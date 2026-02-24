
import React from 'react';
import { Smartphone, Tablet, Laptop, ChevronDown, Megaphone, Sparkles } from 'lucide-react';

export type DeviceType = 'phone' | 'tablet' | 'laptop';

interface DevicePreviewProps {
    device: DeviceType;
    title: string;
    content: string;
    target: string;
}

export const DevicePreview: React.FC<DevicePreviewProps> = ({ device, title, content, target }) => {
    const frames = {
        phone: "w-[300px] h-[580px] border-[10px] rounded-[2.5rem]",
        tablet: "w-[380px] h-[500px] border-[12px] rounded-[2rem]",
        laptop: "w-[420px] h-[300px] border-[6px] rounded-t-xl border-b-0"
    };

    return (
        <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className={`${frames[device]} bg-white dark:bg-stone-900 border-stone-800 dark:border-stone-700 shadow-2xl relative overflow-hidden transition-all duration-500`}>
                {device === 'phone' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-stone-800 dark:bg-stone-700 rounded-b-2xl z-20" />
                )}
                <div className="h-full w-full overflow-y-auto custom-scrollbar bg-[#FDFBF7] dark:bg-stone-950">
                    {/* Mock Header Perangkat */}
                    <div className="h-16 bg-gradient-to-r from-orange-600 to-amber-500 flex items-center px-6 text-white sticky top-0 z-10">
                          <ChevronDown className="w-6 h-6 rotate-90 mr-4" />
                          <h4 className="font-black text-sm uppercase italic tracking-tight">Food AI Rescue</h4>
                    </div>

                    {/* Mock Notifikasi di dalam Frame */}
                    <div className="p-4 space-y-6">
                        <div className="bg-white dark:bg-stone-900 rounded-[2rem] border-2 border-orange-500 shadow-2xl p-5 md:p-6 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 shrink-0">
                                    <Megaphone className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-black text-stone-900 dark:text-white text-sm uppercase italic leading-none truncate">{title || "Judul Pengumuman"}</h4>
                                    <p className="text-[9px] text-stone-400 font-bold uppercase mt-1">Baru Saja • Admin</p>
                                </div>
                            </div>

                            <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 mb-4">
                                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed font-medium italic whitespace-pre-wrap">
                                    {content || "Isi pesan broadcast akan muncul di sini secara real-time saat Anda mengetik di sebelah kiri..."}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full border border-white bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-[7px] font-black">U{i}</div>)}
                                </div>
                                <button className="bg-orange-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">Lihat Detail</button>
                            </div>
                        </div>

                        {/* Mock Feed Lainnya */}
                        <div className="space-y-4 opacity-40 grayscale pointer-events-none">
                            {[1,2].map(i => (
                                <div key={i} className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200">
                                    <div className="w-2/3 h-2.5 bg-stone-200 dark:bg-stone-800 rounded mb-3"></div>
                                    <div className="w-full h-12 bg-stone-100 dark:bg-stone-800/50 rounded-xl"></div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="bg-stone-900 dark:bg-black rounded-2xl p-6 text-center text-white border border-white/5 shadow-lg">
                            <h5 className="font-black text-xs uppercase mb-3 tracking-widest flex items-center justify-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Pusat Notifikasi
                            </h5>
                            <p className="text-[9px] text-stone-400 leading-relaxed mb-4">Target: {target === 'all' ? 'Semua User' : target.toUpperCase()}</p>
                            <div className="h-1 w-20 bg-orange-600 mx-auto rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
            {device === 'laptop' && (
                <div className="w-[460px] h-6 bg-stone-700 dark:bg-stone-600 rounded-b-lg relative shadow-xl">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-stone-500/30 rounded-b" />
                </div>
            )}
        </div>
    );
};
