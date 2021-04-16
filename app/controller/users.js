var v = require("node-input-validator");
var User = require("../models/userModel");
var _ = require('lodash');
var config = require("../config/config");
var bcrypt = require("../utils/bcrypt");
var jwt = require('../utils/jwt');
var logger = require("../utils/logger");
const { profile } = require("../utils/logger");
const { messages } = config;

exports.register = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;
    let constraints = { name: "required", email: 'required', password: 'required' };
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
                "is_notification": 1,
                "image": '',
                "status": '1',
                "role": 1
            };
            const userCreated = await User.create(userObj);
            response.status = true;
            response.message = messages.users.SignUpSuccess;
            response.data = userCreated;
        } else {
            response.message = messages.users.emailAlreadyExist;
        }
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}

exports.login = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;
    const { email, password } = params;
    const user = await User.findOne({ email: email });
    if (user) {
        logger.log('debug', 'Login: Fetched admin by email -', user.email);
        logger.log('debug', 'Login: Comparing password');
        const isSame = await bcrypt.compare(password, user.password);

        logger.log('debug', 'Login: Password match status - %s', isSame);
        if (isSame) {
            const { id: userId } = user;
            const loggedInUser = { userId };
            const refreshToken = await jwt.generateRefreshToken(loggedInUser);
            //const userSessionPayload = { userId, token: refreshToken };
            //const session = await sessionService.create(userSessionPayload);
            const accessToken = await jwt.generateAccessToken({ ...loggedInUser });
            //console.log([admin, { refreshToken, accessToken }]);
            response.data = [user, { refreshToken, accessToken }];
            response.status = true;
            response.message = messages.users.loginSuccess;
        } else {
            response.message = messages.users.invalidCredentials;
        }
    } else {
        response.message = messages.users.invalidCredentials;
    }
    return res.json(response);
}

exports.forgotPassword = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;
    const { email } = params;
    const admin = await User.findOne({ email: email });

    if (admin) {
        logger.log('debug', 'Login: Fetched admin by email -', admin.email);
        let userCreate = {
            "otp": await Helper.generateOTP(6)
        };
        await User.findOneAndUpdate({ id: admin.id }, userCreate);
        /* Forgot OTP Token */
        var data = {
            "otp": userCreate.otp,
            "userId": admin.id
        };
        const forgotToken = await jwt.generateForgotOTPToken(data);
        /* Forgot OTP Token */

        /*  Send mail  */
        // let to = admin.email;
        let to = 'jitendra.saini@octalinfosolution.com';
        let from = '"Blog" <support@blog.com>';
        let subject = 'Verification Code ' + userCreate.otp + ' – PW Reset';
        const html = await ejs.renderFile('./app//views/user_forgot_password.mail.ejs', { email: admin.email, subject: subject, otp: userCreate.otp })
        try {
            let info = {
                from: from, // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                //text: 'Hello world?', // plain text body
                html: html // html body
            };
            await mail.send(info);
            response.status = true;
            response.data = { "forgotToken": forgotToken };
            response.message = messages.admin.ForgotOTPSend;
        } catch (err) {
            console.log('Error while sending registeration mail', err);
            response.status = trufalsee;
            response.message = messages.admin.ForgotOTPSendError;
        }
        /*  Send mail  */

        /* Send SMS */
        //var otpMessage = "Your verification code is " + userCreate.otp;
        //await smsGetway.sendOTP(user.country_code, user.mobile, otpMessage);
        /* Send SMS */
    } else {
        response.message = messages.admin.invalidCredentials;
    }
    return res.json(response);
}

exports.forgotOtpVerify = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;

    if (!params.forgotToken) {
        response.message = messages.admin.tokenNotProvided;
    } else {
        try {
            logger.log('info', 'JWT: Verifying forgot password OTP token - %s', params.forgotToken);
            const verifyToken = await jwt.verifyForgotOTPToken(params.forgotToken);
            finaldata = verifyToken.data;
            logger.log('debug', 'JWT: forgot password OTP token verified -', finaldata);
            if (finaldata) {
                if (finaldata.otp == params.otp) {
                    response.message = messages.admin.otpVerified;
                    response.status = true;
                } else {
                    response.message = messages.admin.otpNotVerified;
                }
            } else {
                response.message = messages.admin.tokenExpired;
            }
        } catch (err) {
            response.message = messages.admin.tokenExpired;
        }
    }
    return res.json(response);
}

exports.changePassword = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;

    if (!params.forgotToken) {
        response.message = messages.admin.tokenNotProvided;
    } else {
        try {
            logger.log('info', 'JWT: Verifying forgot password OTP token - %s', params.forgotToken);
            const verifyToken = await jwt.verifyForgotOTPToken(params.forgotToken);
            finaldata = verifyToken.data;
            logger.log('debug', 'JWT: forgot password OTP token verified -', finaldata);
            if (finaldata) {
                let userUpdate = {
                    "password": await bcrypt.hash(params.password)
                };
                await User.findOneAndUpdate({ _id: finaldata.userId }, userUpdate);
                response.message = messages.admin.changePasswordSuccess;
                response.status = true;
            } else {
                response.message = messages.admin.tokenExpired;
            }
        } catch (err) {
            response.message = messages.admin.tokenExpired;
        }
    }
    return res.json(response);
}

exports.profileUpdate = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    var imageName = '';
    if (req.file !== undefined) {
        imageName = process.env.USER_IMAGE_PATH + '/' + req.file.filename;
    }
    let params = req.body;
    let userId = res.locals.loggedInPayload.userId;
    let constraints = { name: "required" };
    let validator = new v.Validator(params, constraints);
    let matched = await validator.check();
    if (!matched) {
        response.message = 'Required fields missing';
        response.data = validator.errors;
        return res.json(response);
    }
    try {
        const isUserExists = await User.findOne({ _id: userId });
        if (!_.isEmpty(isUserExists)) {
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
            const dataUpdate = await User.findOneAndUpdate({ _id: userId }, dataEdit);
            response.status = true;
            response.message = messages.users.profileUpdate;
            response.data = dataUpdate;
        } else {
            response.message = messages.users.UserNotAvilable;
        }
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}