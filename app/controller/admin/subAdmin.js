var v = require("node-input-validator");
var Admin = require("../../models/adminModel");
var authHelper = require("../../helpers/admin/authHelper");
var generalHelper = require("../../helpers/generalHelper");
var config = require("../../config/config");
var _ = require('lodash');
var moment = require('moment');
const { adminMessages } = config;

exports.subAdminList = async (req, res) => {
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
        filter.role = 2;
        if (!_.isEmpty(params.keyword)) {
            filter = {
                $or: [
                    { name: { $regex: '.*' + params.keyword + '.*', $options: 'i' } },
                    { username: { $regex: '.*' + params.keyword + '.*', $options: 'i' } },
                    { email: { $regex: '.*' + params.keyword + '.*', $options: 'i' } },
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
        const adminList = await Admin.paginate(filter, options);
        response.status = true;
        response.message = adminMessages.subAdmin.fetchAll;
        response.data = adminList;
    } catch (err) {
        console.log(err);
        response['message'] = err.message;
    }
    return res.json(response);
}

exports.subAdminAdd = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    var imageName = '';
    if (req.file !== undefined) {
        imageName = process.env.SUBADMIN_IMAGE_PATH + '/' + req.file.filename;
    }
    let params = req.body;

    let constraints = { name: "required", email: 'required', password: 'required', country_code: 'required', mobile: 'required' };
    let validator = new v.Validator(params, constraints);
    let matched = await validator.check();
    if (!matched) {
        response.message = 'Required fields missing';
        response.data = validator.errors;
        return res.json(response);
    }

    try {
        const isSubAdminExists = await Admin.findOne({ email: params.email });
        console.log(isSubAdminExists);
        if (_.isEmpty(isSubAdminExists)) {
            var subAdminObj = {
                "name": params.name,
                "email": params.email,
                "password": params.password,
                "country_code": params.country_code,
                "mobile": params.mobile,
                "image": imageName,
                "username": params.username,
                "status": '1',
                "role": 2
            };
            console.log(subAdminObj);
            const subAdminCreated = await Admin.create(subAdminObj);
            response.status = true;
            response.message = adminMessages.subAdmin.fetchAll;
            response.data = subAdminCreated;
        } else {
            response.message = adminMessages.subAdmin.emailAlreadyExist;
        }
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.subAdminEdit = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    var imageName = '';
    if (req.file !== undefined) {
        imageName = process.env.SUBADMIN_IMAGE_PATH + '/' + req.file.filename;
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
    try {
        const isSubAdminExists = await Admin.findOne({ _id: params.id });
        if (!_.isEmpty(isSubAdminExists)) {
            let dataEdit = {};
            if (!_.isEmpty(params.name)) {
                dataEdit.name = params.name;
            }
            if (!_.isEmpty(params.username)) {
                dataEdit.username = params.username;
            }
            if (!_.isEmpty(params.email)) {
                dataEdit.email = params.email;
            }
            if (!_.isEmpty(params.country_code)) {
                dataEdit.country_code = params.country_code;
            }
            if (!_.isEmpty(params.mobile)) {
                dataEdit.mobile = params.mobile;
            }
            if (!_.isEmpty(imageName)) {
                dataEdit.image = imageName;
            }
            if (!_.isEmpty(params.status)) {
                dataEdit.status = params.status;
            }
            const subAdminUpdate = await Admin.findOneAndUpdate({ _id: params.id }, dataEdit);
            response.status = true;
            response.message = adminMessages.subAdmin.update;
            response.data = subAdminUpdate;
        } else {
            response.message = adminMessages.subAdmin.emailAlreadyExist;
        }
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

// exports.articleDelete = async (req, res) => {
//     var response = { "status": false, "message": "Invalid Request", 'data': {} };
//     let params = req.body;
//     try {
//         const isArticalExists = await Articale.findOne({ _id: params.id });
//         if (!_.isEmpty(isArticalExists)) {
//             await Articale.deleteOne({ _id: params.id });
//             response.status = true;
//             response.message = 'Success';
//         } else {
//             //response.msg = Messages.TAG_AVILABLE_ERROR;
//             response.message = 'Article not exists.';
//         }
//     } catch (err) {
//         response.message = err.message;
//     }
//     return res.json(response);
// }