import React from 'react';
import { Gift, RSVP } from '../types';
import { Icon } from '../atoms/Icon';

interface ManagementListProps {
  type: 'gifts' | 'guests';
  items: (Gift | RSVP)[];
  onEdit?: (index: number) => void;
  onDelete: (index: number) => void;
  onToggleReservation?: (index: number) => void;
}

export const ManagementList: React.FC<ManagementListProps> = ({ 
  type, 
  items, 
  onEdit, 
  onDelete, 
  onToggleReservation 
}) => {
  return (
    <section className="overflow-hidden rounded-[28px] bg-white/90 p-[22px] shadow-card backdrop-blur-lg flex flex-col">
      <div className="mb-4">
        <h2 className="font-pacifico text-lg text-ocean">
          {type === 'gifts' ? 'Registry Gift List' : 'Guest List'}
        </h2>
        <p className="text-xs font-bold text-[#497184] mt-0.5">
          {type === 'gifts' ? 'Edit or remove items currently on the registry' : 'RSVPs and details'}
        </p>
      </div>

      <div className="overflow-y-auto flex-1 max-h-[720px] pr-1 space-y-3">
        {items.length > 0 ? (
          items.map((item, index) => {
            if (type === 'gifts') {
              const gift = item as Gift;
              return (
                <div key={index} className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-ocean/10 shadow-soft hover:shadow-md transition">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-sand to-[#fff8e8]" aria-hidden="true">
                      <Icon name={gift.icon} className="h-6 w-6 stroke-ocean stroke-2 fill-none" />
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
                    {onToggleReservation && (
                      <span 
                        className={`text-[.72rem] px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1 cursor-pointer transition ${gift.reserved ? 'bg-[#d4f7e5] text-[#1a6640]' : 'bg-seafoam text-ocean hover:bg-ocean hover:text-white'}`}
                        onClick={() => onToggleReservation(index)}
                      >
                        {gift.reserved ? 'Reserved' : 'Available'}
                      </span>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(index)} className="p-2 rounded-lg bg-seafoam/60 hover:bg-ocean hover:text-white transition text-ocean" title="Edit Item">
                        <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                    )}
                    <button onClick={() => onDelete(index)} className="p-2 rounded-lg bg-[#ffe0e0] hover:bg-[#ffe0e0] hover:text-[#b91c1c] text-[#b91c1c] transition" title="Delete Item">
                      <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  </div>
                </div>
              );
            } else {
              const rsvp = item as RSVP;
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-soft border border-ocean/10">
                  <div>
                    <p className="font-extrabold text-deep">{rsvp.firstName} {rsvp.lastName}</p>
                    <p className="text-xs text-[#497184]">Attending: {rsvp.attending ? 'Yes' : 'No'}, Guests: {rsvp.guests}, Diet: {rsvp.diet.join(', ') || 'None'}, Gift: {rsvp.reservedGift || 'None'}</p>
                  </div>
                  <button onClick={() => onDelete(index)} className="p-1 rounded bg-[#ffe0e0] hover:bg-[#ffe0e0] hover:text-[#b91c1c] text-[#b91c1c]">✕</button>
                </div>
              );
            }
          })
        ) : (
          <div className="p-6 text-center text-sm font-bold text-[#497184] border-2 border-dashed border-[#b8e8f5] rounded-2xl bg-white/50">
            {type === 'gifts' ? 'No items on the registry yet. Add some on the left!' : 'No RSVPs yet.'}
          </div>
        )}
      </div>
    </section>
  );
};
