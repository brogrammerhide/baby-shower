import { connectToDatabase } from '../lib/db';
import { RSVPModel } from '../health/entities/RSVP';
import { Dietary } from '../health/entities/Dietary';
import { Gift } from '../health/entities/Gift';

export async function getAllRSVPs() {
  await connectToDatabase();
  return await RSVPModel.find({})
    .populate('dietaryRestrictions')
    .populate('reservedGift')
    .sort({ createdAt: -1 });
}

export async function lookupRSVP(firstName: string, lastName?: string) {
  await connectToDatabase();
  const searchFirst = firstName.trim();
  
  if (lastName) {
    const searchLast = lastName.trim();
    // 1. Check exact case-insensitive match
    const exact = await RSVPModel.findOne({
      firstName: { $regex: new RegExp(`^${searchFirst}$`, 'i') },
      lastName: { $regex: new RegExp(`^${searchLast}$`, 'i') }
    })
    .populate('dietaryRestrictions')
    .populate('reservedGift');
    
    if (exact) {
      return { type: 'exact', data: exact };
    }
  }

  // 2. Fallback to first name match
  const matches = await RSVPModel.find({
    firstName: { $regex: new RegExp(`^${searchFirst}$`, 'i') }
  })
  .populate('dietaryRestrictions')
  .populate('reservedGift');

  return { type: 'matches', data: matches };
}

export async function submitRSVP(data: {
  firstName: string;
  lastName: string;
  attending: boolean;
  guests: number;
  diet: string[];
  otherDiet?: string;
  arrivalTime?: string;
}) {
  await connectToDatabase();

  const fn = data.firstName.trim();
  const ln = data.lastName.trim();

  // Parse dietary restriction string keys (e.g. ['vegan', 'halal']) to ObjectIds
  const cleanDietKeys = data.diet.map(d => d.toLowerCase().trim());
  const resolvedDiets = await Dietary.find({ key: { $in: cleanDietKeys } });
  const dietaryIds = resolvedDiets.map(d => d._id);

  const query = {
    firstName: { $regex: new RegExp(`^${fn}$`, 'i') },
    lastName: { $regex: new RegExp(`^${ln}$`, 'i') }
  };

  const updateData = {
    firstName: fn,
    lastName: ln,
    attending: data.attending,
    guests: data.guests,
    dietaryRestrictions: dietaryIds,
    otherDietNotes: data.otherDiet || '',
    arrivalTime: data.arrivalTime || '',
  };

  // Find and update if existing, otherwise create (upsert)
  const rsvp = await RSVPModel.findOneAndUpdate(query, updateData, {
    new: true,
    upsert: true,
    runValidators: true,
  });

  // If a guest updates their RSVP to 'Not Attending', release their reserved gift
  if (!data.attending && rsvp.reservedGift) {
    await Gift.findByIdAndUpdate(rsvp.reservedGift, {
      reserved: false,
      $unset: { reservedBy: 1, reservedAt: 1 }
    });
    rsvp.reservedGift = undefined;
    await rsvp.save();
  }

  return rsvp;
}

export async function deleteRSVP(id: string) {
  await connectToDatabase();
  const rsvp = await RSVPModel.findById(id);
  if (!rsvp) return null;

  // Release the gift reservation associated with this guest
  if (rsvp.reservedGift) {
    await Gift.findByIdAndUpdate(rsvp.reservedGift, {
      reserved: false,
      $unset: { reservedBy: 1, reservedAt: 1 }
    });
  }

  return await RSVPModel.findByIdAndDelete(id);
}
