
import React from 'react';
import { User, ShieldCheck, MessageCircle } from 'lucide-react';
import { ProviderOrder } from '../../../../types';

interface ReceiverInfoProps {
    receiver: ProviderOrder['receiver'];
    onContact: () => void;
}

export const ReceiverInfo: React.FC<ReceiverInfoProps> = ({ receiver, onContact }) => {
    return (
        <div className="space-y-3">
            <h3 className="font-black text-stone-900 dark:text-white text-sm uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" /> Penerima Manfaat
            </h3>
            <div className="bg-white dark:bg-stone-900 p-5 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/20 text-orange-600 font-black text-xl flex items-center justify-center">
                        {receiver.avatar}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-stone-900 dark:text-white text-lg">{receiver.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Terverifikasi
                            </span>
                            <span className="text-xs text-stone-500">Reputasi: 4.9/5</span>
                        </div>
                    </div>
                    <button 
                        onClick={onContact} 
                        className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/30 transition-all active:scale-95 pointer-events-auto"
                    >
                        <MessageCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
