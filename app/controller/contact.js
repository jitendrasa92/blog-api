var v = require("node-input-validator");
var _ = require('lodash');
// var mongoose = require("mongoose");
// var { ObjectId } = mongoose.Types
var config = require("../config/config");

const { messages } = config;
var ejs = require("ejs");
var mail = require("../utils/mail");

exports.contactMailSend = async (req, res) => {
    var response = { "status": false, "message": "Invalid Request", 'data': {} };
    let params = req.body;

    let constraints = { name: "required", phone: 'required', email: 'required', subject: 'required', message: 'required' };
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
        let to = 'jitendra.saini@octalinfosolution.com';
        let from = '"Blog" <support@blog.com>';
        let subject = 'Contact Mail';
        const html = await ejs.renderFile('./app//views/contact.mail.ejs', { name: params.name, phone: params.phone, email: params.email, subject: params.subject, message: params.message });

        let info = {
            from: from, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            //text: 'Hello world?', // plain text body
            html: html // html body
        };
        await mail.send(info);
        response.status = true;
        response.message = messages.contact.mailSend;
    } catch (err) {
        response.message = err.message;
    }
    return res.json(response);
}