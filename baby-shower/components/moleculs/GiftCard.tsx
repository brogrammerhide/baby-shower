import React from 'react';
import { Gift } from '../types';
import { Icon } from '../atoms/Icon';
import { Button } from '../atoms/Button';

interface GiftCardProps {
  gift: Gift;
  onToggle: () => void;
}

export const GiftCard: React.FC<GiftCardProps> = ({ gift, onToggle }) => {
  return (
    <article className="grid min-h-[222px] grid-rows-[auto_1fr_auto] gap-2.5 rounded-[18px] border-2 border-[#b8e8f5] bg-gradient-to-br from-white to-[#f3fdff] p-3.5 shadow-[0_5px_16px_rgba(0,119,182,.09)]">
      <div className="flex items-center justify-between gap-2.5">
        <span className="grid h-[46px] w-[46px] place-items-center rounded-[15px] bg-gradient-to-br from-sand to-[#fff8e8] shadow-[0_2px_7px_rgba(0,0,0,.06)]">
          <Icon name={gift.icon} className="h-[25px] w-[25px] fill-none stroke-ocean stroke-2" />
        </span>
        <span className="whitespace-nowrap rounded-full bg-seafoam px-[9px] py-[5px] text-[.72rem] font-black uppercase tracking-[.04em] text-ocean">{gift.category}</span>
      </div>
      <div>
        <h3 className="text-[1.03rem] font-extrabold leading-tight text-deep">{gift.name}</h3>
        <p className="mt-2 text-sm font-bold leading-snug text-[#4a6c7d]">{gift.note}</p>
      </div>
      <div className="flex flex-col gap-2.5 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
        <span className="text-[1.1rem] font-black text-coral">{gift.price}</span>
        <Button 
          variant={gift.reserved ? 'mint' : 'coral'} 
          onClick={onToggle}
          className="min-h-[38px] whitespace-nowrap"
        >
          {gift.reserved ? 'Reserved' : 'Reserve'}
        </Button>
      </div>
    </article>
  );
};
