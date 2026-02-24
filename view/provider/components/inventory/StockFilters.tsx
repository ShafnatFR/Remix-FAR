
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../../components/Input';

interface StockFiltersProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
}

export const StockFilters: React.FC<StockFiltersProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="mb-4">
            <Input 
                label="" 
                placeholder="Cari menu makanan..." 
                icon={<Search className="w-5 h-5 text-stone-400" />} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 border-stone-200 dark:border-stone-800 shadow-sm bg-white dark:bg-stone-900"
            />
        </div>
    );
};
