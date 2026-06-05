import { connectToDatabase } from '../lib/db';
import { RSVPModel } from '../entities/RSVP';
import { Dietary } from '../entities/Dietary';
import { Gift } from '../entities/Gift';
import mongoose from 'mongoose';

async function releaseGift(giftId: mongoose.Types.ObjectId) {
  await Gift.findByIdAndUpdate(giftId, {
    $set: { reserved: false },
    $unset: { reservedBy: 1, reservedAt: 1 },
    $inc: { reservationCount: -1 },
  });
}

async function releaseAllReservedGifts(rsvp: { reservedGifts?: mongoose.Types.ObjectId[] }) {
  const ids = rsvp.reservedGifts ?? [];
  for (const giftId of ids) {
    await releaseGift(giftId);
  }
}

export async function getAllRSVPs() {
  await connectToDatabase();
  return await RSVPModel.find({})
    .populate('dietaryRestrictions')
    .populate('reservedGifts')
    .sort({ createdAt: -1 });
}

export async function lookupRSVP(firstName: string, lastName?: string) {
  await connectToDatabase();
  const searchFirst = firstName.trim();

  if (lastName) {
    const searchLast = lastName.trim();
    const exact = await RSVPModel.findOne({
      firstName: { $regex: new RegExp(`^${searchFirst}$`, 'i') },
      lastName: { $regex: new RegExp(`^${searchLast}$`, 'i') },
    })
      .populate('dietaryRestrictions')
      .populate('reservedGifts');

    if (exact) {
      return { type: 'exact', data: exact };
    }
  }

  const matches = await RSVPModel.find({
    firstName: { $regex: new RegExp(`^${searchFirst}$`, 'i') },
  })
    .populate('dietaryRestrictions')
    .populate('reservedGifts');

  return { type: 'matches', data: matches };
}

export async function submitRSVP(data: {
  firstName: string;
  lastName: string;
  attending: boolean;
  guests: number;
  diet: string[];
  otherDiet?: string;
  estimateArrivalTime?: string;
}) {
  await connectToDatabase();

  const fn = data.firstName.trim();
  const ln = data.lastName.trim();
  const guests = data.attending ? Math.max(1, data.guests) : 0;

  const cleanDietKeys = data.diet.map((d) => d.toLowerCase().trim());
  const resolvedDiets = await Dietary.find({ key: { $in: cleanDietKeys } });
  const dietaryIds = resolvedDiets.map((d: { _id: mongoose.Types.ObjectId }) => d._id);

  const query = {
    firstName: { $regex: new RegExp(`^${fn}$`, 'i') },
    lastName: { $regex: new RegExp(`^${ln}$`, 'i') },
  };

  const existing = await RSVPModel.findOne(query);

  const updateData = {
    firstName: fn,
    lastName: ln,
    attending: data.attending,
    guests,
    dietaryRestrictions: dietaryIds,
    otherDietNotes: data.otherDiet || '',
    estimateArrivalTime: data.attending ? data.estimateArrivalTime || '' : '',
  };

  const rsvp = await RSVPModel.findOneAndUpdate(query, updateData, {
    new: true,
    upsert: true,
    runValidators: true,
  });

  if (!data.attending && (existing?.reservedGifts?.length || rsvp.reservedGifts?.length)) {
    await releaseAllReservedGifts(rsvp);
    rsvp.reservedGifts = [];
    await rsvp.save();
  }

  return rsvp;
}

export async function deleteRSVP(id: string) {
  await connectToDatabase();
  const rsvp = await RSVPModel.findById(id);
  if (!rsvp) return null;

  await releaseAllReservedGifts(rsvp);
  return await RSVPModel.findByIdAndDelete(id);
}
