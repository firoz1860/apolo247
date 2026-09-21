import mongoose, { Schema, Document } from 'mongoose';

export interface ILabTest extends Document {
  name: string;
  description?: string;
  price: number;
  mrp: number;
  category: string;
  sampleType: string;
  reportTimeHours: number;
  preparation?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LabTestSchema = new Schema<ILabTest>(
  {
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, index: true },
    sampleType: { type: String, default: 'Blood' },
    reportTimeHours: { type: Number, default: 24, min: 1 },
    preparation: { type: String },
  },
  { timestamps: true }
);

LabTestSchema.index({ name: 'text', description: 'text', category: 'text' });

const LabTest =
  mongoose.models.LabTest || mongoose.model<ILabTest>('LabTest', LabTestSchema);

export default LabTest;
