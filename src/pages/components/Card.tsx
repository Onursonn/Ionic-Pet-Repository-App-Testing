import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div
            className={`flex items-center gap-4 rounded-2xl bg-white p-4 border border-gray-300
                 shadow-[0px_4px_12px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:-translate-y-[5px] ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;
