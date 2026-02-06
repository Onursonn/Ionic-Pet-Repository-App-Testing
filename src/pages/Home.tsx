import React, { useEffect, useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import AnimalCard, { Animal } from './components/AnimalCard';
import {
  AnimalRecord,
  seedAnimalsIfEmpty
} from '../lib/animalsStorage';



const Home: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    const load = async () => {
      const records: AnimalRecord[] = await seedAnimalsIfEmpty();
      const mapped: Animal[] = records.map((record) => ({
        name: record.name,
        breed: record.breed,
        weightKg: record.weightKg,
        birthdate: new Date(record.birthdateIso),
        image: record.imageDataUrl
      }));
      setAnimals(mapped);
    };

    load();
  }, []);

  return (
    <IonPage>
      <IonContent className="bg-[#F2F4F8]">
        <div className="mx-auto max-w-md p-4">
          <div className="flex flex-col gap-3">
            {animals.map((animal, index) => (
              <AnimalCard key={index} animal={animal} />
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
