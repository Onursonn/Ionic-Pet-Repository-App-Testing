import React from 'react';
import Card from './Card';

export interface Animal {
    name: string;
    breed: string;
    weightKg: number;
    birthdate: Date;
    image?: string;
}

interface AnimalCardProps {
    animal: Animal;
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

const AnimalCard: React.FC<AnimalCardProps> = ({ animal }) => {
    return (
        <Card>
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
