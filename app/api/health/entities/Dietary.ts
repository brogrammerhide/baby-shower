import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDietary extends Document {
  key: string; // e.g., 'vegetarian', 'vegan', 'gluten-free'
  label: string; // e.g., 'Vegetarian', 'Vegan', 'Gluten-Free'
  icon?: string; // e.g., '🌱', '🌰'
}

const DietarySchema = new Schema<IDietary>({
  key: {
    type: String,
    required: [true, 'Dietary key is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  label: {
    type: String,
    required: [true, 'Dietary label is required'],
    trim: true,
  },
  icon: {
    type: String,
    trim: true,
  },
});

export const Dietary: Model<IDietary> =
  mongoose.models.Dietary || mongoose.model<IDietary>('Dietary', DietarySchema);
