
import React from 'react';
import { Target, Trophy, X } from 'lucide-react';
import { SocialSystemConfig, SocialTier } from '../../../../types';

interface RankDetailsModalProps {
    onClose: () => void;
    providerSystem: SocialSystemConfig;
    currentRank: SocialTier;
    currentPoints: number;
}

export const RankDetailsModal: React.FC<RankDetailsModalProps> = ({ onClose, providerSystem, currentRank, currentPoints }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] w-full max-w-lg max-h-[85vh] flex flex-col relative shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
                <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-950 backdrop-blur-sm z-10">
                    <div>
                        <h3 className="text-lg font-black text-stone-900 dark:text-white uppercase tracking-tighter italic">Syarat & Jenjang Karir</h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Tingkatkan reputasi & poin sosial anda</p>
                    </div>
                    <button onClick={onClose} className="p-2.5 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            
                <div className="flex-1 overflow-y-auto p-0 scrollbar-hide">
                    <div className="p-6 border-b border-stone-100 dark:border-stone-800 bg-orange-50/50 dark:bg-orange-900/10">
                        <h4 className="font-black text-stone-900 dark:text-white text-sm mb-4 flex items-center gap-2 uppercase tracking-widest"><Target className="w-4 h-4 text-orange-500" /> Cara Mendapatkan Poin</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {providerSystem.rules.map((rule, idx) => (
                                <div key={idx} className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-100 dark:border-stone-700 shadow-sm flex justify-between items-center group hover:border-orange-200 transition-colors">
                                    <div className="flex-1">
                                        <span className="text-sm font-bold text-stone-800 dark:text-stone-200 block mb-1">{rule.action}</span>
                                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-tight">{rule.description}</p>
                                    </div>
                                    <div className="ml-4">
                                        <span className="text-sm font-black text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full">+{rule.points}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <h4 className="font-black text-stone-900 dark:text-white text-sm flex items-center gap-2 uppercase tracking-widest"><Trophy className="w-4 h-4 text-amber-500" /> Tingkatan & Benefit</h4>
                        {providerSystem.tiers.map((rank) => {
                            const isCurrent = rank.id === currentRank.id;
                            return (
                                <div key={rank.id} className={`p-5 rounded-[2rem] border transition-all duration-500 ${isCurrent ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 ring-1 ring-orange-500 shadow-lg' : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 opacity-60 hover:opacity-100'}`}>
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="text-3xl filter drop-shadow-sm">{rank.icon}</div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-black text-stone-900 dark:text-white text-base">{rank.name}</h4>
                                                {isCurrent && <span className="bg-orange-500 text-white text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-tighter">Aktif</span>}
                                            </div>
                                            <p className="text-xs text-stone-500 font-bold">Minimal {rank.minPoints.toLocaleString()} Poin</p>
                                        </div>
                                    </div>
                                    <div className="pl-12">
                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Keuntungan:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {rank.benefits.map((b, i) => (
                                                <span key={i} className="text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700">{b}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            
                <div className="p-6 bg-stone-50 dark:bg-stone-950 border-t border-stone-100 dark:border-stone-800">
                    <button 
                        onClick={onClose}
                        className="w-full py-4 bg-stone-900 dark:bg-stone-800 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-black transition-colors shadow-lg"
                    >
                        Tutup Detail
                    </button>
                </div>
            </div>
        </div>
    );
};
