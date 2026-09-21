import mongoose, { Schema, Document } from 'mongoose';

export type LabBookingStatus = 'booked' | 'cancelled' | 'completed';

export interface ILabBooking extends Document {
  user: mongoose.Types.ObjectId;
  test: mongoose.Types.ObjectId;
  testName: string;
  price: number;
  /** Sample-collection date, stored as YYYY-MM-DD. */
  date: string;
  status: LabBookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const LabBookingSchema = new Schema<ILabBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    test: { type: Schema.Types.ObjectId, ref: 'LabTest', required: true },
    testName: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    date: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'],
    },
    status: {
      type: String,
      enum: ['booked', 'cancelled', 'completed'],
      default: 'booked',
      index: true,
    },
  },
  { timestamps: true }
);

const LabBooking =
  mongoose.models.LabBooking ||
  mongoose.model<ILabBooking>('LabBooking', LabBookingSchema);

export default LabBooking;
