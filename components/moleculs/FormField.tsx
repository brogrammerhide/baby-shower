import React from 'react';
import { Input } from '../atoms/Input';

interface FormFieldProps {
  label: string;
  id: string;
  as?: 'input' | 'textarea' | 'select';
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  className?: string;
  type?: string;
  min?: string | number;
  max?: string | number;
  children?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  id, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-extrabold text-[#497184] uppercase tracking-wider" htmlFor={id}>
        {label}
      </label>
      <Input id={id} {...props} />
    </div>
  );
};
