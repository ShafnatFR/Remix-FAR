
import React, { useMemo, useState } from 'react';
import { Bell } from 'lucide-react'; 
import { DashboardStats } from './components/dashboard';
import { FoodItem, ClaimHistoryItem, UserData } from '../../types';
import { NotificationsPage } from '../common/Notifications';
import { OnboardingTour } from '../common/OnboardingTour';

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
    onNavigate, 
    foodItems = [], 
    claimHistory = [], 
    currentUser,
    onCompleteOnboarding 
}) => {
  const [viewMode, setViewMode] = useState<'main' | 'notifications'>('main');
  const userName = currentUser?.name || 'Restoran Berkah';

  const handleFinishTour = () => {
      if (onCompleteOnboarding) {
          onCompleteOnboarding();
      }
  };

  const { stats, weeklyData } = useMemo(() => {
      const myClaims = claimHistory.filter(h => h.providerName === userName);
      const completedOrders = myClaims.filter(h => h.status === 'completed');
      
      const totalPoints = completedOrders.reduce((acc, curr) => acc + (curr.socialImpact?.totalPoints || 0), 0);
      const co2Saved = completedOrders.reduce((acc, curr) => acc + (curr.socialImpact?.co2Saved || 0), 0);
      
      // REAL RATING CALCULATION
      const ratedOrders = completedOrders.filter(h => h.rating && h.rating > 0);
      const totalRating = ratedOrders.reduce((acc, curr) => acc + (curr.rating || 0), 0);
      const avgRating = ratedOrders.length > 0 ? parseFloat((totalRating / ratedOrders.length).toFixed(1)) : 5.0;

      const pendingReports = myClaims.filter(h => h.isReported).length;
      
      // --- CALCULATE WEEKLY TRENDS (Real Data) ---
      const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const today = new Date();
      const weeklyPoints = [0, 0, 0, 0, 0, 0, 0];
      const weeklyCo2 = [0, 0, 0, 0, 0, 0, 0];

      completedOrders.forEach(order => {
          // Parse date dd/mm/yyyy
          const parts = order.date.split('/');
          if (parts.length === 3) {
              const orderDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
              
              // Check if order is within last 7 days
              const diffTime = Math.abs(today.getTime() - orderDate.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
              
              if (diffDays <= 7) {
                  const dayIndex = orderDate.getDay(); // 0 = Sunday
                  const points = order.socialImpact?.totalPoints || 0;
                  const co2 = order.socialImpact?.co2Saved || 0;
                  
                  weeklyPoints[dayIndex] += points;
                  weeklyCo2[dayIndex] += co2;
              }
          }
      });

      return {
          stats: {
            totalPoints,
            co2Saved: parseFloat(co2Saved.toFixed(2)),
            activeStock: foodItems.length,
            completedOrders: completedOrders.length,
            pendingReports,
            avgRating
          },
          weeklyData: {
              points: weeklyPoints,
              co2: weeklyCo2
          }
      };
  }, [foodItems, claimHistory, userName]);

  if (viewMode === 'notifications') {
      return (
        <NotificationsPage 
            role="provider" 
            onBack={() => setViewMode('main')} 
            claimHistory={claimHistory} 
            inventory={foodItems} // Pass Inventory here for upload success notifs
            userName={userName} 
        />
      );
  }

  return (
    <>
        {/* Render Tour based on isNewUser property from currentUser */}
        {currentUser?.isNewUser && (
            <OnboardingTour role="provider" onFinish={handleFinishTour} />
        )}
        
        <div className="p-6 md:p-8 max-w-5xl mx-auto pb-32">
            <header className="mb-8 flex justify-between items-start">
                <div className="animate-in slide-in-from-left duration-500">
                    <h1 className="text-3xl font-black text-stone-900 dark:text-white tracking-tighter leading-none italic uppercase">Dashboard Donatur</h1>
                    <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest mt-2 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-lg w-fit">Integritas Pangan AI</p>
                </div>
                
                <button 
                    onClick={() => setViewMode('notifications')} 
                    className="relative p-3 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-500 hover:text-orange-600 transition-all shadow-sm group active:scale-95"
                >
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-600 border-2 border-white rounded-full animate-pulse"></span>
                </button>
            </header>
            
            <DashboardStats 
                setActiveTab={onNavigate} 
                stats={stats} 
                weeklyPoints={weeklyData.points}
                weeklyCo2={weeklyData.co2}
            />
        </div>
    </>
  );
};
