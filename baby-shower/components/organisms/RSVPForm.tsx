import React, { useState } from 'react';
import { RSVP } from '../types';
import { Icon } from '../atoms/Icon';
import { Button } from '../atoms/Button';
import { FormField } from '../moleculs/FormField';

interface RSVPFormProps {
  rsvps: RSVP[];
  onRsvpSubmit: (rsvp: RSVP) => void;
  onBabyModeChange: (mode: 'happy' | 'sad') => void;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ rsvps, onRsvpSubmit, onBabyModeChange }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
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

    onRsvpSubmit(newRsvp);
    setShowThankYou(true);
    onBabyModeChange('happy');
  };

  if (showThankYou) {
    return (
      <div className="px-6 pb-[30px] pt-[42px] text-center">
        <div className="mb-4 flex items-center justify-center gap-2.5 text-ocean drop-shadow-[0_5px_10px_rgba(0,119,182,.18)]" aria-hidden="true">
          <Icon name="shell" className="h-[46px] w-[46px] fill-none stroke-current stroke-2" />
          <Icon name="wave" className="h-[46px] w-[46px] fill-none stroke-current stroke-2" />
          <Icon name="sun" className="h-[46px] w-[46px] fill-none stroke-current stroke-2" />
        </div>
        <h2 className="mb-2.5 font-pacifico text-[1.8rem] text-ocean">See you at the beach!</h2>
        <p className="text-base font-bold leading-relaxed text-deep">Thanks so much for your RSVP. We cannot wait to celebrate this July baby boy with you.</p>
        <button onClick={() => setShowThankYou(false)} className="mt-6 text-ocean font-bold underline">
          Send another RSVP
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 rounded-[18px] border border-ocean/10 bg-gradient-to-br from-seafoam to-[#e0f7fa] px-[22px] py-5 shadow-soft">
        <div className="mb-3.5 flex items-center gap-2 font-pacifico text-[1.05rem] text-ocean">
          <Icon name="flower" className="h-[21px] w-[21px] fill-none stroke-coral stroke-[2.2]" />
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
        <Button onClick={handleLookup} className="mt-3 w-full !py-2 !font-pacifico">
          Lookup RSVP
        </Button>
        {lookupResult && <div className="mt-2 text-sm text-deep">{lookupResult}</div>}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-5 rounded-[18px] border border-ocean/10 bg-gradient-to-br from-seafoam to-[#e0f7fa] px-[22px] py-5 shadow-soft">
          <div className="mb-3.5 flex items-center gap-2 font-pacifico text-[1.05rem] text-ocean">
            <Icon name="flower" className="h-[21px] w-[21px] fill-none stroke-coral stroke-[2.2]" /> 
            Your Info
          </div>
          <FormField 
            label="First Name" id="firstName" required placeholder="e.g. Alice"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          />
          <FormField 
            label="Last Name" id="lastName" required placeholder="e.g. Smith" className="mt-2"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          />
        </div>

        <div className="mb-5 rounded-[18px] border border-ocean/10 bg-gradient-to-br from-seafoam to-[#e0f7fa] px-[22px] py-5 shadow-soft">
          <div className="mb-3.5 flex items-center gap-2 font-pacifico text-[1.05rem] text-ocean">
            <Icon name="party" className="h-[21px] w-[21px] fill-none stroke-coral stroke-[2.2]" /> 
            Will you be joining us?
          </div>
          <div className="mb-3 grid gap-2.5">
            <label className={`flex cursor-pointer items-center gap-2.5 rounded-xl border-2 px-3.5 py-2.5 text-[.95rem] font-extrabold shadow-soft transition hover:-translate-y-px ${formData.attending === 'yes' ? 'border-ocean bg-seafoam' : 'border-[#b8e8f5] bg-white'}`}>
              <input 
                className="h-[18px] w-[18px] accent-ocean" type="radio" name="attending" value="yes" 
                checked={formData.attending === 'yes'}
                onChange={() => {
                  setFormData({...formData, attending: 'yes'});
                  onBabyModeChange('happy');
                }}
              />
              Yes, I&apos;ll be there!
            </label>
            <label className={`flex cursor-pointer items-center gap-2.5 rounded-xl border-2 px-3.5 py-2.5 text-[.95rem] font-extrabold shadow-soft transition hover:-translate-y-px ${formData.attending === 'no' ? 'border-ocean bg-seafoam' : 'border-[#b8e8f5] bg-white'}`}>
              <input 
                className="h-[18px] w-[18px] accent-ocean" type="radio" name="attending" value="no"
                checked={formData.attending === 'no'}
                onChange={() => {
                  setFormData({...formData, attending: 'no'});
                  onBabyModeChange('sad');
                }}
              />
              Sorry, I can&apos;t make it
            </label>
          </div>
          <FormField 
            label="Number of guests" id="guests" type="number" min="1" max="10"
            value={formData.guests}
            onChange={(e) => setFormData({...formData, guests: Number(e.target.value)})}
          />
          <FormField 
            label="Arrival Time" id="arrivalTime" type="time" required className="mt-2"
            value={formData.arrivalTime}
            onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
          />
        </div>

        <div className="mb-5 rounded-[18px] border border-ocean/10 bg-gradient-to-br from-seafoam to-[#e0f7fa] px-[22px] py-5 shadow-soft">
          <div className="mb-3.5 flex items-center gap-2 font-pacifico text-[1.05rem] text-ocean">
            <Icon name="watermelon" className="h-[21px] w-[21px] fill-none stroke-coral stroke-[2.2]" /> 
            Dietary Restrictions
          </div>
          <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {['vegetarian', 'vegan', 'gluten-free', 'nut-allergy', 'dairy-free', 'halal', 'kosher'].map((diet) => (
              <label key={diet} className={`flex cursor-pointer items-center gap-2 rounded-[10px] border-2 px-3 py-2 text-sm font-extrabold shadow-soft transition hover:-translate-y-px ${formData.diet.includes(diet) ? 'border-coral bg-[#fff0eb]' : 'border-[#b8e8f5] bg-white'}`}>
                <input 
                  className="h-4 w-4 accent-coral" type="checkbox" checked={formData.diet.includes(diet)}
                  onChange={(e) => {
                    const newDiet = e.target.checked ? [...formData.diet, diet] : formData.diet.filter(d => d !== diet);
                    setFormData({...formData, diet: newDiet});
                  }}
                /> 
                {diet.charAt(0).toUpperCase() + diet.slice(1)}
              </label>
            ))}
          </div>
          <FormField 
            label="Other notes" id="otherDiet" as="textarea" placeholder="Anything else we should know?"
            value={formData.otherDiet}
            onChange={(e) => setFormData({...formData, otherDiet: e.target.value})}
          />
        </div>

        <Button type="submit" className="w-full !p-4 !font-pacifico !text-[1.15rem]">
          Send my RSVP <Icon name="wave" className="ml-1.5 inline h-[22px] w-[22px] align-[-4px] fill-none stroke-current stroke-[2.4]" />
        </Button>
      </form>
    </div>
  );
};
