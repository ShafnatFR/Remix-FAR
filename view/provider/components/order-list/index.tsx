
import React, { useState, useMemo } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { EmptyState } from '../../../common/EmptyState';
import { ProviderOrder } from '../../../../types';
import { OrderDetail } from '../order-detail';
import { OrderHeader } from './OrderHeader';
import { OrderItemCard } from './OrderItemCard';
import { InventoryNavigation } from '../InventoryNavigation';
import { Skeleton } from '../../../components/Skeleton';

const SkeletonOrderCard = () => (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-stone-200 dark:bg-stone-800"></div>
        <div className="flex justify-between items-start mb-3 pl-2">
            <Skeleton variant="text" className="h-3 w-16" />
            <Skeleton variant="rectangle" className="h-5 w-20 rounded-lg" />
        </div>

        <div className="flex gap-3 mb-4 pl-2">
            <Skeleton variant="rectangle" className="w-16 h-16 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="h-4 w-3/4" />
                <Skeleton variant="text" className="h-3 w-1/2" />
                <Skeleton variant="rectangle" className="h-5 w-24 rounded mt-1" />
            </div>
        </div>

        <div className="space-y-3 border-t border-stone-100 dark:border-stone-800 pt-3 pl-2">
            <div className="flex justify-between items-center">
                <Skeleton variant="text" className="h-3 w-16" />
                <Skeleton variant="text" className="h-3 w-24" />
            </div>
            <div className="flex justify-between items-center">
                <Skeleton variant="text" className="h-3 w-20" />
                <Skeleton variant="text" className="h-3 w-20" />
            </div>
        </div>

        <div className="mt-4 pl-2">
            <Skeleton variant="rectangle" className="h-9 w-full rounded-xl" />
        </div>
    </div>
);

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

            {/* LOADING STATE - Skeleton Loaders */}
            {isParentLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonOrderCard key={i} />
                    ))}
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
