import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import Doctor from '@/lib/db/models/Doctor';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const data = await request.json();
    console.log("Received data:", data);

    // Bulk insert
    if (Array.isArray(data)) {
      const missingRequiredFields: { index: number; name?: string; error: string }[] = [];

      const doctorsToInsert = data.map((doc, index) => {
        const { name, gender, experience, primarySpecialization, specializations, qualifications } = doc;

        if (
          !name ||
          !gender ||
          !experience ||
          !primarySpecialization ||
          !Array.isArray(specializations) || specializations.length === 0 ||
          !Array.isArray(qualifications) || qualifications.length === 0
        ) {
          missingRequiredFields.push({
            index,
            name,
            error: 'Missing required fields',
          });
        }

        return {
          name,
          specializations,
          primarySpecialization,
          qualifications,
          experience,
          gender,
          languages: doc.languages || ['English', 'Hindi'],
          clinics: doc.clinics,
          availability: doc.availability,
          about: doc.about,
          profileImage: doc.profileImage || '/images/default-doctor.png',
          rating: doc.rating || 0,
          reviewsCount: doc.reviewsCount || 0,
          isConsultOnline: doc.isConsultOnline || false,
          isHomeVisit: doc.isHomeVisit || false,
        };
      });

      if (missingRequiredFields.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Some doctors are missing required fields',
            details: missingRequiredFields,
          },
          { status: 400 }
        );
      }

      const insertedDoctors = await Doctor.insertMany(doctorsToInsert, { ordered: false });
      console.log("Inserted doctors:", insertedDoctors);
      return NextResponse.json({ success: true, data: insertedDoctors }, { status: 201 });
    }

    // Single insert
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
      isHomeVisit = false,
    } = data;

    if (
      !name ||
      !gender ||
      !experience ||
      !primarySpecialization ||
      !Array.isArray(specializations) || specializations.length === 0 ||
      !Array.isArray(qualifications) || qualifications.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: { name, gender, experience, primarySpecialization, specializations, qualifications },
        },
        { status: 400 }
      );
    }

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
      isHomeVisit,
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



// import { NextRequest, NextResponse } from 'next/server';
// import { dbConnect } from '@/lib/db/dbConnect';
// import Doctor from '@/lib/db/models/Doctor';

// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect();

//     const data = await request.json();
//     console.log("Received data:", data);

//     // ✅ Bulk Insert
//     if (Array.isArray(data)) {
//       const missingRequiredFields: { index: number; name?: string; error: string }[] = [];

//       const doctorsToInsert = data.map((doc, index) => {
//         const { name, gender, experience, primarySpecialization } = doc;

//         if (!name || !gender || !experience || !primarySpecialization) {
//           missingRequiredFields.push({
//             index,
//             name,
//             error: 'Missing required fields',
//           });
//         }

//         return {
//           name,
//           specializations: doc.specializations,
//           primarySpecialization,
//           qualifications: doc.qualifications,
//           experience,
//           gender,
//           languages: doc.languages || ['English', 'Hindi'],
//           clinics: doc.clinics,
//           availability: doc.availability,
//           about: doc.about,
//           profileImage: doc.profileImage || '/images/default-doctor.png',
//           rating: doc.rating || 0,
//           reviewsCount: doc.reviewsCount || 0,
//           isConsultOnline: doc.isConsultOnline || false,
//           isHomeVisit: doc.isHomeVisit || false,
//         };
//       });

//       if (missingRequiredFields.length > 0) {
//         return NextResponse.json(
//           {
//             success: false,
//             error: 'Some doctors are missing required fields',
//             details: missingRequiredFields,
//           },
//           { status: 400 }
//         );
//       }

//       const insertedDoctors = await Doctor.insertMany(doctorsToInsert);
//       return NextResponse.json({ success: true, data: insertedDoctors }, { status: 201 });
//     }

//     // ✅ Single Insert
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
//       isHomeVisit = false,
//     } = data;

//     // Minimal validation for single insert
//     if (!name || !gender || !experience || !primarySpecialization) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: 'Missing required fields',
//           details: { name, gender, experience, primarySpecialization },
//         },
//         { status: 400 }
//       );
//     }

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
//       isHomeVisit,
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
