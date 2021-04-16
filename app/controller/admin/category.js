var v = require("node-input-validator");
var Category = require("../../models/categoryModel");
var generalHelper = require("../../helpers/generalHelper");
var config = require("../../config/config");
var _ = require('lodash');
var moment = require('moment');

const { adminMessages } = config;

exports.categoryList = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    var params = req.query;
    try {
        let options = {
            //lean: true,
            page: Number(req.query.page || process.env.adminDefaultPage),
            limit: Number(req.query.itemsPerPage || process.env.adminDefaultPageSize),
            sort: { created_at: -1 },
            // populate: ([
            //     { path: "receiver", select: "_id name" },
            // ])
        };

        var filter = {};
        if (!_.isEmpty(params.keyword)) {
            filter = {
                $or: [
                    { category_name: { $regex: '.*' + params.keyword + '.*', $options: 'i' } },
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
        const dataList = await Category.paginate(filter, options);
        response.status = true;
        response.message = adminMessages.article.fetchAll;
        response.data = dataList;
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.categoryListAll = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    var params = req.query;
    try {
        var filter = {
            status: 1
        };

        const dataListAll = await Category.find(filter);
        response.status = true;
        response.message = adminMessages.article.fetchAll;
        response.data = dataListAll;
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.categoryAdd = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;
    console.log(req);
    let constraints = { category_name: "required" };
    let validator = new v.Validator(params, constraints);
    let matched = await validator.check();
    if (!matched) {
        response.message = 'Required fields missing';
        response.data = validator.errors;
        return res.json(response);
    }

    try {
        const isCategoryExists = await Category.findOne({ category_name: params.category_name });
        console.log(isCategoryExists);
        if (_.isEmpty(isCategoryExists)) {
            var articalObj = {
                "category_name": params.category_name,
                "status": '1'
            };
            const dataCreated = await Category.create(articalObj);
            response.status = true;
            response.message = 'Success';
            response.data = dataCreated;
        } else {
            response.message = 'Category already exists.';
        }
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.categoryEdit = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;
    let constraints = { id: "required" };
    let validator = new v.Validator(params, constraints);
    let matched = await validator.check();
    if (!matched) {
        response.message = 'Required fields missing';
        response.data = validator.errors;
        return res.json(response);
    }
    try {
        const isCategoryExists = await Category.findOne({ _id: params.id });
        if (!_.isEmpty(isCategoryExists)) {
            let dataEdit = {};
            if (!_.isEmpty(params.category_name)) {
                dataEdit.category_name = params.category_name;
            }
            if (!_.isEmpty(params.status)) {
                dataEdit.status = params.status;
            }
            console.log(dataEdit);
            const responseData = await Category.findOneAndUpdate({ _id: params.id }, dataEdit);
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

exports.categoryDelete = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;
    try {
        const isArticalExists = await Category.findOne({ _id: params.id });
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