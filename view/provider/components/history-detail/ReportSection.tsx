
import React from 'react';
import { AlertTriangle, MessageCircle, FileText, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/Button';
import { ProviderOrder } from '../../../../types';

interface ReportSectionProps {
    report: NonNullable<ProviderOrder['report']>;
    orderId: string;
    foodName: string;
    onOpenDetail: () => void; // Added to trigger parent modal
}

export const ReportSection: React.FC<ReportSectionProps> = ({ report, orderId, foodName, onOpenDetail }) => {
    const handleAppeal = () => {
        const adminPhone = "6285215376975";
        const message = `Halo Admin Food AI Rescue,\n\nSaya ingin mengajukan BANDING atas laporan berikut:\n\n` +
                        `ID Pesanan: *${orderId}*\n` +
                        `Makanan: ${foodName}\n` +
                        `Masalah Dilaporkan: ${report.issue}\n\n` +
                        `Penjelasan Saya:\n[Tulis alasan Anda disini]`;
        
        window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-[2.5rem] border-2 border-red-100 dark:border-red-900/30 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-200/20 rounded-full -mr-12 -mt-12 blur-3xl"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
                <h3 className="font-black text-red-700 dark:text-red-400 text-lg md:text-xl flex items-center gap-3 italic uppercase tracking-tighter">
                    <AlertTriangle className="w-6 h-6 animate-bounce" /> Laporan Masalah Diterima
                </h3>
            </div>
            
            <div className="space-y-4 relative z-10">
                {/* Brief Issue Info */}
                <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-red-100 dark:border-red-900/20 shadow-sm">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1.5">Kategori Masalah</p>
                    <p className="font-black text-stone-900 dark:text-white text-base md:text-lg mb-2">{report.issue.toUpperCase()}</p>
                    <p className="text-stone-600 dark:text-stone-400 font-medium text-sm leading-relaxed line-clamp-2 italic">
                        "{report.description}"
                    </p>
                </div>

                {/* Primary Action: VIEW DETAIL (REQUESTED) */}
                <button 
                    onClick={onOpenDetail}
                    className="w-full h-14 bg-[#120D0A] hover:bg-black text-white rounded-2xl flex items-center justify-between px-6 transition-all active:scale-[0.98] shadow-xl group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-black text-[11px] uppercase tracking-widest">Lihat Detail Laporan & Bukti Foto</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
                </button>
                
                {/* Secondary Action: APPEAL */}
                <div className="flex gap-3">
                    <Button 
                        onClick={handleAppeal}
                        className="bg-white hover:bg-stone-50 text-red-600 border border-red-200 h-12 text-[10px] font-black uppercase tracking-widest shadow-sm flex-1 rounded-2xl"
                    >
                        <MessageCircle className="w-4 h-4 mr-2" /> Ajukan Banding
                    </Button>
                </div>
            </div>
        </div>
    );
};
