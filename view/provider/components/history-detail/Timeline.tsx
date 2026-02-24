
import React from 'react';
import { Clock } from 'lucide-react';
import { ProviderOrder } from '../../../../types';
import { getDateTimeParts } from '../../../../utils/transformers';

interface TimelineProps {
    timestamps: ProviderOrder['timestamps'];
    deliveryMethod: ProviderOrder['deliveryMethod'];
    receiverName: string;
}

export const Timeline: React.FC<TimelineProps> = ({ timestamps, deliveryMethod, receiverName }) => {
    const claimedParts = getDateTimeParts(timestamps.claimedAt);
    const pickedUpParts = getDateTimeParts(timestamps.pickedUpAt);
    const completedParts = getDateTimeParts(timestamps.completedAt);

    const renderTime = (parts: ReturnType<typeof getDateTimeParts>) => {
        if (!parts) return <span className="text-xs text-stone-500 font-mono mb-0.5">Waktu tidak tersedia</span>;
        return (
            <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs text-stone-500 font-mono">{parts.date} - {parts.time}</span>
                <span className={`px-1.5 rounded text-[9px] font-black ${parts.ampm === 'PM' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    {parts.ampm}
                </span>
            </div>
        );
    };

    return (
        <div className="bg-stone-50 dark:bg-stone-900/50 p-6 rounded-[2rem] border border-stone-200 dark:border-stone-800">
            <h3 className="font-black text-stone-900 dark:text-white text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" /> Timeline Pesanan
            </h3>
            <div className="relative pl-4 space-y-8 border-l-2 border-stone-200 dark:border-stone-700 ml-2">
                <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-stone-900 shadow-sm"></div>
                    {renderTime(claimedParts)}
                    <p className="font-bold text-stone-800 dark:text-stone-200 text-sm">Diklaim oleh {receiverName}</p>
                </div>
                {timestamps.pickedUpAt && (
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white dark:border-stone-900 shadow-sm"></div>
                        {renderTime(pickedUpParts)}
                        <p className="font-bold text-stone-800 dark:text-stone-200 text-sm">
                            {deliveryMethod === 'delivery' ? 'Diambil oleh Kurir' : 'Menunggu di Lokasi'}
                        </p>
                    </div>
                )}
                {timestamps.completedAt && (
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-stone-900 shadow-sm"></div>
                        {renderTime(completedParts)}
                        <p className="font-bold text-stone-800 dark:text-stone-200 text-sm">Pesanan Selesai & Diterima</p>
                    </div>
                )}
            </div>
        </div>
    );
};
