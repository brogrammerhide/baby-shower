'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Details, Gift } from '../../components/types';
import { useFetch } from '../hooks/useFetch';
import { toDetails, toGifts, toRsvps } from '../lib/apiMappers';
import { DEFAULT_DETAILS, DEFAULT_GIFTS } from '../lib/defaults';
import { BaseLayout } from '../../components/templates/BaseLayout';
import { PageTemplate } from '../../components/templates/PageTemplate';
import { DetailsForm } from '../../components/organisms/DetailsForm';
import { GiftForm } from '../../components/organisms/GiftForm';
import { ManagementList } from '../../components/organisms/ManagementList';

export default function EditPage() {
  const { data: detailsData, mutate: mutateDetails } = useFetch('/api/details');
  const { data: giftsData, mutate: mutateGifts } = useFetch('/api/gifts');
  const { data: rsvpsData, mutate: mutateRsvps } = useFetch('/api/rsvp');

  const gifts = giftsData ? toGifts(giftsData) : DEFAULT_GIFTS;
  const rsvps = rsvpsData ? toRsvps(rsvpsData) : [];

  const [details, setDetails] = useState<Details>(DEFAULT_DETAILS);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    if (detailsData) {
      setDetails(toDetails(detailsData));
    }
  }, [detailsData]);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/details', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert((err as { error?: string }).error || 'Failed to save details.');
      return;
    }
    await mutateDetails();
    alert('Shower details saved successfully!');
  };

  const handleGiftSubmit = async (gift: Gift, index: number | null) => {
    const payload = {
      name: gift.name,
      category: gift.category,
      price: gift.price,
      icon: gift.icon,
      note: gift.note,
      url: gift.url,
      imageUrl: gift.imageUrl,
    };

    const existingId = index !== null ? gifts[index]?.id : undefined;
    const res = await fetch(existingId ? `/api/gifts/${existingId}` : '/api/gifts', {
      method: existingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert((err as { error?: string }).error || 'Failed to save gift.');
      return;
    }

    await mutateGifts();
    setEditIndex(null);
  };

  const deleteGift = async (index: number) => {
    const gift = gifts[index];
    if (!gift || !confirm(`Are you sure you want to delete "${gift.name}"?`)) return;

    if (gift.id) {
      const res = await fetch(`/api/gifts/${gift.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert((err as { error?: string }).error || 'Failed to delete gift.');
        return;
      }
      await mutateGifts();
    }

    if (editIndex === index) setEditIndex(null);
    else if (editIndex !== null && editIndex > index) setEditIndex(editIndex - 1);
  };

  const toggleReservation = async (index: number) => {
    const gift = gifts[index];
    if (!gift?.id) return;

    const res = await fetch(`/api/gifts/${gift.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...gift, reserved: !gift.reserved }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert((err as { error?: string }).error || 'Failed to update reservation.');
      return;
    }

    await mutateGifts();
  };

  const deleteGuest = async (index: number) => {
    const guest = rsvps[index];
    if (!guest || !confirm(`Delete RSVP for ${guest.firstName} ${guest.lastName}?`)) return;

    if (guest.id) {
      const res = await fetch(`/api/rsvp/${guest.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert((err as { error?: string }).error || 'Failed to delete RSVP.');
        return;
      }
      await mutateRsvps();
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
