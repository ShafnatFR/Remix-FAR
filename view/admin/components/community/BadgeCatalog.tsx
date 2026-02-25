import React, { useState } from 'react';
import { Gift, PlusCircle, Target, Search, Filter, RefreshCcw } from 'lucide-react';
import { Badge } from '../../../../types';
import { ACHIEVEMENT_BADGES } from '../../../../constants';
import { BadgeModal } from './BadgeModal';
import { db } from '../../../../services/db';

interface BadgeCatalogProps {
    badges?: Badge[];
    setBadges?: React.Dispatch<React.SetStateAction<Badge[]>>;
    onRefresh?: () => void;
}

export const BadgeCatalog: React.FC<BadgeCatalogProps> = ({ badges: propBadges, setBadges: propSetBadges, onRefresh }) => {
    // Use prop state if provided, otherwise fall back to local state
    const [localBadges, setLocalBadges] = useState<Badge[]>(ACHIEVEMENT_BADGES);
    const badges = propBadges ?? localBadges;
    const setBadges = propSetBadges ?? setLocalBadges;

    const [showBadgeModal, setShowBadgeModal] = useState(false);
    const [badgeForm, setBadgeForm] = useState<Badge>({ id: '', name: '', icon: '🏆', image: '', description: '', role: 'all', minPoints: 0, awardedTo: 0 });
    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'provider' | 'volunteer' | 'receiver'>('all');

    const handleRefresh = async () => {
        if (!onRefresh) return;
        setIsRefreshing(true);
        await onRefresh();
        // Artificial delay for better UX
        setTimeout(() => setIsRefreshing(false), 800);
    };

    const handleSaveBadge = async (newBadge: Badge) => {
        setIsSaving(true);
        const badgeData = newBadge.id ? newBadge : { ...newBadge, id: `badge-${Date.now()}` };
        try {
            await db.upsertBadge(badgeData);
        } catch (error) {
            console.warn("Failed to persist badge to DB, saving locally:", error);
        }
        if (newBadge.id) {
            setBadges(prev => prev.map(b => b.id === newBadge.id ? badgeData : b));
        } else {
            setBadges(prev => [badgeData, ...prev]);
        }
        setShowBadgeModal(false);
        setIsSaving(false);
    };

    const handleDeleteBadge = async (id: string) => {
        setIsSaving(true);
        try {
            await db.deleteBadge(id);
        } catch (error) {
            console.warn("Failed to delete badge from DB:", error);
        }
        setBadges(prev => prev.filter(b => b.id !== id));
        setShowBadgeModal(false);
        setIsSaving(false);
    };

    // Filtering Logic
    const filteredBadges = badges.filter(badge => {
        const matchesSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            badge.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            badge.minPoints.toString().includes(searchTerm);

        const matchesRole = roleFilter === 'all' || badge.role === roleFilter || badge.role === 'all';

        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-4 animate-in slide-in-from-right duration-400">
            {/* Header Badges */}
            <div className="bg-[#2D1B14] rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 text-white relative shadow-2xl overflow-hidden border border-white/5">
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                {/* Title & Add Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 relative z-10 gap-4">
                    <div className="space-y-0.5">
                        <h3 className="font-black text-xl flex items-center gap-2.5 text-white italic tracking-tighter uppercase leading-none">
                            <Gift className="w-5 h-5 text-orange-500" /> Katalog Badges
                        </h3>
                        <p className="text-stone-400 text-[10px] font-medium">Apresiasi khusus untuk pahlawan penyelamat pangan.</p>
                    </div>
                    <button
                        onClick={() => { setBadgeForm({ id: '', name: '', icon: '🏆', image: '', description: '', role: 'all', minPoints: 0, awardedTo: 0 }); setShowBadgeModal(true); }}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 border border-orange-400/20"
                    >
                        <PlusCircle className="w-4 h-4" /> TAMBAH BADGE
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Search Input and Refresh Button row */}
                    <div className="flex gap-2">
                        <div className="relative group flex-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                                <Search className="w-4 h-4 text-stone-500 group-focus-within:text-orange-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari nama, deskripsi, atau poin..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 focus:border-orange-500/50 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-white placeholder-stone-600 focus:outline-none transition-all backdrop-blur-sm h-12"
                            />
                        </div>
                        {onRefresh && (
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className={`w-12 h-12 flex items-center justify-center bg-black/40 border border-white/5 rounded-xl transition-all backdrop-blur-sm group/refresh ${isRefreshing ? 'opacity-50' : 'hover:border-orange-500/50'
                                    }`}
                                title="Refresh Data"
                            >
                                <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-500' : 'text-stone-500 group-hover/refresh:text-orange-500'}`} />
                            </button>
                        )}
                    </div>

                    {/* Role Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar sm:justify-end">
                        <Filter className="w-3.5 h-3.5 text-stone-500 shrink-0 mr-1" />
                        {(['all', 'provider', 'volunteer', 'receiver'] as const).map((role) => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border h-10 ${roleFilter === role
                                        ? 'bg-orange-500/10 border-orange-500 text-orange-500 shadow-lg shadow-orange-500/10'
                                        : 'bg-white/5 border-white/5 text-stone-500 hover:text-stone-300'
                                    }`}
                            >
                                {role === 'all' ? 'SEMUA' : role}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Badge Grid */}
                {filteredBadges.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                        {filteredBadges.map(badge => (
                            <div
                                key={badge.id}
                                onClick={() => { setBadgeForm(badge); setShowBadgeModal(true); }}
                                className="bg-[#1F120D] rounded-2xl w-full border border-white/5 hover:border-orange-500/30 transition-all duration-300 group flex flex-col cursor-pointer shadow-lg overflow-hidden"
                            >
                                {/* Badge Item UI */}
                                <div className="h-28 w-full relative overflow-hidden">
                                    {badge.image ? (
                                        <>
                                            <img src={badge.image} alt="bg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#1F120D] via-[#1F120D]/30 to-transparent"></div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900"></div>
                                    )}
                                    <div className="absolute top-2.5 left-2.5">
                                        <span className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg backdrop-blur-md border border-white/10 ${badge.role === 'provider' ? 'bg-blue-600 text-white' :
                                            badge.role === 'volunteer' ? 'bg-green-600 text-white' :
                                                badge.role === 'receiver' ? 'bg-amber-500 text-white' : 'bg-stone-600 text-white'
                                            }`}>
                                            {badge.role}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-[#2D1B14] border-2 border-[#1F120D] flex items-center justify-center text-2xl shadow-xl z-20 group-hover:scale-110 transition-transform">
                                        {badge.icon}
                                    </div>
                                </div>
                                <div className="flex-1 pt-5 pb-4 px-4 text-center flex flex-col justify-between items-center gap-2">
                                    <div className="space-y-0.5">
                                        <h4 className="font-black text-white text-xs leading-tight uppercase italic tracking-tight">{badge.name}</h4>
                                        <p className="text-xs text-stone-500 font-medium line-clamp-1 leading-relaxed">{badge.description}</p>
                                    </div>
                                    <div className="w-full">
                                        <div className="flex items-center justify-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-orange-400 bg-orange-950/30 border border-orange-500/20 py-1.5 rounded-lg w-full group-hover:bg-orange-500 group-hover:text-white transition-all">
                                            <Target className="w-2.5 h-2.5" /> {badge.minPoints} PTS
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="relative z-10 py-16 text-center bg-black/20 rounded-2xl border border-dashed border-white/10">
                        <Search className="w-10 h-10 text-stone-700 mx-auto mb-4 opacity-20" />
                        <p className="text-stone-500 font-bold text-sm tracking-tight italic uppercase">Badge tidak ditemukan</p>
                        <button
                            onClick={() => { setSearchTerm(''); setRoleFilter('all'); }}
                            className="mt-4 text-[9px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-400 transition-colors"
                        >
                            Reset Filter
                        </button>
                    </div>
                )}
            </div>

            {showBadgeModal && (
                <BadgeModal
                    badge={badgeForm}
                    onClose={() => setShowBadgeModal(false)}
                    onSave={handleSaveBadge}
                    onDelete={handleDeleteBadge}
                />
            )}
        </div>
    );
};
