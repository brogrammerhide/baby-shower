import { connectToDatabase } from '../lib/db';
import { Gift } from '../health/entities/Gift';
import { RSVPModel } from '../health/entities/RSVP';
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

export async function updateGift(id: string, data: any) {
  await connectToDatabase();
  return await Gift.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteGift(id: string) {
  await connectToDatabase();
  const gift = await Gift.findById(id);
  if (!gift) return null;

  // Clear reserved gift from the RSVP profile if they had this one selected
  if (gift.reservedBy) {
    await RSVPModel.findByIdAndUpdate(gift.reservedBy, { $unset: { reservedGift: 1 } });
  }

  return await Gift.findByIdAndDelete(id);
}

export async function reserveGift(giftId: string, rsvpId: string, action: 'reserve' | 'release') {
  await connectToDatabase();

  const rsvpObjectId = new mongoose.Types.ObjectId(rsvpId);
  const giftObjectId = new mongoose.Types.ObjectId(giftId);

  if (action === 'reserve') {
    // Ensure the guest exists
    const rsvpExists = await RSVPModel.findById(rsvpObjectId);
    if (!rsvpExists) {
      throw new Error('RSVP profile not found');
    }

    // 1. Atomically reserve the gift if not already reserved
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

    // 2. If the user had a previous gift reserved, release it first
    if (rsvpExists.reservedGift && rsvpExists.reservedGift.toString() !== giftId) {
      await Gift.findByIdAndUpdate(rsvpExists.reservedGift, {
        $set: { reserved: false },
        $unset: { reservedBy: 1, reservedAt: 1 },
        $inc: { reservationCount: -1 },
      });
    }

    // 3. Link new reserved gift to the RSVP
    await RSVPModel.findByIdAndUpdate(rsvpObjectId, { reservedGift: giftObjectId });
    return gift;
  } else {
    // Release action - only allow releasing if it was reserved by this guest
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

    // Unlink the gift from the RSVP profile
    await RSVPModel.findByIdAndUpdate(rsvpObjectId, { $unset: { reservedGift: 1 } });
    return gift;
  }
}
