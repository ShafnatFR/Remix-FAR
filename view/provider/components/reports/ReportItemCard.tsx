import React from 'react';
import { AlertTriangle, ShoppingBag, User, Calendar, Package } from 'lucide-react';
import { Report } from '../../../../types';

interface ReportItemCardProps {
    report: Report;
    layoutMode: 'list' | 'grid';
    onClick: () => void;
}

export const ReportItemCard: React.FC<ReportItemCardProps> = ({ report, layoutMode, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className={`
                bg-white dark:bg-stone-900 rounded-[1.5rem] border border-stone-200 dark:border-stone-800 shadow-sm cursor-pointer 
                hover:border-orange-500/50 hover:shadow-md transition-all group overflow-hidden flex flex-col justify-between
                ${layoutMode === 'grid' ? 'p-5' : 'p-4 md:p-5 flex-row items-center gap-6'}
            `}
        >
            <div className={`flex-1 ${layoutMode === 'list' ? 'min-w-0' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-5 h-5 shrink-0 transition-colors ${report.isUrgent ? 'text-red-500' : 'text-orange-500 group-hover:text-orange-600'}`} />
                        <div className="min-w-0">
                            <h3 className="font-bold text-lg text-stone-900 dark:text-white group-hover:text-orange-600 transition-colors truncate">{report.title}</h3>
                            <p className="text-xs text-stone-500 font-medium truncate flex items-center gap-1">
                                <Package className="w-3 h-3" /> {report.foodName}
                            </p>
                        </div>
                        {report.isUrgent && <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold uppercase shrink-0">Urgent</span>}
                    </div>
                    {layoutMode === 'grid' && (
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase shrink-0 ${report.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{report.status}</span>
                    )}
                </div>
                <p className={`text-sm text-stone-600 dark:text-stone-300 mb-3 ${layoutMode === 'grid' ? 'line-clamp-2' : 'line-clamp-1'}`}>{report.description}</p>
                
                <div className="flex justify-between items-center text-xs text-stone-500">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded">
                            <ShoppingBag className="w-3 h-3" /> {report.orderId || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {report.reporter}</span>
                    </div>
                    {layoutMode === 'grid' && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {report.date}</span>}
                </div>
            </div>

            {layoutMode === 'list' && (
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${report.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{report.status}</span>
                    <span className="flex items-center gap-1 text-xs text-stone-400"><Calendar className="w-3 h-3" /> {report.date}</span>
                </div>
            )}
        </div>
    );
};