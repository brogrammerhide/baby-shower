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
import { ScheduleView } from '../components/organisms/ScheduleView';
import { Icon } from '../components/atoms/Icon';

import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [rsvpId, setRsvpId] = useState<string | null>(null);
  const [view, setView] = useState<'rsvp' | 'registry' | 'schedule'>('rsvp');

  useEffect(() => {
    // Try to load rsvpId from localStorage
    const saved = localStorage.getItem('rsvpId');
    if (saved) {
      if (saved.includes(':anon:') || saved.startsWith('anon:')) {
        // Clear anonymous IDs to force a proper RSVP for registry access
        localStorage.removeItem('rsvpId');
        localStorage.removeItem('myReservedGifts');
      } else {
        setRsvpId(saved);
      }
    }
  }, []);

  const handleRsvpSuccess = (id: string) => {
    setRsvpId(id);
    localStorage.setItem('rsvpId', id);
    // After success, we stay in RSVP to show thank you, 
    // but the thank you will have a button to go to registry.
  };

  const { data: giftsData, mutate: mutateGifts } = useFetch(rsvpId ? `/api/gifts?rsvpId=${encodeURIComponent(rsvpId)}` : null);
  const [babyMode, setBabyMode] = useState<'idle' | 'happy' | 'sad'>('happy');

  const details = DEFAULT_DETAILS;
  
  const gifts = (giftsData ? toGifts(giftsData) : DEFAULT_GIFTS);

  const toggleGiftReservation = async (index: number) => {
    const gift = gifts[index];
    if (!gift?.id || !rsvpId) return;

    const action = gift.reserved ? 'release' : 'reserve';
    
    // Optimistic Update (UI)
    const updatedGifts = [...gifts];
    updatedGifts[index] = {
      ...gift,
      reserved: !gift.reserved,
      reservedCount: (gift.reservedCount || 0) + (gift.reserved ? -1 : 1)
    };
    
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
      toast.error(error.message);
      mutateGifts();
    } finally {
      await mutateGifts();
    }
  };

  return (
    <BaseLayout>
      <PageTemplate
        sidebar={
          <div className="lg:sticky lg:top-0 grid gap-[22px]">
            <Sidebar details={details} onViewSchedule={() => setView('schedule')} />
          </div>
        }
        content={
          <AnimatePresence mode="wait">
            {view === 'rsvp' ? (
              <motion.div
                key="rsvp-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <RSVPForm
                  onRsvpSuccess={handleRsvpSuccess}
                  onBabyModeChange={setBabyMode}
                  onViewRegistry={() => setView('registry')}
                  babyMode={babyMode}
                />
              </motion.div>
            ) : view === 'registry' ? (
              <motion.div
                key="registry-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-end">
                  <button 
                    onClick={() => setView('rsvp')}
                    className="flex items-center gap-1.5 text-sm font-bold text-ocean hover:underline"
                  >
                    <Icon name="flower" className="h-4 w-4 fill-none stroke-current stroke-2 rotate-180" />
                    Back to RSVP
                  </button>
                </div>
                <RegistryGrid
                  gifts={gifts}
                  onToggleReservation={toggleGiftReservation}
                />
              </motion.div>
            ) : (
              <motion.div
                key="schedule-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ScheduleView onBack={() => setView('rsvp')} />
              </motion.div>
            )}
          </AnimatePresence>
        }
      />
    </BaseLayout>
  );
}
