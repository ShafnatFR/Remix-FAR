
import React from 'react';
import { Info } from 'lucide-react';
import { SocialTier } from '../../../../types';

interface RankCardProps {
    currentRank: SocialTier;
    nextRank?: SocialTier;
    currentPoints: number;
    progress: number;
    onShowDetails: () => void;
}

export const RankCard: React.FC<RankCardProps> = ({ currentRank, nextRank, currentPoints, progress, onShowDetails }) => {
    return (
        <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 rounded-[2rem] p-7 md:p-9 text-white shadow-2xl shadow-orange-500/30 relative overflow-hidden group border border-white/10">
            {/* Decorative Patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                <div className="flex items-center md:items-start gap-5">
                    {/* Ikon dikunci ukurannya agar tidak gepeng */}
                    <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-xl text-4xl aspect-square">
                        {currentRank.icon}
                    </div>
                    
                    <div className="space-y-2">
                        <div>
                            <p className="text-orange-100 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] mb-1 opacity-80">
                                Status Keaktifan
                            </p>
                            <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight italic drop-shadow-md">
                                {currentRank.name}
                            </h2>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {currentRank.benefits.map((benefit, idx) => (
                                <span key={idx} className="text-[9px] md:text-[10px] font-bold bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10 shadow-sm">
                                    {benefit}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <button 
                    onClick={onShowDetails}
                    className="flex-shrink-0 px-5 py-2.5 bg-black/20 hover:bg-black/40 border border-white/20 rounded-2xl transition-all duration-300 text-white backdrop-blur-md text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 self-end md:self-start"
                >
                    <Info className="w-3.5 h-3.5" /> Info Level
                </button>
            </div>

            <div className="relative z-10 mt-10 space-y-3">
                <div className="flex justify-between items-end text-sm font-black italic">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-orange-100 opacity-70 mb-0.5">Poin Terkumpul</span>
                        <span className="text-xl md:text-2xl">{currentPoints.toLocaleString()} <span className="text-xs opacity-80 not-italic">Poin</span></span>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] uppercase tracking-widest text-orange-100 opacity-70 mb-0.5 block">Target Berikutnya</span>
                        <span className="text-xs md:text-sm text-white/90">{nextRank ? `${nextRank.name} (${nextRank.minPoints})` : 'Level Tertinggi!'}</span>
                    </div>
                </div>
                
                <div className="relative h-4 w-full bg-black/20 rounded-2xl overflow-hidden backdrop-blur-md border border-white/5 shadow-inner">
                    <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-white via-white/90 to-orange-100 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-1000 ease-out" 
                        style={{width: `${progress}%`}}
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
