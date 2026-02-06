import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import AnimalCard, { Animal } from './components/AnimalCard';
import AddPetModal from './components/AddPetModal';
import {
  AnimalRecord,
  seedAnimalsIfEmpty
} from '../lib/animalsStorage';


const Home: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

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
      {/* ── Navigation Bar ── */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="evo-toolbar">
          <div className="mx-auto flex w-full max-w-5xl items-center px-5">
            <div className="flex items-center gap-3">
              {/* Placeholder logo */}
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#E6007E] to-[#FF4DA6] shadow-lg shadow-[#E6007E]/25">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <span className="text-[18px] font-bold tracking-tight text-white">
                Evovell
              </span>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      {/* ── Main Content ── */}
      <IonContent className="evo-content">
        <div className="mx-auto max-w-5xl px-5 pt-8 pb-28">
          {/* Page heading */}
          <div className="anim-heading mb-7">
            <h1 className="text-[28px] font-bold tracking-tight text-[#143D30] dark:text-white sm:text-[32px]">
              My Animals
            </h1>
            <p className="mt-1.5 text-[15px] font-normal text-[#6B7280] dark:text-[#9CA3AF]">
              Your companion overview
            </p>
          </div>

          {/* Animal cards grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {animals.map((animal, index) => (
              <div
                key={index}
                className="anim-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <AnimalCard animal={animal} />
              </div>
            ))}
          </div>
        </div>
      </IonContent>

      {/* ── Floating Action Button ── */}
      <button
        onClick={() => setShowAddModal(true)}
        className="anim-fab fixed bottom-6 right-6 z-50 flex h-14 w-14 cursor-pointer
          items-center justify-center rounded-full!
          bg-linear-to-br from-[#E6007E] to-[#FF4DA6]
          text-white shadow-xl shadow-[#E6007E]/30
          transition-all duration-200 ease-out
          hover:scale-105 hover:shadow-2xl hover:shadow-[#E6007E]/40
          active:scale-95
          md:bottom-8 md:right-8 md:h-[60px] md:w-[60px]
          lg:bottom-10 lg:right-10"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="md:h-7 md:w-7"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* ── Add Pet Modal ── */}
      <AddPetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdded={(updated) => setAnimals(updated)}
      />
    </IonPage>
  );
};

export default Home;
