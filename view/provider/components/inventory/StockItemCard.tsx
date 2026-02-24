
import React from 'react';
import { Sparkles, Timer, ChevronRight, AlertTriangle, Trash2, CheckSquare } from 'lucide-react';
import { FoodItem } from '../../../../types';
import { getDateTimeParts, isFoodExpired } from '../../../../utils/transformers';

interface StockItemCardProps {
    item: FoodItem;
    layoutMode: 'list' | 'grid';
    onClick: () => void;
    onDelete?: (id: string) => void;
    isMultiSelectMode?: boolean;
    isSelected?: boolean;
    onToggleSelect?: (id: string) => void;
}

export const StockItemCard: React.FC<StockItemCardProps> = ({
    item,
    layoutMode,
    onClick,
    onDelete,
    isMultiSelectMode,
    isSelected,
    onToggleSelect
}) => {
    const expiryParts = getDateTimeParts(item.distributionEnd);
    const expired = isFoodExpired(item.distributionEnd);

    return (
        <div 
            onClick={isMultiSelectMode && onToggleSelect ? () => onToggleSelect(item.id) : onClick}
            className={`
                group bg-white dark:bg-stone-900 rounded-[1.5rem] md:rounded-[2rem] border border-stone-200 dark:border-stone-800 
                transition-all duration-300 hover:border-orange-500/50 hover:shadow-xl cursor-pointer relative overflow-hidden flex
                ${layoutMode === 'list' ? 'flex-row h-32 md:h-44 p-3 md:p-4 gap-4 md:gap-6' : 'flex-col p-3 md:p-5 gap-3 md:gap-4'}
                ${expired ? 'opacity-75 grayscale-[0.3]' : ''}
                ${isSelected ? 'border-orange-500 ring-2 ring-orange-500/50' : 'border-stone-200 dark:border-stone-800'}
            `}>
            {isMultiSelectMode && (
                <div className="absolute top-3 left-3 z-20">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect && onToggleSelect(item.id)}
                        className="form-checkbox h-5 w-5 text-orange-600 rounded border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 focus:ring-orange-500"
                        onClick={(e) => e.stopPropagation()} // Prevent card onClick when clicking checkbox
                    />
                </div>
            )}
            {expired && onDelete && !isMultiSelectMode && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    className="absolute top-3 right-3 z-20 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    title="Hapus Produk Expired"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
            <div className={`shrink-0 rounded-xl md:rounded-2xl overflow-hidden bg-stone-100 ${layoutMode === 'list' ? 'w-24 md:w-36 h-full' : 'w-full aspect-square md:aspect-video'}`}>
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                {/* AI Score Badge */}
                {layoutMode === 'grid' && (
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col items-start gap-1 z-10">
                        <div className="bg-white/95 dark:bg-stone-900/80 backdrop-blur-md text-stone-900 dark:text-white px-2 py-1 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-tight shadow-lg border border-stone-100 dark:border-stone-800 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-orange-500 fill-orange-500" />
                            <span>AI SCORE {item.aiVerification?.halalScore}</span>
                        </div>
                    </div>
                )}
                {expired && (
                    <div className="absolute inset-0 bg-red-900/20 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-xl">
                            <AlertTriangle className="w-3 h-3" /> EXPIRED
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-black text-stone-900 dark:text-white leading-tight group-hover:text-orange-600 transition-colors line-clamp-1 md:line-clamp-2 ${layoutMode === 'grid' ? 'text-xs md:text-lg' : 'text-sm md:text-xl'}`}>{item.name}</h3>
                        <span className={`text-[8px] md:text-[10px] font-black px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg uppercase tracking-widest shrink-0 ml-2 ${expired ? 'bg-red-100 text-red-600' : (item.currentQuantity > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600')}`}>
                            {expired ? 'Expired' : (item.currentQuantity > 0 ? 'Aktif' : 'Habis')}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-stone-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] mb-1 md:mb-2">
                        <Timer className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        <span>Exp:</span>
                        {expiryParts ? (
                            <div className="flex items-center gap-1">
                                <span>{expiryParts.date} - {expiryParts.time}</span>
                                <span className={`px-1 rounded text-[7px] md:text-[8px] font-black ${expiryParts.ampm === 'PM' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {expiryParts.ampm}
                                </span>
                            </div>
                        ) : (
                            <span>{item.expiryTime}</span>
                        )}
                    </div>

                    <p className={`text-stone-500 text-[10px] md:text-xs leading-relaxed ${layoutMode === 'grid' ? 'hidden md:line-clamp-2' : 'line-clamp-2 md:line-clamp-3'}`}>{item.description}</p>
                </div>
                
                <div className="flex items-center justify-between mt-2 md:mt-4 pt-2 md:pt-4 border-t border-stone-50 dark:border-stone-800">
                    <div>
                        <p className="text-[8px] md:text-[9px] font-black text-stone-400 uppercase hidden md:block">Sisa Ketersediaan</p>
                        <p className="text-xs md:text-sm font-black text-orange-600 italic">{item.currentQuantity} <span className="text-stone-400 not-italic text-[8px] md:text-[10px]">/ {item.initialQuantity}</span></p>
                    </div>
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                </div>
            </div>
        </div>
    );
};
