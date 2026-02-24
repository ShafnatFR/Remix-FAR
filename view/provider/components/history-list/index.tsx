
import React, { useState, useEffect } from 'react';
import { History, Star, AlertTriangle, Loader2 } from 'lucide-react';
import { EmptyState } from '../../../common/EmptyState';
import { ProviderOrder } from '../../../../types';
import { HistoryDetail } from '../history-detail';
import { HeaderSection } from './HeaderSection';
import { FilterTabs } from './FilterTabs';
import { HistoryItemCard } from './HistoryItemCard';
import { InventoryNavigation } from '../InventoryNavigation';

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

        {/* LOADING STATE (Only show big loader if parent is loading initial data) */}
        {isParentLoading ? (
            <div className="flex flex-col items-center justify-center py-32 animate-in fade-in">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-stone-200 dark:border-stone-800 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-stone-500 rounded-full animate-spin border-t-transparent"></div>
                </div>
                <p className="text-stone-500 dark:text-stone-400 font-black text-xs uppercase tracking-[0.2em] mt-6 animate-pulse">
                    Memuat Riwayat...
                </p>
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
