
import React from 'react';
import { LayoutGrid, StretchHorizontal } from 'lucide-react';

interface ReviewsHeaderProps {
    count: number;
    layoutMode: 'list' | 'grid';
    setLayoutMode: (mode: 'list' | 'grid') => void;
}

export const ReviewsHeader: React.FC<ReviewsHeaderProps> = ({ count, layoutMode, setLayoutMode }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Ulasan Penerima ({count})</h2>
            
            <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl w-full md:w-auto border border-stone-200 dark:border-stone-700 self-start md:self-auto">
                <button 
                    onClick={() => setLayoutMode('grid')}
                    className={`flex-1 md:w-14 h-10 rounded-xl flex items-center justify-center transition-all ${layoutMode === 'grid' ? 'bg-white dark:bg-stone-700 text-orange-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <LayoutGrid className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => setLayoutMode('list')}
                    className={`flex-1 md:w-14 h-10 rounded-xl flex items-center justify-center transition-all ${layoutMode === 'list' ? 'bg-white dark:bg-stone-700 text-orange-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <StretchHorizontal className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
