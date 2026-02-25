import { useState, useEffect, useMemo } from 'react';
import { FoodItem, ClaimHistoryItem, UserData } from '../../../types';
import { TimeRange } from '../components/dashboard/TimeRangeSelector';

interface ProviderStats {
    totalPoints: number;
    co2Saved: number;
    activeStock: number;
    completedOrders: number;
    pendingReports: number;
    avgRating: number;
}

interface WeeklyData {
    points: number[];
    co2: number[];
    labels: string[];
}

export const useProviderStats = (foodItems: FoodItem[], claimHistory: ClaimHistoryItem[], currentUser: UserData | null | undefined, userName: string, timeRange: TimeRange) => {
    const [stats, setStats] = useState<ProviderStats>({
        totalPoints: 0,
        co2Saved: 0,
        activeStock: 0,
        completedOrders: 0,
        pendingReports: 0,
        avgRating: 5.0,
    });
    const [weeklyData, setWeeklyData] = useState<WeeklyData>({
        points: [],
        co2: [],
        labels: [],
    });

    useEffect(() => {
        const calculateStats = () => {
            const myClaims = claimHistory.filter(h => h.providerName === userName);
            const completedOrders = myClaims.filter(h => h.status === 'completed');

            const totalPoints = completedOrders.reduce((acc, curr) => acc + (curr.socialImpact?.totalPoints || 0), 0);
            const co2Saved = completedOrders.reduce((acc, curr) => acc + (curr.socialImpact?.co2Saved || 0), 0);

            const ratedOrders = completedOrders.filter(h => h.rating && h.rating > 0);
            const totalRating = ratedOrders.reduce((acc, curr) => acc + (curr.rating || 0), 0);
            const avgRating = ratedOrders.length > 0 ? parseFloat((totalRating / ratedOrders.length).toFixed(1)) : 5.0;

            const pendingReports = myClaims.filter(h => h.isReported).length;

            setStats({
                totalPoints,
                co2Saved: parseFloat(co2Saved.toFixed(2)),
                activeStock: foodItems.length,
                completedOrders: completedOrders.length,
                pendingReports,
                avgRating,
            });

            // --- CALCULATE WEEKLY TRENDS (Real Data) ---
            const today = new Date();
            let labels: string[] = [];
            let dataPoints: number[] = [];
            let dataCo2: number[] = [];

            if (timeRange === '7d') {
                labels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
                dataPoints = Array(7).fill(0);
                dataCo2 = Array(7).fill(0);

                completedOrders.forEach(order => {
                    const orderDate = new Date(order.date.split('/').reverse().join('-')); // Assuming DD/MM/YYYY
                    const diffTime = Math.abs(today.getTime() - orderDate.getTime());
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays < 7) {
                        const dayIndex = (orderDate.getDay() + 7 - today.getDay()) % 7; // 0 = today, 6 = 6 days ago
                        dataPoints[dayIndex] += order.socialImpact?.totalPoints || 0;
                        dataCo2[dayIndex] += order.socialImpact?.co2Saved || 0;
                    }
                });

                // Rotate data so today is at the end
                const todayIndex = today.getDay();
                dataPoints = [...dataPoints.slice(todayIndex + 1), ...dataPoints.slice(0, todayIndex + 1)];
                dataCo2 = [...dataCo2.slice(todayIndex + 1), ...dataCo2.slice(0, todayIndex + 1)];
                labels = [...labels.slice(todayIndex + 1), ...labels.slice(0, todayIndex + 1)];

            } else if (timeRange === '30d') {
                labels = Array(5).fill('').map((_, i) => `Minggu ${i + 1}`); // Simplified for 5 weeks
                dataPoints = Array(5).fill(0);
                dataCo2 = Array(5).fill(0);

                completedOrders.forEach(order => {
                    const orderDate = new Date(order.date.split('/').reverse().join('-'));
                    const diffTime = Math.abs(today.getTime() - orderDate.getTime());
                    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

                    if (diffWeeks < 5) {
                        dataPoints[4 - diffWeeks] += order.socialImpact?.totalPoints || 0;
                        dataCo2[4 - diffWeeks] += order.socialImpact?.co2Saved || 0;
                    }
                });
            } else if (timeRange === '1y') {
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                dataPoints = Array(12).fill(0);
                dataCo2 = Array(12).fill(0);

                completedOrders.forEach(order => {
                    const orderDate = new Date(order.date.split('/').reverse().join('-'));
                    const diffTime = Math.abs(today.getTime() - orderDate.getTime());
                    const diffMonths = today.getMonth() - orderDate.getMonth() + (12 * (today.getFullYear() - orderDate.getFullYear()));

                    if (diffMonths >= 0 && diffMonths < 12) {
                        dataPoints[orderDate.getMonth()] += order.socialImpact?.totalPoints || 0;
                        dataCo2[orderDate.getMonth()] += order.socialImpact?.co2Saved || 0;
                    }
                });
            }

            setWeeklyData({
                points: dataPoints,
                co2: dataCo2,
                labels: labels,
            });
        };

        calculateStats();
    }, [foodItems, claimHistory, currentUser, userName, timeRange]);

    return { stats, weeklyData };
};
