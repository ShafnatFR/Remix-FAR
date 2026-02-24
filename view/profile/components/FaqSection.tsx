
import React, { useState, useMemo } from 'react';
import { Shield, User, Store, ChevronUp, ChevronDown, MessageSquare, BookOpen, Truck } from 'lucide-react';
import { Button } from '../../components/Button';
import { FAQItem } from '../../../types';

interface FaqSectionProps {
    faqs?: FAQItem[];
}

// Simple Parser for formatted text (Bold, Italic, Bullets, Numbering)
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  
  return (
    <div className="space-y-1.5">
      {lines.map((line, lineIdx) => {
        // Cek penomoran
        const numberMatch = line.match(/^(\d+)\.\s+(.*)/);
        // Cek bullet
        const bulletMatch = line.match(/^- \s*(.*)/);

        let content = line;
        let isList = false;
        let listPrefix = null;

        if (numberMatch) {
          isList = true;
          listPrefix = <span className="font-black text-orange-600 mr-2 min-w-[1.2rem]">{numberMatch[1]}.</span>;
          content = numberMatch[2];
        } else if (bulletMatch) {
          isList = true;
          // Bullet point berbentuk bulat hitam solid
          listPrefix = <span className="text-stone-900 dark:text-stone-100 mr-3 mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-current shadow-sm"></span>;
          content = bulletMatch[1];
        }

        // Parse Bold and Italic inside content
        const parts = content.split(/(\*\*.*?\*\*|_.*?_)/g);
        const parsedContent = parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-black text-stone-900 dark:text-white">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('_') && part.endsWith('_')) {
            return <em key={i} className="italic text-stone-800 dark:text-stone-300 font-semibold">{part.slice(1, -1)}</em>;
          }
          return part;
        });

        if (content.trim() === "") return <div key={lineIdx} className="h-2"></div>;

        return (
          <div key={lineIdx} className={`flex items-start ${isList ? 'pl-2' : ''}`}>
            {listPrefix}
            <p className="flex-1 leading-relaxed">{parsedContent}</p>
          </div>
        );
      })}
    </div>
  );
};

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs = [] }) => {
    const [openCategory, setOpenCategory] = useState<string | null>('Umum');
    const [openFaq, setOpenFaq] = useState<string | null>(null);

    const groupedFaqs = useMemo(() => {
        const groups: { [key: string]: FAQItem[] } = {};
        const listToUse = faqs.length > 0 ? faqs : [
            { question: "Apa itu Food AI Rescue?", answer: "Platform penyelamatan makanan surplus berbasis AI.", category: "Umum" }
        ];

        listToUse.forEach(item => {
            const cat = item.category || 'Umum';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(item);
        });
        return groups;
    }, [faqs]);

    const getIcon = (cat: string) => {
        if (cat.includes('Donatur')) return Store;
        if (cat.includes('Penerima')) return User;
        if (cat.includes('Relawan')) return Truck;
        return BookOpen;
    };

    return (
        <div className="p-4 md:p-6 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen animate-in fade-in">
            <div className="space-y-6 max-w-3xl mx-auto">
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg text-blue-600 dark:text-blue-200 shrink-0">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-blue-700 dark:text-blue-400 mb-1 tracking-tight">Pusat Bantuan & SOP</h4>
                        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">Temukan panduan resmi dan jawaban atas kendala teknis Anda.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {Object.keys(groupedFaqs).map((category, idx) => {
                        const Icon = getIcon(category);
                        return (
                            <div key={idx} className="bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm transition-all hover:shadow-md">
                                <button onClick={() => setOpenCategory(openCategory === category ? null : category)} className={`w-full flex justify-between items-center p-5 text-left transition-colors ${openCategory === category ? 'bg-orange-50 dark:bg-orange-900/10' : 'hover:bg-stone-50'}`}>
                                    <span className="flex gap-3 items-center font-black text-stone-900 dark:text-stone-200 text-lg uppercase italic tracking-tighter">
                                        <div className={`p-2 rounded-xl ${openCategory === category ? 'bg-orange-100 text-orange-600' : 'bg-stone-100 text-stone-500'}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        {category}
                                    </span>
                                    {openCategory === category ? <ChevronUp className="w-5 h-5 text-orange-500" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
                                </button>
                                
                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openCategory === category ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-2 space-y-2 border-t border-stone-50 dark:border-stone-800">
                                        {groupedFaqs[category].map((item, i) => (
                                            <div key={i} className="rounded-2xl overflow-hidden">
                                                <button onClick={() => setOpenFaq(openFaq === `${idx}-${i}` ? null : `${idx}-${i}`)} className={`w-full flex justify-between items-start gap-4 p-4 text-left font-bold text-sm transition-colors ${openFaq === `${idx}-${i}` ? 'text-orange-600 bg-orange-50/50' : 'text-stone-800 dark:text-stone-200 hover:bg-stone-50'}`}>
                                                    {item.question}
                                                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform mt-0.5 ${openFaq === `${idx}-${i}` ? 'rotate-180 text-orange-500' : 'text-stone-400'}`} />
                                                </button>
                                                <div className={`overflow-hidden transition-all duration-300 ${openFaq === `${idx}-${i}` ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <div className="p-5 pt-1 pl-6 text-sm text-stone-600 dark:text-stone-400 leading-relaxed bg-stone-50/30 dark:bg-stone-800/20 border-l-4 border-orange-500 ml-4 mb-4 mr-4 rounded-r-2xl whitespace-pre-wrap shadow-inner">
                                                        <FormattedText text={item.answer} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 p-8 bg-gradient-to-br from-[#1A110D] to-[#0F0F0F] rounded-[3rem] text-center shadow-xl relative overflow-hidden border border-white/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl"></div>
                    <h4 className="font-black text-xl text-white mb-2 relative z-10 italic uppercase tracking-tighter">Masih Butuh Bantuan?</h4>
                    <p className="text-stone-400 text-sm mb-8 relative z-10 font-medium">Tim CS kami siap membantu Anda 24/7 melalui WhatsApp.</p>
                    <Button onClick={() => window.open(`https://wa.me/6285215376975`, '_blank')} className="w-auto bg-[#25D366] hover:bg-[#128C7E] border-0 text-white shadow-lg shadow-green-500/20 mx-auto relative z-10 px-8 h-14 rounded-2xl font-black uppercase tracking-widest text-xs">
                        <MessageSquare className="w-5 h-5 mr-2" /> Hubungi WhatsApp Support
                    </Button>
                </div>
            </div>
        </div>
    );
};
