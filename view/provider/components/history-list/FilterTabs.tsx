
import React from 'react';
import { Star, AlertTriangle } from 'lucide-react';

interface FilterTabsProps {
    filterType: 'all' | 'rated' | 'reported';
    setFilterType: (t: 'all' | 'rated' | 'reported') => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ filterType, setFilterType }) => (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button 
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${filterType === 'all' ? 'bg-stone-800 text-white border-stone-800' : 'bg-white dark:bg-stone-900 text-stone-500 border-stone-200 dark:border-stone-800 hover:bg-stone-100'}`}
        >
            Semua
        </button>
        <button 
            onClick={() => setFilterType('rated')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-1.5 border ${filterType === 'rated' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 shadow-sm' : 'bg-white dark:bg-stone-900 text-stone-500 border-stone-200 dark:border-stone-800 hover:bg-yellow-50 hover:text-yellow-600'}`}
        >
            <Star className={`w-3 h-3 ${filterType === 'rated' ? 'fill-current' : ''}`} /> Ulasan Masuk
        </button>
        <button 
            onClick={() => setFilterType('reported')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-1.5 border ${filterType === 'reported' ? 'bg-red-100 text-red-700 border-red-200 shadow-sm' : 'bg-white dark:bg-stone-900 text-stone-500 border-stone-200 dark:border-stone-800 hover:bg-red-50 hover:text-red-600'}`}
        >
            <AlertTriangle className="w-3 h-3" /> Laporan Masuk
        </button>
    </div>
);
