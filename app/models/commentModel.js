
var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var _ = require('lodash');
const CommentSchema = mongoose.Schema({
    artical: { type: mongoose.Schema.Types.ObjectId, ref: "Artical" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: String,
    status: { type: String },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true }
}
);

CommentSchema.plugin(mongoosePaginate);
CommentSchema.plugin(uniqueValidator, { message: 'Field {PATH} should be unique.' });
module.exports = mongoose.model('Comment', CommentSchema);
