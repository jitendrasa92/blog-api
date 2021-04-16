var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var _ = require('lodash');
const NotificationSchema = mongoose.Schema({
    receiver: { type: mongoose.Types.ObjectId, ref: "User", default: null },
    sender: { type: mongoose.Types.ObjectId, ref: "User", default: null },
    message: String,
    type: String,
    is_read: String,
    status: { type: String },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true }
}
);
NotificationSchema.plugin(mongoosePaginate);
NotificationSchema.plugin(uniqueValidator, { message: 'Field {PATH} should be unique.' });
module.exports = mongoose.model('Notification', NotificationSchema);

