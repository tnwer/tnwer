const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    product_category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    img_url: {
        type: String,
        required: true
    },
    shop_name: {
        type: String,
        required: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    product_count: {
        type: Number,
        default: 0
    },
    product_owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product_location: {
        type: String,
        default: null,
        required: true
    },
    discount: {
        type: Schema.Types.ObjectId,
        ref: 'Discount',
        default: null,
        required: false,
    },
    rating: {
        type: Number,
        required: false,
        min: 0,
        max: 5,
        default: 0
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
