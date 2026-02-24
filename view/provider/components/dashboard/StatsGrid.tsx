
import React, { useState } from 'react';
import { TrendingUp, Zap, Leaf, Info, X, Target, AlertTriangle, ShieldCheck, HelpCircle, Heart, Sparkles } from 'lucide-react';
import { SocialSystemConfig } from '../../../../types';

// Perbaikan SimpleBarChart: Menambahkan label hari di bagian bawah
const SimpleBarChart = ({ data, colorClass }: { data: number[], colorClass: string }) => {
    const max = Math.max(...data, 1);
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  
    return (
      <div className="space-y-1 md:space-y-2 mt-2 md:mt-4">
        <div className="flex items-end gap-1 md:gap-1.5 h-16 md:h-20 px-1">
          {data.map((val, idx) => {
            const heightPercent = Math.max((val / max) * 100, 5);
            return (
                <div key={idx} className="flex-1 flex flex-col justify-end group relative h-full">
                  <div 
                      className={`w-full rounded-t-sm md:rounded-t-md transition-all duration-700 ease-out shadow-sm ${colorClass}`} 
                      style={{ height: `${heightPercent}%` }}
                  ></div>
                </div>
            );
          })}
        </div>
        {/* Label Hari */}
        <div className="flex items-center gap-1 px-1">
          {days.map((day, i) => (
            <span key={i} className="flex-1 text-center text-[7px] md:text-[9px] font-black text-stone-400 group-hover:text-stone-600 transition-colors uppercase">
              {day}
            </span>
          ))}
        </div>
      </div>
    );
};

interface StatsGridProps {
    stats: {
        totalPoints: number;
        co2Saved: number;
    };
    weeklyPoints: number[];
    weeklyCo2: number[];
    providerSystem: SocialSystemConfig;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, weeklyPoints, weeklyCo2, providerSystem }) => {
    const [infoModalType, setInfoModalType] = useState<'social' | 'co2' | null>(null);

    const renderInfoContent = () => {
        if (infoModalType === 'social') {
            return {
                title: "Nilai Kebaikan Sosial",
                icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
                sections: [
                    { label: "Apa Arti Angka Ini?", text: "Ini bukan sekadar angka, tapi catatan amal kebaikan Bapak/Ibu. Setiap angka mewakili satu perut yang kenyang dan satu doa terima kasih dari mereka yang membutuhkan." },
                    { label: "Mengapa Sangat Berharga?", text: "Makanan yang Bapak/Ibu sisihkan menjadi rezeki bagi tetangga atau warga sekitar yang sedang kesulitan. Bapak/Ibu telah menjadi perantara rezeki bagi mereka." },
                    { label: "Dampak Bagi Masyarakat", text: "Dengan berbagi, Bapak/Ibu ikut menjaga kerukunan warga. Tidak ada tetangga yang kelaparan karena kepedulian Bapak/Ibu." },
                    { label: "Semangat Berbagi", text: "Teruslah menebar kebaikan. Sekecil apapun makanan yang diselamatkan, sangat besar artinya bagi yang lapar." }
                ],
                color: "indigo"
            };
        }
        return {
            title: "Kontribusi Menjaga Bumi",
            icon: <Leaf className="w-6 h-6 text-emerald-500" />,
            sections: [
                { label: "Apa Maksud Penyelamatan Ini?", text: "Ini adalah takaran seberapa besar peran Bapak/Ibu dalam merawat bumi ciptaan Tuhan agar tetap lestari dan nyaman ditinggali." },
                { label: "Bahaya Membuang Makanan", text: "Makanan yang dibuang dan membusuk akan menjadi racun udara yang membuat bumi semakin panas dan cuaca tidak menentu." },
                { label: "Tindakan Mulia Bapak/Ibu", text: "Dengan tidak membuang makanan, Bapak/Ibu mencegah kerusakan alam. Makanan jadi berkah untuk manusia, bukan jadi sampah yang merusak." },
                { label: "Warisan Untuk Anak Cucu", text: "Langkah ini adalah sedekah alam. Kita menjaga udara tetap bersih dan bumi tetap sejuk untuk masa depan anak cucu kita nanti." }
            ],
            color: "emerald"
        };
    };

    const modalContent = renderInfoContent();

    return (
        <>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
                {/* Card: Total Poin Sosial */}
                <div className="bg-white dark:bg-stone-900 p-3 md:p-6 rounded-2xl md:rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    
                    {/* Tombol Bantuan (Pojok Kanan Atas) */}
                    <button 
                        onClick={() => setInfoModalType('social')}
                        className="absolute top-[10px] right-[10px] z-20 text-stone-300 hover:text-indigo-500 transition-colors p-1 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>

                    {/* Header dengan padding-right (pr-8) agar teks tidak menabrak ikon absolute */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 md:mb-4 relative z-10 pr-8">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <span className="text-xs md:text-base font-bold text-stone-600 dark:text-stone-400 leading-tight break-words">Total Nilai Kebaikan</span>
                        </div>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-baseline gap-1 md:gap-2">
                            <p className="text-2xl md:text-5xl font-extrabold text-stone-900 dark:text-white mb-1 md:mb-2 tracking-tighter truncate">{stats.totalPoints.toLocaleString()}</p>
                            <span className="text-xs md:text-lg font-bold text-indigo-500">Poin</span>
                        </div>
                        <p className="text-[10px] text-stone-500 font-medium mb-1">Tabungan Kebaikan</p>
                        
                        <div className="mt-1 md:mt-2 mb-2 md:mb-6">
                            <p className="text-[8px] md:text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Keaktifan Mingguan</p>
                            <SimpleBarChart data={weeklyPoints} colorClass="bg-indigo-500 dark:bg-indigo-600" />
                        </div>

                        {/* Hidden on Mobile to save space */}
                        <div className="hidden md:block space-y-2 border-t border-stone-100 dark:border-stone-800 pt-4">
                            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Zap className="w-3 h-3 text-amber-500" /> Cara Menambah Kebaikan:
                            </p>
                            {providerSystem.rules.slice(0, 2).map((rule, i) => (
                                <div key={i} className="flex justify-between items-center text-xs bg-stone-50 dark:bg-stone-800/50 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800">
                                    <span className="text-stone-700 dark:text-stone-300 font-medium">{rule.action}</span>
                                    <span className="font-black text-green-600">+{rule.points} Poin</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Card: Dampak Carbon */}
                <div className="bg-white dark:bg-stone-900 p-3 md:p-6 rounded-2xl md:rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    
                    {/* Tombol Bantuan (Pojok Kanan Atas) */}
                    <button 
                        onClick={() => setInfoModalType('co2')}
                        className="absolute top-[10px] right-[10px] z-20 text-stone-300 hover:text-emerald-500 transition-colors p-1 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>

                    {/* Header dengan padding-right (pr-8) agar teks tidak menabrak ikon absolute */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 md:mb-4 relative z-10 pr-8">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                <Leaf className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <span className="text-xs md:text-base font-bold text-stone-600 dark:text-stone-400 leading-tight break-words">Menjaga Bumi</span>
                        </div>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-baseline gap-1 md:gap-2">
                            <p className="text-2xl md:text-5xl font-extrabold text-stone-900 dark:text-white mb-1 tracking-tighter truncate">
                                {stats.co2Saved.toLocaleString('id-ID', { maximumFractionDigits: 2 })}
                            </p>
                            <span className="text-xs md:text-lg font-bold text-emerald-500">kg</span>
                        </div>
                        <p className="text-[9px] md:text-xs text-stone-500 font-medium mb-2 md:mb-4 line-clamp-1">Tidak Mubazir (Sayang Dibuang)</p>
                        
                        <div className="mb-2 md:mb-6">
                            <p className="text-[8px] md:text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Tren Mingguan</p>
                            <SimpleBarChart data={weeklyCo2} colorClass="bg-emerald-500 dark:bg-emerald-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* INFO MODAL / BOTTOM SHEET */}
            {infoModalType && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center sm:p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setInfoModalType(null)}></div>
                    <div className="bg-white dark:bg-stone-900 w-full md:max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-500">
                        
                        {/* Header */}
                        <div className={`p-6 md:p-8 pb-12 ${infoModalType === 'social' ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white dark:bg-stone-800 shadow-lg ${infoModalType === 'social' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                                        {modalContent.icon}
                                    </div>
                                    <div>
                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${infoModalType === 'social' ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                            Penjelasan Untuk Anda
                                        </p>
                                        <h3 className="text-2xl font-black text-stone-900 dark:text-white leading-none tracking-tight">{modalContent.title}</h3>
                                    </div>
                                </div>
                                <button onClick={() => setInfoModalType(null)} className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors dark:bg-black/20 dark:hover:bg-black/40">
                                    <X className="w-5 h-5 text-stone-500" />
                                </button>
                            </div>
                        </div>

                        {/* Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 -mt-6 bg-white dark:bg-stone-900 rounded-t-[2rem] space-y-6">
                            {modalContent.sections.map((section, idx) => (
                                <div key={idx} className="relative pl-4 border-l-2 border-stone-100 dark:border-stone-800 hover:border-orange-200 dark:hover:border-orange-900 transition-colors group">
                                    <h4 className="text-xs font-black text-stone-900 dark:text-white uppercase tracking-widest mb-1 group-hover:text-orange-600 transition-colors">
                                        {section.label}
                                    </h4>
                                    <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                                        {section.text}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
                            <button 
                                onClick={() => setInfoModalType(null)}
                                className="w-full py-4 rounded-2xl bg-stone-900 dark:bg-stone-800 text-white font-black uppercase tracking-widest text-xs hover:bg-black transition-colors shadow-lg"
                            >
                                Saya Mengerti
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
