var v = require("node-input-validator");
var Content = require("../../models/contentModel");
var authHelper = require("../../helpers/admin/authHelper");
var generalHelper = require("../../helpers/generalHelper");
var config = require("../../config/config");
var _ = require('lodash');
var moment = require('moment');

const { adminMessages } = config;

exports.pageList = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    var params = req.query;
    try {
        // const page = Number(req.query.page || process.env.adminDefaultPage);
        // const limit = Number(req.query.itemsPerPage || process.env.adminDefaultPageSize);
        // const offset = Number((page - 1) * limit);
        let options = {
            //lean: true,
            page: Number(req.query.page || process.env.adminDefaultPage),
            limit: Number(req.query.itemsPerPage || process.env.adminDefaultPageSize),
            sort: { id: -1 }
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
        const pageList = await Content.paginate(filter, options);
        response.status = true;
        response.message = adminMessages.page.fetchAll;
        response.data = pageList;
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.pageAdd = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;

    let constraints = { title: "required", content: 'required' };
    let validator = new v.Validator(params, constraints);
    let matched = await validator.check();
    if (!matched) {
        response.message = 'Required fields missing';
        response.data = validator.errors;
        return res.json(response);
    }

    try {
        const isContentExists = await Content.findOne({ title: params.title });
        if (_.isEmpty(isContentExists)) {
            var pageObj = {
                "title": params.title,
                "content": params.content,
                "status": 1,
                "slug": await generalHelper.creatSlug(params.title)
            };
            const contentCreated = await Content.create(pageObj);
            response.status = true;
            response.message = adminMessages.page.insert;
            response.data = contentCreated;
        } else {
            response.message = adminMessages.page.pageAlreadyExist;
        }
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.pageEdit = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;
    console.log(req);
    console.log(params);
    let constraints = { id: "required" };
    let validator = new v.Validator(params, constraints);
    let matched = await validator.check();
    if (!matched) {
        response.message = 'Required fields missing';
        response.data = validator.errors;
        return res.json(response);
    }

    try {
        const isContentExists = await Content.findOne({ _id: params.id });
        if (!_.isEmpty(isContentExists)) {
            let dataEdit = {};
            if (!_.isEmpty(params.title)) {
                dataEdit.title = params.title;
            }
            if (!_.isEmpty(params.content)) {
                dataEdit.content = params.content;
            }
            if (!_.isEmpty(params.status)) {
                dataEdit.status = params.status;
            }
            const contentUpdate = await Content.findOneAndUpdate({ _id: params.id }, dataEdit);
            response.status = true;
            response.message = adminMessages.page.update;
            response.data = contentUpdate;
        } else {
            response.message = adminMessages.page.pageNotAvilable;;
        }
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.pageDelete = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;
    try {
        const isContentExists = await Content.findOne({ _id: params.id });
        if (!_.isEmpty(isContentExists)) {
            await Content.deleteOne({ _id: params.id });
            response.status = true;
            response.message = 'Success';
        } else {
            //response.msg = Messages.TAG_AVILABLE_ERROR;
            response.message = 'Page not exists.';
        }
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}