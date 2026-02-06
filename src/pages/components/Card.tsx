import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div
            className={`flex items-center gap-4 rounded-2xl p-4
                bg-white border border-gray-200/70
                shadow-[0px_2px_12px_rgba(0,0,0,0.06)]
                dark:bg-[#162B23] dark:border-white/[0.07]
                dark:shadow-[0px_2px_16px_rgba(0,0,0,0.35)]
                transition-all duration-300 ease-out
                hover:-translate-y-[3px]
                hover:shadow-[0px_8px_28px_rgba(0,0,0,0.1)]
                dark:hover:shadow-[0px_8px_28px_rgba(0,0,0,0.5)]
                ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;
