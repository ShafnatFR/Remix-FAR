
import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle, Phone } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface ForgotPasswordViewProps {
    onNavigate: (view: 'login' | 'register' | 'forgot-password') => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onNavigate }) => {
    const [method, setMethod] = useState<'email' | 'whatsapp'>('email');
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        setIsSent(true);
    };

    const LEFT_IMAGE_URL = "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=1080&auto=format&fit=crop";

    return (
        <div className="flex w-full min-h-screen bg-[#FDFBF7] font-sans text-stone-900 overflow-hidden">
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-stone-200">
                <div className="absolute inset-0 z-0">
                    <img src={LEFT_IMAGE_URL} alt="Background" className="w-full h-full object-cover opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-white/90 to-transparent"></div>
                </div>

                <div className="relative z-10 animate-in slide-in-from-top-8 duration-700">
                </div>

                <div className="relative z-10 max-w-lg mt-auto mb-12">
                    <h1 className="text-4xl font-black leading-tight mb-4 drop-shadow-sm">
                        KEMBALIKAN AKSES<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-600">AKUN ANDA.</span>
                    </h1>
                    <p className="text-stone-600 font-medium pl-6 border-l-4 border-orange-600">Pilih metode verifikasi yang paling nyaman untuk Anda.</p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative bg-white/80 backdrop-blur-xl border-l border-stone-200">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FDFBF7] via-white to-stone-50 opacity-60"></div>

                <div className="w-full max-w-md relative z-10">
                    <div className="lg:hidden mb-8">
                        <button onClick={() => onNavigate('login')} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors"><ArrowLeft className="w-5 h-5" /> Kembali</button>
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={() => onNavigate('login')}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-all text-xs font-bold uppercase tracking-widest w-fit"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                        </div>
                        <h2 className="text-3xl font-bold text-stone-900 mb-2">Lupa Password?</h2>
                        <p className="text-stone-500 text-sm">Pilih metode untuk menerima kode verifikasi reset password.</p>
                    </div>

                    {isSent ? (
                        <div className="bg-white border border-stone-100 rounded-2xl p-8 text-center animate-in zoom-in-95 duration-300 shadow-xl">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 border border-green-100">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 mb-2">Kode Terkirim!</h3>
                            <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                                Kami telah mengirimkan instruksi reset ke
                                <br /><strong className="text-stone-800">{inputValue}</strong>
                                <br />via {method === 'email' ? 'Email' : 'WhatsApp'}.
                            </p>
                            <Button variant="outline" onClick={() => onNavigate('login')} className="border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 h-12 rounded-xl">
                                Kembali ke Halaman Login
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Method Selection */}
                            <div className="grid grid-cols-2 gap-3 p-1 bg-stone-100 rounded-xl border border-stone-200">
                                <button
                                    type="button"
                                    onClick={() => setMethod('email')}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${method === 'email'
                                        ? 'bg-white text-orange-600 shadow-sm border border-orange-100'
                                        : 'text-stone-400 hover:text-stone-600'
                                        }`}
                                >
                                    <Mail className="w-4 h-4" /> Via Email
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMethod('whatsapp')}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${method === 'whatsapp'
                                        ? 'bg-white text-green-600 shadow-sm border border-green-100'
                                        : 'text-stone-400 hover:text-stone-600'
                                        }`}
                                >
                                    <Phone className="w-4 h-4" /> Via WhatsApp
                                </button>
                            </div>

                            <div className="space-y-2 animate-in fade-in duration-300" key={method}>
                                <Input
                                    label={method === 'email' ? "Alamat Email" : "Nomor WhatsApp"}
                                    type={method === 'email' ? "email" : "tel"}
                                    placeholder={method === 'email' ? "nama@email.com" : "08xxxxxxxxxx"}
                                    icon={method === 'email' ? <Mail className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="!bg-stone-50 !border-stone-200 !text-stone-900 !placeholder-stone-400 focus:!border-orange-500 rounded-xl py-4 pl-12 transition-all hover:!border-stone-300"
                                    labelClassName="text-stone-700"
                                    required
                                />
                                <p className="text-xs text-stone-400 ml-1">
                                    {method === 'email'
                                        ? "Link reset password akan dikirim ke inbox email Anda."
                                        : "Kode OTP akan dikirim ke nomor WhatsApp Anda."}
                                </p>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={isLoading}
                                className="w-full h-14 text-base font-black bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-600 hover:from-yellow-400 hover:via-orange-400 hover:to-orange-500 text-white shadow-lg shadow-orange-100 border-0 rounded-xl tracking-wide transition-all duration-300 hover:scale-[1.02]"
                            >
                                KIRIM KODE <Send className="w-4 h-4 ml-2" />
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
