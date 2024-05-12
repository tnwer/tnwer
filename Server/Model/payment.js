const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  payment_At: { type: Date, required: true, default: Date.now },
  payment_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  quantity: { type: Number, default: 1},
  total: {type: Number, required: true, default: 0}
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;