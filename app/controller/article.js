var v = require("node-input-validator");
var Articale = require("../models/articalModel");
var _ = require('lodash');

exports.articleList = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;

    try {
        var filter = {};
        filter.status = 1
        // if (!_.isEmpty(params.category_id)) {
        // }
        const articleList = await Articale.find(filter);
        response.status = true;
        response.message = 'Success';
        response.data = articleList;
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.viewCount = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.query;
    let constraints = { id: "required" };
    let validator = new v.Validator(params, constraints);
    let matched = await validator.check();
    if (!matched) {
        response.message = 'Required fields missing';
        response.data = validator.errors;
        return res.json(response);
    }
    try {
        const isArticleExists = await Articale.findOne({ _id: params.id });
        if (!_.isEmpty(isArticleExists)) {
            let dataEdit = {};
            dataEdit.view_count = isArticleExists.view_count + 1;
            const responseData = await Articale.findOneAndUpdate({ _id: params.id }, dataEdit);
            response.status = true;
            response.message = "success";
            response.data = responseData;
        } else {
            response.message = adminMessages.article.articleNotAvilable;
        }
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.popularArticle = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;
    // let constraints = { category_id: "required" };
    // let validator = new v.Validator(params, constraints);
    // let matched = await validator.check();
    // if (!matched) {
    //     response.message = 'Required fields missing';
    //     response.data = validator.errors;
    //     return res.json(response);
    // }
    try {
        var filter = {};
        filter.status = 1;
        // filter.category = params.category
        const articleList = await Articale.find(filter).limit(5).sort({ view_count: 1 });
        response.status = true;
        response.message = 'Success';
        response.data = articleList;
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.relatedArticle = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.query;
    let constraints = { category: "required" };
    let validator = new v.Validator(params, constraints);
    let matched = await validator.check();
    if (!matched) {
        response.message = 'Required fields missing';
        response.data = validator.errors;
        return res.json(response);
    }
    try {
        var filter = {};
        filter.status = 1;
        filter.category = params.category
        const articleList = await Articale.find(filter).limit(3);
        response.status = true;
        response.message = 'Success';
        response.data = articleList;
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.oneBlockList = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;

    try {
        var filter = {};
        filter.status = 1;
        filter.category = '605354c0f46bc53e58b5825d';
        const articleList = await Articale.find(filter).limit(3);
        response.status = true;
        response.message = 'Success';
        response.data = articleList;
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.secondBlockList = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;

    try {
        var filter = {};
        filter.status = 1;
        filter.category = '605354c5f46bc53e58b5825e';
        const articleList = await Articale.find(filter).limit(3);
        response.status = true;
        response.message = 'Success';
        response.data = articleList;
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

// exports.articleList = async (req, res) => {
//     var response = { "status": false, "message": "Invalid Request", 'data': {} };
//     let params = req.body;

//     try {
//         var filter = {};
//         filter.status = 1
//         // if (!_.isEmpty(params.category_id)) {
//         // }
//         const articleList = await Articale.find(filter);
//         response.status = true;
//         response.message = 'Success';
//         response.data = articleList;
//     } catch (err) {
//         response.message = err.message;
//     }
//     return res.json(response);
// }
// exports.articleAdd = async (req, res) => {
//     var response = { "status": false, "message": "Invalid Request", 'data': {} };
//     let params = req.body;
//     let constraints = { title: "required", content: 'required' };
//     let validator = new v.Validator(params, constraints);
//     let matched = await validator.check();
//     if (!matched) {
//         response['message'] = 'Required fields missing';
//         response['data'] = validator.errors;
//         return res.json(response);
//     }
//     try {
//         response['status'] = true;
//         response['message'] = 'Success';
//         response['data'] = params;
//     } catch (err) {
//         response['message'] = err.message;
//     }
//     return res.json(response);
// } 