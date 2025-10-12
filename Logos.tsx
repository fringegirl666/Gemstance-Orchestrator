
import React from 'react';

type LogoProps = {
  className?: string;
};

export const GeminiLogo: React.FC<LogoProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.69018 9.38002C6.88018 9.38002 8.64018 7.62002 8.64018 5.43002C8.64018 3.24002 6.88018 1.48002 4.69018 1.48002C2.50018 1.48002 0.740176 3.24002 0.740176 5.43002C0.740176 7.62002 2.50018 9.38002 4.69018 9.38002Z" fill="#8E8FFA"/>
        <path d="M12.0002 22.52C14.1902 22.52 15.9502 20.76 15.9502 18.57C15.9502 16.38 14.1902 14.62 12.0002 14.62C9.81018 14.62 8.05018 16.38 8.05018 18.57C8.05018 20.76 9.81018 22.52 12.0002 22.52Z" fill="#8E8FFA"/>
        <path d="M18.5702 9.38002C20.7602 9.38002 22.5202 7.62002 22.5202 5.43002C22.5202 3.24002 20.7602 1.48002 18.5702 1.48002C16.3802 1.48002 14.6202 3.24002 14.6202 5.43002C14.6202 7.62002 16.3802 9.38002 18.5702 9.38002Z" fill="#8E8FFA"/>
    </svg>
);

export const ClaudeLogo: React.FC<LogoProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#D97757"/>
    </svg>
);

export const OpenAILogo: React.FC<LogoProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.7262 12.0002C21.7262 17.0602 18.2862 21.2702 13.5062 22.3002C12.9262 22.4202 12.4462 22.4802 12.0062 22.5002C5.38623 22.5002 0.00622559 17.6502 0.00622559 12.0002C0.00622559 6.35021 5.38623 1.50021 12.0062 1.50021C18.6262 1.50021 21.7262 6.94021 21.7262 12.0002Z" fill="#10A37F"/>
        <path d="M12.0062 22.5C12.4462 22.48 12.9262 22.42 13.5062 22.3C18.2862 21.27 21.7262 17.06 21.7262 12C21.7262 6.94 18.6262 1.5 12.0062 1.5C5.38623 1.5 0.00622559 6.35 0.00622559 12C0.00622559 17.65 5.38623 22.5 12.0062 22.5Z" fill="#10A37F"/>
        <path d="M12.0062 22.5C5.38623 22.5 0.00622559 17.65 0.00622559 12C0.00622559 6.35 5.38623 1.5 12.0062 1.5C18.6262 1.5 21.7262 6.94 21.7262 12C21.7262 17.06 18.2862 21.27 13.5062 22.3C12.9262 22.42 12.4462 22.48 12.0062 22.5Z" fill="url(#paint0_linear_1_2)"/>
        <defs>
            <linearGradient id="paint0_linear_1_2" x1="0.00622559" y1="1.5" x2="21.7262" y2="22.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#19C37D"/>
            <stop offset="1" stopColor="#10A37F"/>
            </linearGradient>
        </defs>
    </svg>
);


export const PerplexityLogo: React.FC<LogoProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="white"/>
        <path d="M12 6C8.69 6 6 8.69 6 12H8C8 9.79 9.79 8 12 8V6Z" fill="white"/>
    </svg>
);
