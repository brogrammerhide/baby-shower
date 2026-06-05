import { Details, Gift } from '../../components/types';

export const DEFAULT_DETAILS: Details = {
  date: 'Sunday, July 13 from 12:00 to 16:00',
  theme: 'Summer beach, seafoam blues, coral, and sunshine',
  place: '570 Wilson Avenue, Toronto, ON',
};

export const DEFAULT_GIFTS: Gift[] = [
  { name: 'Wave-Soft Swaddle Set', category: 'nursery', price: '$32', icon: 'wave', note: 'Light cotton muslin for warm July naps and stroller walks.', reserved: false, url: 'https://www.amazon.com/s?k=baby+swaddle+set' },
  { name: 'Sea Glass Sound Machine', category: 'nursery', price: '$48', icon: 'moon', note: 'Ocean sounds and soft light for bedtime.', reserved: false, url: 'https://www.amazon.com/s?k=baby+sound+machine' },
  { name: 'Palm Shade Stroller Fan', category: 'beach', price: '$29', icon: 'palm', note: 'Rechargeable fan for sunny walks and beach days.', reserved: false, url: 'https://www.amazon.com/s?k=stroller+fan' },
  { name: 'Baby Beach Tent', category: 'beach', price: '$76', icon: 'tent', note: 'Portable shade for picnics, shore days, and backyard lounging.', reserved: false, url: 'https://www.amazon.com/s?k=baby+beach+tent' },
  { name: 'Bottle Warmer', category: 'feeding', price: '$41', icon: 'bottle', note: 'Compact warmer for nighttime bottles and early mornings.', reserved: false, url: 'https://www.amazon.com/s?k=baby+bottle+warmer' },
  { name: 'Ocean Bib Bundle', category: 'feeding', price: '$22', icon: 'bib', note: 'Soft waterproof bibs in shell, wave, and sailboat prints.', reserved: false, url: 'https://www.amazon.com/s?k=baby+bibs' },
  { name: 'Newborn Diaper Caddy', category: 'care', price: '$35', icon: 'caddy', note: 'Keeps wipes, diapers, cream, and tiny socks in one place.', reserved: false, url: 'https://www.amazon.com/s?k=diaper+caddy' },
  { name: 'Gentle Bath Kit', category: 'care', price: '$44', icon: 'bath', note: 'Wash, lotion, hooded towel, and brush for first baths.', reserved: false, url: 'https://www.amazon.com/s?k=baby+bath+kit' },
  { name: 'Sandy Toes Play Mat', category: 'nursery', price: '$58', icon: 'star', note: 'Padded coastal-color mat for tummy time.', reserved: false, url: 'https://www.amazon.com/s?k=baby+play+mat' },
  { name: 'UPF Swim Romper', category: 'beach', price: '$26', icon: 'shirt', note: 'Sun-safe baby swim layer for future splash days.', reserved: false, url: 'https://www.amazon.com/s?k=baby+swim+romper' },
  { name: 'Burp Cloth Stack', category: 'feeding', price: '$18', icon: 'cloth', note: 'Absorbent everyday cloths in breezy blue and white.', reserved: false, url: 'https://www.amazon.com/s?k=burp+cloths' },
  { name: 'Mini First Aid Pouch', category: 'care', price: '$24', icon: 'firstaid', note: 'Thermometer, nail file, medicine pacifier, and travel pouch.', reserved: false, url: 'https://www.amazon.com/s?k=baby+first+aid+kit' },
];
