const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  role_id: { type: Number, required: true },
  role_name: { type: String, required: true },
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;