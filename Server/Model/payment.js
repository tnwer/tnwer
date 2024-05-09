const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  total: { type: Number, required: true },
  payment_At: { type: Date, required: true, default: Date.now },
  payment_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  payment_cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  payment_products: [{
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        default: 1
    }
}],
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;