var v = require("node-input-validator");
var Articale = require("../../models/articalModel");
var Category = require("../../models/categoryModel");
var generalHelper = require("../../helpers/generalHelper");
var config = require("../../config/config");
var _ = require('lodash');
var moment = require('moment');
var mongoose = require("mongoose");
const { exitOnError } = require("../../utils/logger");
var { ObjectId } = mongoose.Types
const { adminMessages } = config;

exports.articleList = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    var params = req.query;
    try {
        let options = {
            //lean: true,
            page: Number(req.query.page || process.env.adminDefaultPage),
            limit: Number(req.query.itemsPerPage || process.env.adminDefaultPageSize),
            sort: { created_at: -1 },
            populate: ([
                { path: "category", select: "_id category_name" },
            ])
        };

        var filter = {};
        if (!_.isEmpty(params.keyword)) {
            filter = {
                $or: [
                    { title: { $regex: '.*' + params.keyword + '.*', $options: 'i' } },
                    { content: { $regex: '.*' + params.keyword + '.*', $options: 'i' } },
                ]
            };
        }

        if (params.status && params.status != "") {
            filter.status = params.status;
        }
        if (!_.isEmpty(params.start_date) && !_.isEmpty(params.end_date)) {
            let start_date = moment(params.start_date).format('YYYY-MM-DD HH:mm:ss');
            let end_date = moment(params.end_date).format('YYYY-MM-DD 23:59:59');
            filter.created_at = { $gte: new Date(start_date), $lte: new Date(end_date) };
        }
        const dataList = await Articale.paginate(filter, options);
        response.status = true;
        response.message = adminMessages.article.fetchAll;
        response.data = dataList;
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.articleAdd = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    var imageName = '';
    if (req.file !== undefined) {
        imageName = process.env.ARTICLE_IMAGE_PATH + '/' + req.file.filename;
    }
    let params = req.body;

    let constraints = { title: "required", content: 'required' };
    let validator = new v.Validator(params, constraints);
    let matched = await validator.check();
    if (!matched) {
        response.message = 'Required fields missing';
        response.data = validator.errors;
        return res.json(response);
    }
    // var idd = await generalHelper.ObjectIdValid(params.category);
    // console.log(idd);
    try {
        const isArticalExists = await Articale.findOne({ title: params.title });
        if (_.isEmpty(isArticalExists)) {
            var articalObj = {
                "title": params.title,
                "content": params.content,
                "status": '1',
                "img": imageName,
                "slug": await generalHelper.creatSlug(params.title)
            };
            articalObj.category = ObjectId(params.category);
            const tagCreated = await Articale.create(articalObj);
            response.status = true;
            response.message = 'Success';
            response.data = tagCreated;
        } else {
            //response.msg = Messages.TAG_AVILABLE_ERROR;
            response.message = 'Artical already exists.';
        }
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.articleEdit = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    var imageName = '';
    if (req.file !== undefined) {
        imageName = process.env.ARTICLE_IMAGE_PATH + '/' + req.file.filename;
    }
    let params = req.body;
    let constraints = { id: "required" };
    let validator = new v.Validator(params, constraints);
    let matched = await validator.check();
    if (!matched) {
        response.message = 'Required fields missing';
        response.data = validator.errors;
        return res.json(response);
    }
    var idd = await generalHelper.ObjectIdValid(params.category);
    // console.log(idd);
    // console.log(ObjectId(params.category));
    try {
        const isArticleExists = await Articale.findOne({ _id: params.id });
        if (!_.isEmpty(isArticleExists)) {
            let dataEdit = {};
            if (!_.isEmpty(params.title)) {
                dataEdit.title = params.title;
                dataEdit.slug = await generalHelper.creatSlug(params.title)
            }
            if (!_.isEmpty(params.category)) {
                dataEdit.category = ObjectId(params.category)
            }
            if (!_.isEmpty(params.content)) {
                dataEdit.content = params.content;
            }
            if (!_.isEmpty(imageName)) {
                dataEdit.img = imageName;
            }
            if (!_.isEmpty(params.status)) {
                dataEdit.status = params.status;
            }

            const responseData = await Articale.findOneAndUpdate({ _id: params.id }, dataEdit);
            response.status = true;
            response.message = adminMessages.article.update;
            response.data = responseData;
        } else {
            response.message = adminMessages.article.articleNotAvilable;
        }
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.articleDelete = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;
    try {
        const isArticalExists = await Articale.findOne({ _id: params.id });
        if (!_.isEmpty(isArticalExists)) {
            await Articale.deleteOne({ _id: params.id });
            response.status = true;
            response.message = 'Success';
        } else {
            //response.msg = Messages.TAG_AVILABLE_ERROR;
            response.message = 'Article not exists.';
        }
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}