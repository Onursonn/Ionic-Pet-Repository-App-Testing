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
  useIonToast,
  IonFab,
  IonFabButton,
} from '@ionic/react';
import { closeOutline, cameraOutline, closeCircleOutline, add } from 'ionicons/icons';
import { addAnimal, AnimalRecord } from '../../lib/animalsStorage';
import { convertFileToBase64 } from '../../lib/imageUtils';
import { Animal } from './cards/AnimalCard';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (animals: Animal[]) => void;
}

const parseWeight = (value: string): number | null => {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const parsed = parseFloat(trimmed);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
};

const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose, onAdded }) => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');
  const [birthdate, setBirthdate] = useState<string>(new Date().toISOString());
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [presentToast] = useIonToast();
  const modal = useRef<HTMLIonModalElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parsedWeight = parseWeight(weight);
  const isValid = name.trim() !== '' && breed.trim() !== '' && parsedWeight !== null;

  const resetForm = () => {
    setName('');
    setBreed('');
    setWeight('');
    setBirthdate(new Date().toISOString());
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      presentToast({ message: 'Please select a valid image file.', duration: 3000, color: 'warning' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      presentToast({ message: 'Image size must be less than 2 MB.', duration: 3000, color: 'warning' });
      return;
    }

    try {
      const dataUrl = await convertFileToBase64(file);
      setImagePreview(dataUrl);
    } catch (error) {
      console.error('Error reading image:', error);
      presentToast({ message: 'Failed to load image. Please try again.', duration: 3000, color: 'danger' });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!isValid || saving || parsedWeight === null) return;

    setSaving(true);
    try {
      const record: AnimalRecord = {
        id: crypto.randomUUID(),
        name: name.trim(),
        breed: breed.trim(),
        weightKg: parsedWeight,
        birthdateIso: birthdate,
        imageDataUrl: imagePreview || undefined,
      };

      const updated = await addAnimal(record);

      const mapped: Animal[] = updated.map((r) => ({
        id: r.id,
        name: r.name,
        breed: r.breed,
        weightKg: r.weightKg,
        birthdate: new Date(r.birthdateIso),
        image: r.imageDataUrl,
      }));

      onAdded(mapped);
      resetForm();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save pet. Please try again.';
      presentToast({ message, duration: 3000, color: 'danger' });
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
          {/* Avatar placeholder with image upload */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div
                onClick={handleImageClick}
                className="relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-full
                  bg-linear-to-br from-[#E6007E]/10 to-[#E6007E]/20
                  dark:from-[#E6007E]/20 dark:to-[#E6007E]/30
                  ring-2 ring-[#E6007E]/15 dark:ring-[#E6007E]/25
                  transition-all duration-200 hover:ring-[#E6007E]/30 dark:hover:ring-[#E6007E]/40
                  overflow-hidden group"
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Pet preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/30">
                      <IonIcon
                        icon={cameraOutline}
                        className="text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        style={{ fontSize: '24px' }}
                      />
                    </div>
                  </>
                ) : name.trim() ? (
                  <span className="text-[28px] font-semibold text-[#E6007E]">
                    {name.trim().charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <IonIcon
                    icon={cameraOutline}
                    className="text-[#E6007E] transition-opacity duration-200 group-hover:opacity-70"
                    style={{ fontSize: '28px' }}
                  />
                )}
              </div>
              {imagePreview && (
                <button
                  onClick={handleImageRemove}
                  className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full
                    bg-red-500 text-white shadow-lg transition-all duration-200
                    hover:bg-red-600 hover:scale-110 active:scale-95"
                  aria-label="Remove image"
                >
                  <IonIcon icon={closeCircleOutline} className="text-sm" />
                </button>
              )}
              {!imagePreview && (
                <IonFab
                  className="absolute -bottom-2 -right-2"
                  style={{ position: 'absolute' }}
                >
                  <IonFabButton
                    size="small"
                    onClick={handleImageClick}
                    aria-label="Foto hinzufügen"
                  >
                    <IonIcon icon={add}></IonIcon>
                  </IonFabButton>
                </IonFab>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                aria-label="Select pet image"
              />
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
