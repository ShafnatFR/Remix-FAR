
import React, { useState, useEffect } from 'react';
import { History, Star, AlertTriangle, Loader2 } from 'lucide-react';
import { EmptyState } from '../../../common/EmptyState';
import { ProviderOrder } from '../../../../types';
import { HistoryDetail } from '../history-detail';
import { HeaderSection } from './HeaderSection';
import { FilterTabs } from './FilterTabs';
import { HistoryItemCard } from './HistoryItemCard';
import { InventoryNavigation } from '../InventoryNavigation';
import { Skeleton } from '../../../components/Skeleton';

const SkeletonHistoryCard = () => (
    <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4 relative overflow-hidden">
        <Skeleton variant="rectangle" className="w-20 h-20 rounded-xl shrink-0" />

        <div className="flex-1 min-w-0 space-y-2">
            <div className="flex justify-between items-start">
                <Skeleton variant="text" className="h-4 w-1/2" />
                <div className="hidden sm:flex flex-col items-end gap-1">
                    <Skeleton variant="text" className="h-3 w-16" />
                    <Skeleton variant="text" className="h-2 w-12" />
                </div>
            </div>
            <Skeleton variant="text" className="h-3 w-3/4" />

            <div className="flex flex-wrap items-center gap-2 pt-1">
                <Skeleton variant="rectangle" className="h-6 w-24 rounded-lg" />
                <Skeleton variant="rectangle" className="h-6 w-20 rounded-lg" />
                <Skeleton variant="rectangle" className="h-6 w-20 rounded-lg" />
            </div>
        </div>

        <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-full">
            <Skeleton variant="circle" className="w-4 h-4" />
        </div>
    </div>
);

interface HistoryListProps {
    history?: ProviderOrder[];
    currentView: 'stock' | 'orders' | 'history';
    setCurrentView: (view: 'stock' | 'orders' | 'history') => void;
    targetOrderId?: string | null;
    clearTargetOrder?: () => void;
    initialFilter?: 'all' | 'rated' | 'reported' | null;
    isLoading?: boolean; // Prop baru
    onRefresh?: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
    history = [],
    currentView,
    setCurrentView,
    targetOrderId,
    clearTargetOrder,
    initialFilter,
    isLoading: isParentLoading,
    onRefresh
}) => {
    const [selectedHistory, setSelectedHistory] = useState<ProviderOrder | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'rated' | 'reported'>('all');
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (initialFilter) {
            setFilterType(initialFilter);
        }
    }, [initialFilter]);

    useEffect(() => {
        if (targetOrderId) {
            const found = history.find(h => h.id === targetOrderId || `FAR-${h.id}` === targetOrderId || `REP-${h.id}` === targetOrderId);
            if (found) {
                setSelectedHistory(found);
            }
            if (clearTargetOrder) clearTargetOrder();
        }
    }, [targetOrderId, history]);

    const handleRefresh = async () => {
        if (!onRefresh) return;
        setIsRefreshing(true);
        try {
            await onRefresh();
        } catch (error) {
            console.error("Refresh failed", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const showLoading = isParentLoading || isRefreshing;

    const filteredHistory = history.filter(item => {
        const matchesSearch = item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.receiver.name.toLowerCase().includes(searchQuery.toLowerCase());

        if (filterType === 'rated') {
            return matchesSearch && !!item.rating;
        }
        if (filterType === 'reported') {
            return matchesSearch && !!item.report;
        }

        return matchesSearch;
    });

    if (selectedHistory) {
        return <HistoryDetail item={selectedHistory} onBack={() => setSelectedHistory(null)} />;
    }

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in pb-32">
            <HeaderSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onRefresh={handleRefresh}
                isLoading={showLoading}
            />

            <InventoryNavigation currentView={currentView} setCurrentView={setCurrentView} />

            <FilterTabs filterType={filterType} setFilterType={setFilterType} />

            {/* LOADING STATE - Skeleton Loaders */}
            {isParentLoading ? (
                <div className="space-y-3">
                    {[...Array(8)].map((_, i) => (
                        <SkeletonHistoryCard key={i} />
                    ))}
                </div>
            ) : filteredHistory.length === 0 ? (
                <EmptyState
                    icon={filterType === 'reported' ? AlertTriangle : filterType === 'rated' ? Star : History}
                    title={filterType === 'reported' ? "Tidak Ada Laporan" : filterType === 'rated' ? "Belum Ada Ulasan" : "Belum Ada Riwayat"}
                    description={
                        filterType === 'reported' ? "Hebat! Belum ada laporan masalah pada donasi Anda." :
                            filterType === 'rated' ? "Belum ada pesanan yang mendapatkan ulasan." :
                                "Riwayat donasi yang selesai akan muncul di sini."
                    }
                />
            ) : (
                <div className={`space-y-3 ${isRefreshing ? 'opacity-50 pointer-events-none' : ''} transition-opacity duration-300`}>
                    {filteredHistory.map((item) => (
                        <HistoryItemCard
                            key={item.id}
                            item={item}
                            onClick={() => setSelectedHistory(item)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
