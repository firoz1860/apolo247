import mongoose, { Schema, Document } from 'mongoose';

export type ConsultationType = 'online' | 'in-person' | 'home';
export type AppointmentStatus = 'booked' | 'cancelled' | 'completed';

export interface IAppointment extends Document {
  user: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  doctorName: string;
  clinicName?: string;
  consultationType: ConsultationType;
  /** Booking date, stored as a YYYY-MM-DD string for stable per-day matching. */
  date: string;
  slot: {
    startTime: string;
    endTime: string;
  };
  fee: number;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
    doctorName: { type: String, required: true },
    clinicName: { type: String },
    consultationType: {
      type: String,
      enum: ['online', 'in-person', 'home'],
      required: true,
    },
    date: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'],
    },
    slot: {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
    fee: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['booked', 'cancelled', 'completed'],
      default: 'booked',
      index: true,
    },
  },
  { timestamps: true }
);

/**
 * Prevent double-booking: a given doctor + date + start time can only have one
 * active ("booked") appointment. The partial filter lets a cancelled slot be
 * re-booked. Requires MongoDB partial-index support (3.2+).
 */
AppointmentSchema.index(
  { doctor: 1, date: 1, 'slot.startTime': 1 },
  { unique: true, partialFilterExpression: { status: 'booked' } }
);

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment;
