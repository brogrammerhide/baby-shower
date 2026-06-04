import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IGroup extends Document {
  name: string; // e.g., 'The Smiths'
  invitationCode: string; // Unique search code, e.g., 'SUMMER2026'
  maxGuestsAllowed: number; // Max RSVP party size
  members: Types.ObjectId[]; // Array of RSVP member IDs
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
    },
    invitationCode: {
      type: String,
      required: [true, 'Invitation code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    maxGuestsAllowed: {
      type: Number,
      default: 2,
      min: [1, 'Must allow at least 1 guest'],
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'RSVP',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for looking up invitations by code
GroupSchema.index({ invitationCode: 1 });

export const Group: Model<IGroup> =
  mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);
