'use client';

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
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
  date: 'Sunday, July 13 from 12:00 to 16:00',
  theme: 'Summer beach, seafoam blues, coral, and sunshine',
  place: '570 Wilson Avenue, Toronto, ON'
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

const HAPPY_SRC = 'https://assets9.lottiefiles.com/packages/lf20_uu0x8lqv.json';
const CRY_SRC = 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f62d/lottie.json';
const IDLE_SRC = 'https://assets9.lottiefiles.com/packages/lf20_uu0x8lqv.json';

export default function Home() {
  const [details, setDetails] = useState<Details>(DEFAULT_DETAILS);
  const [gifts, setGifts] = useState<Gift[]>(DEFAULT_GIFTS);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [babyMode, setBabyMode] = useState<'idle' | 'happy' | 'sad'>('idle');
  const [showThankYou, setShowThankYou] = useState(false);
  const [lookupResult, setLookupResult] = useState<string | JSX.Element>('');
  const [lookupFirst, setLookupFirst] = useState('');
  const [lookupLast, setLookupLast] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    attending: 'yes',
    guests: 1,
    diet: [] as string[],
    otherDiet: '',
    arrivalTime: ''
  });

  const babyPlayerRef = useRef<any>(null);

  useEffect(() => {
    const savedDetails = localStorage.getItem('baby_shower_details');
    if (savedDetails) setDetails(JSON.parse(savedDetails));

    const savedGifts = localStorage.getItem('baby_shower_gifts');
    if (savedGifts) setGifts(JSON.parse(savedGifts));

    const savedRsvps = localStorage.getItem('baby_shower_rsvps');
    if (savedRsvps) setRsvps(JSON.parse(savedRsvps));
  }, []);

  const handleLookup = () => {
    const fn = lookupFirst.trim().toLowerCase();
    const ln = lookupLast.trim().toLowerCase();
    if (!fn) {
      setLookupResult('Please enter first name.');
      return;
    }

    if (ln) {
      const exact = rsvps.find(r => r.firstName.toLowerCase() === fn && r.lastName.toLowerCase() === ln);
      if (exact) {
        setLookupResult(
          <div className="space-y-1">
            <p className="text-ocean">Found invitation for {exact.firstName} {exact.lastName}.</p>
            <p>Attending: {exact.attending ? 'Yes' : 'No'}</p>
            <p>Guests: {exact.guests}</p>
            <p>Diet: {exact.diet.join(', ') || 'None'}</p>
            <p>Reserved Gift: {exact.reservedGift || 'None'}</p>
            <button
              onClick={() => {
                setFormData({
                  firstName: exact.firstName,
                  lastName: exact.lastName,
                  attending: exact.attending ? 'yes' : 'no',
                  guests: exact.guests,
                  diet: exact.diet,
                  otherDiet: '',
                  arrivalTime: exact.arrivalTime || ''
                });
                setShowThankYou(false);
              }}
              className="mt-2 rounded-xl bg-gradient-to-br from-coral to-[#f7a07a] py-1 px-3 font-pacifico text-white"
            >
              Edit My RSVP
            </button>
          </div>
        );
        return;
      }
    }

    const firstMatches = rsvps.filter(r => r.firstName.toLowerCase() === fn);
    if (firstMatches.length > 0) {
      const names = firstMatches.map(r => `${r.firstName} ${r.lastName}`).join(', ');
      setLookupResult(<p className="text-deep">We found the following: {names}. Is that you?</p>);
      return;
    }

    setLookupResult(<p className="text-red-600">Invitation not found. Please contact the organizer.</p>);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRsvp: RSVP = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      attending: formData.attending === 'yes',
      guests: Number(formData.guests) || 1,
      diet: formData.diet,
      arrivalTime: formData.arrivalTime
    };
    if (formData.otherDiet) newRsvp.diet.push(formData.otherDiet);

    const updatedRsvps = [...rsvps, newRsvp];
    setRsvps(updatedRsvps);
    localStorage.setItem('baby_shower_rsvps', JSON.stringify(updatedRsvps));
    setShowThankYou(true);
    setBabyMode('happy');
  };

  const toggleGiftReservation = (index: number) => {
    const updatedGifts = [...gifts];
    updatedGifts[index].reserved = !updatedGifts[index].reserved;
    setGifts(updatedGifts);
    localStorage.setItem('baby_shower_gifts', JSON.stringify(updatedGifts));
  };

  const filteredGifts = gifts
    .map((gift, index) => ({ gift, index }))
    .filter(({ gift }) => activeFilter === 'all' || gift.category === activeFilter)
    .filter(({ gift }) =>
      `${gift.name} ${gift.category} ${gift.note}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const floatingIcons = ['wave', 'shell', 'fish', 'star', 'flower', 'sun', 'umbrella'];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_16%_10%,rgba(255,209,102,.55),transparent_260px),radial-gradient(circle_at_86%_18%,rgba(110,214,181,.35),transparent_300px),linear-gradient(180deg,#b8f0ff_0%,#e0f7fa_42%,#fde8c8_100%)] px-3 py-[18px] pb-[108px] font-nunito text-deep sm:px-4 sm:py-[30px] sm:pb-28">
      <Script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" strategy="afterInteractive" />

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

      <main className="relative z-10 mx-auto grid w-full max-w-[1040px] grid-cols-1 items-start gap-[22px] lg:grid-cols-[minmax(310px,.88fr)_minmax(0,1.12fr)]">
        {/* Sidebar Info Section */}
        <section className="overflow-hidden rounded-[28px] bg-white/90 shadow-card backdrop-blur-lg lg:sticky lg:top-[22px]" aria-label="Baby shower details">
          <div className="relative bg-gradient-to-br from-ocean to-[#48cae4] px-[18px] pb-[42px] pt-[34px] text-center shadow-[inset_0_4px_20px_rgba(0,119,182,.3)] after:absolute after:bottom-[-1px] after:left-0 after:h-[30px] after:w-full after:bg-white/90 after:[clip-path:ellipse(55%_100%_at_50%_100%)] sm:px-7">
            <Link href="/edit" className="absolute top-3.5 right-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[#eefcff] backdrop-blur-md transition hover:bg-white hover:text-ocean shadow-soft animate-pulse" title="Edit Registry & Details">
              <svg className="h-5 w-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
              </svg>
            </Link>
            <span className="mb-2.5 flex items-center justify-center gap-2.5 text-[#eefcff] drop-shadow-[0_2px_5px_rgba(0,0,0,.16)]" aria-hidden="true">
              <svg className="h-[34px] w-[34px] fill-none stroke-current stroke-2"><use href="#icon-wave"></use></svg>
              <svg className="h-[34px] w-[34px] fill-none stroke-current stroke-2"><use href="#icon-shell"></use></svg>
              <svg className="h-[34px] w-[34px] fill-none stroke-current stroke-2"><use href="#icon-sun"></use></svg>
              <svg className="h-[34px] w-[34px] fill-none stroke-current stroke-2"><use href="#icon-fish"></use></svg>
            </span>
            <h1 className="mb-2.5 font-pacifico text-[clamp(2rem,7vw,3.05rem)] leading-[1.05] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.15)]">Baby Shower!</h1>
            <p className="text-base font-extrabold leading-normal text-[#eefcff]">Celebrating our little summer boy, arriving in July.</p>
          </div>

          {/* Baby Lottie Section */}
          <div className="flex min-h-[190px] flex-col items-center justify-center px-[18px] pb-2 pt-4 transition-all duration-300">
            {babyMode !== 'idle' && (
              <div className={`relative mb-1.5 animate-pop-in rounded-2xl px-4 py-2 text-sm font-extrabold shadow-[0_3px_10px_rgba(0,0,0,.1)] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-[inherit] ${babyMode === 'happy' ? 'bg-[#d4f7e5] text-[#1a6640]' : 'bg-[#ffe0e0] text-[#b91c1c]'}`}>
                {babyMode === 'happy' ? 'Yay, see you there!' : 'We will see each other soon!!'}
              </div>
            )}
            {/* @ts-ignore */}
            <lottie-player
              ref={babyPlayerRef}
              class="h-40 w-40 transition-opacity duration-300"
              src={babyMode === 'sad' ? CRY_SRC : IDLE_SRC}
              background="transparent"
              speed="1"
              loop
              autoplay
            />
            <div className={`min-h-7 text-center font-pacifico text-base ${babyMode === 'happy' ? 'text-[#2a9d5c]' : babyMode === 'sad' ? 'text-[#e63946]' : 'text-ocean'}`}>
              {babyMode === 'happy' ? 'Yay! Baby is SO excited to meet you!' : babyMode === 'sad' ? 'Aww... baby will miss you!' : 'Will you come celebrate?'}
            </div>
          </div>

          <div className="grid gap-3.5 px-7 pb-[30px] pt-2">
            <div className="grid grid-cols-[42px_1fr] items-center gap-3 rounded-[18px] border border-ocean/10 bg-gradient-to-br from-seafoam to-[#e0f7fa] p-[13px] shadow-soft">
              <span className="grid h-[42px] w-[42px] place-items-center rounded-[14px] bg-white shadow-[0_2px_7px_rgba(0,0,0,.06)]" aria-hidden="true"><svg className="h-[23px] w-[23px] fill-none stroke-ocean stroke-2"><use href="#icon-calendar"></use></svg></span>
              <div><strong className="block text-[.85rem] font-extrabold uppercase tracking-[.04em] text-ocean">Date</strong><span className="block font-extrabold leading-snug">{details.date}</span></div>
            </div>
            <div className="grid grid-cols-[42px_1fr] items-center gap-3 rounded-[18px] border border-ocean/10 bg-gradient-to-br from-seafoam to-[#e0f7fa] p-[13px] shadow-soft">
              <span className="grid h-[42px] w-[42px] place-items-center rounded-[14px] bg-white shadow-[0_2px_7px_rgba(0,0,0,.06)]" aria-hidden="true"><svg className="h-[23px] w-[23px] fill-none stroke-ocean stroke-2"><use href="#icon-umbrella"></use></svg></span>
              <div><strong className="block text-[.85rem] font-extrabold uppercase tracking-[.04em] text-ocean">Theme</strong><span className="block font-extrabold leading-snug">{details.theme}</span></div>
            </div>
            <div 
              className="grid grid-cols-[42px_1fr] items-center gap-3 rounded-[18px] border border-ocean/10 bg-gradient-to-br from-seafoam to-[#e0f7fa] p-[13px] shadow-soft cursor-pointer"
              title="Click to copy address"
              onClick={() => {
                navigator.clipboard.writeText(details.place);
                alert('Address copied to clipboard!');
              }}
            >
              <span className="grid h-[42px] w-[42px] place-items-center rounded-[14px] bg-white shadow-[0_2px_7px_rgba(0,0,0,.06)]" aria-hidden="true"><svg className="h-[23px] w-[23px] fill-none stroke-ocean stroke-2"><use href="#icon-pin"></use></svg></span>
              <div><strong className="block text-[.85rem] font-extrabold uppercase tracking-[.04em] text-ocean">Place</strong><span className="block font-extrabold leading-snug">{details.place}</span></div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="overflow-hidden rounded-[28px] bg-white/90 p-[18px] shadow-card backdrop-blur-lg sm:p-6" aria-label="Baby shower registry and RSVP app">
          {/* RSVP Section */}
          <div className="mb-8">
            <h2 className="font-pacifico text-[clamp(1.65rem,5vw,2.3rem)] leading-tight text-ocean">Kindly RSVP</h2>
            <p className="max-w-[420px] font-bold leading-normal text-[#315566] mb-[18px]">Please let us know if you can make it to our beachy July celebration.</p>
            
            <div className="mb-5 rounded-[18px] border border-ocean/10 bg-gradient-to-br from-seafoam to-[#e0f7fa] px-[22px] py-5 shadow-soft">
              <div className="mb-3.5 flex items-center gap-2 font-pacifico text-[1.05rem] text-ocean">
                <svg className="h-[21px] w-[21px] fill-none stroke-coral stroke-[2.2]" aria-hidden="true"><use href="#icon-flower"/></svg>
                Find Your RSVP
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                  value={lookupFirst}
                  onChange={(e) => setLookupFirst(e.target.value)}
                  placeholder="First Name" 
                  className="w-full rounded-xl border-2 border-[#b8e8f5] bg-white px-3.5 py-2.5 text-[.95rem] text-deep outline-none focus:border-ocean"
                />
                <input 
                  type="text" 
                  value={lookupLast}
                  onChange={(e) => setLookupLast(e.target.value)}
                  placeholder="Last Name (optional)" 
                  className="w-full rounded-xl border-2 border-[#b8e8f5] bg-white px-3.5 py-2.5 text-[.95rem] text-deep outline-none focus:border-ocean"
                />
              </div>
              <button 
                onClick={handleLookup}
                className="mt-3 w-full rounded-xl bg-gradient-to-br from-coral to-[#f7a07a] py-2 font-pacifico text-white shadow-soft transition hover:-translate-y-px"
              >
                Lookup RSVP
              </button>
              {lookupResult && <div className="mt-2 text-sm text-deep">{lookupResult}</div>}
            </div>

            {!showThankYou ? (
              <form onSubmit={handleRsvpSubmit}>
                <div className="mb-5 rounded-[18px] border border-ocean/10 bg-gradient-to-br from-seafoam to-[#e0f7fa] px-[22px] py-5 shadow-soft">
                  <div className="mb-3.5 flex items-center gap-2 font-pacifico text-[1.05rem] text-ocean">
                    <svg className="h-[21px] w-[21px] fill-none stroke-coral stroke-[2.2]" aria-hidden="true"><use href="#icon-flower"/></svg> 
                    Your Info
                  </div>
                  <label className="mb-1.5 block text-sm font-extrabold text-deep" htmlFor="firstName">First Name</label>
                  <input 
                    className="w-full rounded-xl border-2 border-[#b8e8f5] bg-white px-3.5 py-2.5 text-[.95rem] text-deep shadow-[inset_0_2px_6px_rgba(0,0,0,.04)] outline-none transition focus:border-ocean" 
                    type="text" 
                    id="firstName" 
                    required 
                    placeholder="e.g. Alice"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                  <label className="mt-2 block text-sm font-extrabold text-deep" htmlFor="lastName">Last Name</label>
                  <input 
                    className="w-full rounded-xl border-2 border-[#b8e8f5] bg-white px-3.5 py-2.5 text-[.95rem] text-deep shadow-[inset_0_2px_6px_rgba(0,0,0,.04)] outline-none transition focus:border-ocean" 
                    type="text" 
                    id="lastName" 
                    required 
                    placeholder="e.g. Smith"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>

                <div className="mb-5 rounded-[18px] border border-ocean/10 bg-gradient-to-br from-seafoam to-[#e0f7fa] px-[22px] py-5 shadow-soft">
                  <div className="mb-3.5 flex items-center gap-2 font-pacifico text-[1.05rem] text-ocean">
                    <svg className="h-[21px] w-[21px] fill-none stroke-coral stroke-[2.2]" aria-hidden="true"><use href="#icon-party"/></svg> 
                    Will you be joining us?
                  </div>
                  <div className="mb-3 grid gap-2.5">
                    <label className={`flex cursor-pointer items-center gap-2.5 rounded-xl border-2 px-3.5 py-2.5 text-[.95rem] font-extrabold shadow-soft transition hover:-translate-y-px ${formData.attending === 'yes' ? 'border-ocean bg-seafoam' : 'border-[#b8e8f5] bg-white'}`}>
                      <input 
                        className="h-[18px] w-[18px] accent-ocean" 
                        type="radio" 
                        name="attending" 
                        value="yes" 
                        checked={formData.attending === 'yes'}
                        onChange={() => {
                          setFormData({...formData, attending: 'yes'});
                          setBabyMode('happy');
                        }}
                      />
                      Yes, I'll be there!
                    </label>
                    <label className={`flex cursor-pointer items-center gap-2.5 rounded-xl border-2 px-3.5 py-2.5 text-[.95rem] font-extrabold shadow-soft transition hover:-translate-y-px ${formData.attending === 'no' ? 'border-ocean bg-seafoam' : 'border-[#b8e8f5] bg-white'}`}>
                      <input 
                        className="h-[18px] w-[18px] accent-ocean" 
                        type="radio" 
                        name="attending" 
                        value="no"
                        checked={formData.attending === 'no'}
                        onChange={() => {
                          setFormData({...formData, attending: 'no'});
                          setBabyMode('sad');
                        }}
                      />
                      Sorry, I can't make it
                    </label>
                  </div>
                  <label className="mb-1.5 block text-sm font-extrabold text-deep" htmlFor="guests">Number of guests, including yourself</label>
                  <input 
                    className="w-full rounded-xl border-2 border-[#b8e8f5] bg-white px-3.5 py-2.5 text-[.95rem] text-deep shadow-[inset_0_2px_6px_rgba(0,0,0,.04)] outline-none transition focus:border-ocean" 
                    type="number" 
                    id="guests" 
                    min="1" 
                    max="10"
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: Number(e.target.value)})}
                  />
                  <label className="mt-2 block text-sm font-extrabold text-deep" htmlFor="arrivalTime">Around what time are you planning to arrive?</label>
                  <input 
                    type="time" 
                    id="arrivalTime" 
                    className="w-full rounded-xl border-2 border-[#b8e8f5] bg-white px-3.5 py-2.5 text-[.95rem] text-deep shadow-[inset_0_2px_6px_rgba(0,0,0,.04)] outline-none transition focus:border-ocean" 
                    required 
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
                  />
                </div>

                <div className="mb-5 rounded-[18px] border border-ocean/10 bg-gradient-to-br from-seafoam to-[#e0f7fa] px-[22px] py-5 shadow-soft">
                  <div className="mb-3.5 flex items-center gap-2 font-pacifico text-[1.05rem] text-ocean">
                    <svg className="h-[21px] w-[21px] fill-none stroke-coral stroke-[2.2]" aria-hidden="true"><use href="#icon-watermelon"/></svg> 
                    Dietary Restrictions
                  </div>
                  <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {['vegetarian', 'vegan', 'gluten-free', 'nut-allergy', 'dairy-free', 'halal', 'kosher'].map((diet) => (
                      <label key={diet} className={`flex cursor-pointer items-center gap-2 rounded-[10px] border-2 px-3 py-2 text-sm font-extrabold shadow-soft transition hover:-translate-y-px ${formData.diet.includes(diet) ? 'border-coral bg-[#fff0eb]' : 'border-[#b8e8f5] bg-white'}`}>
                        <input 
                          className="h-4 w-4 accent-coral" 
                          type="checkbox" 
                          checked={formData.diet.includes(diet)}
                          onChange={(e) => {
                            const newDiet = e.target.checked 
                              ? [...formData.diet, diet]
                              : formData.diet.filter(d => d !== diet);
                            setFormData({...formData, diet: newDiet});
                          }}
                        /> 
                        {diet.charAt(0).toUpperCase() + diet.slice(1)}
                      </label>
                    ))}
                  </div>
                  <label className="mb-1.5 block text-sm font-extrabold text-deep" htmlFor="otherDiet">Other notes</label>
                  <textarea 
                    className="min-h-[70px] w-full resize-y rounded-xl border-2 border-[#b8e8f5] bg-white px-3.5 py-2.5 text-[.95rem] text-deep shadow-[inset_0_2px_6px_rgba(0,0,0,.04)] outline-none transition focus:border-ocean" 
                    id="otherDiet" 
                    placeholder="Anything else we should know?"
                    value={formData.otherDiet}
                    onChange={(e) => setFormData({...formData, otherDiet: e.target.value})}
                  />
                </div>

                <button type="submit" className="w-full rounded-2xl border-0 bg-gradient-to-br from-coral to-[#f7a07a] p-4 font-pacifico text-[1.15rem] text-white shadow-coral-button transition hover:-translate-y-0.5 hover:shadow-coral-button-hover active:translate-y-1 active:shadow-coral-button-active">
                  Send my RSVP <svg className="ml-1.5 inline h-[22px] w-[22px] align-[-4px] fill-none stroke-current stroke-[2.4]" aria-hidden="true"><use href="#icon-wave"></use></svg>
                </button>
              </form>
            ) : (
              <div className="px-6 pb-[30px] pt-[42px] text-center" id="thankyou">
                <div className="mb-4 flex items-center justify-center gap-2.5 text-ocean drop-shadow-[0_5px_10px_rgba(0,119,182,.18)]" aria-hidden="true">
                  <svg className="h-[46px] w-[46px] fill-none stroke-current stroke-2"><use href="#icon-shell"></use></svg>
                  <svg className="h-[46px] w-[46px] fill-none stroke-current stroke-2"><use href="#icon-wave"></use></svg>
                  <svg className="h-[46px] w-[46px] fill-none stroke-current stroke-2"><use href="#icon-sun"></use></svg>
                </div>
                <h2 className="mb-2.5 font-pacifico text-[1.8rem] text-ocean">See you at the beach!</h2>
                <p className="text-base font-bold leading-relaxed text-deep">Thanks so much for your RSVP. We cannot wait to celebrate this July baby boy with you.</p>
                <button 
                  onClick={() => setShowThankYou(false)}
                  className="mt-6 text-ocean font-bold underline"
                >
                  Send another RSVP
                </button>
              </div>
            )}
          </div>

          {/* Beachy Divider */}
          <div className="relative my-9 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t-2 border-dashed border-[#b8e8f5]"></div>
            </div>
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-soft text-ocean border-2 border-[#b8e8f5]">
              <svg className="h-[20px] w-[20px] fill-none stroke-current stroke-2"><use href="#icon-shell"></use></svg>
            </div>
          </div>

          {/* Registry Section */}
          <div>
            <div className="mb-[18px] grid items-start gap-[18px] sm:flex sm:items-end sm:justify-between">
              <h2 className="font-pacifico text-[clamp(1.65rem,5vw,2.3rem)] leading-tight text-ocean">Little Wave Registry</h2>
              <p className="max-w-[420px] font-bold leading-normal text-[#315566]">Pick a gift, reserve it, and help us get ready for our beachy July baby.</p>
            </div>

            <div className="mb-[18px] grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <div className="rounded-[18px] border border-ocean/15 bg-gradient-to-br from-white to-[#eaffff] p-[13px] text-center shadow-soft">
                <strong className="block text-[1.45rem] font-black leading-none text-coral">{gifts.length}</strong>
                <span className="mt-1.5 block text-xs font-extrabold uppercase tracking-[.04em] text-[#497184]">Gift ideas</span>
              </div>
              <div className="rounded-[18px] border border-ocean/15 bg-gradient-to-br from-white to-[#eaffff] p-[13px] text-center shadow-soft">
                <strong className="block text-[1.45rem] font-black leading-none text-coral">{gifts.filter(g => g.reserved).length}</strong>
                <span className="mt-1.5 block text-xs font-extrabold uppercase tracking-[.04em] text-[#497184]">Reserved</span>
              </div>
              <div className="rounded-[18px] border border-ocean/15 bg-gradient-to-br from-white to-[#eaffff] p-[13px] text-center shadow-soft">
                <strong className="block text-[1.45rem] font-black leading-none text-coral">July</strong>
                <span className="mt-1.5 block text-xs font-extrabold uppercase tracking-[.04em] text-[#497184]">Baby due</span>
              </div>
            </div>

            <div className="mb-4 grid items-center gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto]">
              <input 
                className="min-h-11 w-full rounded-[14px] border-2 border-[#b8e8f5] bg-white px-3.5 py-2.5 text-deep shadow-[inset_0_2px_6px_rgba(0,0,0,.04)] outline-none transition focus:border-ocean" 
                type="search" 
                placeholder="Search gifts or notes" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex flex-wrap justify-start gap-[7px] sm:justify-end">
                {['all', 'nursery', 'beach', 'feeding', 'care'].map((filter) => (
                  <button 
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`min-h-[39px] rounded-full border-2 px-[13px] font-black transition hover:-translate-y-px ${activeFilter === filter ? 'border-ocean bg-seafoam text-ocean' : 'border-[#b8e8f5] bg-white text-deep'}`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filteredGifts.length > 0 ? (
                filteredGifts.map(({ gift, index }) => (
                  <article key={index} className="grid min-h-[222px] grid-rows-[auto_1fr_auto] gap-2.5 rounded-[18px] border-2 border-[#b8e8f5] bg-gradient-to-br from-white to-[#f3fdff] p-3.5 shadow-[0_5px_16px_rgba(0,119,182,.09)]">
                    <div className="flex items-center justify-between gap-2.5">
                      <span className="grid h-[46px] w-[46px] place-items-center rounded-[15px] bg-gradient-to-br from-sand to-[#fff8e8] shadow-[0_2px_7px_rgba(0,0,0,.06)]">
                        <svg className="h-[25px] w-[25px] fill-none stroke-ocean stroke-2"><use href={`#icon-${gift.icon}`}></use></svg>
                      </span>
                      <span className="whitespace-nowrap rounded-full bg-seafoam px-[9px] py-[5px] text-[.72rem] font-black uppercase tracking-[.04em] text-ocean">{gift.category}</span>
                    </div>
                    <div>
                      <h3 className="text-[1.03rem] font-extrabold leading-tight text-deep">{gift.name}</h3>
                      <p className="mt-2 text-sm font-bold leading-snug text-[#4a6c7d]">{gift.note}</p>
                    </div>
                    <div className="flex flex-col gap-2.5 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                      <span className="text-[1.1rem] font-black text-coral">{gift.price}</span>
                      <button 
                        onClick={() => toggleGiftReservation(index)}
                        className={`min-h-[38px] whitespace-nowrap rounded-[13px] border-0 px-3 font-black text-white transition hover:-translate-y-px ${gift.reserved ? 'bg-gradient-to-br from-[#6ed6b5] to-[#9ae8d1] shadow-mint-button' : 'bg-gradient-to-br from-coral to-[#f7a07a] shadow-[0_4px_0_#c9603a,0_7px_15px_rgba(244,132,95,.24)] hover:shadow-[0_5px_0_#c9603a,0_10px_18px_rgba(244,132,95,.3)]'}`}
                      >
                        {gift.reserved ? 'Reserved' : 'Reserve'}
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[18px] border-2 border-dashed border-[#b8e8f5] bg-white/70 p-6 text-center font-extrabold text-[#497184] sm:col-span-2">
                  No gifts match that search yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
