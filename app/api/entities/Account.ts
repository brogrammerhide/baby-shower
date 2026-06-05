import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IAccount extends Document {
  email: string;
  passwordHash: string; // Stored securely hashed
  role: 'admin' | 'guest';
  firstName: string;
  lastName: string;
  rsvpProfile?: Types.ObjectId; // Linked RSVP document for guest accounts
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>(
  {
    // email: {
    //   type: String,
    //   required: [true, 'Email is required'],
    //   unique: true,
    //   trim: true,
    //   lowercase: true,
    //   match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    // },
    // passwordHash: {
    //   type: String,
    //   required: [true, 'Password hash is required'],
    //   select: false, // Prevents leakage by default in query returns
    // },
    // role: {
    //   type: String,
    //   enum: ['admin', 'guest'],
    //   default: 'guest',
    // },
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
    // rsvpProfile: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'RSVP',
    // },
    // lastLogin: {
    //   type: Date,
    // },
  },
  {
    timestamps: true,
  }
);

// Index for email lookups
AccountSchema.index({ email: 1 });

export const Account: Model<IAccount> =
  mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);
