var v = require("node-input-validator");
var User = require("../../models/userModel");
var config = require("../../config/config");
var bcrypt = require("../../utils/bcrypt");
var _ = require('lodash');
var moment = require('moment');
const { adminMessages } = config;

exports.userList = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    var params = req.query;
    try {
        let options = {
            //lean: true,
            page: Number(req.query.page || process.env.adminDefaultPage),
            limit: Number(req.query.itemsPerPage || process.env.adminDefaultPageSize),
            sort: { id: -1 }
        };

        var filter = {};
        filter.role = 1;
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
        const userList = await User.paginate(filter, options);
        response.status = true;
        response.message = adminMessages.users.fetchAll;
        response.data = userList;
    } catch (err) {
        console.log(err);
        response['message'] = err.message;
    }
    return res.json(response);
}

exports.userAdd = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    var imageName = '';
    if (req.file !== undefined) {
        imageName = process.env.USER_IMAGE_PATH + '/' + req.file.filename;
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
        const isUserExists = await User.findOne({ email: params.email });
        if (_.isEmpty(isUserExists)) {
            var userObj = {
                "name": params.name,
                "email": params.email,
                "password": await bcrypt.hash(params.password),
                "country_code": params.country_code,
                "mobile": params.mobile,
                "is_notification": 1,
                "image": imageName,
                "status": '1',
                "role": 1
            };
            const userCreated = await User.create(userObj);
            response.status = true;
            response.message = adminMessages.users.fetchAll;
            response.data = userCreated;
        } else {
            response.message = adminMessages.users.emailAlreadyExist;
        }
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.userEdit = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    var imageName = '';
    if (req.file !== undefined) {
        imageName = process.env.USER_IMAGE_PATH + '/' + req.file.filename;
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
        const isSubAdminExists = await User.findOne({ _id: params.id });
        if (!_.isEmpty(isSubAdminExists)) {
            let dataEdit = {};
            if (!_.isEmpty(params.name)) {
                dataEdit.name = params.name;
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
            const subAdminUpdate = await User.findOneAndUpdate({ _id: params.id }, dataEdit);
            response.status = true;
            response.message = adminMessages.users.update;
            response.data = subAdminUpdate;
        } else {
            response.message = adminMessages.users.emailAlreadyExist;
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