
import React from 'react';
import { MapPin, ArrowRight, X } from 'lucide-react';
import { Button } from '../components/Button';

interface AddressWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: () => void;
  userName?: string;
}

export const AddressWarningModal: React.FC<AddressWarningModalProps> = ({ isOpen, onClose, onNavigate, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl relative overflow-hidden border-2 border-orange-500/20 animate-in zoom-in-95 duration-300">
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-orange-50 dark:from-orange-900/20 to-transparent pointer-events-none"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="p-8 text-center relative z-10">
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-white dark:ring-stone-900">
            <MapPin className="w-10 h-10 text-orange-600 animate-bounce" />
          </div>

          <h3 className="text-2xl font-black text-stone-900 dark:text-white uppercase italic tracking-tight mb-3">
            Lengkapi Alamat
          </h3>
          
          <p className="text-sm text-stone-600 dark:text-stone-300 font-medium leading-relaxed mb-8">
            Halo <span className="text-orange-600 font-bold">{userName || 'User'}</span>, akun Anda belum memiliki alamat tersimpan. Mohon isi alamat untuk memudahkan proses transaksi donasi.
          </p>

          <div className="space-y-3">
            <Button 
              onClick={onNavigate}
              className="h-14 w-full rounded-2xl font-black uppercase tracking-widest bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-xl shadow-orange-500/30 border-0"
            >
              Isi Alamat Sekarang <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <button 
              onClick={onClose}
              className="w-full py-3 text-xs font-bold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 uppercase tracking-widest transition-colors"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
