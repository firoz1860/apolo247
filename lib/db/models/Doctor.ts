import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for a Doctor document
export interface IDoctor extends Document {
  name: string;
  specializations: string[];
  primarySpecialization: string;
  qualifications: string[];
  experience: number;
  gender: 'male' | 'female' | 'other';
  languages: string[];
  clinics: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    consultationFee: number;
  }[];
  availability: {
    day: string;
    slots: {
      startTime: string;
      endTime: string;
    }[];
  }[];
  about: string;
  profileImage: string;
  rating: number;
  reviewsCount: number;
  isConsultOnline: boolean;
  isHomeVisit: boolean;
}

// Define the schema
const DoctorSchema: Schema = new Schema({
  name: { type: String, required: true, index: true },
  specializations: { type: [String], required: true, index: true },
  primarySpecialization: { type: String, required: true, index: true },
  qualifications: { type: [String], required: true },
  experience: { type: Number, required: true, index: true },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other'], 
    required: true,
    index: true 
  },
  languages: { type: [String], default: ['English', 'Hindi'] },
  clinics: [{
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    consultationFee: { type: Number, required: true, index: true }
  }],
  availability: [{
    day: { type: String, required: true },
    slots: [{
      startTime: { type: String, required: true },
      endTime: { type: String, required: true }
    }]
  }],
  about: { type: String },
  profileImage: { type: String, default: '/images/default-doctor.png' },
  rating: { type: Number, default: 0, min: 0, max: 5, index: true },
  reviewsCount: { type: Number, default: 0 },
  isConsultOnline: { type: Boolean, default: false, index: true },
  isHomeVisit: { type: Boolean, default: false, index: true }
}, {
  timestamps: true
});

// Create indexes for common queries
DoctorSchema.index({ name: 'text', primarySpecialization: 'text' });
// DoctorSchema.index({ experience: 1 });
// DoctorSchema.index({ 'clinics.consultationFee': 1 });
// DoctorSchema.index({ rating: -1 });

// Prevent model recompilation error in development
const Doctor = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);

export default Doctor;