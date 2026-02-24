
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/Button';
import { ProviderOrder } from '../../../../types';

interface ReviewModalProps {
    rating: NonNullable<ProviderOrder['rating']>;
    receiverName: string;
    onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ rating, receiverName, onClose }) => {
    return (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl p-6 relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-stone-200 transition-colors">
                    <X className="w-5 h-5 text-stone-600 dark:text-stone-300" />
                </button>
                
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-yellow-600 dark:text-yellow-400 font-black text-2xl border-4 border-white dark:border-stone-800 shadow-lg">
                        {rating.stars}.0
                    </div>
                    <h3 className="font-bold text-xl text-stone-900 dark:text-white">Ulasan Lengkap</h3>
                    <p className="text-sm text-stone-500">Oleh {receiverName}</p>
                </div>

                <div className="bg-stone-50 dark:bg-stone-950 p-5 rounded-2xl border border-stone-100 dark:border-stone-800 mb-6">
                    <p className="text-stone-700 dark:text-stone-300 italic text-center font-medium leading-relaxed">"{rating.comment}"</p>
                </div>

                {rating.mediaUrls && rating.mediaUrls.length > 0 && (
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Foto Lampiran</p>
                        <div className="grid grid-cols-2 gap-3">
                            {rating.mediaUrls.map((url, idx) => (
                                <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 relative group">
                                    <img src={url} alt="Review" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="mt-8">
                    <Button onClick={onClose}>Tutup</Button>
                </div>
            </div>
        </div>
    );
};
