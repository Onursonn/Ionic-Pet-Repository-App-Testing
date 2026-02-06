import { Storage } from '@ionic/storage';

const storage = new Storage({ name: 'animalDb' });
let ready: Promise<Storage> | null = null;

const getStorage = async (): Promise<Storage> => {
  if (!ready) {
    ready = storage.create();
  }
  return storage;
};

export type AnimalRecord = {
  id: string;
  name: string;
  breed: string;
  weightKg: number;
  birthdateIso: string;
  imageDataUrl?: string;
};

const KEY = 'animals';

export const getAnimals = async (): Promise<AnimalRecord[]> => {
  const store = await getStorage();
  return (await store.get(KEY)) ?? [];
};

export const saveAnimals = async (animals: AnimalRecord[]): Promise<void> => {
  const store = await getStorage();
  await store.set(KEY, animals);
};

export const addAnimal = async (
  animal: AnimalRecord
): Promise<AnimalRecord[]> => {
  const current = await getAnimals();
  const next = [...current, animal];
  await saveAnimals(next);
  return next;
};

export const seedAnimalsIfEmpty = async (): Promise<AnimalRecord[]> => {
  const existing = await getAnimals();
  if (existing.length === 0) {
    await saveAnimals(seed);
    return seed;
  }
  return existing;
};

const seed: AnimalRecord[] = [
  {
    id: crypto.randomUUID(),
    name: 'Bello2',
    breed: 'Golden Retriever',
    weightKg: 28,
    birthdateIso: new Date(2020, 2, 15).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Luna',
    breed: 'Labrador',
    weightKg: 24,
    birthdateIso: new Date(2022, 7, 4).toISOString(),
    imageDataUrl: 'https://placehold.co/120x120',
  },
  {
    id: crypto.randomUUID(),
    name: 'Milo',
    breed: 'British Shorthair',
    weightKg: 6,
    birthdateIso: new Date(2021, 0, 22).toISOString(),
    imageDataUrl: 'https://placehold.co/120x120',
  },
];
