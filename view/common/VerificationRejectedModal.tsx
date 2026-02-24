
import React from 'react';
import { XCircle, MessageCircle, LogOut, ShieldAlert } from 'lucide-react';
import { Button } from '../components/Button';

interface VerificationRejectedModalProps {
  onLogout: () => void;
  userName?: string;
}

export const VerificationRejectedModal: React.FC<VerificationRejectedModalProps> = ({ onLogout, userName }) => {
  const handleContactAdmin = () => {
    const adminNumber = "6285215376975"; // Nomor Super Admin
    const message = `Halo Admin Food AI Rescue,\n\nSaya pengguna dengan nama *${userName || 'User'}*.\nAkun saya berstatus *Non-Aktif / Ditolak*.\n\nSaya ingin mengajukan permohonan peninjauan kembali / banding. Terima kasih.`;
    
    window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[999] bg-[#0F0502] flex items-center justify-center p-6 animate-in fade-in duration-500">
        {/* Background Ambience - Red/Dark for Rejection */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-stone-800/30 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-sm bg-[#1C100B] border border-red-900/30 rounded-[2.5rem] p-8 text-center relative shadow-2xl shadow-red-900/20 overflow-hidden">
            
            {/* Top Decor */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-800"></div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-red-500/30 relative">
                    <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse opacity-20"></div>
                    <XCircle className="w-10 h-10 text-red-600" />
                    <div className="absolute bottom-0 right-0 bg-[#1C100B] rounded-full p-1 border border-red-900/30">
                        <ShieldAlert className="w-4 h-4 text-stone-400" />
                    </div>
                </div>

                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">
                    Akses Ditolak
                </h2>
                
                <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-4 mb-6 w-full">
                    <p className="text-red-200/80 text-xs font-medium leading-relaxed">
                        Halo <strong className="text-red-500">{userName}</strong>, mohon maaf verifikasi akun Anda tidak disetujui atau akun telah dinonaktifkan oleh Admin.
                    </p>
                    <p className="text-stone-500 text-[10px] mt-2 italic">
                        Silakan hubungi admin jika ini adalah kesalahan.
                    </p>
                </div>

                <Button 
                    onClick={handleContactAdmin}
                    className="h-14 w-full rounded-2xl font-black uppercase tracking-widest bg-stone-800 hover:bg-stone-700 text-white shadow-lg border border-stone-700 flex items-center justify-center gap-2 mb-4"
                >
                    <MessageCircle className="w-5 h-5 fill-current" /> Ajukan Banding
                </Button>

                <button 
                    onClick={onLogout}
                    className="text-stone-500 hover:text-red-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors py-2"
                >
                    <LogOut className="w-4 h-4" /> Keluar Aplikasi
                </button>
            </div>
        </div>
    </div>
  );
};
