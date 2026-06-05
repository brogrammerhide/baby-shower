const DEFAULT_DIETARY_OPTIONS = [
  { key: 'vegetarian', label: 'Vegetarian', icon: '' },
  { key: 'vegan', label: 'Vegan', icon: '' },
  { key: 'gluten-free', label: 'Gluten-Free', icon: '' },
  { key: 'nut-allergy', label: 'Nut Allergy', icon: '' },
  { key: 'dairy-free', label: 'Dairy-Free', icon: '' },
  { key: 'halal', label: 'Halal', icon: '' },
  { key: 'kosher', label: 'Kosher', icon: '' },
];

export async function getDietaryOptions() {
  return DEFAULT_DIETARY_OPTIONS.map((option) => ({
    id: option.key,
    ...option,
  }));
}
