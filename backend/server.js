require('dotenv').config();
const express = require('express'), mongoose = require('mongoose'), cors = require('cors'),
  helmet = require('helmet'), compression = require('compression');
const app = express();
app.use(helmet(), compression(), cors({ origin: process.env.CLIENT_URL || 'https://bulk-bridge-zhkn.vercel.app' }), express.json());
app.get('/api/health', (q, s) => s.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/shop'));
app.use((e, q, s, n) => s.status(e.status || 500).json({ message: e.message }));
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log('API ready on port', process.env.PORT || 5000)))
  .catch(e => { console.error('MongoDB connection failed:', e.message); process.exit(1); });
