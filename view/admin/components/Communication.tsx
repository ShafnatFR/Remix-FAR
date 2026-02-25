import React, { useState, useRef } from 'react';
import { Megaphone, Send, Inbox, Smartphone, Laptop, Tablet, Bold, Italic, List, Eye, Search, ChevronDown, Bell, Sparkles, X } from 'lucide-react';
import { Button } from '../../components/Button';
import { BroadcastMessage } from '../../../types';

type DeviceType = 'phone' | 'tablet' | 'laptop';

// Sub-component for Device Frame Preview
const DeviceFrame: React.FC<{ device: DeviceType, children: React.ReactNode }> = ({ device, children }) => {
    const frames = {
        phone: "w-[300px] h-[580px] border-[10px] rounded-[2.5rem]",
        tablet: "w-[380px] h-[500px] border-[12px] rounded-[2rem]",
        laptop: "w-[420px] h-[300px] border-[6px] rounded-t-xl border-b-0"
    };

    return (
        <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className={`${frames[device]} bg-white dark:bg-stone-900 border-stone-800 dark:border-stone-700 shadow-2xl relative overflow-hidden transition-all duration-500`}>
                {device === 'phone' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-stone-800 dark:bg-stone-700 rounded-b-2xl z-20" />
                )}
                <div className="h-full w-full overflow-y-auto custom-scrollbar bg-[#FDFBF7] dark:bg-stone-950">
                    {children}
                </div>
            </div>
            {device === 'laptop' && (
                <div className="w-[460px] h-6 bg-stone-700 dark:bg-stone-600 rounded-b-lg relative shadow-xl">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-stone-500/30 rounded-b" />
                </div>
            )}
        </div>
    );
};

interface CommunicationProps {
    onSendBroadcast?: (message: BroadcastMessage) => void;
}

export const Communication: React.FC<CommunicationProps> = ({ onSendBroadcast }) => {
    const [broadcastTab, setBroadcastTab] = useState<'compose' | 'history'>('compose');
    const [previewDevice, setPreviewDevice] = useState<DeviceType>('phone');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [formData, setFormData] = useState<{
        title: string;
        content: string;
        target: BroadcastMessage['target'];
    }>({
        title: '',
        content: '',
        target: 'all'
    });

    const [messages, setMessages] = useState<BroadcastMessage[]>([
        { id: '1', title: 'Update Sistem v1.3.0', content: 'Kami telah memperbarui sistem poin dan menambahkan fitur AI Quality Audit baru. Terima kasih atas dukungan Anda!', target: 'all', status: 'sent', sentAt: '20 Feb 2025', readCount: 850 },
        { id: '2', title: 'Maintenance Server Berhasil', content: 'Pemeliharaan sistem rutin telah selesai dilakukan. Aplikasi kini lebih stabil.', target: 'all', status: 'sent', sentAt: '18 Feb 2025', readCount: 720 },
        { id: '3', title: 'Misi Baru: Area Gedebage', content: 'Ada 5 donasi besar membutuhkan pengantaran segera di area Gedebage. Cek menu logistik!', target: 'volunteer', status: 'sent', sentAt: '15 Feb 2025', readCount: 156 }
    ]);

    const handleSendBroadcast = async () => {
        if (!formData.title.trim() || !formData.content.trim()) {
            alert('Judul dan isi pesan tidak boleh kosong');
            return;
        }

        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newMsg: BroadcastMessage = {
            id: Date.now().toString(),
            title: formData.title,
            content: formData.content,
            target: formData.target,
            status: 'sent',
            sentAt: 'Baru saja',
            readCount: 0
        };

        setMessages([newMsg, ...messages]);
        if (onSendBroadcast) onSendBroadcast(newMsg);

        setFormData({ title: '', content: '', target: 'all' });
        setIsSubmitting(false);
        setBroadcastTab('history');
        alert('Broadcast berhasil dikirim ke seluruh target user!');
    };

    const insertFormat = (type: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);
        let replacement = '';
        if (type === 'bold') replacement = `**${selectedText || 'teks'}**`;
        if (type === 'italic') replacement = `_${selectedText || 'teks'}_`;
        if (type === 'list') replacement = `\n- ${selectedText}`;
        
        const newContent = text.substring(0, start) + replacement + text.substring(end);
        setFormData({ ...formData, content: newContent });
    };

    return (
        <div className="space-y-6 animate-in fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-stone-900 dark:text-white flex items-center gap-3 uppercase italic tracking-tighter">
                        <Megaphone className="w-8 h-8 text-orange-600" /> Komunikasi Broadcast
                    </h2>
                    <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mt-1">Pusat Informasi & Notifikasi Masal</p>
                </div>
                <div className="flex bg-stone-100 dark:bg-stone-900 p-1 rounded-xl border border-stone-200 dark:border-stone-800">
                    <button 
                        onClick={() => setBroadcastTab('compose')} 
                        className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${broadcastTab === 'compose' ? 'bg-white dark:bg-stone-800 text-orange-600 shadow-sm' : 'text-stone-400'}`}
                    >
                        Tulis Pesan
                    </button>
                    <button 
                        onClick={() => setBroadcastTab('history')} 
                        className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${broadcastTab === 'history' ? 'bg-white dark:bg-stone-800 text-orange-600 shadow-sm' : 'text-stone-400'}`}
                    >
                        Riwayat
                    </button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-8 items-start">
                
                {/* KOLOM KIRI: Form Compose atau List Riwayat */}
                <div className="flex-1 w-full space-y-6">
                    {broadcastTab === 'compose' ? (
                        <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm p-6 md:p-8 space-y-6 animate-in slide-in-from-left duration-500">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Judul Notifikasi</label>
                                <input 
                                    type="text" 
                                    value={formData.title} 
                                    onChange={e => setFormData({...formData, title: e.target.value})} 
                                    placeholder="Contoh: Pemeliharaan Sistem v1.3" 
                                    className="w-full p-4 bg-stone-50 dark:bg-stone-950 border-2 border-stone-100 dark:border-stone-800 rounded-2xl text-black dark:text-white font-bold text-sm focus:outline-none focus:border-orange-500 transition-all shadow-sm" 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-1">Target Segmen</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {[
                                        { id: 'all', label: 'Semua User', icon: '👥' },
                                        { id: 'provider', label: 'Donatur', icon: '🏪' },
                                        { id: 'volunteer', label: 'Relawan', icon: '🚴' },
                                        { id: 'receiver', label: 'Penerima', icon: '👤' }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setFormData({...formData, target: opt.id as any})}
                                            className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${formData.target === opt.id ? 'border-orange-500 bg-orange-50 dark:bg-orange-950 text-orange-600' : 'border-stone-100 dark:border-stone-800 text-stone-400 hover:border-stone-200'}`}
                                        >
                                            <span className="text-xl">{opt.icon}</span>
                                            <span className="text-[9px] font-black uppercase tracking-tighter">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center mb-1 px-1">
                                    <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Konten Pesan</label>
                                    <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg border border-stone-200">
                                        <button onClick={() => insertFormat('bold')} className="p-1.5 hover:bg-white rounded transition-colors" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => insertFormat('italic')} className="p-1.5 hover:bg-white rounded transition-colors" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => insertFormat('list')} className="p-1.5 hover:bg-white rounded transition-colors" title="List"><List className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                                <textarea 
                                    ref={textareaRef}
                                    value={formData.content} 
                                    onChange={e => setFormData({...formData, content: e.target.value})} 
                                    placeholder="Tulis detail pengumuman di sini..." 
                                    className="w-full h-48 p-5 bg-stone-50 dark:bg-stone-950 border-2 border-stone-100 dark:border-stone-800 rounded-[1.5rem] text-black dark:text-white font-medium text-sm leading-relaxed focus:outline-none focus:border-orange-500 transition-all resize-none shadow-inner" 
                                />
                            </div>

                            <Button 
                                onClick={handleSendBroadcast} 
                                isLoading={isSubmitting}
                                className="h-14 text-base font-black tracking-widest uppercase shadow-xl shadow-orange-500/20 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500"
                            >
                                <Send className="w-5 h-5 mr-2" /> KIRIM BROADCAST SEKARANG
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm animate-in slide-in-from-left duration-500">
                            <div className="p-6 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex justify-between items-center">
                                <h4 className="font-black text-stone-900 dark:text-white uppercase tracking-widest text-xs flex items-center gap-2">
                                    <Inbox className="w-4 h-4 text-orange-600" /> Log Pengiriman
                                </h4>
                            </div>
                            <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-[600px] overflow-y-auto custom-scrollbar">
                                {messages.map(msg => (
                                    <div key={msg.id} className="p-6 hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-all group">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h5 className="font-black text-sm text-stone-900 dark:text-white leading-tight uppercase italic">{msg.title}</h5>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[8px] font-black px-2 py-0.5 rounded tracking-widest uppercase bg-orange-100 text-orange-600 border border-orange-200">Target: {msg.target}</span>
                                                    <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">{msg.sentAt}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xl font-black text-stone-900 dark:text-white italic">{msg.readCount}</span>
                                                <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Views</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium line-clamp-2 italic">{msg.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* KOLOM KANAN: Live Device Preview */}
                <div className="w-full xl:w-[480px] sticky top-8 animate-in slide-in-from-right duration-500">
                    <div className="bg-stone-100 dark:bg-stone-900/40 rounded-[3rem] p-6 border border-stone-200 dark:border-stone-800 shadow-xl">
                        
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="font-black text-stone-800 dark:text-stone-200 text-xs uppercase tracking-widest flex items-center gap-2">
                                <Eye className="w-4 h-4 text-orange-600" /> Live Preview
                            </h4>
                            
                            <div className="flex bg-stone-200 dark:bg-stone-800 p-1 rounded-xl border border-stone-300 dark:border-stone-700 shadow-inner">
                                {[
                                    { id: 'phone', icon: Smartphone },
                                    { id: 'tablet', icon: Tablet },
                                    { id: 'laptop', icon: Laptop }
                                ].map(d => (
                                    <button 
                                        key={d.id} 
                                        onClick={() => setPreviewDevice(d.id as any)} 
                                        className={`p-2 rounded-lg transition-all ${previewDevice === d.id ? 'bg-white dark:bg-stone-700 text-orange-600 shadow-md scale-105' : 'text-stone-400 hover:text-stone-600'}`}
                                    >
                                        <d.icon className="w-3.5 h-3.5" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <DeviceFrame device={previewDevice}>
                                {/* Mock Header Perangkat */}
                                <div className="h-16 bg-gradient-to-r from-orange-600 to-amber-500 flex items-center px-6 text-white sticky top-0 z-10">
                                      <ChevronDown className="w-6 h-6 rotate-90 mr-4" />
                                      <h4 className="font-black text-sm uppercase italic tracking-tight">Food AI Rescue</h4>
                                </div>

                                {/* Mock Notifikasi di dalam Frame */}
                                <div className="p-4 space-y-6">
                                    <div className="bg-white dark:bg-stone-900 rounded-[2rem] border-2 border-orange-500 shadow-2xl p-5 md:p-6 animate-in zoom-in-95 duration-300">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 shrink-0">
                                                <Megaphone className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-black text-stone-900 dark:text-white text-sm uppercase italic leading-none truncate">{formData.title || "Judul Pengumuman"}</h4>
                                                <p className="text-[9px] text-stone-400 font-bold uppercase mt-1">Baru Saja • Admin</p>
                                            </div>
                                        </div>

                                        <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 mb-4">
                                            <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed font-medium italic whitespace-pre-wrap">
                                                {formData.content || "Isi pesan broadcast akan muncul di sini secara real-time saat Anda mengetik di sebelah kiri..."}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex -space-x-2">
                                                {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full border border-white bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-[7px] font-black">U{i}</div>)}
                                            </div>
                                            <button className="bg-orange-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">Lihat Detail</button>
                                        </div>
                                    </div>

                                    {/* Mock Feed Lainnya */}
                                    <div className="space-y-4 opacity-40 grayscale pointer-events-none">
                                        {[1,2].map(i => (
                                            <div key={i} className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200">
                                                <div className="w-2/3 h-2.5 bg-stone-200 dark:bg-stone-800 rounded mb-3"></div>
                                                <div className="w-full h-12 bg-stone-100 dark:bg-stone-800/50 rounded-xl"></div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="bg-stone-900 dark:bg-black rounded-2xl p-6 text-center text-white border border-white/5 shadow-lg">
                                        <h5 className="font-black text-xs uppercase mb-3 tracking-widest flex items-center justify-center gap-2">
                                            <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Pusat Notifikasi
                                        </h5>
                                        <p className="text-[9px] text-stone-400 leading-relaxed mb-4">Anda akan menerima pengumuman penting langsung di dashboard ini.</p>
                                        <div className="h-1 w-20 bg-orange-600 mx-auto rounded-full"></div>
                                    </div>
                                </div>
                            </DeviceFrame>
                        </div>
                        
                        <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                            <p className="text-[10px] text-orange-700 dark:text-orange-400 font-bold leading-relaxed text-center">
                                Tip: Gunakan preview untuk memastikan panjang teks nyaman dibaca di layar HP tanpa perlu scrolling berlebih.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};