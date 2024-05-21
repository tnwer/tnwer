const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_name: { type: String, required: true },
  user_email: { type: String, required: true, unique: true },
  password: { type: String },
  user_role: { type: Number, ref: 'Roles', required: true, default: 2 },
  phone_number: { type: String },
  Commercial_Record: {type: String, required: false, default: null},
  profile_img: { type: String, default: null },
  user_location: { type: String, required: true, default: null },
  login_status: { type: Boolean, required: false, default: false },
  is_deleted : { type: Boolean, required: false, default: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;