require('dotenv').config();
const bcrypt = require('bcryptjs'), mongoose = require('mongoose'), { User, Product } = require('./models');
const data = [
  ['Steel Shelving Unit', 'Warehouse', '🏗️', 10, 42], ['Pallet Wrap Film (6 rolls)', 'Packaging', '📦', 20, 18],
  ['Thermal Label Printer', 'Office', '🖨️', 5, 129], ['Safety Helmet', 'Safety', '⛑️', 50, 7.5],
  ['LED Panel Light 60x60', 'Lighting', '💡', 25, 21], ['Industrial Gloves (12 pairs)', 'Safety', '🧤', 30, 26],
  ['Cardboard Boxes (bundle 50)', 'Packaging', '📫', 20, 34], ['Barcode Scanner', 'Office', '📟', 10, 58],
  ['Pallet Jack 2.5T', 'Warehouse', '🚜', 2, 310], ['Ergonomic Office Chair', 'Office', '🪑', 10, 96],
  ['Cordless Drill Kit', 'Tools', '🔧', 5, 74], ['Hi-Vis Vest', 'Safety', '🦺', 50, 4.2]
];
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany();
  await Product.insertMany(data.map(([name, category, icon, moq, b]) => ({
    name, category, icon, moq, description: `Bulk-ready ${name.toLowerCase()} for professional buyers.`,
    tiers: [{ min: moq, price: b }, { min: moq * 5, price: +(b * .9).toFixed(2) }, { min: moq * 20, price: +(b * .8).toFixed(2) }]
  })));
  await User.findOneAndUpdate({ email: process.env.DEMO_EMAIL || 'demo@b2bhub.com' },
    { name: 'Demo Buyer', company: 'Demo Corp', password: await bcrypt.hash('Demo@1234', 10), verified: true }, { upsert: true });
  console.log('Seeded 12 products + demo user (demo@b2bhub.com / Demo@1234)'); process.exit();
})();
