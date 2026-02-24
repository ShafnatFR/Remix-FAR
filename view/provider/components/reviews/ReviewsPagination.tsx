
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReviewsPaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    indexOfFirstItem: number;
    indexOfLastItem: number;
    totalItems: number;
}

export const ReviewsPagination: React.FC<ReviewsPaginationProps> = ({
    currentPage,
    totalPages,
    setCurrentPage,
    indexOfFirstItem,
    indexOfLastItem,
    totalItems
}) => {
    return (
        <div className="col-span-full flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800 mt-2">
            <span className="text-xs text-stone-500 dark:text-stone-400">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems}
            </span>
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-stone-600 dark:text-stone-300"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-lg">
                    {currentPage} / {totalPages}
                </span>
                <button 
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-stone-600 dark:text-stone-300"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
