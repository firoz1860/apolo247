import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
  mrp: number;
  manufacturer?: string;
  description?: string;
  prescriptionRequired: boolean;
  image?: string;
  stock: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    manufacturer: { type: String },
    description: { type: String },
    prescriptionRequired: { type: Boolean, default: false },
    image: { type: String, default: '/images/default-medicine.png' },
    stock: { type: Number, default: 100, min: 0 },
    rating: { type: Number, default: 4, min: 0, max: 5 },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', description: 'text', category: 'text' });

const Product =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
