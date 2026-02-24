
import React from 'react';
import { CheckCircle2, Ticket, X, ArrowRight, Store } from 'lucide-react';
import { Button } from '../components/Button';

interface SuccessClaimSplashProps {
    foodName: string;
    providerName: string;
    uniqueCode: string;
    onClose: () => void;
    onViewTicket: () => void;
}

export const SuccessClaimSplash: React.FC<SuccessClaimSplashProps> = ({ 
    foodName, 
    providerName, 
    uniqueCode, 
    onClose, 
    onViewTicket 
}) => {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-[2.5rem] p-8 text-center relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
                
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-50 dark:from-green-900/20 to-transparent pointer-events-none"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 mb-6 animate-bounce">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>

                    <h2 className="text-3xl font-black text-stone-900 dark:text-white uppercase italic tracking-tighter mb-2">
                        Klaim Berhasil!
                    </h2>
                    <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-8">
                        Makanan berhasil diamankan
                    </p>

                    <div className="w-full bg-stone-50 dark:bg-stone-800/50 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 mb-8 space-y-4">
                        <div>
                            <p className="text-lg font-black text-stone-900 dark:text-white leading-tight">{foodName}</p>
                            <div className="flex items-center justify-center gap-1.5 mt-1 text-stone-500 dark:text-stone-400">
                                <Store className="w-3 h-3" />
                                <span className="text-xs font-medium">{providerName}</span>
                            </div>
                        </div>

                        <div className="border-t border-dashed border-stone-300 dark:border-stone-700 my-4"></div>

                        <div>
                            <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mb-1">Kode Pengambilan</p>
                            <p className="text-3xl font-mono font-black text-orange-600 dark:text-orange-500 tracking-widest">{uniqueCode}</p>
                        </div>
                    </div>

                    <div className="w-full space-y-3">
                        <Button 
                            onClick={onViewTicket}
                            className="h-14 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-xl shadow-orange-500/30 rounded-2xl font-black uppercase tracking-widest"
                        >
                            <Ticket className="w-5 h-5 mr-2" /> Lihat Tiket
                        </Button>
                        <button 
                            onClick={onClose}
                            className="w-full py-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                            Tutup & Cari Lagi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
