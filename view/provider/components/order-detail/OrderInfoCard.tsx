
import React from 'react';
import { QrCode } from 'lucide-react';

interface OrderInfoCardProps {
    orderId: string;
}

export const OrderInfoCard: React.FC<OrderInfoCardProps> = ({ orderId }) => {
    return (
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl shadow-lg border border-stone-100 dark:border-stone-800 flex justify-between items-center">
            <div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">ID Pesanan</p>
                <p className="text-xl font-mono font-bold text-stone-900 dark:text-white tracking-wider">{orderId}</p>
            </div>
            <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-xl">
                <QrCode className="w-8 h-8 text-stone-800 dark:text-stone-200" />
            </div>
        </div>
    );
};
