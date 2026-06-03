import React from 'react';
import { Details } from '../types';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { FormField } from '../moleculs/FormField';

interface DetailsFormProps {
  details: Details;
  onDetailsChange: (details: Details) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const DetailsForm: React.FC<DetailsFormProps> = ({ 
  details, 
  onDetailsChange, 
  onSubmit 
}) => {
  return (
    <section className="overflow-hidden rounded-[28px] bg-white/90 p-[22px] shadow-card backdrop-blur-lg">
      <h2 className="font-pacifico text-lg text-ocean mb-4 flex items-center gap-2">
        <Icon name="calendar" className="h-5 w-5 fill-none stroke-coral stroke-[2.2]" />
        Shower Details
      </h2>
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormField 
          label="Date & Time" id="inputDate" required placeholder="e.g. Sunday, July 13 at 12:30 PM"
          value={details.date}
          onChange={(e) => onDetailsChange({...details, date: e.target.value})}
        />
        <FormField 
          label="Theme Description" id="inputTheme" required placeholder="e.g. Summer beach, seafoam blues, coral"
          value={details.theme}
          onChange={(e) => onDetailsChange({...details, theme: e.target.value})}
        />
        <FormField 
          label="Place/Address" id="inputPlace" required placeholder="e.g. 123 Sandy Shore Drive"
          value={details.place}
          onChange={(e) => onDetailsChange({...details, place: e.target.value})}
        />
        <Button type="submit" className="w-full">
          Save Details
        </Button>
      </form>
    </section>
  );
};
