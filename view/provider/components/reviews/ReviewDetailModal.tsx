
import React from 'react';
import { X, Package, ShoppingBag, Star, MessageSquare, Image as ImageIcon, Calendar } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Review } from '../../../../types';

interface ReviewDetailModalProps {
    review: Review;
    onClose: () => void;
    onShowProductDetail: () => void;
}

export const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({ review, onClose, onShowProductDetail }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-stone-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
                {/* Header Modal */}
                <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-950">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 font-black text-xl">
                            {review.user.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-stone-900 dark:text-white leading-tight">{review.user}</h3>
                            <p className="text-xs text-stone-500 font-medium">Penerima Manfaat Terverifikasi</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2.5 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Modal */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                    {/* Product Info Link */}
                    <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100 dark:border-stone-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-stone-800 rounded-xl">
                                <Package className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Produk Diulas</p>
                                <p className="font-bold text-stone-900 dark:text-white text-sm">{review.foodName || 'Nama Makanan'}</p>
                            </div>
                        </div>
                        <Button 
                            variant="outline" 
                            className="h-8 text-[10px] px-3 bg-white border-orange-200 text-orange-600 hover:bg-orange-100 w-auto"
                            onClick={onShowProductDetail}
                        >
                            Cek Detail Produk
                        </Button>
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">ID Pesanan</p>
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-orange-500" />
                                <span className="text-sm font-black text-stone-800 dark:text-stone-200 tracking-tight">{review.orderId || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Rating Diberikan</p>
                            <div className="flex items-center gap-1.5">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star 
                                            key={star} 
                                            className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-stone-200'}`} 
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-black text-stone-800 dark:text-stone-200">{review.rating}/5</span>
                            </div>
                        </div>
                    </div>

                    {/* Comment Section */}
                    <div className="space-y-3">
                        <h4 className="font-black text-stone-900 dark:text-white text-xs flex items-center gap-2 uppercase tracking-widest">
                            <MessageSquare className="w-4 h-4 text-orange-500" /> Pesan & Kesan
                        </h4>
                        <div className="bg-[#FDFBF7] dark:bg-stone-950 p-6 rounded-[2rem] border border-orange-100 dark:border-stone-800 relative">
                            <span className="absolute top-4 left-4 text-6xl text-orange-500/10 font-serif leading-none">“</span>
                            <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed italic font-medium relative z-10 pl-2">
                                {review.comment}
                            </p>
                        </div>
                    </div>

                    {/* Media Section */}
                    <div className="space-y-4">
                        <h4 className="font-black text-stone-900 dark:text-white text-xs flex items-center gap-2 uppercase tracking-widest">
                            <ImageIcon className="w-4 h-4 text-blue-500" /> Bukti Foto Penerima
                        </h4>
                        {review.mediaUrls && review.mediaUrls.length > 0 ? (
                            <div className={`grid gap-3 ${review.mediaUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                {review.mediaUrls.map((url, i) => (
                                    <div key={i} className="rounded-[1.5rem] overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 aspect-video group">
                                        <img 
                                            src={url} 
                                            alt={`Review media ${i + 1}`} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-stone-50 dark:bg-stone-800/30 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800">
                                <p className="text-stone-400 text-xs italic">Penerima tidak melampirkan foto pada ulasan ini.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Modal */}
                <div className="p-6 bg-stone-50 dark:bg-stone-950 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-stone-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{review.date}</span>
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={onClose}
                        className="w-auto px-8 rounded-2xl font-black uppercase tracking-widest text-xs h-12 border-2"
                    >
                        Tutup
                    </Button>
                </div>
            </div>
        </div>
    );
};
