
import React, { useState } from 'react';
import { CheckSquare, Square, Trash2, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { SavedItem } from '../../../types';
import { Button } from '../../components/Button';
import { EmptyState } from '../../common/EmptyState';

interface SavedItemsProps {
    items: SavedItem[];
    onDelete: (ids: Set<string>) => void;
    onDetail?: (item: SavedItem) => void;
}

export const SavedItems: React.FC<SavedItemsProps> = ({ items, onDelete, onDetail }) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [filter, setFilter] = useState<'all' | 'available' | 'claimed' | 'expired'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
        setSelectedIds(newSet);
    };

    const filteredItems = items.filter(i => filter === 'all' || i.status === filter);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    return (
        <div className="p-6 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen animate-in fade-in">
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    {['all', 'available', 'claimed', 'expired'].map(f => (
                        <button key={f} onClick={() => setFilter(f as any)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${filter === f ? 'bg-orange-500 text-white' : 'bg-white dark:bg-stone-900 border dark:border-stone-800'}`}>{f}</button>
                    ))}
                </div>
                {items.length > 0 && (
                    <button onClick={() => { setIsSelectionMode(!isSelectionMode); setSelectedIds(new Set()); }} className="text-orange-500 text-sm font-medium">{isSelectionMode ? "Batal" : "Pilih"}</button>
                )}
            </div>

            {isSelectionMode && selectedIds.size > 0 && (
                <button onClick={() => { onDelete(selectedIds); setIsSelectionMode(false); }} className="mb-4 text-red-500 text-sm font-bold flex items-center gap-1 w-full justify-end"><Trash2 className="w-4 h-4" /> Hapus ({selectedIds.size})</button>
            )}

            <div className="space-y-4">
                {currentItems.length === 0 ? (
                    <EmptyState 
                        icon={Heart} 
                        title="Tidak Ada Item" 
                        description="Belum ada makanan yang disimpan."
                    />
                ) : (
                    currentItems.map(item => (
                        <div key={item.id} onClick={() => isSelectionMode && toggleSelection(item.id)} className={`flex gap-4 p-4 bg-white dark:bg-stone-900 rounded-xl border relative overflow-hidden ${selectedIds.has(item.id) ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-stone-200 dark:border-stone-800'}`}>
                            {item.status === 'claimed' && <div className="absolute inset-0 bg-stone-100/50 dark:bg-stone-900/70 z-10 flex items-center justify-center"><span className="bg-stone-800 text-white px-3 py-1 rounded-lg text-xs font-bold -rotate-12">Diklaim</span></div>}
                            {item.status === 'expired' && <div className="absolute inset-0 bg-red-100/50 dark:bg-red-900/70 z-10 flex items-center justify-center"><span className="bg-red-800 text-white px-3 py-1 rounded-lg text-xs font-bold -rotate-12">Expired</span></div>}
                            {isSelectionMode && <div className="flex items-center z-20">{selectedIds.has(item.id) ? <CheckSquare className="w-5 h-5 text-orange-500" /> : <Square className="w-5 h-5 text-stone-400" />}</div>}
                            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-stone-200" />
                            <div className="flex-1">
                                <h4 className="font-bold text-stone-900 dark:text-white">{item.name}</h4>
                                <p className="text-sm text-stone-500">{item.provider}</p>
                                {!isSelectionMode && item.status === 'available' && (
                                    <Button variant="outline" className="mt-2 w-auto h-8 text-xs px-4 rounded-full border-stone-300 dark:border-stone-700" onClick={(e) => { e.stopPropagation(); onDetail?.(item); }}>Detail Makanan</Button>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {filteredItems.length > itemsPerPage && (
                    <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length}
                        </span>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 disabled:opacity-30"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-bold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-lg">
                                {currentPage} / {totalPages}
                            </span>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 disabled:opacity-30"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
