import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import Doctor from '@/lib/db/models/Doctor';
import Appointment from '@/lib/db/models/Appointment';
import { computeAvailableSlots, type DayAvailability } from '@/lib/appointments/slots';

/**
 * GET /api/doctors/:id/slots?date=YYYY-MM-DD
 * Returns the bookable slots for a doctor on a given date.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const date = request.nextUrl.searchParams.get('date');
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, error: 'A valid date=YYYY-MM-DD query param is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const doctor = await Doctor.findById(params.id).lean<{
      availability?: DayAvailability[];
    }>();
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Parse the date as local midnight so weekday math is stable.
    const [year, month, day] = date.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);

    const booked = await Appointment.find({
      doctor: params.id,
      date,
      status: 'booked',
    })
      .select('slot.startTime')
      .lean<{ slot: { startTime: string } }[]>();

    const bookedStartTimes = booked.map((a) => a.slot.startTime);

    const slots = computeAvailableSlots(
      doctor.availability || [],
      targetDate,
      bookedStartTimes
    );

    return NextResponse.json({ success: true, data: slots });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
