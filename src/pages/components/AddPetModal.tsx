import React, { useRef, useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonDatetime,
  IonButtons,
  IonIcon,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { addAnimal, AnimalRecord } from '../../lib/animalsStorage';
import { Animal } from './AnimalCard';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (animals: Animal[]) => void;
}

const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose, onAdded }) => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');
  const [birthdate, setBirthdate] = useState<string>(new Date().toISOString());
  const [saving, setSaving] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  const isValid = name.trim() !== '' && breed.trim() !== '' && weight.trim() !== '';

  const resetForm = () => {
    setName('');
    setBreed('');
    setWeight('');
    setBirthdate(new Date().toISOString());
  };

  const handleSave = async () => {
    if (!isValid || saving) return;

    setSaving(true);
    try {
      const record: AnimalRecord = {
        id: crypto.randomUUID(),
        name: name.trim(),
        breed: breed.trim(),
        weightKg: parseFloat(weight),
        birthdateIso: birthdate,
      };

      const updated = await addAnimal(record);

      const mapped: Animal[] = updated.map((r) => ({
        name: r.name,
        breed: r.breed,
        weightKg: r.weightKg,
        birthdate: new Date(r.birthdateIso),
        image: r.imageDataUrl,
      }));

      onAdded(mapped);
      resetForm();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleDismiss = () => {
    resetForm();
    onClose();
  };

  return (
    <IonModal
      ref={modal}
      isOpen={isOpen}
      onDidDismiss={handleDismiss}
      breakpoints={[0, 1]}
      initialBreakpoint={1}
      className="add-pet-modal"
    >
      {/* ── Header ── */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="add-pet-toolbar">
          <IonButtons slot="start">
            <IonButton onClick={handleDismiss} className="add-pet-close-btn">
              <IonIcon icon={closeOutline} className="text-[22px]" />
            </IonButton>
          </IonButtons>
          <IonTitle className="add-pet-title">New Pet</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={handleSave}
              disabled={!isValid || saving}
              strong
              className="add-pet-save-btn"
            >
              {saving ? 'Saving...' : 'Save'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* ── Form Content ── */}
      <IonContent className="add-pet-content">
        <div className="mx-auto max-w-lg px-5 pt-6 pb-10">
          {/* Avatar placeholder */}
          <div className="mb-8 flex justify-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full
                bg-linear-to-br from-[#E6007E]/10 to-[#E6007E]/20
                dark:from-[#E6007E]/20 dark:to-[#E6007E]/30
                ring-2 ring-[#E6007E]/15 dark:ring-[#E6007E]/25"
            >
              {name.trim() ? (
                <span className="text-[28px] font-semibold text-[#E6007E]">
                  {name.trim().charAt(0).toUpperCase()}
                </span>
              ) : (
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E6007E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
            </div>
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-4">
            {/* Name */}
            <div className="add-pet-field">
              <label className="add-pet-label">Name</label>
              <IonInput
                value={name}
                placeholder="e.g. Bello"
                onIonInput={(e) => setName(e.detail.value ?? '')}
                className="add-pet-input"
                autocapitalize="words"
              />
            </div>

            {/* Breed */}
            <div className="add-pet-field">
              <label className="add-pet-label">Breed</label>
              <IonInput
                value={breed}
                placeholder="e.g. Golden Retriever"
                onIonInput={(e) => setBreed(e.detail.value ?? '')}
                className="add-pet-input"
                autocapitalize="words"
              />
            </div>

            {/* Weight */}
            <div className="add-pet-field">
              <label className="add-pet-label">Weight (kg)</label>
              <IonInput
                value={weight}
                type="number"
                placeholder="e.g. 12"
                onIonInput={(e) => setWeight(e.detail.value ?? '')}
                className="add-pet-input"
                min="0"
                step="0.1"
              />
            </div>

            {/* Birthdate */}
            <div className="add-pet-field">
              <label className="add-pet-label">Birthdate</label>
              <IonDatetime
                value={birthdate}
                presentation="date"
                preferWheel={true}
                max={new Date().toISOString()}
                size="cover"
                onIonChange={(e) => setBirthdate(e.detail.value as string)}
                className="add-pet-datetime"
              />
            </div>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default AddPetModal;
