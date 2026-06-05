import mongoose from 'mongoose';
import { Gift } from '../app/api/entities/Gift';
import { connectToDatabase } from '../app/api/lib/db';

interface GiftData {
  name: string;
  category: string;
  price: string;
  icon: string;
  note: string;
  url?: string;
  imageUrl?: string;
}

const giftsData: GiftData[] = [
  // Nursery Category
  {
    name: 'Crib with Mattress',
    category: 'nursery',
    price: '$299',
    icon: 'moon',
    note: 'Comfortable and safe crib with hypoallergenic mattress for peaceful sleep',
    url: 'https://www.amazon.ca/s?k=baby+crib+mattress',
    imageUrl: 'https://images.unsplash.com/photo-1606763662064-c19730a47d10?w=200&q=80',
  },
  {
    name: 'Changing Table',
    category: 'nursery',
    price: '$159',
    icon: 'moon',
    note: 'Sturdy changing table with storage drawers for diaper supplies',
    url: 'https://www.amazon.ca/s?k=baby+changing+table',
    imageUrl: 'https://images.unsplash.com/photo-1515238152791-de8973cecb3d?w=200&q=80',
  },
  {
    name: 'Dresser with Drawers',
    category: 'nursery',
    price: '$199',
    icon: 'moon',
    note: 'Spacious dresser for storing baby clothes and accessories',
    url: 'https://www.amazon.ca/s?k=baby+dresser',
    imageUrl: 'https://images.unsplash.com/photo-1555158636-6efefede0203?w=200&q=80',
  },
  {
    name: 'Blackout Curtains',
    category: 'nursery',
    price: '$49',
    icon: 'moon',
    note: 'Light-blocking curtains for better sleep environment',
    url: 'https://www.amazon.ca/s?k=blackout+curtains+baby',
    imageUrl: 'https://images.unsplash.com/photo-1578932750294-708694e7f316?w=200&q=80',
  },
  {
    name: 'Night Light',
    category: 'nursery',
    price: '$29',
    icon: 'moon',
    note: 'Soft ambient lighting for nighttime feedings and diaper changes',
    url: 'https://www.amazon.ca/s?k=baby+night+light',
    imageUrl: 'https://images.unsplash.com/photo-1516564366149-8162fe8f9629?w=200&q=80',
  },

  // Feeding Category
  {
    name: 'High Chair',
    category: 'feeding',
    price: '$179',
    icon: 'fork',
    note: 'Easy-to-clean high chair with adjustable height for growing babies',
    url: 'https://www.amazon.ca/s?k=baby+high+chair',
    imageUrl: 'https://images.unsplash.com/photo-1605910861501-2e08e86ce19f?w=200&q=80',
  },
  {
    name: 'Bottle Warmer',
    category: 'feeding',
    price: '$59',
    icon: 'fork',
    note: 'Quick and gentle warming for bottles and baby food',
    url: 'https://www.amazon.ca/s?k=bottle+warmer',
    imageUrl: 'https://images.unsplash.com/photo-1615049305284-cf3be5983b13?w=200&q=80',
  },
  {
    name: 'Feeding Set with Bibs',
    category: 'feeding',
    price: '$39',
    icon: 'fork',
    note: 'Complete set including plates, bowls, utensils, and bibs',
    url: 'https://www.amazon.ca/s?k=baby+feeding+set',
    imageUrl: 'https://images.unsplash.com/photo-1616394584534-eb32064e08b8?w=200&q=80',
  },
  {
    name: 'Sterilizer and Dryer',
    category: 'feeding',
    price: '$99',
    icon: 'fork',
    note: 'Electric sterilizer that dries bottles and pacifiers automatically',
    url: 'https://www.amazon.ca/s?k=bottle+sterilizer',
    imageUrl: 'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=200&q=80',
  },
  {
    name: 'Diaper Pail',
    category: 'feeding',
    price: '$69',
    icon: 'fork',
    note: 'Odor-blocking diaper pail with hands-free lid',
    url: 'https://www.amazon.ca/s?k=diaper+pail',
    imageUrl: 'https://images.unsplash.com/photo-1595453606746-1e5e01a476cc?w=200&q=80',
  },

  // Care Category
  {
    name: 'Baby Monitor with Camera',
    category: 'care',
    price: '$149',
    icon: 'heart',
    note: 'HD video monitor with temperature monitoring and night vision',
    url: 'https://www.amazon.ca/s?k=baby+monitor+camera',
    imageUrl: 'https://images.unsplash.com/photo-1591073225862-9f1b1e887f6f?w=200&q=80',
  },
  {
    name: 'First Aid Kit',
    category: 'care',
    price: '$45',
    icon: 'heart',
    note: 'Complete first aid kit tailored for babies and toddlers',
    url: 'https://www.amazon.ca/s?k=baby+first+aid+kit',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde0e?w=200&q=80',
  },
  {
    name: 'Humidifier',
    category: 'care',
    price: '$79',
    icon: 'heart',
    note: 'Ultrasonic humidifier for maintaining healthy air quality',
    url: 'https://www.amazon.ca/s?k=baby+humidifier',
    imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&q=80',
  },
  {
    name: 'Nasal Aspirator',
    category: 'care',
    price: '$25',
    icon: 'heart',
    note: 'Electric nasal aspirator for gentle congestion relief',
    url: 'https://www.amazon.ca/s?k=baby+nasal+aspirator',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=80',
  },
  {
    name: 'Bath Tub with Stand',
    category: 'care',
    price: '$89',
    icon: 'heart',
    note: 'Ergonomic bath tub with temperature indicator and support stand',
    url: 'https://www.amazon.ca/s?k=baby+bath+tub',
    imageUrl: 'https://images.unsplash.com/photo-1606763662064-c19730a47d10?w=200&q=80',
  },

  // Beach Category
  {
    name: 'Beach Tent',
    category: 'beach',
    price: '$89',
    icon: 'wave',
    note: 'UV-protective pop-up tent for sun safety at the beach',
    url: 'https://www.amazon.ca/s?k=baby+beach+tent',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    name: 'Sun Protection Suit',
    category: 'beach',
    price: '$65',
    icon: 'wave',
    note: 'Full-body swim suit with UPF 50+ sun protection',
    url: 'https://www.amazon.ca/s?k=baby+sun+suit',
    imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=200&q=80',
  },
  {
    name: 'Sunscreen SPF 70',
    category: 'beach',
    price: '$19',
    icon: 'wave',
    note: 'Mineral sunscreen safe for babies from birth',
    url: 'https://www.amazon.ca/s?k=baby+sunscreen',
    imageUrl: 'https://images.unsplash.com/photo-1552514669-e0a172d718f0?w=200&q=80',
  },
  {
    name: 'Beach Bag Organizer',
    category: 'beach',
    price: '$39',
    icon: 'wave',
    note: 'Insulated beach bag with multiple compartments and wet storage',
    url: 'https://www.amazon.ca/s?k=beach+bag+organizer',
    imageUrl: 'https://images.unsplash.com/photo-1625784299049-8ad66a50d5e4?w=200&q=80',
  },
  {
    name: 'Floatie and Pool Ring',
    category: 'beach',
    price: '$35',
    icon: 'wave',
    note: 'Safe inflatable floatie ring for water confidence building',
    url: 'https://www.amazon.ca/s?k=baby+floatie+ring',
    imageUrl: 'https://images.unsplash.com/photo-1552183520-9a9e8c5e8a3b?w=200&q=80',
  },
];

async function seedGifts() {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB');

    // Clear existing gifts
    await Gift.deleteMany({});
    console.log('Cleared existing gifts');

    // Insert new gifts
    const result = await Gift.insertMany(
      giftsData.map((gift) => ({
        ...gift,
        reserved: false,
        reservationCount: 0,
      }))
    );

    console.log(`✅ Successfully seeded ${result.length} gifts to MongoDB`);
    console.log('Gifts inserted:', result.map((g) => g.name).join(', '));

    process.exit(0);
  } catch (error) {
    console.error('Error seeding gifts:', error);
    process.exit(1);
  }
}

seedGifts();
