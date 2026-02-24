
import React from 'react';
import { Star, Image as ImageIcon } from 'lucide-react';
import { ProviderOrder } from '../../../../types';

interface ReviewCardProps {
    rating: NonNullable<ProviderOrder['rating']>;
    onClick: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ rating, onClick }) => {
    return (
        <div className="space-y-4">
            <h3 className="font-black text-stone-900 dark:text-white text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Ulasan Penerima
            </h3>
            <div 
                onClick={onClick}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-stone-900 dark:to-stone-800 p-6 rounded-[2rem] border border-yellow-200 dark:border-stone-700 cursor-pointer hover:shadow-md transition-all group relative overflow-hidden"
            >
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-black px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                    Klik untuk Detail
                </div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < rating.stars ? 'text-yellow-500 fill-yellow-500' : 'text-stone-300'}`} />
                        ))}
                    </div>
                    <span className="font-black text-lg text-stone-900 dark:text-white">{rating.stars}.0</span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 italic font-medium leading-relaxed">
                    "{rating.comment}"
                </p>
                {rating.mediaUrls && rating.mediaUrls.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-stone-500">
                        <ImageIcon className="w-4 h-4" /> {rating.mediaUrls.length} Foto Lampiran
                    </div>
                )}
            </div>
        </div>
    );
};
