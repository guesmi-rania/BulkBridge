const r = require('express').Router(), jwt = require('jsonwebtoken');
const { Product, Order } = require('../models');
const w = f => (q, s, n) => f(q, s, n).catch(n);
const auth = (q, s, n) => {
  try { q.uid = jwt.verify((q.headers.authorization || '').slice(7), process.env.JWT_SECRET).id; n(); }
  catch { s.status(401).json({ message: 'Please sign in' }); }
};
const unit = (p, qty) => [...p.tiers].reverse().find(t => qty >= t.min)?.price ?? p.tiers[0].price;

r.get('/products', w(async (q, s) => s.json(await Product.find().lean())));

r.post('/orders', auth, w(async (q, s) => {
  const items = [];
  for (const { id, qty } of q.body.items || []) {
    const p = await Product.findById(id);
    if (!p || qty < p.moq) return s.status(400).json({ message: `${p ? p.name : 'Product'}: minimum order is ${p ? p.moq : '?'}` });
    items.push({ product: p._id, name: p.name, qty, price: unit(p, qty) });   // price computed server-side
  }
  if (!items.length) return s.status(400).json({ message: 'Cart is empty' });
  const total = items.reduce((a, i) => a + i.qty * i.price, 0);
  s.status(201).json(await Order.create({ user: q.uid, items, total }));
}));

r.get('/orders', auth, w(async (q, s) => s.json(await Order.find({ user: q.uid }).sort('-createdAt').lean())));
module.exports = r;
