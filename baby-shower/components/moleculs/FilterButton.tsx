import React from 'react';

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ 
  label, 
  active, 
  onClick 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`min-h-[39px] rounded-full border-2 px-[13px] font-black transition hover:-translate-y-px cursor-pointer ${active ? 'border-ocean bg-seafoam text-ocean' : 'border-[#b8e8f5] bg-white text-deep'}`}
    >
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </button>
  );
};
