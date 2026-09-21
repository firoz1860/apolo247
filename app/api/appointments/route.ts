import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import Doctor from '@/lib/db/models/Doctor';
import Appointment from '@/lib/db/models/Appointment';
import { requireAuth } from '@/lib/auth/requireAuth';
import {
  bookAppointmentSchema,
  listAppointmentsQuerySchema,
} from '@/lib/validation/appointment';
import { isSlotOffered } from '@/lib/appointments/slots';

/** GET /api/appointments — list the authenticated user's appointments. */
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const parsed = listAppointmentsQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams)
    );
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid query' },
        { status: 400 }
      );
    }
    const { status, page, limit } = parsed.data;

    await dbConnect();

    const filter: Record<string, unknown> = { user: auth.userId };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .sort({ date: -1, 'slot.startTime': -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Appointment.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);
    return NextResponse.json({
      success: true,
      data: appointments,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error listing appointments:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/** POST /api/appointments — book an appointment. */
export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const body = await request.json().catch(() => null);
    const parsed = bookAppointmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    const { doctorId, date, slot, consultationType, clinicName } = parsed.data;

    await dbConnect();

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Requested date must not be in the past.
    const [year, month, day] = date.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (targetDate.getTime() < startOfToday.getTime()) {
      return NextResponse.json(
        { success: false, error: 'Cannot book an appointment in the past' },
        { status: 400 }
      );
    }

    // The slot must be one the doctor actually offers that weekday.
    if (!isSlotOffered(doctor.availability, targetDate, slot)) {
      return NextResponse.json(
        { success: false, error: 'Doctor does not offer this slot on the selected day' },
        { status: 400 }
      );
    }

    // Server-authoritative fee (never trust a client-supplied price).
    let fee = 0;
    let resolvedClinic: string | undefined;
    if (consultationType === 'online') {
      const fees = doctor.clinics.map((c: { consultationFee: number }) => c.consultationFee);
      fee = fees.length ? Math.min(...fees) : 0;
    } else {
      const clinic = doctor.clinics.find(
        (c: { name: string }) => c.name === clinicName
      );
      if (!clinic) {
        return NextResponse.json(
          { success: false, error: 'Selected clinic not found for this doctor' },
          { status: 400 }
        );
      }
      fee = clinic.consultationFee;
      resolvedClinic = clinic.name;
    }

    try {
      const appointment = await Appointment.create({
        user: auth.userId,
        doctor: doctor._id,
        doctorName: doctor.name,
        clinicName: resolvedClinic,
        consultationType,
        date,
        slot,
        fee,
        status: 'booked',
      });

      return NextResponse.json({ success: true, data: appointment }, { status: 201 });
    } catch (err: any) {
      // Duplicate key on the partial unique index → slot already taken.
      if (err?.code === 11000) {
        return NextResponse.json(
          { success: false, error: 'That slot has just been booked. Please pick another.' },
          { status: 409 }
        );
      }
      throw err;
    }
  } catch (error: any) {
    console.error('Error booking appointment:', error);
    if (error?.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
