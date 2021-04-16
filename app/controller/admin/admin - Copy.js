var v = require("node-input-validator");
var User = require("../../models/articalModel");
var Admin = require("../../models/adminModel");
var Helper = require("../../helpers/generalHelper");
var authHelper = require("../../helpers/generalHelper");
var config = require("../../config/config");
var bcrypt = require("../../utils/bcrypt");
var logger = require("../../utils/logger");
var mail = require("../../utils/mail");
var jwt = require('../../utils/jwt');
var ejs = require('ejs');
var _ = require('lodash');
const { adminMessages } = config;

exports.login = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;
    const { email, password } = params;
    const admin = await Admin.findOne({ email: email });

    if (admin) {
        logger.log('debug', 'Login: Fetched admin by email -', admin.email);
        logger.log('debug', 'Login: Comparing password');
        const isSame = await bcrypt.compare(password, admin.password);

        logger.log('debug', 'Login: Password match status - %s', isSame);
        if (isSame) {
            const { id: adminId } = admin;
            const loggedInUser = { adminId };
            const refreshToken = await jwt.generateRefreshToken(loggedInUser);
            //const userSessionPayload = { userId, token: refreshToken };
            //const session = await sessionService.create(userSessionPayload);
            const accessToken = await jwt.generateAccessToken({ ...loggedInUser });
            console.log([admin, { refreshToken, accessToken }]);
            response.data = [admin, { refreshToken, accessToken }];
            response.status = true;
            response.message = adminMessages.admin.loginSuccess;
        } else {
            response.message = adminMessages.admin.invalidCredentials;
        }
    } else {
        response.message = adminMessages.admin.invalidCredentials;
    }
    return res.json(response);
}


exports.forgotPassword = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;
    const { email } = params;
    const admin = await Admin.findOne({ email: email });

    if (admin) {
        logger.log('debug', 'Login: Fetched admin by email -', admin.email);
        let userCreate = {
            "otp": await Helper.generateOTP(6)
        };
        await Admin.findOneAndUpdate({ id: admin.id }, userCreate);
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
            response.message = adminMessages.admin.ForgotOTPSend;
        } catch (err) {
            console.log('Error while sending registeration mail', err);
            response.status = trufalsee;
            response.message = adminMessages.admin.ForgotOTPSendError;
        }
        /*  Send mail  */

        /* Send SMS */
        //var otpMessage = "Your verification code is " + userCreate.otp;
        //await smsGetway.sendOTP(user.country_code, user.mobile, otpMessage);
        /* Send SMS */
    } else {
        response.message = adminMessages.admin.invalidCredentials;
    }
    return res.json(response);
}

exports.forgotOtpVerify = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;

    if (!params.forgotToken) {
        response.message = adminMessages.admin.ForgotOTPSend;
    } else {
        try {
            logger.log('info', 'JWT: Verifying forgot password OTP token - %s', params.forgotToken);
            const verifyToken = await jwt.verifyForgotOTPToken(params.forgotToken);
            finaldata = verifyToken.data;
            logger.log('debug', 'JWT: forgot password OTP token verified -', finaldata);
            if (finaldata) {
                if (finaldata.otp == params.otp) {
                    response.message = adminMessages.admin.otpVerified;
                    response.status = true;
                } else {
                    response.message = adminMessages.admin.otpNotVerified;
                }
            } else {
                response.message = adminMessages.admin.tokenExpired;
            }
        } catch (err) {
            response.message = adminMessages.admin.tokenExpired;
        }
    }
    return res.json(response);
}

exports.changePassword = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;
    const { email, password } = params;
    const admin = await Admin.findOne({ email: email });

    if (admin) {
        logger.log('debug', 'Login: Fetched admin by email -', admin.email);
        logger.log('debug', 'Login: Comparing password');
        const isSame = await bcrypt.compare(password, admin.password);

        logger.log('debug', 'Login: Password match status - %s', isSame);
        if (isSame) {
            const { id: adminId } = admin;
            const loggedInUser = { adminId };
            const refreshToken = await jwt.generateRefreshToken(loggedInUser);
            //const userSessionPayload = { userId, token: refreshToken };
            //const session = await sessionService.create(userSessionPayload);
            const accessToken = await jwt.generateAccessToken({ ...loggedInUser });
            console.log([admin, { refreshToken, accessToken }]);
            response.data = [admin, { refreshToken, accessToken }];
            response.status = true;
            response.message = adminMessages.admin.loginSuccess;
        } else {
            response.message = adminMessages.admin.invalidCredentials;
        }
    } else {
        response.message = adminMessages.admin.invalidCredentials;
    }
    return res.json(response);
}