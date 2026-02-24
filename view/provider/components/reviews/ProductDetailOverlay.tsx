
import React from 'react';
import { ArrowLeft, ShieldCheck, Truck, ShoppingBag, Timer, Clock } from 'lucide-react';
import { FoodItem } from '../../../../types';

interface ProductDetailOverlayProps {
    item: FoodItem;
    onBack: () => void;
}

export const ProductDetailOverlay: React.FC<ProductDetailOverlayProps> = ({ item, onBack }) => {
    return (
        <div className="fixed inset-0 bg-[#FDFBF7] dark:bg-stone-950 z-[120] overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-lg border-b border-stone-100 dark:border-stone-800 p-4 flex items-center gap-4 text-stone-900 dark:text-white">
                <button onClick={onBack} className="p-2.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="font-black text-lg truncate uppercase tracking-tight">Detail Produk Terkait</h2>
            </div>

            <div className="max-w-4xl mx-auto p-6 md:p-10 pb-32 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 relative group">
                            <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-xl uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck className="w-3.5 h-3.5" /> AI Verified
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-black text-stone-900 dark:text-white leading-tight mb-4">{item.name}</h1>
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-orange-100 dark:border-orange-800 flex items-center gap-1.5">
                                    <Truck className="w-3 h-3" /> {item.deliveryMethod}
                                </span>
                                <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-blue-100 dark:border-orange-800 flex items-center gap-1.5">
                                    <ShoppingBag className="w-3 h-3" /> Stok Awal: {item.initialQuantity}
                                </span>
                            </div>
                            <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed font-medium">"{item.description}"</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Dibuat Pada</p>
                                <p className="font-bold text-stone-900 dark:text-stone-200 text-sm flex items-center gap-2">
                                    <Timer className="w-4 h-4 text-orange-500" /> {new Date(item.createdAt).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                            <div className="p-4 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Expired Jam</p>
                                <p className="font-bold text-red-600 text-sm flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> {item.expiryTime}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
