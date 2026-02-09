import React, { useRef } from 'react';
import { IonIcon, IonItemOption, IonItemOptions, useIonToast } from '@ionic/react';
import { trash } from 'ionicons/icons';
import Card from './Card';
import { addAnimal, AnimalRecord, deleteAnimal } from '../../../lib/animalsStorage';
import { useConfirmAction } from '../overlays/ConfirmActionAlert';
import { useUndoToast } from '../overlays/UndoToast';

export interface Animal {
    id: string;
    name: string;
    breed: string;
    weightKg: number;
    birthdate: Date;
    image?: string;
}

interface AnimalCardProps {
    animal: Animal;
    onAnimalsChange: (animals: Animal[]) => void;
}

const getAgeInYears = (birthdate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    return age;
};

const mapRecordsToAnimals = (records: AnimalRecord[]): Animal[] =>
    records.map((record) => ({
        id: record.id,
        name: record.name,
        breed: record.breed,
        weightKg: record.weightKg,
        birthdate: new Date(record.birthdateIso),
        image: record.imageDataUrl
    }));

const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onAnimalsChange }) => {
    const confirmAction = useConfirmAction();
    const presentUndoToast = useUndoToast();
    const [presentToast] = useIonToast();
    const slidingRef = useRef<HTMLIonItemSlidingElement>(null);

    const handleDelete = async () => {
        await slidingRef.current?.close();
        const confirmed = await confirmAction({
            header: 'Delete animal?',
            message: `Are you sure you want to delete ${animal.name}?`,
            confirmText: 'Delete',
            cancelText: 'Cancel'
        });

        if (!confirmed) return;

        const recordForUndo: AnimalRecord = {
            id: animal.id,
            name: animal.name,
            breed: animal.breed,
            weightKg: animal.weightKg,
            birthdateIso: animal.birthdate.toISOString(),
            imageDataUrl: animal.image
        };

        try {
            const updated = await deleteAnimal(animal.id);
            onAnimalsChange(mapRecordsToAnimals(updated));
            await presentUndoToast({
                message: `${animal.name} has been deleted`,
                onUndo: async () => {
                    const restored = await addAnimal(recordForUndo);
                    onAnimalsChange(mapRecordsToAnimals(restored));
                }
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete pet. Please try again.';
            presentToast({ message, duration: 3000, color: 'danger' });
        }
    };

    return (
        <Card
            sliding={true}
            slidingRef={slidingRef}
            slidingOptions={
                <IonItemOptions side="end">
                    <IonItemOption color="danger" expandable onClick={handleDelete}>
                        <IonIcon icon={trash} />
                    </IonItemOption>
                </IonItemOptions>
            }
        >
            {animal.image ? (
                <img
                    src={animal.image}
                    alt={animal.name}
                    className="h-15 w-15 rounded-full object-cover ring-2 ring-[#E6007E]/20 dark:ring-[#E6007E]/30"
                />
            ) : (
                <div className="flex h-15 w-15 items-center justify-center rounded-full
                    bg-gradient-to-br from-[#E6007E]/10 to-[#E6007E]/20
                    dark:from-[#E6007E]/20 dark:to-[#E6007E]/30
                    text-[20px] font-semibold text-[#E6007E]
                    ring-2 ring-[#E6007E]/15 dark:ring-[#E6007E]/25">
                    {animal.name.charAt(0)}
                </div>
            )}
            <div className="flex flex-col">
                <span className="text-[18px] font-semibold text-[#1A1A1A] dark:text-white">
                    {animal.name}
                </span>
                <span className="text-[14px] text-[#737373] dark:text-[#9CA3AF]">
                    {animal.breed} • {getAgeInYears(animal.birthdate)} years old
                </span>
            </div>
        </Card>
    );
};

export default AnimalCard;
