
import React, { useState, useEffect } from 'react';
import { Truck, ArrowRight, MapPin, X, Navigation, MessageCircle, ArrowDown, CheckCircle2, Clock, PackageCheck, UserCheck, Phone, Box, ShieldCheck, Bike, Car } from 'lucide-react';
import { Button } from '../../components/Button';
import { DistributionTask, ClaimHistoryItem, UserData, FoodItem, Address } from '../../../types';
import { db } from '../../../services/db';

interface ExtendedDistributionTask extends DistributionTask {
    volunteerId?: string;
    // Expanded Data for Detail View
    fullData: {
        donorName: string;
        donorPhone: string;
        donorLocation: string;
        receiverName: string;
        receiverPhone: string;
        receiverLocation: string;
        items: string;
        quantity: string;
        imageUrl: string;
        description: string;
        ingredients: string[];
        points: number;
        foodCondition: number;
        vehicle: string;
        status: string;
    }
}

interface DistributionProps {
    claims?: ClaimHistoryItem[];
    users?: UserData[]; // Users data for phone lookup
    inventory?: FoodItem[]; // Inventory for ingredients lookup
    allAddresses?: Address[];
}

export const Distribution: React.FC<DistributionProps> = ({ claims = [], users = [], inventory = [], allAddresses = [] }) => {
    const [activeDeliveries, setActiveDeliveries] = useState<ExtendedDistributionTask[]>([]);
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'on_progress' | 'completed'>('all');
    const [showAssignVolunteerModal, setShowAssignVolunteerModal] = useState<string | null>(null);
    const [showDetailModal, setShowDetailModal] = useState<ExtendedDistributionTask | null>(null);

    // Priority Map for Sorting
    const priorityMap: Record<string, number> = {
        'pending': 1,
        'picking_up': 2,
        'delivering': 2,
        'completed': 3
    };

    // Perbarui list hanya jika data claims berubah
    useEffect(() => {
        const tasks: ExtendedDistributionTask[] = claims
            // FILTER: Hanya tampilkan yang deliveryMethod-nya 'delivery'
            .filter(c => c.deliveryMethod === 'delivery')
            .map(c => {
                // 1. Lookup Provider Info
                const providerUser = users.find(u => String(u.id).trim() === String(c.providerId).trim());
                const providerAddr = allAddresses.find(a => String(a.userId) === String(c.providerId) && a.isPrimary) || allAddresses.find(a => String(a.userId) === String(c.providerId));
                const donorName = providerAddr ? providerAddr.label : c.providerName;
                const donorPhone = providerUser?.phone || providerAddr?.phone || '6285215376975';
                const donorLocation = providerAddr?.fullAddress || c.location?.address || 'Lokasi Donatur';

                // 2. Lookup Receiver Info
                const receiverUser = users.find(u => String(u.id).trim() === String(c.receiverId).trim());
                const receiverAddr = allAddresses.find(a => String(a.userId) === String(c.receiverId) && a.isPrimary) || allAddresses.find(a => String(a.userId) === String(c.receiverId));
                const receiverName = receiverAddr ? receiverAddr.label : (c.receiverName || 'Penerima');
                const receiverPhone = c.receiverPhone || receiverUser?.phone || receiverAddr?.phone || '6285215376975';
                const receiverLocation = receiverAddr?.fullAddress || (c as any).receiverLocation?.address || 'Lokasi Penerima';

                // 3. Lookup Food Details
                const foodItem = inventory.find(i => String(i.id).trim() === String(c.foodId).trim());
                const ingredients = foodItem?.aiVerification?.ingredients || [];

                // Logic Vehicle Recommendation
                const isLargeQuantity = (c.claimedQuantity || '').toLowerCase().includes('box') && parseInt(c.claimedQuantity || '0') > 5;
                const vehicle = isLargeQuantity ? 'Mobil' : 'Motor';

                const taskStatus: any = c.status === 'completed' ? 'completed' : c.courierStatus === 'picking_up' ? 'picking_up' : c.courierStatus === 'delivering' ? 'delivering' : 'pending';

                return {
                    id: c.id,
                    volunteer: c.courierName || 'Belum Ditugaskan',
                    volunteerId: c.volunteerId,
                    from: donorName,
                    to: receiverName,
                    status: taskStatus,
                    startTime: c.date,
                    priority: 'normal' as 'normal',
                    fullData: {
                        donorName: donorName,
                        donorPhone,
                        donorLocation,
                        receiverName: receiverName,
                        receiverPhone,
                        receiverLocation,
                        items: c.foodName,
                        quantity: c.claimedQuantity || '1 Porsi',
                        imageUrl: c.imageUrl,
                        description: c.description || 'Tidak ada deskripsi',
                        ingredients,
                        points: c.socialImpact?.totalPoints || 0,
                        foodCondition: (c as any).foodCondition || 0,
                        vehicle,
                        status: c.status
                    }
                };
            })
            // PRIORITY SORTING:
            // 1. Belum ditugaskan (pending)
            // 2. Sudah diambil (picking_up/delivering)
            // 3. Sudah selesai (completed)
            .sort((a, b) => {
                const priorityA = priorityMap[a.status] || 99;
                const priorityB = priorityMap[b.status] || 99;
                return priorityA - priorityB;
            });
        setActiveDeliveries(tasks);
    }, [claims, users, inventory, allAddresses]);

    // Filtering logic for the list
    const filteredTasks = activeDeliveries.filter(task => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'pending') return task.status === 'pending';
        if (filterStatus === 'on_progress') return task.status === 'picking_up' || task.status === 'delivering';
        if (filterStatus === 'completed') return task.status === 'completed';
        return true;
    });

    const [isAssigning, setIsAssigning] = useState(false);

    const handleAssignVolunteer = async (taskId: string, volunteerName: string, volunteerId?: string) => {
        setIsAssigning(true);
        try {
            await db.updateClaimStatus(taskId, 'active', {
                courierName: volunteerName,
                volunteerId: volunteerId || '',
                courierStatus: 'picking_up'
            });
            setActiveDeliveries(prev => prev.map(d => d.id === taskId ? { ...d, volunteer: volunteerName, volunteerId, status: 'picking_up' } : d));
            setShowAssignVolunteerModal(null);
            alert(`Tugas berhasil diberikan kepada ${volunteerName}`);
        } catch (error) {
            console.error("Failed to assign volunteer:", error);
            alert("Gagal menugaskan relawan. Coba lagi.");
        } finally {
            setIsAssigning(false);
        }
    };

    // Helper untuk membuka WhatsApp
    const openWhatsApp = (phone: string, message: string) => {
        let targetPhone = "";
        if (phone && phone.length > 5) {
            let cleanPhone = phone.replace(/\D/g, '');
            if (cleanPhone.startsWith('0')) {
                targetPhone = '62' + cleanPhone.slice(1);
            } else if (cleanPhone.startsWith('62')) {
                targetPhone = cleanPhone;
            } else {
                targetPhone = '62' + cleanPhone;
            }
        } else {
            // Fallback Default Admin
            targetPhone = "6285215376975";
        }
        window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // REAL-TIME LOOKUP FUNCTION
    // Mencari data relawan langsung dari array 'users' saat tombol diklik
    const getVolunteerPhone = (name: string, id?: string): string => {
        // 1. Try Exact ID Match
        if (id) {
            const userById = users.find(u => String(u.id).trim() === String(id).trim());
            if (userById && userById.phone) return userById.phone;
        }

        // 2. Try Exact Name Match
        if (name) {
            const userByName = users.find(u => u.name.trim().toLowerCase() === name.trim().toLowerCase());
            if (userByName && userByName.phone) return userByName.phone;

            // 3. Try Fuzzy Name Match (Contains) - Handle "Budi" vs "Budi Santoso"
            const userByFuzzy = users.find(u =>
                u.name.toLowerCase().includes(name.toLowerCase()) ||
                name.toLowerCase().includes(u.name.toLowerCase())
            );
            if (userByFuzzy && userByFuzzy.phone) return userByFuzzy.phone;
        }

        return "";
    };

    const handleChatVolunteer = (volunteerName: string, volunteerId?: string) => {
        const phone = getVolunteerPhone(volunteerName, volunteerId);
        const message = `Halo Relawan ${volunteerName}, saya Admin Logistik Food AI Rescue. Status pengiriman bagaimana?`;
        openWhatsApp(phone, message);
    };

    const handleChatDonor = (data: ExtendedDistributionTask['fullData']) => {
        const message = `Halo Donatur *${data.donorName}*, saya Admin Food AI Rescue. Terkait pengambilan donasi *${data.items}*...`;
        openWhatsApp(data.donorPhone, message);
    };

    const handleChatReceiver = (data: ExtendedDistributionTask['fullData']) => {
        const message = `Halo Penerima *${data.receiverName}*, saya Admin Food AI Rescue. Terkait pengiriman donasi *${data.items}*...`;
        openWhatsApp(data.receiverPhone, message);
    };

    const pendingCount = activeDeliveries.filter(d => d.status === 'pending').length;
    const activeCount = activeDeliveries.filter(d => d.status === 'picking_up' || d.status === 'delivering').length;

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-black text-stone-900 dark:text-white flex items-center gap-3 uppercase italic tracking-tighter">
                    <Truck className="w-8 h-8 text-orange-600" /> Distribusi & Logistik
                </h2>

                {/* Filter Status Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar w-full sm:w-auto">
                    {(['all', 'pending', 'on_progress', 'completed'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${filterStatus === status
                                ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-500 hover:border-orange-500/50'
                                }`}
                        >
                            {status === 'all' ? 'SEMUA' : status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-stone-900 p-6 rounded-[1.5rem] border border-stone-200 dark:border-stone-800 shadow-sm">
                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Total Pengiriman</h4>
                    <p className="text-3xl font-black text-stone-900 dark:text-white italic">{activeDeliveries.length}</p>
                </div>
                <div className="bg-white dark:bg-stone-900 p-6 rounded-[1.5rem] border border-stone-200 dark:border-stone-800 shadow-sm">
                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Sedang Berjalan</h4>
                    <p className="text-3xl font-black text-orange-600 italic">{activeCount}</p>
                </div>
                <div className="bg-white dark:bg-stone-900 p-6 rounded-[1.5rem] border border-stone-200 dark:border-stone-800 shadow-sm">
                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Butuh Relawan</h4>
                    <p className="text-3xl font-black text-red-500 italic">{pendingCount}</p>
                </div>
            </div>

            <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-[2.5rem] border-2 border-dashed border-stone-100 dark:border-stone-800 flex flex-col items-center justify-center gap-3">
                        <Box className="w-10 h-10 text-stone-200" />
                        <p className="text-stone-400 font-black uppercase text-[10px] tracking-widest">
                            {filterStatus === 'all' ? 'Belum ada aktivitas distribusi aktif' : `Tidak ada data dengan status ${filterStatus.replace('_', ' ')}`}
                        </p>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <div key={task.id} className="bg-white dark:bg-stone-900 p-6 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-orange-500/30 transition-all gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[9px] font-black bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded text-stone-500 tracking-widest">{task.id}</span>
                                    <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-sm ${task.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                        task.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                                            'bg-blue-100 text-blue-700 border border-blue-200'
                                        }`}>
                                        {task.status === 'pending' ? 'Belum Ditugaskan' : task.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex-1 max-w-[150px]">
                                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">Asal</p>
                                        <p className="font-bold text-sm text-stone-800 dark:text-stone-200 truncate">{task.from}</p>
                                    </div>
                                    <div className="flex flex-col items-center pt-3">
                                        <ArrowRight className="w-4 h-4 text-orange-500 opacity-30" />
                                    </div>
                                    <div className="flex-1 max-w-[150px]">
                                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">Tujuan</p>
                                        <p className="font-bold text-sm text-stone-800 dark:text-stone-200 truncate">{task.to}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Relawan</p>
                                        <p className="text-xs font-black text-stone-700 dark:text-stone-300 uppercase italic">{task.volunteer}</p>
                                    </div>
                                    {task.volunteer !== 'Belum Ditugaskan' && (
                                        <Button
                                            onClick={() => handleChatVolunteer(task.volunteer, task.volunteerId)}
                                            className="h-10 px-4 bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-lg shadow-green-500/20 flex items-center gap-2 rounded-xl w-auto"
                                        >
                                            <MessageCircle className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Chat WA</span>
                                        </Button>
                                    )}
                                </div>

                                {task.status === 'pending' ? (
                                    <Button className="h-10 text-[10px] font-black tracking-widest px-6 w-full md:w-auto" onClick={() => setShowAssignVolunteerModal(task.id)}>TUGASKAN</Button>
                                ) : (
                                    <Button variant="outline" className="h-10 text-[10px] font-black tracking-widest px-6 border-2 w-full md:w-auto" onClick={() => setShowDetailModal(task)}>DETAIL STATUS</Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* MISSION DETAIL MODAL (TABLET OPTIMIZED) */}
            {showDetailModal && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-stone-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-white/5 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-950">
                            <div>
                                <h3 className="text-xl font-black text-stone-900 dark:text-white uppercase italic tracking-tighter">Mission Control</h3>
                                <p className="text-xs text-stone-500 font-bold uppercase tracking-widest mt-1">ID: {showDetailModal.id} • Relawan: {showDetailModal.volunteer}</p>
                            </div>
                            <button onClick={() => setShowDetailModal(null)} className="p-3 bg-white dark:bg-stone-800 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors border border-stone-200 dark:border-stone-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-[#FDFBF7] dark:bg-stone-900">
                            {/* 1. Hero Summary */}
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-1/3 aspect-square md:aspect-video rounded-3xl overflow-hidden relative shadow-lg group">
                                    <img src={showDetailModal.fullData.imageUrl} alt="Food" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                                        <h4 className="text-white font-black text-lg leading-tight">{showDetailModal.fullData.items}</h4>
                                        <p className="text-white/80 text-xs font-medium">{showDetailModal.fullData.quantity}</p>
                                    </div>
                                </div>

                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-[2rem] border border-blue-100 dark:border-blue-900/30 flex flex-col justify-center items-center text-center">
                                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Transportasi</p>
                                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-black text-xl">
                                            {showDetailModal.fullData.vehicle === 'Motor' ? <Bike className="w-6 h-6" /> : <Car className="w-6 h-6" />}
                                            {showDetailModal.fullData.vehicle}
                                        </div>
                                    </div>
                                    <div className="bg-orange-50 dark:bg-orange-900/10 p-5 rounded-[2rem] border border-orange-100 dark:border-orange-900/30 flex flex-col justify-center items-center text-center">
                                        <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-2">Jarak Tempuh</p>
                                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-black text-xl">
                                            <Navigation className="w-6 h-6" /> {showDetailModal.fullData.distanceStr}
                                        </div>
                                    </div>
                                    <div className="col-span-2 bg-white dark:bg-stone-800 p-5 rounded-[2rem] border border-stone-200 dark:border-stone-700">
                                        <h5 className="font-black text-xs text-stone-900 dark:text-white uppercase tracking-widest mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-500" /> Kondisi Paket</h5>
                                        <p className="text-sm text-stone-600 dark:text-stone-300 italic">"{showDetailModal.fullData.description}"</p>
                                        {showDetailModal.fullData.ingredients.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {showDetailModal.fullData.ingredients.map((ing, i) => (
                                                    <span key={i} className="text-[9px] font-bold bg-stone-100 dark:bg-stone-900 px-2 py-1 rounded border border-stone-200 dark:border-stone-700 text-stone-500">{ing}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Timeline & Logistics */}
                            <div className="bg-white dark:bg-stone-900 p-6 md:p-8 rounded-[2.5rem] border border-stone-200 dark:border-stone-800">
                                <h3 className="font-black text-stone-900 dark:text-white uppercase italic tracking-tighter mb-8 text-lg">Logistik & Kontak</h3>

                                <div className="relative pl-4 space-y-10 border-l-2 border-dashed border-stone-200 dark:border-stone-700 ml-2">
                                    {/* Pickup Point */}
                                    <div className="relative">
                                        <div className="absolute -left-[23px] top-0 w-6 h-6 bg-orange-500 rounded-full border-4 border-white dark:border-stone-900 shadow-sm flex items-center justify-center text-[10px] text-white font-bold">1</div>
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">TITIK PENJEMPUTAN (DONATUR)</p>
                                                <h4 className="font-bold text-stone-900 dark:text-white text-lg">{showDetailModal.fullData.donorName}</h4>
                                                <p className="text-xs text-stone-500 mt-0.5 max-w-md">{showDetailModal.fullData.donorLocation}</p>
                                            </div>
                                            <Button
                                                onClick={() => handleChatDonor(showDetailModal.fullData)}
                                                className="h-10 w-auto px-5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-green-600 hover:bg-green-50 text-[10px] font-black uppercase tracking-widest shadow-none border border-stone-200 dark:border-stone-700 flex items-center gap-2"
                                            >
                                                <MessageCircle className="w-4 h-4" /> Hubungi Donatur
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Tracking Status Steps */}
                                    <div className="ml-4 p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-100 dark:border-stone-800 space-y-4">
                                        <StatusStep
                                            icon={<Clock className="w-4 h-4" />}
                                            title="Menuju Lokasi"
                                            description="Relawan sedang bergerak ke titik jemput"
                                            status={showDetailModal.status !== 'pending' ? 'completed' : 'active'}
                                            isLast={false}
                                        />
                                        <StatusStep
                                            icon={<PackageCheck className="w-4 h-4" />}
                                            title="Barang Diambil"
                                            description="Donasi telah divalidasi dan dibawa relawan"
                                            status={showDetailModal.status === 'delivering' || showDetailModal.status === 'completed' ? 'completed' : showDetailModal.status === 'picking_up' ? 'active' : 'pending'}
                                            isLast={false}
                                        />
                                        <StatusStep
                                            icon={<UserCheck className="w-4 h-4" />}
                                            title="Selesai Diantar"
                                            description="Donasi diterima oleh penerima manfaat"
                                            status={showDetailModal.status === 'completed' ? 'completed' : showDetailModal.status === 'delivering' ? 'active' : 'pending'}
                                            isLast={true}
                                        />
                                    </div>

                                    {/* Dropoff Point */}
                                    <div className="relative">
                                        <div className="absolute -left-[23px] top-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-stone-900 shadow-sm flex items-center justify-center text-[10px] text-white font-bold">2</div>
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">TITIK PENGANTARAN (PENERIMA)</p>
                                                <h4 className="font-bold text-stone-900 dark:text-white text-lg">{showDetailModal.fullData.receiverName}</h4>
                                                <p className="text-xs text-stone-500 mt-0.5 max-w-md">{showDetailModal.fullData.receiverLocation}</p>
                                            </div>
                                            <Button
                                                onClick={() => handleChatReceiver(showDetailModal.fullData)}
                                                className="h-10 w-auto px-5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-green-600 hover:bg-green-50 text-[10px] font-black uppercase tracking-widest shadow-none border border-stone-200 dark:border-stone-700 flex items-center gap-2"
                                            >
                                                <MessageCircle className="w-4 h-4" /> Hubungi Penerima
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-stone-50 dark:bg-stone-950 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-stone-500">Relawan Bertugas:</span>
                                <div className="flex items-center gap-2 bg-white dark:bg-stone-800 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-700">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-xs font-black uppercase text-stone-800 dark:text-white">{showDetailModal.volunteer}</span>
                                </div>
                            </div>
                            <Button
                                onClick={() => handleChatVolunteer(showDetailModal.volunteer, showDetailModal.volunteerId)}
                                className="w-auto h-12 px-6 bg-[#25D366] hover:bg-[#128C7E] text-white border-0 shadow-lg shadow-green-500/20 font-black uppercase tracking-widest rounded-2xl text-xs flex items-center gap-2"
                            >
                                <MessageCircle className="w-4 h-4" /> Chat Relawan
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showAssignVolunteerModal && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-stone-900 p-8 rounded-[2.5rem] w-full max-w-sm border border-stone-200 dark:border-stone-800 shadow-2xl">
                        <h3 className="font-black text-xl mb-6 text-stone-900 dark:text-white uppercase italic tracking-tight">Pilih Relawan</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {users.filter(u => u.role === 'volunteer').length === 0 ? (
                                <p className="text-center text-stone-400 text-sm py-4">Tidak ada relawan terdaftar.</p>
                            ) : (
                                users.filter(u => u.role === 'volunteer').map(vol => (
                                    <button
                                        key={vol.id}
                                        disabled={isAssigning}
                                        onClick={() => handleAssignVolunteer(showAssignVolunteerModal, vol.name, vol.id)}
                                        className="w-full p-4 text-left bg-stone-50 dark:bg-stone-800 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-500 border border-transparent rounded-2xl text-stone-800 dark:text-stone-200 font-bold transition-all disabled:opacity-50"
                                    >
                                        <p className="font-bold">{vol.name}</p>
                                        <p className="text-xs text-stone-500 mt-0.5">{vol.phone || 'No phone'}</p>
                                    </button>
                                ))
                            )}
                        </div>
                        <Button variant="ghost" className="mt-6 font-black uppercase tracking-widest text-[10px]" onClick={() => setShowAssignVolunteerModal(null)}>BATALKAN</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

// HELPER COMPONENT UNTUK LANGKAH STATUS
const StatusStep = ({ icon, title, description, status, isLast }: { icon: React.ReactNode, title: string, description: string, status: 'completed' | 'active' | 'pending', isLast: boolean }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="flex items-start gap-4 w-full">
                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${status === 'completed' ? 'bg-green-600 text-white' :
                    status === 'active' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' :
                        'bg-stone-200 dark:bg-stone-800 text-stone-400'
                    }`}>
                    {status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : icon}
                </div>
                <div className="flex-1 pt-0.5">
                    <h4 className={`text-xs font-black uppercase tracking-tight ${status === 'pending' ? 'text-stone-400' : 'text-stone-900 dark:text-white'}`}>
                        {title}
                    </h4>
                    <p className={`text-[9px] font-medium leading-relaxed ${status === 'pending' ? 'text-stone-400' : 'text-stone-500'}`}>
                        {description}
                    </p>
                </div>
            </div>
            {!isLast && (
                <div className="flex justify-center w-8 mr-auto ml-0 my-1">
                    <ArrowDown className={`w-3 h-3 ${status === 'completed' ? 'text-green-600' : 'text-stone-200 dark:text-stone-800'}`} />
                </div>
            )}
        </div>
    );
};
