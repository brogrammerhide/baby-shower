'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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
  const [rsvpId, setRsvpId] = useState<string | null>(null);

  useEffect(() => {
    // Try to load rsvpId from localStorage
    let saved = localStorage.getItem('rsvpId');
    if (!saved) {
      // Generate a persistent anonymous ID if none exists
      saved = `rsvp:anon:${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem('rsvpId', saved);
    }
    setRsvpId(saved);
  }, []);

  const handleRsvpSuccess = (id: string) => {
    setRsvpId(id);
    localStorage.setItem('rsvpId', id);
  };

  const { data: giftsData, mutate: mutateGifts } = useFetch(rsvpId ? `/api/gifts?rsvpId=${encodeURIComponent(rsvpId)}` : null);
  const [babyMode, setBabyMode] = useState<'idle' | 'happy' | 'sad'>('happy');

  const details = DEFAULT_DETAILS;
  
  // Merge server data with local state for anonymous users
  const gifts = (giftsData ? toGifts(giftsData) : DEFAULT_GIFTS).map(gift => {
    if (rsvpId?.startsWith('rsvp:anon:')) {
      const localReserved = JSON.parse(localStorage.getItem('myReservedGifts') || '[]');
      return { ...gift, reserved: localReserved.includes(gift.id) };
    }
    return gift;
  });

  const toggleGiftReservation = async (index: number) => {
    const gift = gifts[index];
    if (!gift?.id || !rsvpId) return;

    const action = gift.reserved ? 'release' : 'reserve';
    
    // Update local state for anonymous persistence
    if (rsvpId.startsWith('rsvp:anon:')) {
      const localReserved = JSON.parse(localStorage.getItem('myReservedGifts') || '[]');
      const nextReserved = action === 'reserve' 
        ? [...localReserved, gift.id] 
        : localReserved.filter((id: string) => id !== gift.id);
      localStorage.setItem('myReservedGifts', JSON.stringify(nextReserved));
    }

    // Optimistic Update (UI)
    const updatedGifts = [...gifts];
    updatedGifts[index] = {
      ...gift,
      reserved: !gift.reserved,
      reservedCount: (gift.reservedCount || 0) + (gift.reserved ? -1 : 1)
    };
    
    // We mutate the cache optimistically
    mutateGifts(updatedGifts, { revalidate: false });

    try {
      const res = await fetch(`/api/gifts/${gift.id}/reserve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rsvpId, action }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Could not update reservation.');
      }

      toast.success(action === 'reserve' ? `${gift.name} reserved!` : `${gift.name} released!`);
    } catch (error: any) {
      alert(error.message);
      // Rollback on error
      mutateGifts();
    } finally {
      // Final revalidation to ensure sync with server
      await mutateGifts();
    }
  };

  return (
    <BaseLayout>
      <PageTemplate
        sidebar={
          <div className="lg:sticky lg:top-0 grid gap-[22px]">
            <Sidebar details={details} />
          </div>
        }
        content={
          <>
            <RSVPForm
              onRsvpSuccess={handleRsvpSuccess}
              onBabyModeChange={setBabyMode}
              babyMode={babyMode}
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
