
import React, { useState } from 'react';
import { Users, Award } from 'lucide-react';
import { UserData, FoodItem, ClaimHistoryItem, Badge } from '../../../../types';
import { UserList } from './UserList';
import { BadgeCatalog } from './BadgeCatalog';

interface CommunityProps {
  users?: UserData[];
  setUsers?: React.Dispatch<React.SetStateAction<UserData[]>>;
  inventory?: FoodItem[];
  claims?: ClaimHistoryItem[];
  badges?: Badge[];
  setBadges?: React.Dispatch<React.SetStateAction<Badge[]>>;
  onRefresh?: () => void;
}

export const Community: React.FC<CommunityProps> = ({
  users = [],
  setUsers,
  inventory = [],
  claims = [],
  badges,
  setBadges,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'badges'>('users');
  const pendingCount = users.filter(u => u.status === 'pending').length;

  return (
    <div className="animate-in fade-in space-y-4 pb-20 px-1">

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-1.5 bg-[#120D0A] p-1 rounded-xl border border-white/5 w-fit">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'users' ? 'bg-orange-500 text-white shadow-lg' : 'text-stone-500 hover:text-stone-300'}`}
        >
          <Users className="w-3.5 h-3.5" /> Pengguna
          {pendingCount > 0 && activeTab !== 'users' && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-[#120D0A]"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'badges' ? 'bg-orange-500 text-white shadow-lg' : 'text-stone-500 hover:text-stone-300'}`}
        >
          <Award className="w-3.5 h-3.5" /> Badges
        </button>
      </div>

      {activeTab === 'users' && setUsers ? (
        <UserList
          users={users}
          setUsers={setUsers}
          inventory={inventory}
          claims={claims}
          pendingCount={pendingCount}
        />
      ) : activeTab === 'badges' ? (
        <BadgeCatalog badges={badges} setBadges={setBadges} onRefresh={onRefresh} />
      ) : null}
    </div>
  );
};
