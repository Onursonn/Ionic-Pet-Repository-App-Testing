import { IonCard } from '@ionic/react';
import React from 'react';
import './cards.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <IonCard className={`${className}`}>
            {children}
        </IonCard>
    );
};

export default Card;
