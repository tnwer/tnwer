const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
    cart_user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    cart_product: {
        type: Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true
    },
    quantity: {
        type: Number,
        required: false,
        default: 1 // Default count if not provided
    },
    is_deleted: {
        type: Boolean,
        default: false // Default value if not provided
    },
    is_payed: {
        type: Boolean,
        default: false // Default value if not provided
    }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
