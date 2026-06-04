'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Details, Gift, RSVP } from '../../components/types';
import { BaseLayout } from '../../components/templates/BaseLayout';
import { PageTemplate } from '../../components/templates/PageTemplate';
import { DetailsForm } from '../../components/organisms/DetailsForm';
import { GiftForm } from '../../components/organisms/GiftForm';
import { ManagementList } from '../../components/organisms/ManagementList';

const DEFAULT_DETAILS: Details = {
  date: 'Sunday, July 13 at 12:30 PM',
  theme: 'Summer beach, seafoam blues, coral, and sunshine',
  place: 'Add your shower address here'
};

const DEFAULT_GIFTS: Gift[] = [
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
  { name: 'Mini First Aid Pouch', category: 'care', price: '$24', icon: 'firstaid', note: 'Thermometer, nail file, medicine pacifier, and travel pouch.', reserved: false, url: 'https://www.amazon.com/s?k=baby+first+aid+kit' }
];

export default function EditPage() {
  const [details, setDetails] = useState<Details>(DEFAULT_DETAILS);
  const [gifts, setGifts] = useState<Gift[]>(DEFAULT_GIFTS);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Shower details saved successfully!');
  };

  const handleGiftSubmit = (gift: Gift, index: number | null) => {
    if (index !== null) {
      setGifts((prev) => prev.map((g, i) => (i === index ? gift : g)));
      setEditIndex(null);
    } else {
      setGifts((prev) => [...prev, gift]);
    }
  };

  const deleteGift = (index: number) => {
    if (confirm(`Are you sure you want to delete "${gifts[index].name}"?`)) {
      setGifts((prev) => prev.filter((_, i) => i !== index));
      if (editIndex === index) setEditIndex(null);
    }
  };

  const toggleReservation = (index: number) => {
    setGifts((prev) =>
      prev.map((g, i) => (i === index ? { ...g, reserved: !g.reserved } : g))
    );
  };

  const deleteGuest = (index: number) => {
    if (confirm(`Delete RSVP for ${rsvps[index].firstName} ${rsvps[index].lastName}?`)) {
      setRsvps((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <BaseLayout>
      <PageTemplate
        maxWidth="max-w-[1080px]"
        gridCols="lg:grid-cols-[1fr_1.2fr]"
        sidebar={
          <div className="grid gap-[22px]">
            <section className="overflow-hidden rounded-[28px] bg-white/90 p-5 shadow-card backdrop-blur-lg flex items-center justify-between">
              <div>
                <h1 className="font-pacifico text-2xl text-ocean">Registry Settings</h1>
                <p className="text-xs font-bold text-[#497184] mt-0.5">Customize details & gifts</p>
              </div>
              <Link href="/" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-seafoam text-ocean font-bold text-sm border-2 border-ocean/10 transition hover:-translate-y-px hover:bg-ocean hover:text-white hover:shadow-soft">
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Registry
              </Link>
            </section>

            <DetailsForm 
              details={details} 
              onDetailsChange={setDetails} 
              onSubmit={handleDetailsSubmit} 
            />

            <GiftForm 
              editIndex={editIndex} 
              initialGift={editIndex !== null ? gifts[editIndex] : undefined}
              onSubmit={handleGiftSubmit}
              onCancel={() => setEditIndex(null)}
            />
          </div>
        }
        content={
          <div className="grid gap-[22px] !p-0">
            <ManagementList 
              type="gifts" 
              items={gifts} 
              onEdit={setEditIndex} 
              onDelete={deleteGift} 
              onToggleReservation={toggleReservation} 
            />
            <ManagementList 
              type="guests" 
              items={rsvps} 
              onDelete={deleteGuest} 
            />
          </div>
        }
      />
    </BaseLayout>
  );
}
