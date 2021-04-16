var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var _ = require('lodash');
const ArticalSchema = mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    view_count: { type: Number, default: 0 },
    title: String,
    slug: String,
    content: String,
    img: { type: String },
    status: { type: String },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true }
}
);

ArticalSchema.plugin(mongoosePaginate);
ArticalSchema.plugin(uniqueValidator, { message: 'Field {PATH} should be unique.' });
module.exports = mongoose.model('Artical', ArticalSchema);
