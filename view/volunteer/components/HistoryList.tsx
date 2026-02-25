
import React from 'react';
import { History, Clock, MapPin, ArrowRight, ChevronRight, CheckCircle2, PlayCircle, CalendarDays } from 'lucide-react';
import { Button } from '../../components/Button';
import { Skeleton } from '../../components/Skeleton';

interface HistoryItem {
    id: number;
    originalId: string;
    date: string;
    from: string;
    to: string;
    items: string;
    points: number;
    distance?: number;
    status?: string;
}

interface HistoryListProps {
    history: HistoryItem[];
    onFindMissions?: () => void;
    onSelect?: (originalId: string) => void;
    isLoading?: boolean;
}

const SkeletonVolunteerHistoryCard = () => (
    <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 space-y-3">
        <div className="flex justify-between">
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
        <div className="pt-2 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
        </div>
    </div>
);

export const HistoryList: React.FC<HistoryListProps> = ({ history, onFindMissions, onSelect, isLoading }) => {

    const formatDateDetail = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return { dateStr: dateString, timeStr: '', ampm: '' };
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;

        return {
            dateStr: `${day}/${month}/${year}`,
            timeStr: `${hours}:${minutes}:${seconds}`,
            ampm
        };
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <SkeletonVolunteerHistoryCard key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-2">
                <History className="w-5 h-5 text-orange-500" /> Riwayat Pengantaran
            </h2>

            <div className={history.length === 0 ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
                {history.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 flex flex-col items-center">
                        <p className="mb-6">Belum ada riwayat pengantaran. Ambil misi pertamamu!</p>
                        {onFindMissions && (
                            <Button
                                onClick={onFindMissions}
                                className="w-auto h-12 text-xs font-black uppercase tracking-widest px-6"
                            >
                                Cari Misi Sekarang <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                ) : (
                    history.map(item => {
                        const { dateStr, timeStr, ampm } = formatDateDetail(item.date);
                        const isCompleted = item.status === 'completed';

                        return (
                            <div
                                key={item.id}
                                onClick={() => onSelect && onSelect(item.originalId)}
                                className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col gap-2 cursor-pointer hover:border-orange-500/50 hover:shadow-md transition-all group relative overflow-hidden"
                            >
                                <div className={`absolute right-0 top-0 bottom-0 w-1 transition-colors ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}></div>

                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 w-fit ${isCompleted
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                        }`}>
                                        {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <PlayCircle className="w-3 h-3" />}
                                        {isCompleted ? 'Selesai' : 'Aktif'}
                                    </span>
                                    <span className="text-[10px] font-black text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full border border-orange-100 dark:border-orange-800 shrink-0">
                                        +{item.points} Poin
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-stone-900 dark:text-white text-base group-hover:text-orange-600 transition-colors flex items-center gap-2 line-clamp-1">
                                            {item.items} <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                                        </h3>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] text-stone-500 font-mono flex items-center gap-1">
                                                <CalendarDays className="w-3 h-3" /> {dateStr}
                                            </span>
                                            {timeStr && (
                                                <div className="flex items-center gap-1 bg-stone-50 dark:bg-stone-800 px-1.5 py-0.5 rounded-md">
                                                    <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300">{timeStr}</span>
                                                    <span className={`text-[8px] font-black px-1 py-0.5 rounded ${ampm === 'PM' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                        {ampm}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {item.distance && (
                                            <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-500 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                <MapPin className="w-2.5 h-2.5" /> {item.distance} km
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-col gap-1.5 text-[11px] text-stone-600 dark:text-stone-400">
                                    <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1"></div>
                                        <div className="flex gap-1">
                                            <span className="font-bold text-stone-900 dark:text-stone-300">Dari:</span>
                                            <span className="line-clamp-1">{item.from}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1"></div>
                                        <div className="flex gap-1">
                                            <span className="font-bold text-stone-900 dark:text-stone-300">Ke:</span>
                                            <span className="line-clamp-1">{item.to}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
};
