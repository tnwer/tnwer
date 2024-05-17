const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    category_name: {
        type: String,
        required: true
    },
    category_img: {
        type: String,
        required: true
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
