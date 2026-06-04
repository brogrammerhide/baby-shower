import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IRSVP extends Document {
  firstName: string;
  lastName: string;
  attending: boolean;
  guests: number;
  dietaryRestrictions: Types.ObjectId[]; // References Dietary options
  otherDietNotes?: string; // Stores custom text for 'otherDiet'
  arrivalTime?: string; // Stores arrival time, e.g., '12:30'
  reservedGift?: Types.ObjectId; // References Gift
  group?: Types.ObjectId; // References Group
  createdAt: Date;
  updatedAt: Date;
}

const RSVPSchema = new Schema<IRSVP>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    attending: {
      type: Boolean,
      required: [true, 'Attendance status is required'],
      default: false,
    },
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'Must have at least 1 attendee (the RSVP holder)'],
      default: 1,
    },
    dietaryRestrictions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Dietary',
      },
    ],
    otherDietNotes: {
      type: String,
      trim: true,
      default: '',
    },
    arrivalTime: {
      type: String,
      trim: true,
    },
    reservedGift: {
      type: Schema.Types.ObjectId,
      ref: 'Gift',
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for RSVP lookups ("Find My RSVP" flow)
RSVPSchema.index({ firstName: 1, lastName: 1 });

export const RSVPModel: Model<IRSVP> =
  mongoose.models.RSVP || mongoose.model<IRSVP>('RSVP', RSVPSchema);
