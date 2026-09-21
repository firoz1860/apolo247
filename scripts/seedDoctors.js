/**
 * Seed sample doctors so the "Find Doctors" listing has data to display.
 *
 * Reads the connection string from the MONGODB_URI environment variable.
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." node scripts/seedDoctors.js
 */
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI environment variable is required.');
  process.exit(1);
}

const now = new Date();

const doctor = (over) => ({
  qualifications: ['MBBS', 'MD'],
  languages: ['English', 'Hindi'],
  availability: [
    {
      day: 'Monday',
      slots: [{ startTime: '10:00', endTime: '13:00' }],
    },
  ],
  about: 'Experienced specialist committed to patient-centred care.',
  profileImage: '/images/default-doctor.png',
  rating: 4.5,
  reviewsCount: 120,
  isConsultOnline: true,
  isHomeVisit: false,
  createdAt: now,
  updatedAt: now,
  ...over,
});

const doctors = [
  doctor({
    name: 'Dr. Sana Khan',
    primarySpecialization: 'General Physician',
    specializations: ['General Physician', 'Internal Medicine'],
    experience: 12,
    gender: 'female',
    clinics: [
      {
        name: 'Apollo Clinic',
        address: '12 MG Road',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        consultationFee: 500,
      },
    ],
  }),
  doctor({
    name: 'Dr. Rahul Verma',
    primarySpecialization: 'Cardiology',
    specializations: ['Cardiology'],
    experience: 18,
    gender: 'male',
    clinics: [
      {
        name: 'Apollo Heart Centre',
        address: '5 Ring Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        consultationFee: 900,
      },
    ],
  }),
  doctor({
    name: 'Dr. Meera Nair',
    primarySpecialization: 'Pediatrics',
    specializations: ['Pediatrics'],
    experience: 9,
    gender: 'female',
    clinics: [
      {
        name: 'Apollo Cradle',
        address: '88 Park Street',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001',
        consultationFee: 600,
      },
    ],
  }),
];

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('doctors');

    for (const doc of doctors) {
      await collection.updateOne(
        { name: doc.name },
        { $setOnInsert: doc },
        { upsert: true }
      );
    }

    const count = await collection.countDocuments();
    console.log(`✅ Doctors seeded. Total doctors in collection: ${count}`);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
