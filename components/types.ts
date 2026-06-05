export interface Gift {
  id?: string;
  name: string;
  category: string;
  price: string;
  icon: string;
  note: string;
  reserved: boolean;
  url?: string;
  imageUrl?: string;
}

export interface RSVP {
  id?: string;
  firstName: string;
  lastName: string;
  attending: boolean;
  guests: number;
  diet: string[];
  arrivalTime?: string;
  reservedGift?: string;
}

export interface DietaryOption {
  key: string;
  label: string;
}

export interface Details {
  date: string;
  theme: string;
  place: string;
}

export interface Floater {
  left: string;
  duration: string;
  delay: string;
  size: string;
  icon: string;
}
