'use client';

import { useState } from 'react';
import { Details, Gift, RSVP } from '../components/types';
import { BaseLayout } from '../components/templates/BaseLayout';
import { PageTemplate } from '../components/templates/PageTemplate';
import { Sidebar } from '../components/organisms/Sidebar';
import { BabyAnimation } from '../components/organisms/BabyAnimation';
import { RSVPForm } from '../components/organisms/RSVPForm';
import { RegistryGrid } from '../components/organisms/RegistryGrid';
import { Icon } from '../components/atoms/Icon';

const DEFAULT_DETAILS: Details = {
  date: 'Sunday, July 13 from 12:00 to 16:00',
  theme: 'Summer beach, seafoam blues, coral, and sunshine',
  place: '570 Wilson Avenue, Toronto, ON'
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

export default function Home() {
  const details: Details = DEFAULT_DETAILS;
  const [gifts, setGifts] = useState<Gift[]>(DEFAULT_GIFTS);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [babyMode, setBabyMode] = useState<'idle' | 'happy' | 'sad'>('idle');


  const handleRsvpSubmit = (newRsvp: RSVP) => {
    setRsvps((prev) => [...prev, newRsvp]);
  };

  const toggleGiftReservation = (index: number) => {
    setGifts((prev) =>
      prev.map((g, i) => (i === index ? { ...g, reserved: !g.reserved } : g))
    );
  };

  return (
    <BaseLayout>
      <PageTemplate
        sidebar={
          <div className="lg:sticky lg:top-0 grid gap-[22px]">
            <Sidebar details={details} />
            <div className="overflow-hidden rounded-[28px] bg-white/90 shadow-card backdrop-blur-lg">
              <BabyAnimation mode={babyMode} />
            </div>
          </div>
        }
        content={
          <>
            <RSVPForm
              rsvps={rsvps}
              onRsvpSubmit={handleRsvpSubmit}
              onBabyModeChange={setBabyMode}
            />

            <div className="relative my-9 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t-2 border-dashed border-[#b8e8f5]"></div>
              </div>
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-soft text-ocean border-2 border-[#b8e8f5]">
                <Icon name="shell" className="h-[20px] w-[20px] fill-none stroke-current stroke-2" />
              </div>
            </div>no,

            <RegistryGrid
              gifts={gifts}
              onToggleReservation={toggleGiftReservation}
            />
          </>
        }
      />
    </BaseLayout>
  );
}
