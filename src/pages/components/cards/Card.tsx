import { IonCard, IonItem, IonItemSliding } from '@ionic/react';
import React from 'react';
import './cards.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    sliding?: boolean;
    slidingOptions?: React.ReactNode;
    slidingRef?: React.Ref<HTMLIonItemSlidingElement>;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    sliding = false,
    slidingOptions,
    slidingRef
}) => {
    const itemContent = (
        <IonItem className={`card-item ${className}`} lines="none">
            <IonCard>
                {children}
            </IonCard>
        </IonItem>
    );

    if (sliding) {
        return (
            <IonItemSliding ref={slidingRef}>
                {itemContent}
                {slidingOptions}
            </IonItemSliding>
        );
    }

    return itemContent;
};

export default Card;
