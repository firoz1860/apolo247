// import { NextRequest, NextResponse } from 'next/server';
// import { dbConnect } from '@/lib/db/dbConnect';
// import Doctor from '@/lib/db/models/Doctor';

// // POST handler to add a new doctor
// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect();

//     const data = await request.json();

//     const {
//       name,
//       specializations,
//       primarySpecialization,
//       qualifications,
//       experience,
//       gender,
//       languages = ['English', 'Hindi'],
//       clinics,
//       availability,
//       about,
//       profileImage = '/images/default-doctor.png',
//       rating = 0,
//       reviewsCount = 0,
//       isConsultOnline = false,
//       isHomeVisit = false
//     } = data;

//     const newDoctor = await Doctor.create({
//       name,
//       specializations,
//       primarySpecialization,
//       qualifications,
//       experience,
//       gender,
//       languages,
//       clinics,
//       availability,
//       about,
//       profileImage,
//       rating,
//       reviewsCount,
//       isConsultOnline,
//       isHomeVisit
//     });

//     return NextResponse.json({ success: true, data: newDoctor }, { status: 201 });

//   } catch (error: any) {
//     console.error('Error creating doctor:', error);

//     if (error.name === 'ValidationError') {
//       return NextResponse.json({ success: false, error: error.message }, { status: 400 });
//     }

//     return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import Doctor from '@/lib/db/models/Doctor';

// GET handler to fetch a single doctor by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get doctor ID from params
    const doctorId = params.id;
    
    // Fetch doctor
    const doctor = await Doctor.findById(doctorId);
    
    // Handle not found
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    // Return doctor data
    return NextResponse.json({ success: true, data: doctor });
    
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT handler to update a doctor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get doctor ID from params
    const doctorId = params.id;
    
    // Parse request body
    const data = await request.json();
    
    // Update doctor
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    // Handle not found
    if (!updatedDoctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    // Return updated doctor data
    return NextResponse.json({ success: true, data: updatedDoctor });
    
  } catch (error: any) {
    console.error('Error updating doctor:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a doctor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get doctor ID from params
    const doctorId = params.id;
    
    // Delete doctor
    const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);
    
    // Handle not found
    if (!deletedDoctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    // Return success response
    return NextResponse.json(
      { success: true, message: 'Doctor deleted successfully' }
    );
    
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}