import React from 'react';
import { IonContent, IonPage } from '@ionic/react';

interface Animal {
  name: string;
  breed: string;
  weightKg: number;
  birthdate: Date;
  image?: string;
}

const animals: Animal[] = [
  { name: 'Bello', breed: 'Golden Retriever', weightKg: 28, birthdate: new Date(2020, 2, 15) },
  { name: 'Luna', breed: 'Labrador', weightKg: 24, birthdate: new Date(2022, 7, 4), image: 'https://placehold.co/120x120' },
  { name: 'Milo', breed: 'British Shorthair', weightKg: 6, birthdate: new Date(2021, 0, 22), image: 'https://placehold.co/120x120' },
];

const getAgeInYears = (birthdate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
};

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="bg-[#F2F4F8]">
        <div className="mx-auto max-w-md p-4">
          <div className="flex flex-col gap-3">
            {animals.map((animal, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-2xl bg-white p-4
                           shadow-[0px_4px_12px_rgba(0,0,0,0.05)]"
              >
                {animal.image ? (
                  <img
                    src={animal.image}
                    alt={animal.name}
                    className="h-15 w-15 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-15 w-15 items-center justify-center rounded-full bg-[#E5E7EB] text-[20px] font-semibold text-[#737373]">
                    {animal.name.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-[18px] font-semibold text-[#1A1A1A]">
                    {animal.name}
                  </span>
                  <span className="text-[14px] text-[#737373]">
                    {animal.breed} • {getAgeInYears(animal.birthdate)} years old
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
