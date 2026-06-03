import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'coral' | 'seafoam' | 'mint' | 'transparent';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'coral', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyles = 'transition hover:-translate-y-px active:translate-y-0.5 font-black px-4 py-2 rounded-xl';
  
  const variants = {
    coral: 'bg-gradient-to-br from-coral to-[#f7a07a] text-white shadow-coral-button hover:shadow-coral-button-hover active:shadow-coral-button-active',
    seafoam: 'border-2 border-ocean bg-seafoam text-ocean',
    mint: 'bg-gradient-to-br from-[#6ed6b5] to-[#9ae8d1] text-white shadow-mint-button',
    transparent: 'bg-white/20 text-[#eefcff] backdrop-blur-md hover:bg-white hover:text-ocean shadow-soft'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
