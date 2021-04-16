var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var _ = require('lodash');
const CategorySchema = mongoose.Schema({
    category_name: String,
    status: { type: String },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true }
}
);

CategorySchema.plugin(mongoosePaginate);
CategorySchema.plugin(uniqueValidator, { message: 'Field {PATH} should be unique.' });
module.exports = mongoose.model('Category', CategorySchema);
