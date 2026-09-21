import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import LabTest from '@/lib/db/models/LabTest';
import LabBooking from '@/lib/db/models/LabBooking';
import { requireAuth } from '@/lib/auth/requireAuth';
import { bookLabTestSchema } from '@/lib/validation/commerce';

/** GET /api/lab-bookings — the authenticated user's lab-test bookings. */
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    await dbConnect();
    const bookings = await LabBooking.find({ user: auth.userId })
      .sort({ date: -1 })
      .lean();
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error listing lab bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/** POST /api/lab-bookings — book a lab test for a collection date. */
export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const body = await request.json().catch(() => null);
    const parsed = bookLabTestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    const { testId, date } = parsed.data;

    const [year, month, day] = date.split('-').map(Number);
    const target = new Date(year, month - 1, day);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (target.getTime() < startOfToday.getTime()) {
      return NextResponse.json(
        { success: false, error: 'Cannot book a collection date in the past' },
        { status: 400 }
      );
    }

    await dbConnect();

    const test = await LabTest.findById(testId);
    if (!test) {
      return NextResponse.json(
        { success: false, error: 'Lab test not found' },
        { status: 404 }
      );
    }

    const booking = await LabBooking.create({
      user: auth.userId,
      test: test._id,
      testName: test.name,
      price: test.price,
      date,
      status: 'booked',
    });

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error: any) {
    console.error('Error booking lab test:', error);
    if (error?.name === 'ValidationError') {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
