
import React, { useState } from 'react';
import { FoodItem, ClaimHistoryItem, UserData, ProviderOrder } from '../../../types';
import { StockManager } from './inventory/StockManager';
import { OrderList } from './order-list';
import { HistoryList } from './history-list';

interface InventoryManagerProps {
    foodItems: FoodItem[];
    setFoodItems: React.Dispatch<React.SetStateAction<FoodItem[]>>;
    claimHistory: ClaimHistoryItem[];
    setClaimHistory: React.Dispatch<React.SetStateAction<ClaimHistoryItem[]>>;
    targetOrderId: string | null;
    clearTargetOrder: () => void;
    initialFilter: 'all' | 'rated' | 'reported' | null;
    onUpdateStatus: (claimId: string, status: 'completed' | 'active') => void;
    currentUser: UserData | null;
    onRefresh?: () => void;
    onNavigate: (view: string) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
    foodItems,
    setFoodItems,
    claimHistory,
    setClaimHistory,
    targetOrderId,
    clearTargetOrder,
    initialFilter,
    onUpdateStatus,
    currentUser,
    onRefresh,
    onNavigate
}) => {
    const [currentView, setCurrentView] = useState<'stock' | 'orders' | 'history'>('stock');
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Auto-switch to history if initial filter is provided
    React.useEffect(() => {
        if (initialFilter) {
            setCurrentView('history');
        }
    }, [initialFilter]);

    // Mappers
    const mapClaimToOrder = (claim: ClaimHistoryItem): ProviderOrder => ({
        id: claim.id,
        uniqueCode: claim.uniqueCode,
        foodName: claim.foodName,
        description: claim.description || 'Tidak ada deskripsi',
        quantity: claim.claimedQuantity || '1 Porsi',
        imageUrl: claim.imageUrl,
        status: claim.status === 'active' ? 'claimed' : claim.status as any,
        isScanned: claim.isScanned,
        deliveryMethod: claim.deliveryMethod || 'pickup',
        receiver: {
            name: claim.receiverName || 'Penerima',
            avatar: (claim.receiverName || 'U').charAt(0).toUpperCase(),
            phone: claim.receiverPhone || '',
            address: (claim as any).receiverLocation?.address || 'Lokasi tidak tersedia'
        },
        courier: claim.courierName ? {
            name: claim.courierName,
            avatar: claim.courierName.charAt(0),
            phone: '08123456789'
        } : undefined,
        timestamps: {
            claimedAt: claim.date,
            completedAt: claim.status === 'completed' ? claim.date : undefined
        },
        rating: claim.rating ? {
            stars: claim.rating,
            comment: claim.review || '',
            mediaUrls: claim.reviewMedia
        } : undefined,
        report: claim.isReported ? {
            issue: claim.reportReason || 'Masalah',
            description: claim.reportDescription || '',
            evidenceUrl: claim.reportEvidence,
            isUrgent: true
        } : undefined,
        impact: claim.socialImpact ? {
            points: claim.socialImpact.totalPoints,
            co2: claim.socialImpact.co2Saved
        } : {
            // Fallback default jika data impact belum ada
            points: 50,
            co2: 2.5
        }
    });

    const orders = claimHistory.filter(c => c.status === 'active').map(mapClaimToOrder);
    const history = claimHistory.filter(c => c.status !== 'active').map(mapClaimToOrder);

    // Wrapper function to handle view switching with animation
    const handleSwitchView = (view: 'stock' | 'orders' | 'history') => {
        if (view === currentView) return;

        // 1. Immediately switch view to update Header/Nav
        setCurrentView(view);

        // 2. Trigger loading state for content area
        setIsTransitioning(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // 3. Artificial delay for smooth splash effect
        setTimeout(() => {
            setIsTransitioning(false);
        }, 800);
    };

    if (currentView === 'stock') {
        return <StockManager
            foodItems={foodItems}
            setFoodItems={setFoodItems}
            currentView={currentView}
            setCurrentView={handleSwitchView}
            currentUser={currentUser}
            isLoading={isTransitioning} // Pass loading state
            onRefresh={onRefresh} // Pass refresh
            onNavigate={onNavigate}
        />;
    }

    if (currentView === 'orders') {
        return <OrderList
            orders={orders}
            currentView={currentView}
            setCurrentView={handleSwitchView}
            onUpdateStatus={onUpdateStatus}
            isLoading={isTransitioning} // Pass loading state
            onRefresh={onRefresh} // Pass refresh
        />;
    }

    return <HistoryList
        history={history}
        currentView={currentView}
        setCurrentView={handleSwitchView}
        targetOrderId={targetOrderId}
        clearTargetOrder={clearTargetOrder}
        initialFilter={initialFilter}
        isLoading={isTransitioning} // Pass loading state
        onRefresh={onRefresh} // Pass refresh
    />;
};
