
import React from 'react';
import { Star, Image as ImageIcon, Package } from 'lucide-react';
import { Review } from '../../../../types';

interface ReviewItemCardProps {
    review: Review;
    layoutMode: 'list' | 'grid';
    onClick: () => void;
}

export const ReviewItemCard: React.FC<ReviewItemCardProps> = ({ review, layoutMode, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className={`
                bg-white dark:bg-stone-900 rounded-[1.5rem] border border-stone-200 dark:border-stone-800 shadow-sm cursor-pointer 
                hover:border-orange-500/50 hover:shadow-md transition-all group overflow-hidden flex flex-col justify-between
                ${layoutMode === 'grid' ? 'p-3 md:p-5' : 'p-5'}
            `}
        >
            <div className={`${layoutMode === 'grid' ? 'space-y-2' : ''}`}>
                <div className={`flex justify-between items-start ${layoutMode === 'grid' ? 'flex-col gap-2' : 'flex-row mb-3'}`}>
                    <div className="flex items-center gap-2">
                        <div className={`${layoutMode === 'grid' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-base'} rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-bold text-stone-600 dark:text-stone-300 shrink-0`}>
                            {review.user.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <p className={`font-bold text-stone-900 dark:text-white group-hover:text-orange-600 transition-colors truncate ${layoutMode === 'grid' ? 'text-xs' : 'text-sm'}`}>{review.user}</p>
                            <p className="text-[9px] text-stone-500 flex items-center gap-1 font-medium truncate">
                                <Package className="w-2.5 h-2.5" /> {review.foodName || 'Makanan'}
                            </p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg ${layoutMode === 'grid' ? 'self-start' : ''}`}>
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-black text-yellow-700 dark:text-yellow-400">{review.rating}</span>
                    </div>
                </div>
                
                <p className={`text-stone-600 dark:text-stone-300 italic leading-relaxed ${layoutMode === 'grid' ? 'text-[10px] line-clamp-3 mt-1' : 'text-sm line-clamp-2'}`}>"{review.comment}"</p>
            </div>
            
            <div className={`flex items-center justify-between ${layoutMode === 'grid' ? 'mt-2 pt-2 border-t border-stone-50 dark:border-stone-800' : 'mt-4'}`}>
                <div className="flex items-center gap-1">
                    {review.mediaUrls && review.mediaUrls.length > 0 && (
                        <span className={`text-[9px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1`}>
                            <ImageIcon className="w-3 h-3" /> <span className={layoutMode === 'grid' ? 'hidden md:inline' : ''}>Foto</span>
                        </span>
                    )}
                </div>
                <span className="text-[9px] font-bold text-stone-400">{review.date}</span>
            </div>
        </div>
    );
};
