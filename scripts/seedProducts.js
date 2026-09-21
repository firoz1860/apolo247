/**
 * Seed sample pharmacy products.
 * Usage: MONGODB_URI="mongodb+srv://..." node scripts/seedProducts.js
 */
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI environment variable is required.');
  process.exit(1);
}

const now = new Date();
const p = (over) => ({
  prescriptionRequired: false,
  image: '/images/default-medicine.png',
  stock: 100,
  rating: 4.3,
  createdAt: now,
  updatedAt: now,
  ...over,
});

const products = [
  p({ name: 'Paracetamol 500mg (10 tablets)', category: 'Pain Relief', price: 25, mrp: 30, manufacturer: 'Apollo Pharmacy' }),
  p({ name: 'Ibuprofen 400mg (15 tablets)', category: 'Pain Relief', price: 45, mrp: 55, manufacturer: 'Cipla' }),
  p({ name: 'Vitamin C 1000mg (20 tablets)', category: 'Vitamins', price: 120, mrp: 150, manufacturer: 'HealthKart' }),
  p({ name: 'Vitamin D3 60K (4 capsules)', category: 'Vitamins', price: 90, mrp: 110, manufacturer: 'Sun Pharma' }),
  p({ name: 'Cough Syrup 100ml', category: 'Cold & Cough', price: 85, mrp: 99, manufacturer: 'Dabur' }),
  p({ name: 'Antacid Gel 170ml', category: 'Digestive', price: 130, mrp: 155, manufacturer: 'Pfizer' }),
  p({ name: 'Moisturising Lotion 200ml', category: 'Skin Care', price: 210, mrp: 260, manufacturer: 'Cetaphil' }),
  p({ name: 'Metformin 500mg (15 tablets)', category: 'Diabetes', price: 35, mrp: 42, manufacturer: 'USV', prescriptionRequired: true }),
];

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const col = client.db().collection('products');
    for (const doc of products) {
      await col.updateOne({ name: doc.name }, { $setOnInsert: doc }, { upsert: true });
    }
    console.log(`✅ Products seeded. Total: ${await col.countDocuments()}`);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
