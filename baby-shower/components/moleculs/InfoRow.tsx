import React from 'react';
import { Icon } from '../atoms/Icon';

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  onClick?: () => void;
  title?: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({ 
  icon, 
  label, 
  value, 
  onClick, 
  title 
}) => {
  return (
    <div 
      className={`grid grid-cols-[42px_1fr] items-center gap-3 rounded-[18px] border border-ocean/10 bg-gradient-to-br from-seafoam to-[#e0f7fa] p-[13px] shadow-soft ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      title={title}
    >
      <span className="grid h-[42px] w-[42px] place-items-center rounded-[14px] bg-white shadow-[0_2px_7px_rgba(0,0,0,.06)]" aria-hidden="true">
        <Icon name={icon} className="h-[23px] w-[23px] fill-none stroke-ocean stroke-2" />
      </span>
      <div>
        <strong className="block text-[.85rem] font-extrabold uppercase tracking-[.04em] text-ocean">{label}</strong>
        <span className="block font-extrabold leading-snug">{value}</span>
      </div>
    </div>
  );
};
