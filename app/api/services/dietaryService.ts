import { connectToDatabase } from '../lib/db';
import { Dietary } from '../entities/Dietary';

const DEFAULT_DIETARY_OPTIONS = [
  { key: 'vegetarian', label: 'Vegetarian', icon: '🌱' },
  { key: 'vegan', label: 'Vegan', icon: '🌱' },
  { key: 'gluten-free', label: 'Gluten-Free', icon: '' },
  { key: 'nut-allergy', label: 'Nut Allergy', icon: '🌰' },
  { key: 'dairy-free', label: 'Dairy-Free', icon: '' },
  { key: 'halal', label: 'Halal', icon: '' },
  { key: 'kosher', label: 'Kosher', icon: '' },
];

export async function getDietaryOptions() {
  await connectToDatabase();
  let options = await Dietary.find({});
  // Auto-seed options if database collection is empty
  if (options.length === 0) {
    options = await Dietary.insertMany(DEFAULT_DIETARY_OPTIONS);
  }
  return options;
}

export async function createDietaryOption(data: { key: string; label: string; icon?: string }) {
  await connectToDatabase();
  const option = new Dietary({
    key: data.key.toLowerCase().trim(),
    label: data.label.trim(),
    icon: data.icon?.trim() || '',
  });
  return await option.save();
}
