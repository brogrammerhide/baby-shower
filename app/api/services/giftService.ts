import { connectToDatabase } from '../lib/db';
import { Gift } from '../entities/Gift';
import { RSVPModel } from '../entities/RSVP';
import mongoose from 'mongoose';

export async function getAllGifts(category?: string) {
  await connectToDatabase();
  const filter = category ? { category: category.toLowerCase().trim() } : {};
  return await Gift.find(filter).sort({ createdAt: -1 });
}

export async function createGift(data: {
  name: string;
  category: string;
  price: string;
  icon: string;
  note?: string;
  url?: string;
  imageUrl?: string;
}) {
  await connectToDatabase();
  const gift = new Gift(data);
  return await gift.save();
}

export async function updateGift(id: string, data: Record<string, unknown>) {
  await connectToDatabase();
  return await Gift.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteGift(id: string) {
  await connectToDatabase();
  const gift = await Gift.findById(id);
  if (!gift) return null;

  await RSVPModel.updateMany(
    { reservedGifts: gift._id },
    { $pull: { reservedGifts: gift._id } }
  );

  return await Gift.findByIdAndDelete(id);
}

export async function reserveGift(giftId: string, rsvpId: string, action: 'reserve' | 'release') {
  await connectToDatabase();

  const rsvpObjectId = new mongoose.Types.ObjectId(rsvpId);
  const giftObjectId = new mongoose.Types.ObjectId(giftId);

  if (action === 'reserve') {
    const rsvpExists = await RSVPModel.findById(rsvpObjectId);
    if (!rsvpExists) {
      throw new Error('RSVP profile not found');
    }
    if (!rsvpExists.attending) {
      throw new Error('Only attending guests can reserve gifts');
    }

    const gift = await Gift.findOneAndUpdate(
      { _id: giftObjectId, reserved: false },
      {
        $set: {
          reserved: true,
          reservedBy: rsvpObjectId,
          reservedAt: new Date(),
        },
        $inc: { reservationCount: 1 },
      },
      { new: true }
    );

    if (!gift) {
      throw new Error('Gift is already reserved by someone else or does not exist');
    }

    await RSVPModel.findByIdAndUpdate(rsvpObjectId, {
      $addToSet: { reservedGifts: giftObjectId },
    });

    return gift;
  }

  const gift = await Gift.findOneAndUpdate(
    { _id: giftObjectId, reservedBy: rsvpObjectId },
    {
      $set: { reserved: false },
      $unset: { reservedBy: 1, reservedAt: 1 },
      $inc: { reservationCount: -1 },
    },
    { new: true }
  );

  if (!gift) {
    throw new Error('Gift was not reserved by this guest or does not exist');
  }

  await RSVPModel.findByIdAndUpdate(rsvpObjectId, {
    $pull: { reservedGifts: giftObjectId },
  });

  return gift;
}
