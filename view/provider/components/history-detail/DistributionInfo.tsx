
import React from 'react';
import { User, Truck, MessageCircle } from 'lucide-react';
import { ProviderOrder } from '../../../../types';

interface DistributionInfoProps {
    receiver: ProviderOrder['receiver'];
    courier?: ProviderOrder['courier'];
    deliveryMethod: ProviderOrder['deliveryMethod'];
}

export const DistributionInfo: React.FC<DistributionInfoProps> = ({ receiver, courier, deliveryMethod }) => {
    
    const handleContact = (phone: string | number | undefined, name: string, role: string) => {
        // SAFETY CHECK: Pastikan phone dijadikan string dulu sebelum di-replace
        // Jika phone null/undefined, gunakan string kosong
        const safePhone = String(phone || ""); 
        
        if (!safePhone || safePhone === "undefined" || safePhone.length < 5) {
            alert("Nomor telepon pengguna ini tidak valid atau belum diisi.");
            return;
        }

        const cleanPhone = safePhone.replace(/\D/g, '');
        
        // Fallback jika format lokal 08... ubah ke 628...
        const finalPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

        const text = `Halo ${role} *${name}*, saya dari Donatur Food AI Rescue...`;
        window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    const UserCard = ({ label, data, role }: { label: string, data: { name: string, avatar: string, phone: string }, role: 'Penerima' | 'Relawan' }) => (
        <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${role === 'Penerima' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                {data.avatar}
            </div>
            <div className="flex-1">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{label}</p>
                <p className="font-bold text-stone-900 dark:text-white text-sm">{data.name}</p>
            </div>
            <button 
                onClick={() => handleContact(data.phone, data.name, role)} 
                className="p-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-lg text-stone-500 transition-colors"
            >
                <MessageCircle className="w-4 h-4" />
            </button>
        </div>
    );

    return (
        <div className="space-y-4">
            <h3 className="font-black text-stone-900 dark:text-white text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500" /> Informasi Distribusi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UserCard label="Penerima Manfaat" data={receiver} role="Penerima" />
                {deliveryMethod !== 'pickup' && courier && (
                    <UserCard label="Kurir Relawan" data={courier} role="Relawan" />
                )}
            </div>
        </div>
    );
};
