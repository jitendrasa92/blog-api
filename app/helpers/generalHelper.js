var _ = require('lodash');
var logger = require("../utils/logger");
var apn = require('apn');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

var slugify = require('slugify')

exports.sendIosNotification = async (evice_token, notificationMessage, type, bet_group_id = null, bet_id = null) => {
    if (deIdvice_token) {
        new Promise((resolve, reject) => {
            let payload = {
                "type": type
            };
            if (bet_group_id) {
                payload.bet_group_id = bet_group_id;
            }
            if (bet_id) {
                payload.bet_id = bet_id;
            }
            let unread = 0;
            let deviceToken = device_token;
            let message = notificationMessage;
            let bundleId = process.env.BUNDLEID;
            let service = new apn.Provider({
                cert: process.env.CERT_PEM,
                key: process.env.KEY_PEM,
                //production: process.env.PRODUCTION_ENVIRONMENT
            });
            let note = new apn.Notification({
                alert: message
            });
            note.topic = bundle;
            note.sound = "ping.aiff";
            note.alert = message;
            note.payload = payload;
            note.badge = (unread + 1);
            // service.send(note, deviceToken).then(result => {
            //     if (result.sent.length) {
            //         console.log('ios_push_sent');
            //         console.log(result);
            //         return resolve();
            //     } else {
            //         console.log("sent:", result.sent.length);
            //         console.log("failed:", result.failed.length);
            //         return reject();
            //     }
            // });
            service.shutdown();
            try {
                service.send(note, deviceToken)
                service.shutdown();
                console.log('-------------------------------- IOS push notification sent --------------------------------');
                //console.log(result);
            } catch (error) {
                console.log("sent:", error);
                console.log("sent:", result.sent.length);
                console.log("failed:", result.failed.length);
            }
        })
    }
}

exports.creatSlug = async (data) => {
    var slug = '';
    if (!_.isEmpty(data)) {
        return data
            .toString()
            .trim()
            .toLowerCase()
            .replace(/ /g, '-')
            .replace('/[^A-Za-z0-9-s-अआइईउऊएऐओऔअंअःऋॠऌॡकखगघङचछजझञटठडढणड़ढ़तथदधनपफबभमयरलवशषसहक्षत्रज्ञ]+/', '')
            ;
        // var a = slugify(data, {
        //     replacement: '-',  // replace spaces with replacement character, defaults to `-`
        //     remove: undefined, // remove characters that match regex, defaults to `undefined`
        //     lower: true,      // convert to lower case, defaults to `false`
        //     strict: false,     // strip special characters except replacement, defaults to `false`
        //     locale: ['en', 'hi']      // language code of the locale to use
        // })
        // console.log(a);
        // return slugify(data);

    }
    return slug;
}

exports.generateOTP = async (length) => {
    logger.log('debug', 'Generating OTP ....');
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}



exports.ObjectIdValid = async (id) => {
    try {
        return new ObjectId(id).toString() === id;
    }
    catch {
        return false;
    }
}

