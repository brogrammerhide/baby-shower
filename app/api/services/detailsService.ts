import { connectToDatabase } from '../lib/db';
import { Details } from '../health/entities/Details';

const DEFAULT_DETAILS = {
  date: 'Sunday, July 13 from 12:00 to 16:00',
  theme: 'Summer beach, seafoam blues, coral, and sunshine',
  place: '570 Wilson Avenue, Toronto, ON'
};

export async function getDetails() {
  await connectToDatabase();
  let details = await Details.findOne({});
  if (!details) {
    details = await Details.create(DEFAULT_DETAILS);
  }
  return details;
}

export async function updateDetails(data: { date: string; theme: string; place: string }) {
  await connectToDatabase();
  return await Details.findOneAndUpdate({}, data, {
    new: true,
    upsert: true,
    runValidators: true,
  });
}
