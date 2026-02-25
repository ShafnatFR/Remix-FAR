
import { useMemo } from 'react';
import { FoodItem, ClaimHistoryItem, UserData } from '../../../types';
import { parseClaimDate } from '../../../utils/transformers';
import { TimeRange } from '../components/dashboard/TimeRangeSelector';

export const useProviderStats = (
    foodItems: FoodItem[],
    claimHistory: ClaimHistoryItem[],
    currentUser: UserData | null,
    userName: string,
    timeRange: TimeRange
) => {
    return useMemo(() => {
        const myProviderId = currentUser?.id ? String(currentUser.id).trim() : '';
        const myClaims = claimHistory.filter(h => {
            if (h.providerId && myProviderId) {
                return String(h.providerId).trim() === myProviderId;
            }
            return h.providerName === userName;
        });

        const allOrders = myClaims;
        const today = new Date();
        const todayClean = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const filteredOrders = allOrders.filter(order => {
            if (timeRange === 'all') return true;
            const orderDate = parseClaimDate(order.date);
            if (!orderDate) return false;
            const diffDays = Math.floor((todayClean.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
            if (timeRange === '7d') return diffDays >= 0 && diffDays < 7;
            if (timeRange === '30d') return diffDays >= 0 && diffDays < 30;
            return true;
        });

        const totalPoints = filteredOrders.reduce((acc, curr) => acc + (Number(curr.socialImpact?.totalPoints) || 0), 0);
        const co2Saved = filteredOrders.reduce((acc, curr) => acc + (Number(curr.socialImpact?.co2Saved) || 0), 0);

        const completedOrders = filteredOrders.filter(h => h.status === 'completed');
        const ratedOrders = completedOrders.filter(h => h.rating && h.rating > 0);
        const totalRating = ratedOrders.reduce((acc, curr) => acc + (curr.rating || 0), 0);
        const avgRating = ratedOrders.length > 0 ? parseFloat((totalRating / ratedOrders.length).toFixed(1)) : 5.0;

        const pendingReports = myClaims.filter(h => h.isReported && h.status !== 'completed').length;

        const labels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const weeklyPoints = [0, 0, 0, 0, 0, 0, 0];
        const weeklyCo2 = [0, 0, 0, 0, 0, 0, 0];

        allOrders.forEach(order => {
            const orderDate = parseClaimDate(order.date);
            if (!orderDate) return;
            const diffDays = Math.floor((todayClean.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && diffDays < 7) {
                const dayIndex = orderDate.getDay();
                weeklyPoints[dayIndex] += Number(order.socialImpact?.totalPoints || 0);
                weeklyCo2[dayIndex] += Number(order.socialImpact?.co2Saved || 0);
            }
        });

        return {
            stats: {
                totalPoints,
                co2Saved: parseFloat(co2Saved.toFixed(2)),
                activeStock: foodItems.length,
                completedOrders: filteredOrders.length,
                pendingReports,
                avgRating
            },
            weeklyData: {
                points: weeklyPoints,
                co2: weeklyCo2,
                labels
            }
        };
    }, [foodItems, claimHistory, currentUser, userName, timeRange]);
};
