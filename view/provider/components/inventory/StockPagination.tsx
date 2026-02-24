
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StockPaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    indexOfFirstItem: number;
    indexOfLastItem: number;
    totalItems: number;
}

export const StockPagination: React.FC<StockPaginationProps> = ({ currentPage, totalPages, setCurrentPage, indexOfFirstItem, indexOfLastItem, totalItems }) => {
    return (
        <div className="flex items-center justify-between pt-8 border-t border-stone-200 dark:border-stone-800">
            <span className="text-xs font-medium text-stone-400">
                Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} dari {totalItems} Produk
            </span>
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                    disabled={currentPage === 1}
                    className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 transition-colors disabled:opacity-30"
                >
                    <ChevronLeft className="w-5 h-5 text-stone-600" />
                </button>
                <div className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-black">
                    Halaman {currentPage} / {totalPages}
                </div>
                <button 
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 transition-colors disabled:opacity-30"
                >
                    <ChevronRight className="w-5 h-5 text-stone-600" />
                </button>
            </div>
        </div>
    );
};
