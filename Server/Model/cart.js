const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
    cart_user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cart_product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: false,
        default: 1 
    },
    is_deleted: {
        type: Boolean,
        default: false 
    },
    is_payed: {
        type: Boolean,
        default: false 
    }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
