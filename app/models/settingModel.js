var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var _ = require('lodash');
const SettingSchema = mongoose.Schema({
    welcome_points: String,
    status: { type: String },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true }
}
);
SettingSchema.plugin(mongoosePaginate);
SettingSchema.plugin(uniqueValidator, { message: 'Field {PATH} should be unique.' });
module.exports = mongoose.model('Setting', SettingSchema);

