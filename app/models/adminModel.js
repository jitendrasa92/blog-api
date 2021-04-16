var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var _ = require('lodash');

function setURL(v) {
    // if (_.isEmpty(v)) {
    //     return config.appPath + "/storage/users/default.png";
    // }
    // return config.appPath + "/storage/" + v;
}

const AdminSchema = mongoose.Schema({
    role: String,
    name: String,
    country_code: Number,
    mobile: Number,
    gender: { type: String }, // 1 => male, 2 => female
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    device_token: String,
    password: String,
    pin: String,
    otp: String,
    device_type: String,
    permission: String,
    image: String,
    status: { type: String }, // 1 => active, 0 => inactive, 2 => deleted
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true }
}
);

AdminSchema.plugin(mongoosePaginate);
AdminSchema.plugin(uniqueValidator, { message: 'Field {PATH} should be unique.' });
module.exports = mongoose.model('Admin', AdminSchema);
