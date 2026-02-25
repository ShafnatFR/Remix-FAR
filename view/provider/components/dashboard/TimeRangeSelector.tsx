
import React from 'react';
import { Calendar } from 'lucide-react';

export type TimeRange = '7d' | '30d' | 'all';

interface TimeRangeSelectorProps {
    currentRange: TimeRange;
    onChange: (range: TimeRange) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ currentRange, onChange }) => {
    const options: { label: string; value: TimeRange }[] = [
        { label: '7 Hari', value: '7d' },
        { label: '30 Hari', value: '30d' },
        { label: 'Semua', value: 'all' },
    ];

    return (
        <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl w-fit">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${currentRange === opt.value
                            ? 'bg-white dark:bg-stone-700 text-orange-600 shadow-sm'
                            : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                        }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};
