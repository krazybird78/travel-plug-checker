import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

interface Country {
    name: string;
    code: string;
}

interface CountrySelectorProps {
    label: string;
    icon: React.ReactNode;
    value: string;
    options: Country[];
    onChange: (value: string) => void;
    placeholder?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
    label,
    icon,
    value,
    options,
    onChange,
    placeholder = "Search country..."
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="space-y-2" ref={containerRef}>
            <label className="text-[10px] font-black uppercase tracking-widest text-swiss-gray-medium flex items-center gap-2">
                {icon} {label}
            </label>

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`input-premium text-left flex justify-between items-center ${isOpen ? 'ring-2 ring-swiss-red border-transparent' : ''}`}
                >
                    <span className={value ? 'text-swiss-gray-dark font-medium' : 'text-swiss-gray-medium'}>
                        {value || placeholder}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-swiss-gray-medium transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
                        <div className="p-3 border-b border-gray-100 bg-swiss-gray-light">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-swiss-gray-medium" />
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full pl-9 pr-4 py-2 bg-white rounded-lg text-sm border-none outline-none focus:ring-1 focus:ring-swiss-red/50"
                                    placeholder="Type to filter..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <button
                                        key={opt.name}
                                        type="button"
                                        className="w-full px-4 py-3 text-left text-sm hover:bg-swiss-gray-light flex justify-between items-center transition-colors"
                                        onClick={() => {
                                            onChange(opt.name);
                                            setIsOpen(false);
                                            setSearch("");
                                        }}
                                    >
                                        <span className={value === opt.name ? 'font-bold text-swiss-red' : ''}>{opt.name}</span>
                                        {value === opt.name && <Check className="w-4 h-4 text-swiss-red" />}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-6 text-center text-xs text-swiss-gray-medium italic">
                                    No location found.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
