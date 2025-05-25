
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb+srv://firoz526:firoz123@cluster0.jtsrdxy.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('apollo247'); 
    const users = db.collection('users');

    const hashedPassword = await bcrypt.hash('12345678', 10);

    const result = await users.insertOne({
      email: 'ashraf@gmail.com',
      password: hashedPassword,
    });

    console.log('✅ User created:', result.insertedId);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await client.close();
  }
}

run();





