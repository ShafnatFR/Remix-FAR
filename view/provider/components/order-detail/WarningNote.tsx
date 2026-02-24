
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const WarningNote: React.FC = () => {
    return (
        <div className="flex gap-3 items-start p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-800/30">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0" />
            <p className="text-xs text-yellow-800 dark:text-yellow-200 font-medium leading-relaxed">
                Pastikan penerima menunjukkan kode unik atau QR Code pada aplikasi mereka sebelum menyerahkan makanan.
            </p>
        </div>
    );
};
