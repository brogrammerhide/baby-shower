'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Gift {
  name: string;
  category: string;
  price: string;
  icon: string;
  note: string;
  reserved: boolean;
}

interface RSVP {
  firstName: string;
  lastName: string;
  attending: boolean;
  guests: number;
  diet: string[];
  arrivalTime?: string;
  reservedGift?: string;
}

interface Details {
  date: string;
  theme: string;
  place: string;
}

const DEFAULT_DETAILS: Details = {
  date: 'Sunday, July 13 at 12:30 PM',
  theme: 'Summer beach, seafoam blues, coral, and sunshine',
  place: 'Add your shower address here'
};

const DEFAULT_GIFTS: Gift[] = [
  { name: 'Wave-Soft Swaddle Set', category: 'nursery', price: '$32', icon: 'wave', note: 'Light cotton muslin for warm July naps and stroller walks.', reserved: false },
  { name: 'Sea Glass Sound Machine', category: 'nursery', price: '$48', icon: 'moon', note: 'Ocean sounds and soft light for bedtime.', reserved: false },
  { name: 'Palm Shade Stroller Fan', category: 'beach', price: '$29', icon: 'palm', note: 'Rechargeable fan for sunny walks and beach days.', reserved: false },
  { name: 'Baby Beach Tent', category: 'beach', price: '$76', icon: 'tent', note: 'Portable shade for picnics, shore days, and backyard lounging.', reserved: false },
  { name: 'Bottle Warmer', category: 'feeding', price: '$41', icon: 'bottle', note: 'Compact warmer for nighttime bottles and early mornings.', reserved: false },
  { name: 'Ocean Bib Bundle', category: 'feeding', price: '$22', icon: 'bib', note: 'Soft waterproof bibs in shell, wave, and sailboat prints.', reserved: false },
  { name: 'Newborn Diaper Caddy', category: 'care', price: '$35', icon: 'caddy', note: 'Keeps wipes, diapers, cream, and tiny socks in one place.', reserved: false },
  { name: 'Gentle Bath Kit', category: 'care', price: '$44', icon: 'bath', note: 'Wash, lotion, hooded towel, and brush for first baths.', reserved: false },
  { name: 'Sandy Toes Play Mat', category: 'nursery', price: '$58', icon: 'star', note: 'Padded coastal-color mat for tummy time.', reserved: false },
  { name: 'UPF Swim Romper', category: 'beach', price: '$26', icon: 'shirt', note: 'Sun-safe baby swim layer for future splash days.', reserved: false },
  { name: 'Burp Cloth Stack', category: 'feeding', price: '$18', icon: 'cloth', note: 'Absorbent everyday cloths in breezy blue and white.', reserved: false },
  { name: 'Mini First Aid Pouch', category: 'care', price: '$24', icon: 'firstaid', note: 'Thermometer, nail file, medicine pacifier, and travel pouch.', reserved: false }
];

const AVAILABLE_ICONS = ['wave', 'shell', 'sun', 'fish', 'calendar', 'umbrella', 'flower', 'party', 'watermelon', 'moon', 'palm', 'tent', 'bottle', 'bib', 'caddy', 'bath', 'star', 'shirt', 'cloth', 'firstaid'];

export default function EditPage() {
  const [details, setDetails] = useState<Details>(DEFAULT_DETAILS);
  const [gifts, setGifts] = useState<Gift[]>(DEFAULT_GIFTS);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [giftForm, setGiftForm] = useState({
    name: '',
    price: '',
    category: 'nursery',
    note: '',
    icon: 'wave'
  });

  useEffect(() => {
    const savedDetails = localStorage.getItem('baby_shower_details');
    if (savedDetails) setDetails(JSON.parse(savedDetails));

    const savedGifts = localStorage.getItem('baby_shower_gifts');
    if (savedGifts) setGifts(JSON.parse(savedGifts));

    const savedRsvps = localStorage.getItem('baby_shower_rsvps');
    if (savedRsvps) setRsvps(JSON.parse(savedRsvps));
  }, []);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('baby_shower_details', JSON.stringify(details));
    alert('Shower details saved successfully!');
  };

  const handleGiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = giftForm.price.startsWith('$') ? giftForm.price : '$' + giftForm.price;
    const newGift: Gift = { ...giftForm, price, reserved: editIndex !== null ? gifts[editIndex].reserved : false };

    let updatedGifts;
    if (editIndex !== null) {
      updatedGifts = [...gifts];
      updatedGifts[editIndex] = newGift;
      setEditIndex(null);
    } else {
      updatedGifts = [...gifts, newGift];
    }

    setGifts(updatedGifts);
    localStorage.setItem('baby_shower_gifts', JSON.stringify(updatedGifts));
    setGiftForm({ name: '', price: '', category: 'nursery', note: '', icon: 'wave' });
  };

  const deleteGift = (index: number) => {
    if (confirm(`Are you sure you want to delete "${gifts[index].name}"?`)) {
      const updatedGifts = gifts.filter((_, i) => i !== index);
      setGifts(updatedGifts);
      localStorage.setItem('baby_shower_gifts', JSON.stringify(updatedGifts));
      if (editIndex === index) {
        setEditIndex(null);
        setGiftForm({ name: '', price: '', category: 'nursery', note: '', icon: 'wave' });
      }
    }
  };

  const loadGiftForEdit = (index: number) => {
    const gift = gifts[index];
    setGiftForm({
      name: gift.name,
      price: gift.price,
      category: gift.category,
      note: gift.note || '',
      icon: gift.icon
    });
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleReservation = (index: number) => {
    const updatedGifts = [...gifts];
    updatedGifts[index].reserved = !updatedGifts[index].reserved;
    setGifts(updatedGifts);
    localStorage.setItem('baby_shower_gifts', JSON.stringify(updatedGifts));
  };

  const deleteGuest = (index: number) => {
    if (confirm(`Delete RSVP for ${rsvps[index].firstName} ${rsvps[index].lastName}?`)) {
      const updatedRsvps = rsvps.filter((_, i) => i !== index);
      setRsvps(updatedRsvps);
      localStorage.setItem('baby_shower_rsvps', JSON.stringify(updatedRsvps));
    }
  };

  const floatingIcons = ['wave', 'shell', 'fish', 'star', 'flower', 'sun', 'umbrella'];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_16%_10%,rgba(255,209,102,.55),transparent_260px),radial-gradient(circle_at_86%_18%,rgba(110,214,181,.35),transparent_300px),linear-gradient(180deg,#b8f0ff_0%,#e0f7fa_42%,#fde8c8_100%)] px-3 py-[18px] pb-[108px] font-nunito text-deep sm:px-4 sm:py-[30px] sm:pb-28">
      {/* Background Floaters */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-up text-ocean/20 drop-shadow-[0_3px_6px_rgba(0,119,182,.12)]"
            style={{
              left: `${Math.random() * 100}vw`,
              animationDuration: `${8 + Math.random() * 14}s`,
              animationDelay: `${Math.random() * 12}s`,
              fontSize: `${1.2 + Math.random() * 1.4}rem`
            }}
          >
            <svg className="h-8 w-8 fill-none stroke-current stroke-2" aria-hidden="true">
              <use href={`#icon-${floatingIcons[Math.floor(Math.random() * floatingIcons.length)]}`}></use>
            </svg>
          </div>
        ))}
      </div>

      {/* Animated Waves */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[86px] overflow-hidden" aria-hidden="true">
        <svg className="absolute bottom-0 left-0 h-[86px] w-[200%] animate-wave" viewBox="0 0 1600 86" preserveAspectRatio="none">
          <path d="M0,43 C100,82 200,4 400,43 C600,82 700,4 800,43 C900,82 1000,4 1200,43 C1400,82 1500,4 1600,43 L1600,86 L0,86 Z" fill="#0077b6" opacity=".42"></path>
        </svg>
        <svg className="absolute bottom-0 left-0 h-[86px] w-[200%] animate-wave-slow" viewBox="0 0 1600 86" preserveAspectRatio="none">
          <path d="M0,55 C150,12 250,75 400,43 C550,12 650,75 800,55 C950,12 1050,75 1200,43 C1350,12 1450,75 1600,55 L1600,86 L0,86 Z" fill="#90e0ef" opacity=".58"></path>
        </svg>
      </div>

      <main className="relative z-10 mx-auto grid w-full max-w-[1080px] grid-cols-1 items-start gap-[22px] lg:grid-cols-[1fr_1.2fr]">
        <div className="grid gap-[22px]">
          {/* Title & Back navigation */}
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

          {/* Shower Details Form */}
          <section className="overflow-hidden rounded-[28px] bg-white/90 p-[22px] shadow-card backdrop-blur-lg" aria-label="Edit Shower Details">
            <h2 className="font-pacifico text-lg text-ocean mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 fill-none stroke-coral stroke-[2.2]"><use href="#icon-calendar"></use></svg>
              Shower Details
            </h2>
            <form onSubmit={handleDetailsSubmit} className="grid gap-4">
              <div>
                <label className="block text-xs font-extrabold text-[#497184] uppercase tracking-wider mb-1.5" htmlFor="inputDate">Date & Time</label>
                <input 
                  className="w-full rounded-xl border-2 border-[#b8e8f5] bg-white px-3.5 py-2.5 text-[.95rem] text-deep shadow-[inset_0_2px_6px_rgba(0,0,0,.04)] outline-none transition focus:border-ocean" 
                  type="text" 
                  id="inputDate" 
                  required 
                  placeholder="e.g. Sunday, July 13 at 12:30 PM"
                  value={details.date}
                  onChange={(e) => setDetails({...details, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-[#497184] uppercase tracking-wider mb-1.5" htmlFor="inputTheme">Theme Description</label>
                <input 
                  className="w-full rounded-xl border-2 border-[#b8e8f5] bg-white px-3.5 py-2.5 text-[.95rem] text-deep shadow-[inset_0_2px_6px_rgba(0,0,0,.04)] outline-none transition focus:border-ocean" 
                  type="text" 
                  id="inputTheme" 
                  required 
                  placeholder="e.g. Summer beach, seafoam blues, coral"
                  value={details.theme}
                  onChange={(e) => setDetails({...details, theme: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-[#497184] uppercase tracking-wider mb-1.5" htmlFor="inputPlace">Place/Address</label>
                <input 
                  className="w-full rounded-xl border-2 border-[#b8e8f5] bg-white px-3.5 py-2.5 text-[.95rem] text-deep shadow-[inset_0_2px_6px_rgba(0,0,0,.04)] outline-none transition focus:border-ocean" 
                  type="text" 
                  id="inputPlace" 
                  required 
                  placeholder="e.g. 123 Sandy Shore Drive"
                  value={details.place}
                  onChange={(e) => setDetails({...details, place: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full rounded-xl border-0 bg-gradient-to-br from-coral to-[#f7a07a] py-3 font-extrabold text-white shadow-soft hover:-translate-y-px active:translate-y-0 transition">
                Save Details
              </button>
            </form>
          </section>

          {/* Add/Edit Gift Form */}
          <section className="overflow-hidden rounded-[28px] bg-white/90 p-[22px] shadow-card backdrop-blur-lg" aria-label="Add or Edit Gift">
            <h2 className="font-pacifico text-lg text-ocean mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 fill-none stroke-coral stroke-[2.2]"><use href="#icon-shell"></use></svg>
              {editIndex !== null ? 'Edit Registry Gift' : 'Add New Gift'}
            </h2>
            <form onSubmit={handleGiftSubmit} className="grid gap-4">
              <div>
                <label className="block text-xs font-extrabold text-[#497184] uppercase tracking-wider mb-1.5" htmlFor="giftName">Gift Name</label>
                <input 
                  className="w-full rounded-xl border-2 border-[#b8e8f5] bg-white px-3.5 py-2.5 text-[.95rem] text-deep shadow-[inset_0_2px_6px_rgba(0,0,0,.04)] outline-none transition focus:border-ocean" 
                  type="text" 
                  id="giftName" 
                  required 
                  placeholder="e.g. Cozy Hooded Towel"
                  value={giftForm.name}
                  onChange={(e) => setGiftForm({...giftForm, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#497184] uppercase tracking-wider mb-1.5" htmlFor="giftPrice">Price</label>
                  <input 
                    className="w-full rounded-xl border-2 border-[#b8e8f5] bg-white px-3.5 py-2.5 text-[.95rem] text-deep shadow-[inset_0_2px_6px_rgba(0,0,0,.04)] outline-none transition focus:border-ocean" 
                    type="text" 
                    id="giftPrice" 
                    required 
                    placeholder="e.g. $25"
                    value={giftForm.price}
                    onChange={(e) => setGiftForm({...giftForm, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#497184] uppercase tracking-wider mb-1.5" htmlFor="giftCategory">Category</label>
                  <select 
                    className="w-full rounded-xl border-2 border-[#b8e8f5] bg-white px-3.5 py-2.5 text-[.95rem] text-deep shadow-[inset_0_2px_6px_rgba(0,0,0,.04)] outline-none transition focus:border-ocean" 
                    id="giftCategory" 
                    required
                    value={giftForm.category}
                    onChange={(e) => setGiftForm({...giftForm, category: e.target.value})}
                  >
                    <option value="nursery">Nursery</option>
                    <option value="beach">Beach</option>
                    <option value="feeding">Feeding</option>
                    <option value="care">Care</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-extrabold text-[#497184] uppercase tracking-wider mb-1.5" htmlFor="giftNote">Description / Note</label>
                <textarea 
                  className="w-full min-h-[60px] resize-y rounded-xl border-2 border-[#b8e8f5] bg-white px-3.5 py-2.5 text-[.95rem] text-deep shadow-[inset_0_2px_6px_rgba(0,0,0,.04)] outline-none transition focus:border-ocean" 
                  id="giftNote" 
                  placeholder="Why do you need this?"
                  value={giftForm.note}
                  onChange={(e) => setGiftForm({...giftForm, note: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-[#497184] uppercase tracking-wider mb-1.5">Choose Icon</label>
                <div className="grid grid-cols-6 gap-2 bg-gradient-to-br from-seafoam/50 to-white p-2.5 rounded-xl border border-ocean/10">
                  {AVAILABLE_ICONS.map((icon) => (
                    <label 
                      key={icon} 
                      className={`cursor-pointer border-2 p-1.5 rounded-xl flex items-center justify-center transition ${giftForm.icon === icon ? 'border-ocean bg-white shadow-soft scale-105' : 'border-transparent hover:border-ocean/20 hover:bg-white'}`}
                    >
                      <input 
                        type="radio" 
                        name="giftIcon" 
                        value={icon} 
                        className="hidden" 
                        checked={giftForm.icon === icon}
                        onChange={() => setGiftForm({...giftForm, icon: icon})}
                      />
                      <svg className="h-6 w-6 stroke-ocean stroke-2 fill-none"><use href={`#icon-${icon}`}></use></svg>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 rounded-xl border-0 bg-gradient-to-br from-coral to-[#f7a07a] py-3 font-extrabold text-white shadow-soft hover:-translate-y-px transition">
                  {editIndex !== null ? 'Update Gift' : 'Add Gift'}
                </button>
                {editIndex !== null && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditIndex(null);
                      setGiftForm({ name: '', price: '', category: 'nursery', note: '', icon: 'wave' });
                    }}
                    className="px-4 rounded-xl border-2 border-[#b8e8f5] bg-white font-extrabold text-deep hover:-translate-y-px transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="grid gap-[22px]">
          {/* Registry Items List */}
          <section className="overflow-hidden rounded-[28px] bg-white/90 p-[22px] shadow-card backdrop-blur-lg flex flex-col" aria-label="Manage Registry Items">
            <div className="mb-4">
              <h2 className="font-pacifico text-lg text-ocean">Registry Gift List</h2>
              <p className="text-xs font-bold text-[#497184] mt-0.5">Edit or remove items currently on the registry</p>
            </div>

            <div className="overflow-y-auto flex-1 max-h-[720px] pr-1 space-y-3">
              {gifts.length > 0 ? (
                gifts.map((gift, index) => (
                  <div key={index} className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-ocean/10 shadow-soft hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-sand to-[#fff8e8]" aria-hidden="true">
                        <svg className="h-6 w-6 stroke-ocean stroke-2 fill-none"><use href={`#icon-${gift.icon}`}></use></svg>
                      </span>
                      <div>
                        <h3 className="text-sm font-extrabold leading-snug text-deep">{gift.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-extrabold text-[#497184] uppercase tracking-wider">{gift.category}</span>
                          <span className="text-xs font-black text-coral">{gift.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span 
                        className={`text-[.72rem] px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1 cursor-pointer transition ${gift.reserved ? 'bg-[#d4f7e5] text-[#1a6640]' : 'bg-seafoam text-ocean hover:bg-ocean hover:text-white'}`}
                        onClick={() => toggleReservation(index)}
                      >
                        {gift.reserved ? 'Reserved' : 'Available'}
                      </span>
                      <button onClick={() => loadGiftForEdit(index)} className="p-2 rounded-lg bg-seafoam/60 hover:bg-ocean hover:text-white transition text-ocean" title="Edit Item">
                        <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button onClick={() => deleteGift(index)} className="p-2 rounded-lg bg-[#ffe0e0] hover:bg-[#ffe0e0] hover:text-[#b91c1c] text-[#b91c1c] transition" title="Delete Item">
                        <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-sm font-bold text-[#497184] border-2 border-dashed border-[#b8e8f5] rounded-2xl bg-white/50">No items on the registry yet. Add some on the left!</div>
              )}
            </div>
          </section>

          {/* Guest List Section */}
          <section className="overflow-hidden rounded-[28px] bg-white/90 p-[22px] shadow-card backdrop-blur-lg sm:p-6" aria-label="Guest List">
            <div className="mb-4">
              <h2 className="font-pacifico text-lg text-ocean">Guest List</h2>
              <p className="text-xs font-bold text-[#497184] mt-0.5">RSVPs and details</p>
            </div>
            <div className="overflow-y-auto flex-1 max-h-[720px] pr-1 space-y-3">
              {rsvps.length > 0 ? (
                rsvps.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-soft border border-ocean/10">
                    <div>
                      <p className="font-extrabold text-deep">{r.firstName} {r.lastName}</p>
                      <p className="text-xs text-[#497184]">Attending: {r.attending ? 'Yes' : 'No'}, Guests: {r.guests}, Diet: {r.diet.join(', ') || 'None'}, Gift: {r.reservedGift || 'None'}</p>
                    </div>
                    <button onClick={() => deleteGuest(i)} className="p-1 rounded bg-[#ffe0e0] hover:bg-[#ffe0e0] hover:text-[#b91c1c] text-[#b91c1c]">✕</button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-[#497184] bg-white/50 rounded">No RSVPs yet.</div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
