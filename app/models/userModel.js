var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var _ = require('lodash');


const UserSchema = mongoose.Schema({
    role: String,
    device_token: String,
    device_type: String,
    name: String,
    country_code: Number,
    mobile: Number,
    gender: { type: String }, // 1 => male, 2 => female
    email: { type: String, unique: true },
    password: String,
    pin: String,
    otp: String,
    is_notification: String,
    image: String,
    status: { type: String }, // 1 => active, 0 => inactive, 2 => deleted
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true }
}
);
UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(uniqueValidator, { message: 'Field {PATH} should be unique.' });
module.exports = mongoose.model('User', UserSchema);
