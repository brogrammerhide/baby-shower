import React from 'react';
import { Icon } from '../atoms/Icon';

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  onClick?: () => void;
  title?: string;
  hideCopyIcon?: boolean;
}

export const InfoRow: React.FC<InfoRowProps> = ({ 
  icon, 
  label, 
  value, 
  onClick, 
  title,
  hideCopyIcon
}) => {
  return (
    <div 
      className={`group grid grid-cols-[42px_1fr_auto] items-center gap-3 rounded-[18px] border border-ocean/10 bg-gradient-to-br from-seafoam to-[#e0f7fa] p-[13px] shadow-soft transition-all duration-300 ${onClick ? 'cursor-pointer hover:border-ocean/30 hover:shadow-md' : ''}`}
      onClick={onClick}
      title={title}
    >
      <span className="grid h-[42px] w-[42px] place-items-center rounded-[14px] bg-white shadow-[0_2px_7px_rgba(0,0,0,.06)] transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
        <Icon name={icon} className="h-[23px] w-[23px] fill-none stroke-ocean stroke-2" />
      </span>
      <div>
        <strong className="block text-[.85rem] font-extrabold uppercase tracking-[.04em] text-ocean">{label}</strong>
        <span className="block font-extrabold leading-snug">{value}</span>
      </div>
      {onClick && (
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/50 text-ocean/40 transition-colors group-hover:bg-white group-hover:text-ocean">
          <Icon name={hideCopyIcon ? 'chevron' : 'copy'} className="h-4 w-4 fill-none stroke-current stroke-2" />
        </span>
      )}
    </div>
  );
};
