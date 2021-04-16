var v = require("node-input-validator");
var Comment = require("../models/commentModel");
var generalHelper = require("../helpers/generalHelper");
var _ = require('lodash');
var mongoose = require("mongoose");
var { ObjectId } = mongoose.Types

exports.commentList = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.query;
    let constraints = { artical_id: "required" };
    let validator = new v.Validator(params, constraints);
    let matched = await validator.check();
    if (!matched) {
        response.message = 'Required fields missing';
        response.data = validator.errors;
        return res.json(response);
    }
    try {
        var filter = {};
        filter.status = 1
        filter.artical = params.artical_id;
        const commentList = await Comment.find(filter).
            populate([
                { path: "user", select: "_id name image" },
            ])
        response.status = true;
        response.message = 'Success';
        response.data = commentList;
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.commentAdd = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;
    let userId = res.locals.loggedInPayload.userId;

    let constraints = { artical: "required", comment: 'required' };
    let validator = new v.Validator(params, constraints);
    let matched = await validator.check();
    if (!matched) {
        response.message = 'Required fields missing';
        response.data = validator.errors;
        return res.json(response);
    }

    // var idd = await generalHelper.ObjectIdValid(userId);
    // console.log(idd);

    try {
        const isCommentExists = await Comment.findOne({ comment: params.comment });
        if (_.isEmpty(isCommentExists)) {
            var dataObj = {
                "comment": params.comment,
                "status": '1'
            };
            dataObj.artical = ObjectId(params.artical);
            dataObj.user = ObjectId(userId);
            const commentCreated = await Comment.create(dataObj);
            response.status = true;
            response.message = 'Success';
            response.data = commentCreated;
        } else {
            //response.msg = Messages.TAG_AVILABLE_ERROR;
            response.message = 'Artical already exists.';
        }
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}