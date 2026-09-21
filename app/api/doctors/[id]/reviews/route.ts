import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import Doctor from '@/lib/db/models/Doctor';
import Review from '@/lib/db/models/Review';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/requireAuth';
import { createReviewSchema, averageRating } from '@/lib/validation/review';

/** GET /api/doctors/:id/reviews — list reviews for a doctor (newest first). */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const page = Math.max(1, parseInt(request.nextUrl.searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(request.nextUrl.searchParams.get('limit') || '10')));

    await dbConnect();

    const filter = { doctor: params.id };
    const [reviews, total] = await Promise.all([
      Review.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Review.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error listing reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/** POST /api/doctors/:id/reviews — add or update the caller's review. */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const body = await request.json().catch(() => null);
    const parsed = createReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    await dbConnect();

    const doctor = await Doctor.findById(params.id);
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }

    const user = await User.findById(auth.userId).select('name').lean<{ name: string }>();

    // One review per user per doctor — upsert so editing overwrites.
    const review = await Review.findOneAndUpdate(
      { user: auth.userId, doctor: params.id },
      {
        user: auth.userId,
        doctor: params.id,
        userName: user?.name || 'User',
        rating: parsed.data.rating,
        comment: parsed.data.comment,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Recompute the doctor's aggregate rating and count.
    const all = await Review.find({ doctor: params.id }).select('rating').lean<{ rating: number }[]>();
    doctor.rating = averageRating(all.map((r) => r.rating));
    doctor.reviewsCount = all.length;
    await doctor.save();

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);
    if (error?.name === 'ValidationError') {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
