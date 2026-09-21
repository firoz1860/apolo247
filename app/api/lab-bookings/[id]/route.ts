import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import LabBooking from '@/lib/db/models/LabBooking';
import { requireAuth } from '@/lib/auth/requireAuth';

/** GET /api/lab-bookings/:id — owner reads one booking. */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    await dbConnect();
    const booking = await LabBooking.findById(params.id);
    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }
    if (booking.user.toString() !== auth.userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error fetching lab booking:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/** PATCH /api/lab-bookings/:id — cancel a lab booking (owner only). */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const body = await request.json().catch(() => null);
    if (!body || body.action !== 'cancel') {
      return NextResponse.json(
        { success: false, error: 'Only { "action": "cancel" } is supported' },
        { status: 400 }
      );
    }

    await dbConnect();
    const booking = await LabBooking.findById(params.id);
    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }
    if (booking.user.toString() !== auth.userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    if (booking.status !== 'booked') {
      return NextResponse.json(
        { success: false, error: `Cannot cancel a ${booking.status} booking` },
        { status: 409 }
      );
    }

    booking.status = 'cancelled';
    await booking.save();
    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error cancelling lab booking:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
