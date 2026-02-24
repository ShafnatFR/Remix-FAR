
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/Button';

interface ActionBarProps {
    onCancel: () => void;
    onVerify: () => void;
    onComplete?: () => void; // Add handler for completion
    isVerifying: boolean;
    isCompleting?: boolean; // New prop for loading state
    isCompleted?: boolean; 
}

export const ActionBar: React.FC<ActionBarProps> = ({ onCancel, onVerify, onComplete, isVerifying, isCompleting, isCompleted }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border-t border-stone-200 dark:border-stone-800 z-[110] pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="max-w-2xl mx-auto flex gap-3 pointer-events-auto">
                <Button 
                    variant="outline" 
                    className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest border-2 cursor-pointer relative z-20 pointer-events-auto"
                    onClick={onCancel}
                    disabled={isCompleting || isVerifying}
                >
                    Kembali
                </Button>
                
                {isCompleted ? (
                    <Button 
                        onClick={onComplete}
                        isLoading={isCompleting}
                        disabled={isCompleting}
                        className="flex-[2] h-14 rounded-2xl font-black uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-500/20 border-0 relative z-20 transition-all active:scale-95 cursor-pointer pointer-events-auto"
                    >
                        {!isCompleting && <CheckCircle2 className="w-5 h-5 mr-2" />} Selesai & Tutup
                    </Button>
                ) : (
                    <Button 
                        onClick={onVerify}
                        isLoading={isVerifying}
                        className="flex-[2] h-14 rounded-2xl font-black uppercase tracking-widest bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-xl shadow-orange-500/20 border-0 cursor-pointer relative z-20 pointer-events-auto"
                    >
                        <CheckCircle2 className="w-5 h-5 mr-2" /> Verifikasi & Serahkan
                    </Button>
                )}
            </div>
        </div>
    );
};
