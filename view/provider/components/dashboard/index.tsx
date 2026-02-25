
import React, { useState, useMemo } from 'react';
import { SOCIAL_SYSTEM } from '../../../../constants';
import { RankCard } from './RankCard';
import { QuickActions } from './QuickActions';
import { StatsGrid } from './StatsGrid';
import { RankDetailsModal } from './RankDetailsModal';
import { TimeRangeSelector, TimeRange } from './TimeRangeSelector';

interface DashboardStatsProps {
  setActiveTab: (t: any) => void;
  stats: {
    totalPoints: number;
    co2Saved: number;
    activeStock: number;
    completedOrders: number;
    pendingReports: number;
    avgRating: number;
  };
  weeklyPoints: number[]; // Receive real data
  weeklyCo2: number[];    // Receive real data
  weeklyLabels: string[]; // Dynamic labels for time ranges
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  setActiveTab,
  stats,
  weeklyPoints,
  weeklyCo2,
  weeklyLabels,
  timeRange,
  onTimeRangeChange
}) => {
  const [showRankDetails, setShowRankDetails] = useState(false);

  const providerSystem = SOCIAL_SYSTEM.provider;
  const currentPoints = stats.totalPoints;

  // Logic to determine current and next rank
  const tiers = providerSystem.tiers;
  const currentRank = [...tiers].reverse().find(t => currentPoints >= t.minPoints) || tiers[0];
  const nextRank = tiers.find(t => t.minPoints > currentPoints);

  const progress = useMemo(() => {
    if (!nextRank) return 100;
    const range = nextRank.minPoints - currentRank.minPoints;
    const earned = currentPoints - currentRank.minPoints;
    return Math.min((earned / range) * 100, 100);
  }, [currentPoints, currentRank, nextRank]);

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in">

      <RankCard
        currentRank={currentRank}
        nextRank={nextRank}
        currentPoints={currentPoints}
        progress={progress}
        onShowDetails={() => setShowRankDetails(true)}
      />

      <QuickActions
        setActiveTab={setActiveTab}
        pendingReports={stats.pendingReports}
        avgRating={stats.avgRating}
      />

      <div className="flex justify-center md:justify-start py-2">
        <TimeRangeSelector currentRange={timeRange} onChange={onTimeRangeChange} />
      </div>

      <StatsGrid
        stats={{ totalPoints: currentPoints, co2Saved: stats.co2Saved }}
        weeklyPoints={weeklyPoints}
        weeklyCo2={weeklyCo2}
        weeklyLabels={weeklyLabels}
        providerSystem={providerSystem}
      />

      {showRankDetails && (
        <RankDetailsModal
          onClose={() => setShowRankDetails(false)}
          providerSystem={providerSystem}
          currentRank={currentRank}
          currentPoints={currentPoints}
        />
      )}
    </div>
  );
};
