'use client';

import { useState } from 'react';
import { useFetch } from './hooks/useFetch';
import { toGifts } from './lib/apiMappers';
import { DEFAULT_DETAILS, DEFAULT_GIFTS } from './lib/defaults';
import { BaseLayout } from '../components/templates/BaseLayout';
import { PageTemplate } from '../components/templates/PageTemplate';
import { Sidebar } from '../components/organisms/Sidebar';
import { BabyAnimation } from '../components/organisms/BabyAnimation';
import { RSVPForm } from '../components/organisms/RSVPForm';
import { RegistryGrid } from '../components/organisms/RegistryGrid';
import { Icon } from '../components/atoms/Icon';

export default function Home() {
  const { data: giftsData, mutate: mutateGifts } = useFetch('/api/gifts');

  const details = DEFAULT_DETAILS;
  const gifts = giftsData ? toGifts(giftsData) : DEFAULT_GIFTS;

  const [rsvpId, setRsvpId] = useState<string | null>(null);
  const [babyMode, setBabyMode] = useState<'idle' | 'happy' | 'sad'>('idle');

  const toggleGiftReservation = async (index: number) => {
    const gift = gifts[index];
    if (!gift?.id) return;

    if (!rsvpId) {
      alert('Please submit your RSVP before reserving a gift.');
      return;
    }

    const action = gift.reserved ? 'release' : 'reserve';
    const res = await fetch(`/api/gifts/${gift.id}/reserve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rsvpId, action }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert((err as { error?: string }).error || 'Could not update reservation.');
      return;
    }

    await mutateGifts();
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
              onRsvpSuccess={setRsvpId}
              onBabyModeChange={setBabyMode}
            />

            <div className="relative my-9 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t-2 border-dashed border-[#b8e8f5]"></div>
              </div>
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-soft text-ocean border-2 border-[#b8e8f5]">
                <Icon name="shell" className="h-[20px] w-[20px] fill-none stroke-current stroke-2" />
              </div>
            </div>

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
