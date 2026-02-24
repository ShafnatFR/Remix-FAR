
import React from 'react';
import { Truck, MessageCircle } from 'lucide-react';
import { ProviderOrder } from '../../../../types';

interface CourierInfoProps {
    courier: NonNullable<ProviderOrder['courier']>;
    onContact: () => void;
}

export const CourierInfo: React.FC<CourierInfoProps> = ({ courier, onContact }) => {
    return (
        <div className="space-y-3">
            <h3 className="font-black text-stone-900 dark:text-white text-sm uppercase tracking-widest flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-500" /> Kurir Relawan
            </h3>
            <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-[2rem] border border-blue-100 dark:border-blue-800 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-stone-800 text-blue-600 font-black text-xl flex items-center justify-center shadow-sm">
                        {courier.avatar}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-stone-900 dark:text-white text-lg">{courier.name}</h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Plat: D 1234 ABC • Yamaha Nmax</p>
                    </div>
                    <button 
                        onClick={onContact} 
                        className="p-3 bg-white dark:bg-stone-800 text-green-600 hover:text-green-700 rounded-xl shadow-sm border border-stone-100 dark:border-stone-700 transition-all active:scale-95 pointer-events-auto"
                    >
                        <MessageCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
