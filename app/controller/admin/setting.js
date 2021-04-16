var v = require("node-input-validator");
var Setting = require("../../models/settingModel");
var config = require("../../config/config");
var _ = require('lodash');
var moment = require('moment');

const { adminMessages } = config;

exports.getSetting = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    var params = req.query;
    try {
        const getSetting = await Setting.findOne({ status: '1' });
        response.status = true;
        response.message = adminMessages.setting.fetchAll;
        response.data = getSetting;
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.editSetting = async (req, res) => {
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
        const isSettingExists = await Setting.findOne({ _id: params.id });
        if (!_.isEmpty(isSettingExists)) {
            let dataEdit = {};
            if (!_.isEmpty(params.welcome_points)) {
                dataEdit.welcome_points = params.welcome_points;
            }

            const updatedData = await Setting.findOneAndUpdate({ _id: params.id }, dataEdit);
            response.status = true;
            response.message = adminMessages.setting.settingUpdate;
            response.data = updatedData;
        } else {
            response.message = adminMessages.setting.settingNotAvilable;
        }
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}