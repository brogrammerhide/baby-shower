import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IGift extends Document {
  name: string;
  category: string; // e.g., 'nursery', 'beach', 'feeding', 'care'
  price: string; // e.g., '$32'
  icon: string; // e.g., 'wave', 'moon', 'palm'
  note: string;
  reserved: boolean;
  reservedBy?: Types.ObjectId; // References the RSVP guest who reserved it
  reservedAt?: Date;
  reservationCount: number; // Number of total reservations
  url?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GiftSchema = new Schema<IGift>(
  {
    name: {
      type: String,
      required: [true, 'Gift name is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      lowercase: true,
      trim: true,
    },
    price: {
      type: String,
      required: [true, 'Price is required'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Icon identifier is required'],
      trim: true,
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
    reserved: {
      type: Boolean,
      default: false,
    },
    reservationCount: { type: Number, default: 0 },
    // reservedBy: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'RSVP',
    // },
    // reservedAt: {
    //   type: Date,
    // },
    url: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for registry filtering and status checks
// GiftSchema.index({ category: 1 });
// GiftSchema.index({ reserved: 1 });

export const Gift: Model<IGift> =
  mongoose.models.Gift || mongoose.model<IGift>('Gift', GiftSchema);
