import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  as?: 'input' | 'textarea' | 'select';
  className?: string;
}

export const Input: React.FC<InputProps> = ({ 
  as = 'input', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'w-full rounded-xl border-2 border-[#b8e8f5] bg-white px-3.5 py-2.5 text-[.95rem] text-deep shadow-[inset_0_2px_6px_rgba(0,0,0,.04)] outline-none transition focus:border-ocean';
  
  return React.createElement(as, {
    className: `${baseStyles} ${className}`,
    ...props
  });
};
