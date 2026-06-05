import { redis } from '../lib/upstashRedis';

type RsvpData = {
  firstName: string;
  lastName: string;
  firstNameLower: string;
  lastNameLower: string;
  attending: boolean;
  guests: number;
  diet: string[];
  otherDietNotes: string;
  estimateArrivalTime: string;
  reservedGifts: string[];
  createdAt: string;
  updatedAt: string;
};

type RsvpRecord = RsvpData & { id: string };

function normalizeNamePart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function rsvpId(firstName: string, lastName: string) {
  return `rsvp:${normalizeNamePart(firstName)}:${normalizeNamePart(lastName)}`;
}

function mapRsvpDoc(data: RsvpRecord) {
  return {
    id: data.id,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    attending: Boolean(data.attending),
    guests: Number(data.guests || 0),
    dietaryRestrictions: (data.diet || []).map((key: string) => ({ key })),
    otherDietNotes: data.otherDietNotes || '',
    estimateArrivalTime: data.estimateArrivalTime || '',
    reservedGifts: data.reservedGifts || [],
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
  };
}

async function fetchRsvpDocs() {
  const keys = await redis.keys('rsvp:*');
  if (keys.length === 0) return [];

  const records = await Promise.all(keys.map((key) => redis.get<RsvpData>(key)));
  return records
    .map((record, index) => (record ? { id: keys[index], ...record } : null))
    .filter((record): record is RsvpRecord => Boolean(record));
}

async function fetchRsvpDoc(id: string) {
  const record = await redis.get<RsvpData>(id);
  return record ? { id, ...record } : null;
}

export async function getAllRSVPs() {
  const docs = await fetchRsvpDocs();
  return docs.map(mapRsvpDoc);
}

export async function lookupRSVP(firstName: string, lastName?: string) {
  const fnLower = firstName.trim().toLowerCase();
  
  if (lastName) {
    const lnLower = lastName.trim().toLowerCase();
    const doc = await fetchRsvpDoc(rsvpId(firstName, lastName));
    if (doc?.firstNameLower === fnLower && doc.lastNameLower === lnLower) {
      return { type: 'exact', data: mapRsvpDoc(doc) };
    }
  }

  const docs = await fetchRsvpDocs();
  const matches = docs
    .filter((doc) => doc.firstNameLower === fnLower)
    .map(mapRsvpDoc);

  return { type: 'matches', data: matches };
}

export async function submitRSVP(data: {
  firstName: string;
  lastName: string;
  attending: boolean;
  guests: number;
  diet: string[];
  otherDiet?: string;
  estimateArrivalTime?: string;
}) {
  const fn = data.firstName.trim();
  const ln = data.lastName.trim();
  const guests = data.attending ? Math.max(1, data.guests) : 0;
  const id = rsvpId(fn, ln);
  const existingDoc = await fetchRsvpDoc(id);
  const existing = existingDoc;
  const now = new Date().toISOString();

  const rsvpData: RsvpData = {
    firstName: fn,
    lastName: ln,
    firstNameLower: fn.toLowerCase(),
    lastNameLower: ln.toLowerCase(),
    attending: data.attending,
    guests,
    diet: data.diet || [],
    otherDietNotes: data.otherDiet || '',
    estimateArrivalTime: data.attending ? data.estimateArrivalTime || '' : '',
    reservedGifts: existing?.reservedGifts || [],
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  await redis.set(id, rsvpData);

  const finalDoc = await fetchRsvpDoc(id);
  return mapRsvpDoc(finalDoc || { id, ...rsvpData });
}

export async function deleteRSVP(id: string) {
  const doc = await fetchRsvpDoc(id);
  if (!doc) return null;

  const data = mapRsvpDoc(doc);
  await redis.del(id);
  return data;
}

export async function getRSVPById(id: string) {
  const doc = await fetchRsvpDoc(id);
  return doc ? mapRsvpDoc(doc) : null;
}

export async function getRSVPsWithReservedGift(giftId: string) {
  const docs = await fetchRsvpDocs();
  return docs
    .filter((doc) => doc.reservedGifts?.includes(giftId))
    .map(mapRsvpDoc);
}

export async function updateReservedGifts(id: string, reservedGifts: string[]) {
  const doc = await fetchRsvpDoc(id);
  if (!doc) return null;

  const nextData = {
    ...doc,
    reservedGifts,
    updatedAt: new Date().toISOString(),
  };
  const { id: _id, ...record } = nextData;

  await redis.set(id, record);

  return mapRsvpDoc(nextData);
}
