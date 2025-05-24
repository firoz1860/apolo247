import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import Doctor from '@/lib/db/models/Doctor';

// POST handler to add a new doctor
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const data = await request.json();

    const {
      name,
      specializations,
      primarySpecialization,
      qualifications,
      experience,
      gender,
      languages = ['English', 'Hindi'],
      clinics,
      availability,
      about,
      profileImage = '/images/default-doctor.png',
      rating = 0,
      reviewsCount = 0,
      isConsultOnline = false,
      isHomeVisit = false
    } = data;

    const newDoctor = await Doctor.create({
      name,
      specializations,
      primarySpecialization,
      qualifications,
      experience,
      gender,
      languages,
      clinics,
      availability,
      about,
      profileImage,
      rating,
      reviewsCount,
      isConsultOnline,
      isHomeVisit
    });

    return NextResponse.json({ success: true, data: newDoctor }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating doctor:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}