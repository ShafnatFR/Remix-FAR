
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, ShoppingBag, Package, AlertOctagon, Zap, Leaf } from 'lucide-react';
import { ProviderOrder, Report as ReportType } from '../../../../types';
import { ReportSection } from './ReportSection';
import { DistributionInfo } from './DistributionInfo';
import { Timeline } from './Timeline';
import { ReviewCard } from './ReviewCard';
import { ReviewModal } from './ReviewModal';
import { ReportDetailModal } from '../reports/ReportDetailModal';

interface HistoryDetailProps {
    item: ProviderOrder;
    onBack: () => void;
}

export const HistoryDetail: React.FC<HistoryDetailProps> = ({ item, onBack }) => {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    // Map ProviderOrder.report data to ReportType for compatibility with ReportDetailModal
    const mappedReport: ReportType | null = item.report ? {
        id: `REP-${item.id}`,
        orderId: item.id,
        foodName: item.foodName,
        title: item.report.issue,
        description: item.report.description,
        date: item.timestamps.completedAt || '-',
        status: 'new',
        reporter: item.receiver.name,
        isUrgent: item.report.isUrgent,
        evidenceUrl: item.report.evidenceUrl || 'https://images.unsplash.com/photo-1584263343361-901ce5794591?q=80&w=800' // Mock fallback if missing
    } : null;

    return (
        <div className="fixed inset-0 bg-[#FDFBF7] dark:bg-stone-900 z-[100] overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 w-full">
                <img src={item.imageUrl} alt={item.foodName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <button onClick={onBack} className="absolute top-4 left-4 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors z-10">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-2">
                        {item.status === 'cancelled' ? (
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                                <AlertOctagon className="w-3 h-3" /> Dibatalkan
                            </span>
                        ) : (
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Selesai
                            </span>
                        )}
                        {item.report && (
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 animate-pulse">
                                <AlertTriangle className="w-3 h-3" /> Dilaporkan
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl font-black text-white leading-tight drop-shadow-md mb-1">{item.foodName}</h1>
                    <p className="text-white/80 text-sm font-medium line-clamp-2">{item.description}</p>
                </div>
            </div>

            <div className="p-6 md:p-8 space-y-8 max-w-3xl mx-auto -mt-6 bg-[#FDFBF7] dark:bg-stone-950 rounded-t-[2.5rem] relative pb-20">
                
                {/* Laporan Masalah Section */}
                {item.report && (
                    <ReportSection 
                        report={item.report} 
                        orderId={item.id} 
                        foodName={item.foodName}
                        onOpenDetail={() => setShowReportModal(true)}
                    />
                )}

                {/* Info Utama */}
                <div className="flex items-center justify-between p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                    <div>
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Jumlah</p>
                        <p className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-orange-500" /> {item.quantity}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Metode</p>
                        <p className="text-sm font-bold text-stone-900 dark:text-white capitalize flex items-center gap-2 justify-end">
                            {item.deliveryMethod === 'pickup' ? 'Ambil Sendiri' : 'Diantar Relawan'} <Package className="w-4 h-4 text-blue-500" />
                        </p>
                    </div>
                </div>

                {/* Social Impact Badges - NEW SECTION */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                            <Zap className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Poin Didapat</p>
                            <p className="text-lg font-black text-amber-600 dark:text-amber-400">+{item.impact?.points?.toLocaleString() || 0}</p>
                        </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                            <Leaf className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Jejak Karbon</p>
                            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">-{item.impact?.co2?.toFixed(1) || 0} kg</p>
                        </div>
                    </div>
                </div>

                {/* Informasi Distribusi */}
                <DistributionInfo 
                    receiver={item.receiver} 
                    courier={item.courier} 
                    deliveryMethod={item.deliveryMethod} 
                />

                {/* Timeline Transaksi */}
                <Timeline 
                    timestamps={item.timestamps} 
                    deliveryMethod={item.deliveryMethod}
                    receiverName={item.receiver.name}
                />

                {/* Rating & Review */}
                {item.rating ? (
                    <ReviewCard rating={item.rating} onClick={() => setShowReviewModal(true)} />
                ) : (
                    <div className="p-6 text-center bg-stone-50 dark:bg-stone-900 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 text-stone-400 text-sm">
                        Belum ada ulasan untuk pesanan ini.
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {showReviewModal && item.rating && (
                <ReviewModal 
                    rating={item.rating} 
                    receiverName={item.receiver.name} 
                    onClose={() => setShowReviewModal(false)} 
                />
            )}

            {/* Report Detail Modal - REUSE EXISTING MODAL LOGIC */}
            {showReportModal && mappedReport && (
                <ReportDetailModal 
                    report={mappedReport}
                    onClose={() => setShowReportModal(false)}
                    onShowProductDetail={() => {}} // No need for nesting in history
                    onHandleAction={() => setShowReportModal(false)}
                    onContactAdmin={() => {
                        const adminPhone = "6285215376975";
                        window.open(`https://wa.me/${adminPhone}?text=Halo Admin, saya ingin menanggapi laporan ID ${mappedReport.id}`, '_blank');
                    }}
                />
            )}
        </div>
    );
};
