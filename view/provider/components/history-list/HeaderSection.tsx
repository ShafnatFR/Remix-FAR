
import React from 'react';
import { History, Search, RefreshCw, Loader2 } from 'lucide-react';
import { Input } from '../../../components/Input';

interface HeaderSectionProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    onRefresh?: () => void;
    isLoading?: boolean;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ searchQuery, setSearchQuery, onRefresh, isLoading }) => (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
                <History className="w-6 h-6 text-orange-500" /> Riwayat Donasi
            </h2>
            <p className="text-sm text-stone-500">Daftar donasi yang telah selesai didistribusikan.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <div className="flex-1 md:w-64">
                <Input 
                    label="" 
                    placeholder="Cari riwayat..." 
                    icon={<Search className="w-4 h-4" />} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10"
                />
            </div>
            {onRefresh && (
                <button
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="w-10 h-10 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-xl flex items-center justify-center hover:bg-stone-50 dark:hover:bg-stone-700 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Refresh"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                </button>
            )}
        </div>
    </div>
);
