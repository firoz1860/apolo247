/**
 * Seed a demo user.
 *
 * Reads the connection string from the MONGODB_URI environment variable so no
 * credentials are ever committed to the repository.
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." node scripts/seedUser.js
 */
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI environment variable is required.');
  process.exit(1);
}

const email = process.env.SEED_USER_EMAIL || 'demo@apollo247.local';
const password = process.env.SEED_USER_PASSWORD || 'password123';
const name = process.env.SEED_USER_NAME || 'Demo User';

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    const existing = await users.findOne({ email });
    if (existing) {
      console.log(`ℹ️  User ${email} already exists, skipping.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const now = new Date();
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    console.log('✅ User created:', result.insertedId.toString());
    console.log(`   email: ${email}`);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
