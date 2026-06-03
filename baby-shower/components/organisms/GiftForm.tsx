import React, { useState, useEffect } from 'react';
import { Gift } from '../types';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { FormField } from '../moleculs/FormField';

const AVAILABLE_ICONS = ['wave', 'shell', 'sun', 'fish', 'calendar', 'umbrella', 'flower', 'party', 'watermelon', 'moon', 'palm', 'tent', 'bottle', 'bib', 'caddy', 'bath', 'star', 'shirt', 'cloth', 'firstaid'];

interface GiftFormProps {
  editIndex: number | null;
  initialGift?: Gift;
  onSubmit: (gift: Gift, index: number | null) => void;
  onCancel: () => void;
}

export const GiftForm: React.FC<GiftFormProps> = ({ 
  editIndex, 
  initialGift, 
  onSubmit, 
  onCancel 
}) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'nursery',
    note: '',
    icon: 'wave'
  });

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (initialGift) {
      setForm({
        name: initialGift.name,
        price: initialGift.price,
        category: initialGift.category,
        note: initialGift.note || '',
        icon: initialGift.icon
      });
    } else {
      setForm({ name: '', price: '', category: 'nursery', note: '', icon: 'wave' });
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [initialGift]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = form.price.startsWith('$') ? form.price : '$' + form.price;
    onSubmit({ ...form, price, reserved: initialGift?.reserved || false }, editIndex);
    if (editIndex === null) setForm({ name: '', price: '', category: 'nursery', note: '', icon: 'wave' });
  };

  return (
    <section className="overflow-hidden rounded-[28px] bg-white/90 p-[22px] shadow-card backdrop-blur-lg">
      <h2 className="font-pacifico text-lg text-ocean mb-4 flex items-center gap-2">
        <Icon name="shell" className="h-5 w-5 fill-none stroke-coral stroke-[2.2]" />
        {editIndex !== null ? 'Edit Registry Gift' : 'Add New Gift'}
      </h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <FormField 
          label="Gift Name" id="giftName" required placeholder="e.g. Cozy Hooded Towel"
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField 
            label="Price" id="giftPrice" required placeholder="e.g. $25"
            value={form.price}
            onChange={(e) => setForm({...form, price: e.target.value})}
          />
          <FormField 
            label="Category" id="giftCategory" as="select" required
            value={form.category}
            onChange={(e) => setForm({...form, category: e.target.value})}
          >
            <option value="nursery">Nursery</option>
            <option value="beach">Beach</option>
            <option value="feeding">Feeding</option>
            <option value="care">Care</option>
          </FormField>
        </div>
        <FormField 
          label="Description / Note" id="giftNote" as="textarea" placeholder="Why do you need this?"
          value={form.note}
          onChange={(e) => setForm({...form, note: e.target.value})}
        />
        <div>
          <label className="block text-xs font-extrabold text-[#497184] uppercase tracking-wider mb-1.5">Choose Icon</label>
          <div className="grid grid-cols-6 gap-2 bg-gradient-to-br from-seafoam/50 to-white p-2.5 rounded-xl border border-ocean/10">
            {AVAILABLE_ICONS.map((icon) => (
              <label 
                key={icon} 
                className={`cursor-pointer border-2 p-1.5 rounded-xl flex items-center justify-center transition ${form.icon === icon ? 'border-ocean bg-white shadow-soft scale-105' : 'border-transparent hover:border-ocean/20 hover:bg-white'}`}
              >
                <input 
                  type="radio" name="giftIcon" value={icon} className="hidden" 
                  checked={form.icon === icon}
                  onChange={() => setForm({...form, icon: icon})}
                />
                <Icon name={icon} className="h-6 w-6 stroke-ocean stroke-2 fill-none" />
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            {editIndex !== null ? 'Update Gift' : 'Add Gift'}
          </Button>
          {editIndex !== null && (
            <Button variant="seafoam" onClick={onCancel} className="px-4 !bg-white">
              Cancel
            </Button>
          )}
        </div>
      </form>
    </section>
  );
};
