
import React, { useMemo } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, ArrowLeft, Megaphone, Sparkles, Package, Truck, Star, XCircle, PlayCircle } from 'lucide-react';
import { Notification, UserRole, ClaimHistoryItem, BroadcastMessage, FoodItem } from '../../types';
import { getDateTimeParts } from '../../utils/transformers';
import { SOCIAL_SYSTEM } from '../../constants';

interface NotificationsPageProps {
  role: UserRole;
  onBack: () => void;
  claimHistory?: ClaimHistoryItem[];
  inventory?: FoodItem[]; 
  userName?: string;
  broadcastMessages?: BroadcastMessage[];
  currentUserId?: string; 
}

// Helper untuk membuat Badge Kecil di dalam teks
const BadgeText = ({ text, type = 'default' }: { text: string, type?: 'user' | 'food' | 'info' | 'highlight' | 'default' }) => {
    let colors = "";
    switch(type) {
        case 'user': 
            colors = "bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 border-stone-300 dark:border-stone-600"; 
            break;
        case 'food': 
            colors = "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800"; 
            break;
        case 'info':
            colors = "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
            break;
        case 'highlight':
            colors = "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
            break;
        default:
            colors = "bg-gray-100 text-gray-700";
    }

    return (
        <span className={`inline-block px-1.5 py-0.5 mx-0.5 rounded text-[10px] font-black uppercase tracking-wider border align-middle ${colors}`}>
            {text}
        </span>
    );
};

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ role, onBack, claimHistory = [], inventory = [], userName, broadcastMessages = [], currentUserId }) => {
  
  // Custom interface untuk notifikasi lokal agar support statusLabel
  interface LocalNotification extends Notification {
      statusLabel?: { text: string, colorClass: string };
  }

  const notifications = useMemo(() => {
    const list: LocalNotification[] = [];

    // 1. BROADCAST MESSAGES (Global)
    broadcastMessages.forEach((msg) => {
      const isTargeted = msg.target === 'all' || 
                         (msg.target === 'provider' && role === 'provider') ||
                         (msg.target === 'volunteer' && role === 'volunteer') ||
                         (msg.target === 'receiver' && role === 'receiver');

      if (isTargeted) {
        list.push({
          id: `broadcast-${msg.id}`,
          type: 'info',
          title: msg.title,
          message: msg.content,
          date: msg.sentAt,
          isRead: false,
          priority: 'medium'
        });
      }
    });

    // 2. PROVIDER NOTIFICATIONS (Donatur)
    if (role === 'provider') {
        
        // --- A. MANAJEMEN STOK & KUALITAS ---
        inventory.forEach(item => {
            if (currentUserId && String(item.providerId) === String(currentUserId)) {
                const dateParts = getDateTimeParts(item.createdAt);
                
                // A1. Hasil Audit AI
                const qualityScore = item.aiVerification?.halalScore || 100;
                list.push({
                    id: `inv-upload-${item.id}`,
                    type: 'success',
                    title: 'Produk Berhasil Terbit',
                    message: (
                        <span>
                            Menu <BadgeText text={item.name} type="food" /> lolos audit AI dengan Skor Kualitas <BadgeText text={`${qualityScore}%`} type="info" />. Stok kini tersedia bagi penerima.
                        </span>
                    ),
                    date: dateParts ? `${dateParts.date} ${dateParts.time}` : 'Baru saja',
                    isRead: true 
                });

                // A2. Stok Habis
                if (item.currentQuantity === 0) {
                    list.push({
                        id: `inv-empty-${item.id}`,
                        type: 'info',
                        title: 'Stok Habis',
                        message: (
                            <span>
                                Luar biasa! Semua porsi <BadgeText text={item.name} type="food" /> telah habis diklaim.
                            </span>
                        ),
                        date: 'Hari ini',
                        isRead: true,
                        statusLabel: { text: 'SOLD OUT', colorClass: 'bg-stone-600' }
                    });
                }

                // A3. Peringatan Kedaluwarsa (Warning < 1 Jam)
                if (item.currentQuantity > 0 && (item.distributionEnd || item.expiryTime)) {
                    const now = new Date();
                    let expDate = new Date();
                    
                    const timeStr = item.distributionEnd || item.expiryTime;
                    if (timeStr.includes('T') || timeStr.includes('/')) {
                        // Full ISO or Date string
                        expDate = new Date(timeStr);
                    } else if (timeStr.includes(':')) {
                        // Time only HH:MM, assume today
                        const [h, m] = timeStr.split(':');
                        expDate.setHours(parseInt(h), parseInt(m), 0, 0);
                    }

                    const diffMs = expDate.getTime() - now.getTime();
                    const diffHours = diffMs / (1000 * 60 * 60);
                    
                    if (diffHours > 0 && diffHours <= 1) {
                        list.push({
                            id: `inv-exp-warn-${item.id}`,
                            type: 'warning',
                            title: 'Stok Segera Expired',
                            message: (
                                <span>
                                    Perhatian! Stok <BadgeText text={item.name} type="food" /> akan melewati batas waktu distribusi dalam 1 jam.
                                </span>
                            ),
                            date: 'Segera',
                            isRead: false,
                            priority: 'high',
                            statusLabel: { text: 'EXPIRING', colorClass: 'bg-red-500' }
                        });
                    }
                }
            }
        });

        // Variables for Gamification Stats
        let totalPoints = 0;
        let weeklySavedKg = 0;
        let weeklyCo2 = 0;

        // --- B. TRANSAKSI & INTERAKSI ---
        claimHistory.forEach(c => {
            if (currentUserId && String(c.providerId) === String(currentUserId)) { 
                
                // SKENARIO 3 (Transaksi): KONFIRMASI SELESAI
                if (c.status === 'completed') {
                    list.push({
                        id: `prov-claim-done-${c.id}`,
                        type: 'success',
                        title: 'Donasi Berhasil Diserahkan',
                        message: (
                            <span>
                                Terima kasih! Donasi <BadgeText text={c.foodName} type="food" /> telah diterima oleh <BadgeText text={c.receiverName || 'Penerima'} type="user" />.
                            </span>
                        ),
                        date: c.date,
                        isRead: true,
                        statusLabel: { text: 'SELESAI', colorClass: 'bg-green-600' }
                    });

                    // Accumulate Stats
                    totalPoints += (c.socialImpact?.totalPoints || 0);
                    weeklySavedKg += (c.socialImpact?.wasteReduction || 0);
                    weeklyCo2 += (c.socialImpact?.co2Saved || 0);
                }
                // SKENARIO 2 (Transaksi): RELAWAN MENUJU LOKASI
                else if (c.courierStatus === 'picking_up') {
                    list.push({
                        id: `prov-courier-pickup-${c.id}`,
                        type: 'info',
                        title: 'Kurir Sedang Menjemput',
                        message: (
                            <span>
                                Relawan <BadgeText text={c.courierName || 'Relawan'} type="user" /> sedang dalam perjalanan untuk mengambil donasi <BadgeText text={c.foodName} type="food" />.
                            </span>
                        ),
                        date: c.date,
                        isRead: false,
                        priority: 'high',
                        statusLabel: { text: 'KURIR MENUJU LOKASI', colorClass: 'bg-blue-500' }
                    });
                }
                // SKENARIO 1 (Transaksi): PESANAN MASUK
                else if (c.status === 'active') {
                    list.push({
                        id: `prov-claim-new-${c.id}`,
                        type: 'warning',
                        title: 'Pesanan Masuk!',
                        message: (
                            <span>
                                <BadgeText text={c.receiverName || 'Penerima'} type="user" /> baru saja mengklaim <BadgeText text={c.foodName} type="food" />. Mohon siapkan pesanan.
                            </span>
                        ),
                        date: c.date,
                        isRead: false,
                        priority: 'high',
                        statusLabel: { text: 'PERLU DISIAPKAN', colorClass: 'bg-red-500' }
                    });
                }

                // B1. Ulasan Baru
                if (c.rating) {
                    list.push({
                        id: `review-new-${c.id}`,
                        type: 'success',
                        title: 'Ulasan Diterima',
                        message: (
                            <span>
                                <BadgeText text={c.receiverName || 'Penerima'} type="user" /> memberikan {c.rating} bintang untuk <BadgeText text={c.foodName} type="food" />: "{c.review || 'Enak sekali, terima kasih!'}"
                            </span>
                        ),
                        date: c.date,
                        isRead: true,
                        statusLabel: { text: `★ ${c.rating}.0`, colorClass: 'bg-yellow-500' }
                    });
                }

                // B2. Laporan Masalah
                if (c.isReported) {
                    list.push({
                        id: `report-new-${c.id}`,
                        type: 'error',
                        title: 'Laporan Masalah',
                        message: (
                            <span>
                                Terdapat laporan kualitas pada pesanan <BadgeText text={`ID: ${c.id}`} type="highlight" />. Mohon periksa detail untuk mengajukan banding.
                            </span>
                        ),
                        date: c.date,
                        isRead: false,
                        priority: 'high',
                        statusLabel: { text: 'BUTUH TINDAKAN', colorClass: 'bg-red-600' }
                    });
                }
            }
        });

        // --- C. GAMIFIKASI & DAMPAK ---
        
        // C1. Kenaikan Peringkat (Simulasi berdasarkan Total Poin)
        if (totalPoints > 0) {
            const providerTiers = SOCIAL_SYSTEM.provider.tiers;
            const currentRank = providerTiers.slice().reverse().find(t => totalPoints >= t.minPoints) || providerTiers[0];
            
            // Tampilkan notifikasi "Status Rank" (bisa diubah logicnya untuk trigger hanya saat naik rank jika ada state sebelumnya)
            list.push({
                id: `rank-status-${currentRank.id}`,
                type: 'success',
                title: 'Level Up!',
                message: (
                    <span>
                        Selamat! Anda kini mencapai peringkat <BadgeText text={currentRank.name} type="highlight" />. Nikmati benefit baru di dashboard.
                    </span>
                ),
                date: 'Pencapaian',
                isRead: true,
                statusLabel: { text: 'RANK UP', colorClass: 'bg-purple-600' }
            });
        }

        // C2. Laporan Dampak Mingguan
        if (weeklySavedKg > 0) {
             list.push({
                id: `weekly-impact-summary`,
                type: 'info',
                title: 'Dampak Minggu Ini',
                message: (
                    <span>
                        Minggu ini Anda menyelamatkan <BadgeText text={`${weeklySavedKg.toFixed(1)} kg`} type="food" /> makanan dan mencegah <BadgeText text={`${weeklyCo2.toFixed(1)} kg`} type="info" /> emisi CO2!
                    </span>
                ),
                date: 'Minggu Ini',
                isRead: true,
                statusLabel: { text: 'WEEKLY REPORT', colorClass: 'bg-teal-600' }
            });
        }
    }

    // 3. VOLUNTEER NOTIFICATIONS
    if (role === 'volunteer') {
        claimHistory.forEach((c) => {
            const myVolunteerId = String(currentUserId || '').trim();
            const claimVolunteerId = String(c.volunteerId || '').trim();

            if (myVolunteerId && claimVolunteerId && myVolunteerId === claimVolunteerId) {
                if (c.status === 'completed') {
                    const points = c.socialImpact?.totalPoints || 150;
                    list.push({
                        id: `notif-v-done-${c.id}`,
                        type: 'success',
                        title: 'Misi Selesai',
                        message: (
                            <span>
                                Misi berhasil dijalankan, anda menerima <BadgeText text={`${points} POIN`} type="highlight" />.
                            </span>
                        ),
                        date: c.date,
                        isRead: true,
                        statusLabel: { text: 'SELESAI', colorClass: 'bg-green-600' }
                    });
                } else if (c.status === 'active') {
                     list.push({
                        id: `notif-v-active-${c.id}`,
                        type: 'info',
                        title: 'Misi Berhasil Diambil',
                        message: (
                            <span>
                                Misi mengantar <BadgeText text={c.foodName} type="food" /> berhasil diambil. 
                                Diperuntukkan <BadgeText text={c.providerName} type="user" /> untuk <BadgeText text={c.receiverName || 'Penerima'} type="user" />.
                            </span>
                        ),
                        date: c.date,
                        isRead: false,
                        statusLabel: { text: 'DALAM PROSES', colorClass: 'bg-orange-500' }
                    });
                }
            }
        });
    }

    // 4. RECEIVER NOTIFICATIONS
    if (role === 'receiver') {
        claimHistory.forEach((c) => {
            if (currentUserId && String(c.receiverId) === String(currentUserId)) {
                if (c.status === 'active') {
                    list.push({
                        id: `notif-r-active-${c.id}`,
                        type: 'warning', 
                        title: 'Konfirmasi Klaim',
                        message: (<span>Klaim <BadgeText text={c.foodName} type="food" /> aktif. Kode: <BadgeText text={c.uniqueCode || '???'} type="highlight" />.</span>),
                        date: c.date,
                        isRead: false,
                        priority: 'high'
                    });
                }
                if (c.status === 'completed') {
                    list.push({
                        id: `notif-r-done-${c.id}`,
                        type: 'success',
                        title: 'Pesanan Selesai',
                        message: (<span>Terima kasih! Anda telah menyelamatkan <BadgeText text={c.foodName} type="food" />.</span>),
                        date: c.date,
                        isRead: true
                    });
                }
            }
        });
    }

    return list.reverse(); 
  }, [role, claimHistory, inventory, userName, broadcastMessages, currentUserId]);

  const getIcon = (type: string, id: string) => {
    if (id.startsWith('broadcast-')) return <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg"><Megaphone className="w-5 h-5" /></div>;
    if (id.startsWith('inv-upload')) return <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600"><Package className="w-5 h-5" /></div>;
    if (id.includes('courier')) return <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600"><Truck className="w-5 h-5" /></div>;
    if (id.includes('prov-courier-pickup')) return <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600"><Truck className="w-5 h-5" /></div>;
    if (id.includes('notif-v-active')) return <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600"><Info className="w-5 h-5" /></div>;
    if (id.includes('prov-done') || id.includes('notif-v-done')) return <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600"><CheckCircle className="w-5 h-5" /></div>;
    
    // Icon Mapping Baru untuk Provider
    if (id.includes('review')) return <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600"><Star className="w-5 h-5" /></div>;
    if (id.includes('report')) return <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600"><AlertTriangle className="w-5 h-5" /></div>;
    if (id.includes('inv-empty')) return <div className="w-10 h-10 rounded-xl bg-stone-200 flex items-center justify-center text-stone-600"><XCircle className="w-5 h-5" /></div>;
    if (id.includes('rank')) return <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600"><Sparkles className="w-5 h-5" /></div>;
    if (id.includes('weekly-impact')) return <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600"><Sparkles className="w-5 h-5" /></div>;

    switch (type) {
      case 'success': return <div className="p-2 bg-green-100 rounded-full"><CheckCircle className="w-5 h-5 text-green-500" /></div>;
      case 'warning': return <div className="p-2 bg-amber-100 rounded-full"><Info className="w-5 h-5 text-amber-500" /></div>; 
      case 'report': return <div className="p-2 bg-red-100 rounded-full"><AlertTriangle className="w-5 h-5 text-red-500" /></div>;
      case 'error': return <div className="p-2 bg-red-100 rounded-full"><XCircle className="w-5 h-5 text-red-600" /></div>;
      default: return <div className="p-2 bg-blue-100 rounded-full"><Info className="w-5 h-5 text-blue-500" /></div>;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto min-h-screen pb-24 animate-in slide-in-from-right">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm hover:bg-stone-50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter italic text-stone-900 dark:text-white">Pusat Notifikasi</h1>
            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">Informasi Terkini Akun Anda</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 shadow-sm">{notifications.length} NOTIFIKASI</span>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-32">
              <Bell className="w-16 h-16 text-stone-200 mx-auto mb-4" />
              <p className="text-stone-400 font-black uppercase text-xs tracking-[0.3em]">Tidak ada aktivitas baru</p>
          </div>
        ) : (
          notifications.map(notif => {
            const isBroadcast = notif.id.startsWith('broadcast-');
            const timeParts = getDateTimeParts(notif.date);

            return (
                <div key={notif.id} className={`p-5 rounded-[2rem] border flex gap-4 transition-all duration-300 group ${notif.priority === 'high' ? 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' : notif.isRead ? 'bg-white dark:bg-stone-900 opacity-60' : isBroadcast ? 'bg-[#120D0A] border-orange-500/30 text-white' : 'bg-white dark:bg-stone-900 border-stone-100 shadow-sm hover:shadow-md'}`}>
                <div className="shrink-0">{getIcon(notif.type, notif.id)}</div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-black uppercase tracking-tight italic truncate ${isBroadcast ? 'text-orange-500' : 'text-stone-900 dark:text-white'}`}>{notif.title}</h4>
                        
                        {/* BADGE LOGIC: Prioritaskan statusLabel jika ada, fallback ke Priority jika tidak ada statusLabel */}
                        {notif.statusLabel ? (
                            <span className={`text-[7px] font-black text-white px-1.5 py-0.5 rounded tracking-tighter ml-2 shrink-0 ${notif.statusLabel.colorClass}`}>
                                {notif.statusLabel.text}
                            </span>
                        ) : (
                            <>
                                {isBroadcast && <span className="text-[7px] font-black bg-orange-600 text-white px-1.5 py-0.5 rounded tracking-tighter ml-2 shrink-0">PENGUMUMAN</span>}
                                {notif.priority === 'high' && <span className="text-[7px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded tracking-tighter ml-2 shrink-0">PENTING</span>}
                            </>
                        )}
                    </div>
                    
                    <div className={`text-xs mt-1 leading-relaxed font-medium ${isBroadcast ? 'text-stone-300' : 'text-stone-600 dark:text-stone-400'}`}>
                        {notif.message}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                        {timeParts ? (
                            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-stone-400">
                                <span>{timeParts.date}</span>
                                <span className="text-stone-300 mx-0.5">•</span>
                                <span>{timeParts.time}</span>
                                <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black border ${
                                    timeParts.ampm === 'PM' 
                                    ? 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800' 
                                    : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800'
                                }`}>
                                    {timeParts.ampm}
                                </span>
                            </div>
                        ) : (
                            <p className="text-[9px] text-stone-400 font-black uppercase tracking-widest">{notif.date}</p>
                        )}
                        {!notif.isRead && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse ml-auto"></div>}
                    </div>
                </div>
                </div>
            );
          })
        )}
      </div>

      {notifications.length > 0 && (
          <div className="mt-12 p-6 bg-stone-100 dark:bg-stone-900/50 rounded-3xl border border-stone-200 dark:border-stone-800 text-center">
              <Sparkles className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em]">Terima kasih telah aktif di komunitas Food AI Rescue</p>
          </div>
      )}
    </div>
  );
};
