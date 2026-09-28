const { Schema, model, Types } = require('mongoose');
const User = model('User', new Schema({
  name: String, company: String,
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: String, verified: { type: Boolean, default: false },
  verifyToken: String, resetToken: String, resetExpires: Date
}, { timestamps: true }));
const Product = model('Product', new Schema({
  name: String, category: String, description: String, icon: String,
  moq: Number,                       // minimum order quantity (B2B rule)
  tiers: [{ _id: false, min: Number, price: Number }] // volume pricing, ascending by min
}));
const Order = model('Order', new Schema({
  user: { type: Types.ObjectId, ref: 'User' },
  items: [{ _id: false, product: Types.ObjectId, name: String, qty: Number, price: Number }],
  total: Number
}, { timestamps: true }));
module.exports = { User, Product, Order };
