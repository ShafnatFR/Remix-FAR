
import React, { useMemo, useState } from 'react';
import { TrendingUp, Leaf, Globe, Target, Calendar, Trees } from 'lucide-react';
import { Button } from '../../components/Button';
import { ClaimHistoryItem } from '../../../types';

// Helper Chart Component
const AdminBarChart = ({ data, labels, colorClass, height = "h-40" }: { data: number[], labels: string[], colorClass: string, height?: string }) => {
    const max = Math.max(...data, 1);
    return (
      <div className={`flex items-end gap-2 ${height} mt-6 w-full px-2`}>
        {data.map((val, idx) => (
          <div key={idx} className="flex-1 flex flex-col justify-end group relative h-full">
            <div className="relative w-full flex-1 flex items-end">
                <div 
                  className={`w-full rounded-t-lg transition-all duration-700 ${colorClass} ${val > 0 ? 'opacity-80' : 'opacity-20'} group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] origin-bottom`} 
                  style={{ height: `${(val / max) * 100}%`, minHeight: val > 0 ? '6px' : '2px' }}
                >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-xl">
                        {val.toLocaleString('id-ID', { maximumFractionDigits: 1 })}
                    </div>
                </div>
            </div>
            <p className="text-[8px] md:text-[9px] text-center text-stone-400 mt-2 font-black uppercase tracking-tighter truncate">{labels[idx]}</p>
          </div>
        ))}
      </div>
    );
};

interface ImpactProps {
    claims?: ClaimHistoryItem[];
}

type TimeFilter = 'harian' | 'bulanan' | 'tahunan';

export const Impact: React.FC<ImpactProps> = ({ claims = [] }) => {
  const [filter, setFilter] = useState<TimeFilter>('harian');

  // Helper untuk parsing tanggal
  const parseDate = (dateStr: string): Date | null => {
      if (!dateStr) return null;
      try {
          // Format: DD/MM/YYYY
          if (dateStr.includes('/')) {
              const parts = dateStr.split('/');
              if (parts.length === 3) {
                  return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
              }
          }
          // Format: ISO String
          const d = new Date(dateStr);
          return isNaN(d.getTime()) ? null : d;
      } catch (e) {
          return null;
      }
  };

  const { totalSavedKg, totalCo2Saved, uniqueBeneficiaries, chartData } = useMemo(() => {
      const completedClaims = claims.filter(c => c.status === 'completed');
      
      // 1. Hitung Total Seumur Hidup (Lifetime Stats)
      let kgSum = 0;
      let co2Sum = 0;
      const uniqueReceivers = new Set<string>();

      completedClaims.forEach(c => {
          kgSum += (c.socialImpact?.wasteReduction || 0);
          co2Sum += (c.socialImpact?.co2Saved || 0);
          if (c.receiverId || c.receiverName) {
              uniqueReceivers.add(c.receiverId || c.receiverName || '');
          }
      });

      // 2. Siapkan Struktur Data Chart berdasarkan Filter
      let wasteData: number[] = [];
      let socialData: number[] = [];
      let co2Data: number[] = [];
      let labels: string[] = [];

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentDate = now.getDate();

      if (filter === 'harian') {
          // Logic: 7 Hari Terakhir
          wasteData = new Array(7).fill(0);
          socialData = new Array(7).fill(0);
          co2Data = new Array(7).fill(0);
          
          // Generate Labels (Hari ini mundur ke belakang)
          // Urutan: [H-6, H-5, ..., Hari Ini]
          const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
          labels = new Array(7).fill('').map((_, i) => {
              const d = new Date();
              d.setDate(now.getDate() - (6 - i));
              return dayNames[d.getDay()];
          });

          // Populate Data
          completedClaims.forEach(c => {
              const d = parseDate(c.date);
              if (d) {
                  const diffTime = now.getTime() - d.getTime();
                  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                  
                  // Jika dalam 7 hari terakhir (0 s/d 6)
                  if (diffDays >= 0 && diffDays < 7) {
                      const index = 6 - diffDays; // Hari ini ada di index 6 (paling kanan)
                      wasteData[index] += (c.socialImpact?.wasteReduction || 0);
                      socialData[index] += 1; // Count activity
                      co2Data[index] += (c.socialImpact?.co2Saved || 0);
                  }
              }
          });

      } else if (filter === 'bulanan') {
          // Logic: 4 Minggu dalam Bulan Ini
          wasteData = new Array(4).fill(0);
          socialData = new Array(4).fill(0);
          co2Data = new Array(4).fill(0);
          labels = ['Mg 1', 'Mg 2', 'Mg 3', 'Mg 4'];

          completedClaims.forEach(c => {
              const d = parseDate(c.date);
              if (d && d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
                  const day = d.getDate();
                  // Sederhana: 1-7 (W1), 8-14 (W2), 15-21 (W3), 22+ (W4)
                  const weekIndex = Math.min(Math.floor((day - 1) / 7), 3);
                  
                  wasteData[weekIndex] += (c.socialImpact?.wasteReduction || 0);
                  socialData[weekIndex] += 1;
                  co2Data[weekIndex] += (c.socialImpact?.co2Saved || 0);
              }
          });

      } else {
          // Logic: 12 Bulan dalam Tahun Ini
          wasteData = new Array(12).fill(0);
          socialData = new Array(12).fill(0);
          co2Data = new Array(12).fill(0);
          labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

          completedClaims.forEach(c => {
              const d = parseDate(c.date);
              if (d && d.getFullYear() === currentYear) {
                  const monthIndex = d.getMonth();
                  
                  wasteData[monthIndex] += (c.socialImpact?.wasteReduction || 0);
                  socialData[monthIndex] += 1;
                  co2Data[monthIndex] += (c.socialImpact?.co2Saved || 0);
              }
          });
      }
      
      return { 
          totalSavedKg: kgSum, 
          totalCo2Saved: co2Sum, 
          uniqueBeneficiaries: uniqueReceivers.size,
          chartData: { waste: wasteData, social: socialData, co2: co2Data, labels }
      };
  }, [claims, filter]);

  const TARGET_KG = 50000;
  // Fallback to 5% visual progress even if 0, so the bar isn't invisible
  const targetPercentage = Math.min(100, parseFloat(((totalSavedKg / TARGET_KG) * 100).toFixed(1)));
  const circumference = 351.8;
  const strokeOffset = circumference - (circumference * targetPercentage / 100);

  return (
      <div className="space-y-8 animate-in fade-in pb-20 px-1">
          {/* Global Header & Filter */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                  <h2 className="text-3xl font-black text-stone-900 dark:text-white flex items-center gap-3 tracking-tighter italic uppercase">
                      <TrendingUp className="w-8 h-8 text-orange-600" /> Dashboard Dampak ESG
                  </h2>
                  <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest mt-2 border-l-2 border-orange-500 pl-3">Verifikasi Real-Time AI Auditor</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 bg-stone-100 dark:bg-stone-800 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-700">
                  {(['harian', 'bulanan', 'tahunan'] as TimeFilter[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            filter === t 
                            ? 'bg-white dark:bg-stone-700 text-orange-600 shadow-sm' 
                            : 'text-stone-400 hover:text-stone-600'
                        }`}
                      >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                  ))}
              </div>
          </div>
          
          {/* Top Row: Primary Impacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Waste Reduction */}
              <div className="bg-white dark:bg-stone-900 p-8 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden flex flex-col justify-between group">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/5 rounded-full blur-3xl"></div>
                  <div>
                    <h3 className="font-black text-[10px] text-stone-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><Leaf className="w-4 h-4 text-green-500" /> Food Rescue Efficiency</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-6xl font-black text-stone-900 dark:text-white tracking-tighter italic">{totalSavedKg.toLocaleString('id-ID', { maximumFractionDigits: 1 })}</p>
                        <span className="text-xl font-bold text-stone-400 italic">kg</span>
                    </div>
                  </div>
                  <div className="mt-10">
                    <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                        <span>Tren Penyelamatan ({filter})</span>
                        <span className="text-green-500 font-bold">+{chartData.waste.reduce((a,b)=>a+b, 0).toFixed(1)}kg Periode Ini</span>
                    </p>
                    <AdminBarChart data={chartData.waste} labels={chartData.labels} colorClass="bg-green-500" />
                  </div>
              </div>

              {/* Card 2: Social Reach */}
              <div className="bg-white dark:bg-stone-900 p-8 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
                  <div>
                      <h3 className="font-black text-[10px] text-stone-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-500" /> Community Outreach
                      </h3>
                      <div className="flex items-baseline gap-2">
                          <p className="text-6xl font-black text-stone-900 dark:text-white tracking-tighter italic">{uniqueBeneficiaries}</p>
                          <span className="text-xl font-bold text-stone-400 italic">Instansi</span>
                      </div>
                  </div>
                  <div className="mt-10">
                      <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                          <span>Aktivitas Donasi ({filter})</span>
                          <span className="text-blue-500 font-bold">{chartData.social.reduce((a,b)=>a+b,0)} Transaksi</span>
                      </p>
                      <AdminBarChart data={chartData.social} labels={chartData.labels} colorClass="bg-blue-500" />
                  </div>
              </div>
          </div>

          {/* Bottom Roadmap: Carbon Trend & Zero Waste Gauge Side-by-Side */}
          <div className="bg-gradient-to-br from-[#0F0F0F] to-[#1A110D] rounded-[3rem] p-8 md:p-12 text-white shadow-3xl border border-white/5 relative overflow-hidden">
               <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-center relative z-10">
                   
                   {/* Left Info Column */}
                   <div className="xl:col-span-4 space-y-8">
                       <div>
                           <span className="inline-block px-4 py-1.5 bg-orange-600 text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-6 shadow-xl shadow-orange-900/40">KPI ROADMAP 2025</span>
                           <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter italic leading-none">STRATEGI<br />ZERO WASTE</h3>
                           <p className="text-stone-400 text-sm leading-relaxed max-w-sm font-medium italic">"Menciptakan ekosistem sirkular melalui pemanfaatan surplus pangan yang terukur."</p>
                       </div>
                       
                       <div className="grid grid-cols-1 gap-4">
                           <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md flex items-center justify-between">
                               <div>
                                   <p className="text-[9px] font-black text-stone-500 tracking-widest uppercase mb-1">Target Tahunan</p>
                                   <p className="text-2xl font-black italic text-white">50,000 <span className="text-xs not-italic font-bold text-stone-500">KG</span></p>
                               </div>
                               <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg"><Target className="w-6 h-6" /></div>
                           </div>
                           <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md flex items-center justify-between">
                               <div>
                                   <p className="text-[9px] font-black text-stone-500 tracking-widest uppercase mb-1">Pencapaian ESG</p>
                                   <p className="text-2xl font-black italic text-orange-500">{totalSavedKg.toLocaleString('id-ID', { maximumFractionDigits: 1 })} <span className="text-xs not-italic font-bold text-stone-500">KG</span></p>
                               </div>
                               <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Leaf className="w-6 h-6 text-orange-500" /></div>
                           </div>
                       </div>
                   </div>

                   {/* Right Content: Charts Side-by-Side */}
                   <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/5 p-6 md:p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
                        
                        {/* Carbon Offsetting Chart */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
                                        <Globe className="w-4 h-4" /> Carbon Offsetting
                                    </h4>
                                    <p className="text-2xl font-black tracking-tight mt-1 italic">{totalCo2Saved.toFixed(1)} <span className="text-xs font-bold text-stone-500">KG CO2</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-emerald-400 italic">~{(totalCo2Saved / 20).toFixed(1)}</p>
                                    <p className="text-[8px] text-stone-500 font-black uppercase">Pohon Diselamatkan</p>
                                </div>
                            </div>
                            <AdminBarChart data={chartData.co2} labels={chartData.labels} colorClass="bg-orange-600" height="h-32" />
                        </div>

                        {/* Zero Waste Progress Gauge */}
                        <div className="flex flex-col items-center justify-center border-l border-white/10 pl-0 md:pl-8">
                            <div className="w-56 h-56 relative animate-in zoom-in-75 duration-1000">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                                    {/* Definitions inside SVG to fix reference issues */}
                                    <defs>
                                        <linearGradient id="gauge_grad_unique" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#EA580C" />
                                            <stop offset="100%" stopColor="#FBBF24" />
                                        </linearGradient>
                                    </defs>
                                    {/* Background Track - Ensure it's visible */}
                                    <circle 
                                        cx="64" cy="64" r="56" 
                                        stroke="rgba(255,255,255,0.1)" 
                                        strokeWidth="8" 
                                        fill="transparent" 
                                    />
                                    {/* Progress Circle */}
                                    <circle 
                                        cx="64" cy="64" r="56" 
                                        stroke="url(#gauge_grad_unique)" 
                                        strokeWidth="10" 
                                        fill="transparent" 
                                        strokeDasharray={circumference} 
                                        strokeDashoffset={strokeOffset} 
                                        strokeLinecap="round" 
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-white italic tracking-tighter leading-none">{targetPercentage}%</span>
                                    <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest mt-2 px-2 py-0.5 bg-orange-500/10 rounded">Progress Achieved</span>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center gap-2 text-stone-500 text-[10px] font-bold uppercase tracking-widest">
                                <Trees className="w-3.5 h-3.5 text-green-500" /> Sustainablity Metric
                            </div>
                        </div>

                   </div>
               </div>

               {/* Decorative Background Glows */}
               <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>
               <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[80px] pointer-events-none"></div>
          </div>
      </div>
  );
};
