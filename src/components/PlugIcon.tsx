import React from 'react';

type PlugType = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O';

interface PlugIconProps {
    type: string;
    className?: string;
    size?: number;
}

export const PlugIcon: React.FC<PlugIconProps> = ({ type, className = "", size = 48 }) => {
    const cleanType = type.trim() as PlugType;

    // Modern silhouetted plug designs - Swiss Minimalist aesthetic
    const getPlugPath = (t: PlugType) => {
        switch (t) {
            case 'A': // US 2-pin
                return (
                    <g fill="currentColor">
                        <rect x="14" y="16" width="4" height="16" rx="1" />
                        <rect x="30" y="16" width="4" height="16" rx="1" />
                    </g>
                );
            case 'B': // US 3-pin
                return (
                    <g fill="currentColor">
                        <rect x="14" y="12" width="4" height="16" rx="1" />
                        <rect x="30" y="12" width="4" height="16" rx="1" />
                        <circle cx="24" cy="34" r="3" />
                    </g>
                );
            case 'C': // Euro 2-pin
                return (
                    <g fill="currentColor">
                        <circle cx="16" cy="24" r="3.5" />
                        <circle cx="32" cy="24" r="3.5" />
                    </g>
                );
            case 'G': // UK 3-pin
                return (
                    <g fill="currentColor">
                        <rect x="21" y="8" width="6" height="12" rx="1" />
                        <rect x="10" y="28" width="10" height="6" rx="1" />
                        <rect x="28" y="28" width="10" height="6" rx="1" />
                    </g>
                );
            case 'I': // AU 3-pin
                return (
                    <g fill="currentColor">
                        <rect x="14" y="14" width="4" height="14" rx="1" transform="rotate(30 16 21)" />
                        <rect x="30" y="14" width="4" height="14" rx="1" transform="rotate(-30 32 21)" />
                        <rect x="22" y="32" width="4" height="12" rx="1" />
                    </g>
                );
            default: // Generic placeholder for others (like Type C but slightly different)
                return (
                    <g fill="currentColor" opacity="0.5">
                        <circle cx="24" cy="24" r="4" />
                        <text x="24" y="44" fontSize="12" textAnchor="middle" fontWeight="bold">{t}</text>
                    </g>
                );
        }
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            className={`inline-block ${className}`}
            aria-label={`Plug Type ${type}`}
        >
            <rect x="2" y="2" width="44" height="44" rx="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            {getPlugPath(cleanType)}
        </svg>
    );
};
