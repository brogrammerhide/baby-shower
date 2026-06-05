import { Details, DietaryOption, Gift, RSVP } from '../../components/types';

function docId(doc: { _id?: { toString(): string }; id?: string }): string | undefined {
  return doc._id?.toString() ?? doc.id;
}

export function toDetails(doc: Record<string, unknown> | null | undefined): Details {
  if (!doc) return { date: '', theme: '', place: '' };
  return {
    date: String(doc.date ?? ''),
    theme: String(doc.theme ?? ''),
    place: String(doc.place ?? ''),
  };
}

export function toGift(doc: Record<string, unknown>): Gift {
  return {
    id: docId(doc as { _id?: { toString(): string }; id?: string }),
    name: String(doc.name ?? ''),
    category: String(doc.category ?? ''),
    price: String(doc.price ?? ''),
    icon: String(doc.icon ?? ''),
    note: String(doc.note ?? ''),
    reserved: Boolean(doc.reserved),
    url: doc.url ? String(doc.url) : undefined,
    imageUrl: doc.imageUrl ? String(doc.imageUrl) : undefined,
  };
}

export function toGifts(docs: unknown): Gift[] {
  if (!Array.isArray(docs)) return [];
  return docs.map((d) => toGift(d as Record<string, unknown>));
}

function dietaryKeys(doc: Record<string, unknown>): string[] {
  const restrictions = doc.dietaryRestrictions;
  if (!Array.isArray(restrictions)) return [];
  return restrictions
    .map((d) => {
      if (d && typeof d === 'object' && 'key' in d) return String((d as { key: string }).key);
      return null;
    })
    .filter((k): k is string => Boolean(k));
}

function reservedGiftLabel(doc: Record<string, unknown>): string | undefined {
  const gift = doc.reservedGift;
  if (!gift) return undefined;
  if (typeof gift === 'object' && gift !== null && 'name' in gift) {
    return String((gift as { name: string }).name);
  }
  return undefined;
}

export function toRsvp(doc: Record<string, unknown>): RSVP {
  const diet = dietaryKeys(doc);
  const other = doc.otherDietNotes ? String(doc.otherDietNotes) : '';
  if (other) diet.push(other);

  return {
    id: docId(doc as { _id?: { toString(): string }; id?: string }),
    firstName: String(doc.firstName ?? ''),
    lastName: String(doc.lastName ?? ''),
    attending: Boolean(doc.attending),
    guests: Number(doc.guests) || 1,
    diet,
    arrivalTime: doc.arrivalTime ? String(doc.arrivalTime) : undefined,
    reservedGift: reservedGiftLabel(doc),
  };
}

export function toRsvps(docs: unknown): RSVP[] {
  if (!Array.isArray(docs)) return [];
  return docs.map((d) => toRsvp(d as Record<string, unknown>));
}

export function toDietaryOptions(docs: unknown): DietaryOption[] {
  if (!Array.isArray(docs)) return [];
  return docs.map((d) => {
    const doc = d as Record<string, unknown>;
    return {
      key: String(doc.key ?? ''),
      label: String(doc.label ?? doc.key ?? ''),
    };
  });
}
