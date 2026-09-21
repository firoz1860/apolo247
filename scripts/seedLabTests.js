/**
 * Seed sample lab tests.
 * Usage: MONGODB_URI="mongodb+srv://..." node scripts/seedLabTests.js
 */
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI environment variable is required.');
  process.exit(1);
}

const now = new Date();
const t = (over) => ({
  sampleType: 'Blood',
  reportTimeHours: 24,
  createdAt: now,
  updatedAt: now,
  ...over,
});

const tests = [
  t({ name: 'Complete Blood Count (CBC)', category: 'Haematology', price: 299, mrp: 400, description: 'Screens overall health and detects a range of disorders.', reportTimeHours: 12 }),
  t({ name: 'Thyroid Profile (T3 T4 TSH)', category: 'Hormones', price: 499, mrp: 700, description: 'Assesses thyroid gland function.' }),
  t({ name: 'Lipid Profile', category: 'Cardiac', price: 450, mrp: 600, description: 'Measures cholesterol and triglycerides.', preparation: '10-12 hours fasting required' }),
  t({ name: 'HbA1c (Glycated Haemoglobin)', category: 'Diabetes', price: 399, mrp: 520, description: 'Average blood sugar over the past 3 months.' }),
  t({ name: 'Vitamin D (25-OH)', category: 'Vitamins', price: 899, mrp: 1200, description: 'Detects vitamin D deficiency.', reportTimeHours: 48 }),
  t({ name: 'Liver Function Test (LFT)', category: 'Organ', price: 550, mrp: 750, description: 'Evaluates liver health.' }),
];

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const col = client.db().collection('labtests');
    for (const doc of tests) {
      await col.updateOne({ name: doc.name }, { $setOnInsert: doc }, { upsert: true });
    }
    console.log(`✅ Lab tests seeded. Total: ${await col.countDocuments()}`);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
