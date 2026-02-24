
import React, { useState, useMemo } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { EmptyState } from '../../../common/EmptyState';
import { ProviderOrder } from '../../../../types';
import { OrderDetail } from '../order-detail';
import { OrderHeader } from './OrderHeader';
import { OrderItemCard } from './OrderItemCard';
import { InventoryNavigation } from '../InventoryNavigation';

interface OrderListProps {
    orders?: ProviderOrder[];
    currentView: 'stock' | 'orders' | 'history';
    setCurrentView: (view: 'stock' | 'orders' | 'history') => void;
    onUpdateStatus?: (claimId: string, status: 'completed' | 'active') => void;
    isLoading?: boolean; // Prop baru
    onRefresh?: () => void;
}

export const OrderList: React.FC<OrderListProps> = ({ orders = [], currentView, setCurrentView, onUpdateStatus, isLoading: isParentLoading, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredOrders = useMemo(() => orders.filter(order => 
    order.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.receiver.name.toLowerCase().includes(searchQuery.toLowerCase())
  ), [orders, searchQuery]);

  // Temukan objek pesanan terbaru berdasarkan ID yang dipilih
  const currentSelectedOrder = useMemo(() => 
    orders.find(o => o.id === selectedOrderId) || null
  , [orders, selectedOrderId]);

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

  if (currentSelectedOrder) {
      return (
        <OrderDetail 
            order={currentSelectedOrder} 
            onBack={() => setSelectedOrderId(null)} 
            // Handle completion callback: 'completed' moves to history, 'active' just marks as scanned
            onComplete={(status) => {
                if (onUpdateStatus) {
                    onUpdateStatus(currentSelectedOrder.id, status || 'active');
                }
                // Close detail view immediately
                setSelectedOrderId(null);
            }}
        />
      );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in pb-32">
        <OrderHeader 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            onRefresh={handleRefresh}
            isLoading={showLoading}
        />

        <InventoryNavigation currentView={currentView} setCurrentView={setCurrentView} />

        {/* LOADING STATE (Only show big loader if parent is loading initial data, not on refresh) */}
        {isParentLoading ? (
            <div className="flex flex-col items-center justify-center py-32 animate-in fade-in">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 dark:border-stone-800 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                </div>
                <p className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-[0.2em] mt-6 animate-pulse">
                    Memeriksa Pesanan...
                </p>
            </div>
        ) : filteredOrders.length === 0 ? (
            <EmptyState 
                icon={ShoppingBag} 
                title="Tidak Ada Pesanan Aktif" 
                description="Semua donasi Anda belum ada yang mengklaim atau sudah selesai didistribusikan."
            />
        ) : (
            <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${isRefreshing ? 'opacity-50 pointer-events-none' : ''} transition-opacity duration-300`}>
                {filteredOrders.map(order => (
                    <OrderItemCard 
                        key={order.id} 
                        order={order} 
                        onClick={() => setSelectedOrderId(order.id)} 
                    />
                ))}
            </div>
        )}
    </div>
  );
};
