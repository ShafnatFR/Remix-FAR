
import React from 'react';
import { AlertTriangle, Star } from 'lucide-react';

interface QuickActionsProps {
    setActiveTab: (t: string) => void;
    pendingReports: number;
    avgRating: number;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ setActiveTab, pendingReports, avgRating }) => {
    return (
        <div className="grid grid-cols-2 gap-3 md:gap-4">
            <button onClick={() => setActiveTab('inventory-reported')} className="p-4 md:p-5 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-4 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center text-red-600 dark:text-red-200 group-hover:scale-110 transition-transform shrink-0"><AlertTriangle className="w-5 h-5 md:w-6 md:h-6" /></div>
                <div className="min-w-0">
                    <p className="text-[10px] md:text-sm font-medium text-stone-500 line-clamp-1">Laporan Masuk</p>
                    <p className="text-base md:text-xl font-bold text-stone-900 dark:text-white truncate">{pendingReports} Masalah</p>
                </div>
            </button>
            <button onClick={() => setActiveTab('inventory-rated')} className="p-4 md:p-5 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-900/30 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-4 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center text-yellow-600 dark:text-yellow-200 group-hover:scale-110 transition-transform shrink-0"><Star className="w-5 h-5 md:w-6 md:h-6" /></div>
                <div className="min-w-0">
                    <p className="text-[10px] md:text-sm font-medium text-stone-500 line-clamp-1">Rating Toko</p>
                    <p className="text-base md:text-xl font-bold text-stone-900 dark:text-white truncate">{avgRating}/5.0</p>
                </div>
            </button>
        </div>
    );
};
