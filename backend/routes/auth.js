const r = require('express').Router(), bcrypt = require('bcryptjs'), jwt = require('jsonwebtoken'), crypto = require('crypto');
const { User } = require('../models'), send = require('../mail');
const w = f => (q, s, n) => f(q, s, n).catch(n);                       // async error wrapper
const sign = u => ({ token: jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' }),
  user: { name: u.name, email: u.email, company: u.company } });
const link = p => `${process.env.CLIENT_URL}/${p}`;
const tok = () => crypto.randomBytes(24).toString('hex');
const dev = l => (process.env.SMTP_HOST ? {} : { devLink: l });         // no SMTP => return link for local testing

r.post('/register', w(async (q, s) => {
  const { name, company, email, password } = q.body;
  if (!email || !password || password.length < 6) return s.status(400).json({ message: 'Valid email and a 6+ character password are required' });
  if (await User.findOne({ email })) return s.status(409).json({ message: 'Email already registered' });
  const verifyToken = tok(), l = link('verify/' + verifyToken);
  await User.create({ name, company, email, password: await bcrypt.hash(password, 10), verifyToken });
  await send(email, 'Verify your B2B Hub account', `<p>Welcome ${name}!</p><a href="${l}">Verify my email</a>`);
  s.json({ message: 'Account created. Check your email to verify it.', ...dev(l) });
}));

r.get('/verify/:t', w(async (q, s) => {
  const u = await User.findOne({ verifyToken: q.params.t });
  if (!u) return s.status(400).json({ message: 'Invalid or already used link' });
  u.verified = true; u.verifyToken = undefined; await u.save();
  s.json({ message: 'Email verified. You can sign in now.' });
}));

r.post('/login', w(async (q, s) => {
  const u = await User.findOne({ email: (q.body.email || '').toLowerCase() });
  if (!u || !(await bcrypt.compare(q.body.password || '', u.password))) return s.status(401).json({ message: 'Wrong email or password' });
  if (!u.verified) return s.status(403).json({ message: 'Please verify your email first' });
  s.json(sign(u));
}));

r.post('/forgot', w(async (q, s) => {
  const u = await User.findOne({ email: (q.body.email || '').toLowerCase() });
  const out = { message: 'If this email exists, a reset link was sent.' };
  if (u) {
    u.resetToken = tok(); u.resetExpires = Date.now() + 3600e3; await u.save();
    const l = link('reset/' + u.resetToken);
    await send(u.email, 'Reset your password', `<a href="${l}">Reset password</a> (valid 1 hour)`);
    Object.assign(out, dev(l));
  }
  s.json(out);
}));

r.post('/reset/:t', w(async (q, s) => {
  const u = await User.findOne({ resetToken: q.params.t, resetExpires: { $gt: Date.now() } });
  if (!u || !q.body.password || q.body.password.length < 6) return s.status(400).json({ message: 'Invalid/expired link or weak password' });
  u.password = await bcrypt.hash(q.body.password, 10); u.resetToken = u.resetExpires = undefined; await u.save();
  s.json({ message: 'Password updated. You can sign in.' });
}));

// One-click login for recruiters (seeded, verified demo account)
r.post('/demo', w(async (q, s) => {
  const u = await User.findOne({ email: process.env.DEMO_EMAIL || 'demo@b2bhub.com' });
  if (!u) return s.status(404).json({ message: 'Run "npm run seed" first' });
  s.json(sign(u));
}));
module.exports = r;
