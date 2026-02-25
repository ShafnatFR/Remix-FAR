
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { DashboardStats } from './components/dashboard/index';
import { TimeRangeSelector, TimeRange } from './components/dashboard/TimeRangeSelector';
import { FoodItem, ClaimHistoryItem, UserData } from '../../types';
import { OnboardingTour } from '../common/OnboardingTour';
import { useProviderStats } from './hooks/useProviderStats';

interface ProviderIndexProps {
    onOpenNotifications: () => void;
    isSubNavOpen: boolean;
    onToggleSubNav: () => void;
    onNavigate: (view: string) => void;
    foodItems?: FoodItem[];
    claimHistory?: ClaimHistoryItem[];
    currentUser?: UserData | null;
    onCompleteOnboarding?: () => void; // New Prop
}

export const ProviderIndex: React.FC<ProviderIndexProps> = ({
    onOpenNotifications,
    onNavigate,
    foodItems = [],
    claimHistory = [],
    currentUser,
    onCompleteOnboarding
}) => {
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');
    const userName = currentUser?.name || 'Restoran Berkah';

    const handleFinishTour = () => {
        if (onCompleteOnboarding) {
            onCompleteOnboarding();
        }
    };

    const { stats, weeklyData } = useProviderStats(
        foodItems,
        claimHistory,
        currentUser,
        userName,
        timeRange
    );


    return (
        <>
            {/* Render Tour based on isNewUser property from currentUser */}
            {currentUser?.isNewUser && (
                <OnboardingTour role="provider" onFinish={handleFinishTour} />
            )}

            <div className="p-6 md:p-8 max-w-5xl mx-auto pb-32">
                <header className="mb-8 p-1 flex items-center justify-between">
                    <div className="animate-in slide-in-from-left duration-500 flex-1">
                        <h1 className="text-3xl font-black text-stone-900 dark:text-white tracking-tighter leading-none italic uppercase text-center md:text-left">Dashboard Donatur</h1>
                        <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest mt-2 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-lg w-fit mx-auto md:mx-0">Integritas Pangan AI</p>
                    </div>

                    <button
                        onClick={onOpenNotifications}
                        className="p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-all active:scale-90 group relative"
                    >
                        <Bell className="w-6 h-6 text-stone-600 dark:text-stone-400 group-hover:text-orange-600 group-hover:rotate-12 transition-all" />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-600 border-2 border-white dark:border-stone-900 rounded-full"></span>
                    </button>
                </header>

                <DashboardStats
                    setActiveTab={onNavigate}
                    stats={stats}
                    weeklyPoints={weeklyData.points}
                    weeklyCo2={weeklyData.co2}
                    weeklyLabels={weeklyData.labels}
                    timeRange={timeRange}
                    onTimeRangeChange={setTimeRange}
                />
            </div>
        </>
    );
};
