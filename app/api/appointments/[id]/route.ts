import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import Doctor from '@/lib/db/models/Doctor';
import Appointment from '@/lib/db/models/Appointment';
import { requireAuth } from '@/lib/auth/requireAuth';
import { updateAppointmentSchema } from '@/lib/validation/appointment';
import { isSlotOffered } from '@/lib/appointments/slots';

/** GET /api/appointments/:id — the owner reads one appointment. */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    await dbConnect();

    const appointment = await Appointment.findById(params.id);
    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }
    if (appointment.user.toString() !== auth.userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/** PATCH /api/appointments/:id — cancel or reschedule (owner only). */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const body = await request.json().catch(() => null);
    const parsed = updateAppointmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    await dbConnect();

    const appointment = await Appointment.findById(params.id);
    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }
    if (appointment.user.toString() !== auth.userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    if (appointment.status !== 'booked') {
      return NextResponse.json(
        { success: false, error: `Cannot modify a ${appointment.status} appointment` },
        { status: 409 }
      );
    }

    if (parsed.data.action === 'cancel') {
      appointment.status = 'cancelled';
      await appointment.save();
      return NextResponse.json({ success: true, data: appointment });
    }

    // Reschedule: validate the new date/slot against the doctor's availability.
    const { date, slot } = parsed.data;
    const [year, month, day] = date.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (targetDate.getTime() < startOfToday.getTime()) {
      return NextResponse.json(
        { success: false, error: 'Cannot reschedule to a past date' },
        { status: 400 }
      );
    }

    const doctor = await Doctor.findById(appointment.doctor);
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }
    if (!isSlotOffered(doctor.availability, targetDate, slot)) {
      return NextResponse.json(
        { success: false, error: 'Doctor does not offer this slot on the selected day' },
        { status: 400 }
      );
    }

    appointment.date = date;
    appointment.slot = slot;
    try {
      await appointment.save();
    } catch (err: any) {
      if (err?.code === 11000) {
        return NextResponse.json(
          { success: false, error: 'That slot is already booked. Please pick another.' },
          { status: 409 }
        );
      }
      throw err;
    }

    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
