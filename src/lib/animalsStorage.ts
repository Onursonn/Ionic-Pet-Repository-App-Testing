import { Storage } from '@ionic/storage';
import { convertImageUrlToBase64 } from './imageUtils';

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

/**
 * Converts image URLs in seed data to base64 data URLs
 * This allows images to be stored offline in IndexedDB
 */
const convertSeedImagesToBase64 = async (
  seedData: AnimalRecord[]
): Promise<AnimalRecord[]> => {
  const converted = await Promise.all(
    seedData.map(async (animal) => {
      // If imageDataUrl is already a base64 data URL, keep it
      if (animal.imageDataUrl?.startsWith('data:image/')) {
        return animal;
      }

      // If it's a URL, convert it to base64
      if (animal.imageDataUrl && animal.imageDataUrl.startsWith('http')) {
        try {
          const base64 = await convertImageUrlToBase64(animal.imageDataUrl);
          return { ...animal, imageDataUrl: base64 };
        } catch (error) {
          console.warn(`Failed to convert image for ${animal.name}:`, error);
          return { ...animal, imageDataUrl: undefined };
        }
      }

      return animal;
    })
  );

  return converted;
};

export const seedAnimalsIfEmpty = async (): Promise<AnimalRecord[]> => {
  const existing = await getAnimals();
  if (existing.length === 0) {
    // Convert image URLs to base64 before saving
    const seedWithBase64 = await convertSeedImagesToBase64(seed);
    await saveAnimals(seedWithBase64);
    return seedWithBase64;
  }
  return existing;
};

const seed: AnimalRecord[] = [
  {
    id: 'seed-bello2-001',
    name: 'Bello2',
    breed: 'Golden Retriever',
    weightKg: 28,
    birthdateIso: new Date(2020, 2, 15).toISOString(),

    imageDataUrl:
      'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=400&fit=crop',
  },
  {
    id: 'seed-luna-002',
    name: 'Luna',
    breed: 'Labrador',
    weightKg: 24,
    birthdateIso: new Date(2022, 7, 4).toISOString(),

    imageDataUrl:
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop',
  },
  {
    id: 'seed-milo-003',
    name: 'Milo',
    breed: 'British Shorthair',
    weightKg: 6,
    birthdateIso: new Date(2021, 0, 22).toISOString(),

    imageDataUrl:
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
  },
];
