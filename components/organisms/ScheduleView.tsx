'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../atoms/Icon';
import { Button } from '../atoms/Button';

interface ScheduleItemProps {
  time: string;
  title: string;
  description: string;
  icon: string;
  index: number;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ time, title, description, icon, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative flex gap-6 pb-8 last:pb-0"
    >
      {/* Timeline Line */}
      <div className="absolute left-[27px] top-[40px] bottom-0 w-0.5 border-l-2 border-dashed border-ocean/20 last:hidden" aria-hidden="true" />
      
      {/* Icon Circle */}
      <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-soft border-2 border-seafoam">
        <Icon name={icon} className="h-7 w-7 fill-none stroke-ocean stroke-2" />
      </div>

      <div className="pt-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="font-pacifico text-ocean text-lg">{time}</span>
          <span className="h-1 w-1 rounded-full bg-coral/40" />
          <h3 className="text-deep font-black uppercase tracking-wider text-sm">{title}</h3>
        </div>
        <p className="text-[#497184] font-bold leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

interface ScheduleViewProps {
  onBack: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ onBack }) => {
  const activities = [
    {
      time: '1:00 PM',
      title: 'Arrival & Welcome 🍹',
      description: 'Grab a drink/snack and settle in for the day! 🌴',
      icon: 'sun',
    },
    {
      time: '1:30 PM',
      title: 'Lunch & "Don\'t Say Baby" 🤫',
      description: 'Try not to say the word "baby" until 3:00 PM. If you do, you lose your clip! 🥪',
      icon: 'watermelon',
    },
    {
      time: '2:15 PM',
      title: 'Wood Block Decoration 🎨',
      description: 'Grab a pen! We have wood blocks for everyone to decorate🖌️',
      icon: 'palm',
    },
    {
      time: '2:45 PM',
      title: 'Guessing Baby Food 🍼',
      description: 'Identify the mystery baby food flavors by tasting—or just smelling if you prefer! 👃',
      icon: 'bottle',
    },
    {
      time: '3:30 PM',
      title: 'Guessing how many fish are in the sea 🐟',
      description: 'Guess how many gold fish are in the jar! 🎁',
      icon: 'fish',
    },
    {
      time: '4:00 PM',
      title: 'Farewell 👋',
      description: 'Goodbye and thank you for coming! 🌊',
      icon: 'star',
    },
  ];


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-pacifico text-[clamp(1.65rem,5vw,2.3rem)] leading-tight text-ocean">Event Schedule</h2>
          <p className="max-w-[420px] font-bold leading-normal text-[#315566]">Here is what we have planned for our beachy July afternoon.</p>
        </div>
        <button 
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-seafoam/40 text-ocean hover:bg-seafoam transition-colors"
          title="Go Back"
        >
          <Icon name="flower" className="h-5 w-5 fill-none stroke-current stroke-2 rotate-180" />
        </button>
      </div>

      <div className="rounded-[28px] border-2 border-ocean/5 bg-gradient-to-br from-white to-seafoam/10 p-6 sm:p-8">
        {activities.map((activity, idx) => (
          <ScheduleItem 
            key={idx} 
            index={idx}
            {...activity} 
          />
        ))}
      </div>

      <div className="flex justify-center">
        <Button onClick={onBack} variant="transparent" className="!font-pacifico !text-ocean underline decoration-ocean/30 underline-offset-4">
          Back to my RSVP
        </Button>
      </div>
    </div>
  );
};
