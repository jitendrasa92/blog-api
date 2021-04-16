var v = require("node-input-validator");
var mongoose = require("mongoose");
var Notification = require("../../models/notificationModel");
var User = require("../../models/userModel");
var Helper = require("../../helpers/generalHelper");
var config = require("../../config/config");
var _ = require('lodash');
var { ObjectId } = mongoose.Types

const { adminMessages } = config;

exports.notificationList = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    var params = req.query;
    try {
        let options = {
            //lean: true,
            page: Number(req.query.page || process.env.adminDefaultPage),
            limit: Number(req.query.itemsPerPage || process.env.adminDefaultPageSize),
            sort: { id: -1 },
            populate: ([
                { path: "receiver", select: "_id name" },
            ])
        };

        var filter = {};
        if (!_.isEmpty(params.keyword)) {
            filter = {
                $or: [
                    { message: { $regex: '.*' + params.keyword + '.*', $options: 'i' } },
                    { type: { $regex: '.*' + params.keyword + '.*', $options: 'i' } },
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
        const dataList = await Notification.paginate(filter, options);
        response.status = true;
        response.message = adminMessages.notification.fetchAll;
        response.data = dataList;
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.sendNotification = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;

    let constraints = { message: "required" };
    let validator = new v.Validator(params, constraints);
    let matched = await validator.check();
    if (!matched) {
        response.message = 'Required fields missing';
        response.data = validator.errors;
        return res.json(response);
    }

    try {
        var userData = await User.find({ status: 1 });
        //console.log("User Count :: ", userData.length);
        for (var i = 0; i < userData.length; i++) {
            // console.log("Device Token ", userData[i].device_token);
            // console.log("Type ", config.NotificationType.General);
            var notificationCreate = {
                "receiver": ObjectId(userData[i].id),
                "message": params.message,
                "type": config.NotificationType.General,
                "is_read": 0,
                "status": 1
            };

            const notificationCreated = await Notification.create(notificationCreate);
            if (userData[i].notifications && userData[i].device_type == 'ios') {
                //await Helper.sendIosNotification(userData[i].device_token, notificationCreate.message, notificationCreate.notification_type);
            } else if (userData[i].notification && userData[i].device_type == 'android') {
                //
            }
        }
        response.status = true;
        response.message = adminMessages.notification.notificationSent;
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}