import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDetails extends Document {
  date: string;
  theme: string;
  place: string;
  createdAt: Date;
  updatedAt: Date;
}

const DetailsSchema = new Schema<IDetails>(
  {
    date: {
      type: String,
      required: [true, 'Date and time is required'],
      trim: true,
    },
    theme: {
      type: String,
      required: [true, 'Theme details are required'],
      trim: true,
    },
    place: {
      type: String,
      required: [true, 'Place/address is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Details: Model<IDetails> =
  mongoose.models.Details || mongoose.model<IDetails>('Details', DetailsSchema);
