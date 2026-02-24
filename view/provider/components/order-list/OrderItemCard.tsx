
import React from 'react';
import { Package, Truck, User, Clock } from 'lucide-react';
import { Button } from '../../../components/Button';
import { ProviderOrder } from '../../../../types';
import { getDateTimeParts } from '../../../../utils/transformers';

interface OrderItemCardProps {
    order: ProviderOrder;
    onClick: () => void;
}

export const OrderItemCard: React.FC<OrderItemCardProps> = ({ order, onClick }) => {
    const dateParts = getDateTimeParts(order.timestamps.claimedAt);

    return (
        <div 
            onClick={onClick}
            className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm relative overflow-hidden group hover:border-orange-500/50 transition-all cursor-pointer hover:shadow-md"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
            <div className="flex justify-between items-start mb-3 pl-2">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{order.id}</span>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide ${
                    order.status === 'claimed' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                }`}>
                    {order.status === 'claimed' ? 'Menunggu Ambil' : 'Diantar'}
                </span>
            </div>

            <div className="flex gap-3 mb-4 pl-2">
                <img src={order.imageUrl} className="w-16 h-16 rounded-xl object-cover bg-stone-100" alt={order.foodName} />
                <div>
                    <h3 className="font-bold text-stone-900 dark:text-white leading-tight line-clamp-1 group-hover:text-orange-600 transition-colors">{order.foodName}</h3>
                    <p className="text-xs text-stone-500 mt-1">{order.quantity}</p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded w-fit">
                        {order.deliveryMethod === 'pickup' ? <Package className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                        {order.deliveryMethod === 'pickup' ? 'Ambil Sendiri' : 'Kurir Relawan'}
                    </div>
                </div>
            </div>

            <div className="space-y-2 border-t border-stone-100 dark:border-stone-800 pt-3 pl-2">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 flex items-center gap-1"><User className="w-3 h-3" /> Penerima</span>
                    <span className="font-bold text-stone-900 dark:text-white">{order.receiver.name}</span>
                </div>
                <div className="flex justify-between items-start text-xs">
                    <span className="text-stone-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> Waktu Klaim</span>
                    <div className="flex flex-col items-end">
                        {dateParts ? (
                            <>
                                <span className="text-stone-900 dark:text-white font-mono">{dateParts.date}</span>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="font-mono text-stone-600 dark:text-stone-300">{dateParts.time}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${dateParts.ampm === 'PM' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {dateParts.ampm}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <span className="text-stone-400">Invalid Date</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4 pl-2">
                <Button className="h-9 text-xs font-black uppercase">Detail Pesanan</Button>
            </div>
        </div>
    );
};
