const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String, required: true, unique: true }, // From Firebase
  photo: String,
  phone: { type: String, default: "" },   // For delivery
  address: { type: String, default: "" }, // For delivery
  role: { type: String, default: "customer" }, // "admin" or "customer"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);