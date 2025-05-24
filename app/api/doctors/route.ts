import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import Doctor, { IDoctor } from '@/lib/db/models/Doctor';

// GET handler to fetch doctors with filters and pagination
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    
    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter: any = {};
    
    // Specialty filter
    const specialization = searchParams.get('specialization');
    if (specialization) {
      filter.specializations = specialization;
    }
    
    // Gender filter
    const gender = searchParams.get('gender');
    if (gender) {
      filter.gender = gender;
    }
    
    // Experience filter
    const minExperience = searchParams.get('minExperience');
    if (minExperience) {
      filter.experience = { $gte: parseInt(minExperience) };
    }
    
    // Fee filter
    const maxFee = searchParams.get('maxFee');
    if (maxFee) {
      filter['clinics.consultationFee'] = { $lte: parseInt(maxFee) };
    }
    
    // Availability filter (online/in-person)
    const isOnline = searchParams.get('isOnline');
    if (isOnline) {
      filter.isConsultOnline = isOnline === 'true';
    }
    
    const isHomeVisit = searchParams.get('isHomeVisit');
    if (isHomeVisit) {
      filter.isHomeVisit = isHomeVisit === 'true';
    }
    
    // Search by name or text
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      filter.$text = { $search: searchQuery };
    }
    
    // Sort options
    let sortOption = {};
    const sort = searchParams.get('sort');
    
    switch (sort) {
      case 'experience-high':
        sortOption = { experience: -1 };
        break;
      case 'experience-low':
        sortOption = { experience: 1 };
        break;
      case 'fee-high':
        sortOption = { 'clinics.consultationFee': -1 };
        break;
      case 'fee-low':
        sortOption = { 'clinics.consultationFee': 1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      default:
        sortOption = { rating: -1 }; // Default sort by rating
    }
    
    // Execute query with pagination
    const doctors = await Doctor.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const total = await Doctor.countDocuments(filter);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    // Return response
    return NextResponse.json({
      success: true,
      data: doctors,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });
    
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler to add a new doctor
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Parse request body
    const data = await request.json();
    
    // Create new doctor
    const newDoctor = new Doctor(data);
    await newDoctor.save();
    
    // Return success response
    return NextResponse.json(
      { success: true, data: newDoctor },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('Error adding doctor:', error);
    
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