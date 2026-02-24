
import React from 'react';
import { Package, ShoppingBag, History } from 'lucide-react';

interface InventoryNavigationProps {
    currentView: 'stock' | 'orders' | 'history';
    setCurrentView: (view: 'stock' | 'orders' | 'history') => void;
}

export const InventoryNavigation: React.FC<InventoryNavigationProps> = ({ currentView, setCurrentView }) => {
    return (
        <div className="bg-stone-100 dark:bg-stone-900 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800 grid grid-cols-3 gap-1 mb-6">
            <button
                onClick={() => setCurrentView('stock')}
                className={`
                    flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                    ${currentView === 'stock' 
                        ? 'bg-white dark:bg-stone-800 text-orange-600 shadow-sm ring-1 ring-black/5 dark:ring-white/5' 
                        : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'}
                `}
            >
                <Package className="w-4 h-4" />
                <span className="hidden md:inline">Stok Makanan</span>
                <span className="md:hidden">Stok</span>
            </button>

            <button
                onClick={() => setCurrentView('orders')}
                className={`
                    flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                    ${currentView === 'orders' 
                        ? 'bg-white dark:bg-stone-800 text-orange-600 shadow-sm ring-1 ring-black/5 dark:ring-white/5' 
                        : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'}
                `}
            >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden md:inline">Pesanan Masuk</span>
                <span className="md:hidden">Pesanan</span>
            </button>

            <button
                onClick={() => setCurrentView('history')}
                className={`
                    flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                    ${currentView === 'history' 
                        ? 'bg-white dark:bg-stone-800 text-orange-600 shadow-sm ring-1 ring-black/5 dark:ring-white/5' 
                        : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'}
                `}
            >
                <History className="w-4 h-4" />
                <span className="hidden md:inline">Riwayat Pemesanan</span>
                <span className="md:hidden">Riwayat</span>
            </button>
        </div>
    );
};
