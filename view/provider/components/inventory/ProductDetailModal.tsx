
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Truck, ShoppingBag, Timer, Clock, List, Edit3, Save, X, Plus, Trash2, Loader2, Info, ChevronDown, Leaf, Award, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/Button';
import { FoodItem, ImpactBreakdownItem } from '../../../../types';
import { db } from '../../../../services/db';
import { formatDateTime, isFoodExpired } from '../../../../utils/transformers';

interface ProductDetailModalProps {
    product: FoodItem;
    onClose: () => void;
    onUpdate?: (updatedItem: FoodItem) => void;
    onDelete?: (id: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product: p, onClose, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formData, setFormData] = useState<FoodItem>(p);
    const [newIngredient, setNewIngredient] = useState('');
    
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const [isImpactExpanded, setIsImpactExpanded] = useState(false);
    const [activeCalcTab, setActiveCalcTab] = useState<'co2' | 'social'>('co2');

    const progressPercent = (p.currentQuantity / p.initialQuantity) * 100;
    const expired = isFoodExpired(p.distributionEnd);

    useEffect(() => {
        setFormData(p);
    }, [p]);

    const fullDescription = formData.description || "Tidak ada deskripsi tersedia.";
    const firstDotIndex = fullDescription.indexOf('.');
    const firstSentence = firstDotIndex !== -1 ? fullDescription.substring(0, firstDotIndex + 1) : fullDescription;
    const isLongDescription = fullDescription.length > firstSentence.length;

    const handleSave = async () => {
        if (!onUpdate) return;
        setIsSaving(true);
        try {
            await db.updateFoodItem(formData);
            onUpdate(formData);
            setIsEditing(false);
            alert("Data produk berhasil diperbarui!");
        } catch (error) {
            console.error("Update failed:", error);
            alert("Gagal memperbarui produk.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;
        if (!confirm("Apakah Anda yakin ingin menghapus produk ini dari stok? Tindakan ini tidak dapat dibatalkan.")) return;
        
        setIsDeleting(true);
        try {
            await db.deleteFoodItem(formData.id);
            onDelete(formData.id);
            onClose();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Gagal menghapus produk.");
            setIsDeleting(false);
        }
    };

    const handleAddIngredient = () => {
        if (newIngredient.trim()) {
            const currentIngredients = formData.aiVerification?.ingredients || [];
            setFormData({
                ...formData,
                aiVerification: {
                    ...formData.aiVerification!,
                    isEdible: formData.aiVerification?.isEdible ?? true,
                    reason: formData.aiVerification?.reason ?? '',
                    halalScore: formData.aiVerification?.halalScore ?? 0,
                    ingredients: [...currentIngredients, newIngredient.trim()]
                }
            });
            setNewIngredient('');
        }
    };

    const handleRemoveIngredient = (index: number) => {
        const currentIngredients = formData.aiVerification?.ingredients || [];
        const newIngredients = currentIngredients.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            aiVerification: {
                ...formData.aiVerification!,
                isEdible: formData.aiVerification?.isEdible ?? true,
                reason: formData.aiVerification?.reason ?? '',
                halalScore: formData.aiVerification?.halalScore ?? 0,
                ingredients: newIngredients
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-[#FDFBF7] dark:bg-stone-950 z-[100] overflow-y-auto animate-in slide-in-from-right duration-500">
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-lg border-b border-stone-100 dark:border-stone-800 p-3 flex items-center justify-between text-stone-900 dark:text-white">
                <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="font-black text-sm sm:text-base truncate uppercase tracking-tight">Detail Produk Inventory</h2>
                </div>
                <div className="shrink-0">
                    {!isEditing ? (
                        <div className="flex gap-2">
                            {onDelete && (
                                <button 
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-bold text-xs"
                                >
                                    {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                            )}
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors font-bold text-xs"
                            >
                                <Edit3 className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Edit Data</span><span className="xs:hidden">Edit</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <button 
                                onClick={() => { setIsEditing(false); setFormData(p); }} 
                                disabled={isSaving}
                                className="px-3 py-2 rounded-xl bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors font-bold text-xs"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleSave} 
                                disabled={isSaving}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors font-bold text-xs shadow-lg shadow-green-500/20 disabled:opacity-70"
                            >
                                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Simpan
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6 md:p-10 pb-32 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 relative group">
                            <img src={formData.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={formData.name} />
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                <span className="bg-white/90 backdrop-blur-md text-stone-900 px-4 py-1.5 rounded-full text-xs font-black shadow-xl uppercase tracking-widest flex items-center gap-2 border border-white/20">
                                    <Sparkles className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> AI SCORE {formData.aiVerification?.halalScore}
                                </span>
                                {expired && (
                                    <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-xl uppercase tracking-widest flex items-center gap-2 border border-red-500">
                                        <AlertTriangle className="w-3.5 h-3.5" /> EXPIRED
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Inventory Status Card */}
                        <div className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Status Ketersediaan</p>
                                    <h3 className="text-3xl font-black text-orange-600 italic leading-none">{formData.currentQuantity} <span className="text-sm not-italic text-stone-400">/ {formData.initialQuantity} Sisa</span></h3>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-stone-900 dark:text-white">{Math.round(100 - progressPercent)}% Terklaim</span>
                                </div>
                            </div>
                            <div className="h-4 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-1000 shadow-lg" style={{width: `${progressPercent}%`}}></div>
                            </div>
                        </div>

                        {/* DETAILED AI BREAKDOWN SECTION */}
                        {formData.socialImpact && formData.socialImpact.co2Breakdown && (
                            <div className="bg-[#1A1D27] dark:bg-[#0F1117] rounded-[2.5rem] p-6 text-white shadow-xl border border-white/5 overflow-hidden">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/10 rounded-xl">
                                            {activeCalcTab === 'co2' ? (
                                                <Leaf className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <Award className="w-5 h-5 text-indigo-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-stone-400 font-black uppercase tracking-widest">TOTAL DAMPAK</p>
                                            <p className="text-xl font-bold">
                                                {activeCalcTab === 'co2' 
                                                    ? `${formData.socialImpact.co2Saved}kg CO2` 
                                                    : `${formData.socialImpact.totalPoints} Poin`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setIsImpactExpanded(!isImpactExpanded)}
                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isImpactExpanded ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>

                                <div className={`overflow-hidden transition-all duration-500 ${isImpactExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="bg-black/30 rounded-2xl p-4 mt-2 border border-white/5">
                                        
                                        {/* TAB SWITCHER */}
                                        <div className="flex bg-white/5 p-1 rounded-xl mb-4">
                                            <button onClick={() => setActiveCalcTab('co2')} className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${activeCalcTab === 'co2' ? 'bg-emerald-600 text-white shadow-lg' : 'text-stone-400 hover:text-white'}`}>
                                                CO2
                                            </button>
                                            <button onClick={() => setActiveCalcTab('social')} className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${activeCalcTab === 'social' ? 'bg-indigo-600 text-white shadow-lg' : 'text-stone-400 hover:text-white'}`}>
                                                SOCIAL
                                            </button>
                                        </div>

                                        {/* FORMULA & LOGIC */}
                                        <div>
                                            <p className="font-bold text-stone-400 mb-3 text-[10px] uppercase tracking-widest">
                                                METODOLOGI PERHITUNGAN (LCA STANDARD)
                                            </p>
                                            <div className="bg-white/5 p-3 rounded-lg border border-white/10 mb-6">
                                                <code className={`block text-[10px] font-mono ${activeCalcTab === 'co2' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                                    {activeCalcTab === 'co2' 
                                                        ? 'CO2 Saved = Σ (Berat Komponen x Faktor Emisi Kategori)' 
                                                        : 'Total Poin = Σ (Berat Komponen x Faktor Dampak Sosial)'}
                                                </code>
                                            </div>

                                            {/* SECTION 1: ANALISIS KANDUNGAN PER 1 PORSI */}
                                            <div className="flex justify-between items-end mb-2">
                                                <p className="font-bold text-stone-300 text-[10px] uppercase tracking-widest">
                                                    ANALISIS KANDUNGAN PER 1 PORSI
                                                </p>
                                                <span className="text-[10px] font-black text-orange-500">
                                                    Bobot: {(formData.weightPerUnit || 500)}g
                                                </span>
                                            </div>
                                            
                                            <div className="space-y-2 mb-6">
                                                {(activeCalcTab === 'co2' 
                                                    ? formData.socialImpact?.co2Breakdown 
                                                    : formData.socialImpact?.socialBreakdown
                                                )?.map((item: ImpactBreakdownItem, idx: number) => (
                                                    <div key={idx} className="flex justify-between items-center text-[11px] border-b border-white/10 pb-1 last:border-0">
                                                        <span className="text-stone-300">{item.name}</span>
                                                        <div className="text-right font-mono">
                                                            <span className={`font-bold ${activeCalcTab === 'co2' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                                                {item.result} {activeCalcTab === 'co2' ? 'kg' : 'Pts'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="flex justify-between items-center pt-2 mt-1 border-t border-white/20">
                                                    <span className="text-[10px] font-bold text-stone-400">Total (1 Porsi)</span>
                                                    <span className={`font-black text-sm ${activeCalcTab === 'co2' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                                        {activeCalcTab === 'co2' 
                                                            ? `${formData.socialImpact?.co2PerPortion} kg CO2`
                                                            : `${formData.socialImpact?.pointsPerPortion} Pts`
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            {/* SECTION 2: AKUMULASI TOTAL */}
                                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6 text-center">
                                                <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-1">AKUMULASI TOTAL DONASI</p>
                                                <p className="text-xl font-black text-white">
                                                    {activeCalcTab === 'co2' ? formData.socialImpact?.co2PerPortion : formData.socialImpact?.pointsPerPortion} 
                                                    <span className="text-stone-500 text-sm mx-2">x</span> 
                                                    <span className="text-orange-500">{formData.socialImpact?.portionCount} Porsi</span> 
                                                    <span className="text-stone-500 text-sm mx-2">=</span> 
                                                    <span className={`${activeCalcTab === 'co2' ? 'text-emerald-500' : 'text-indigo-500'}`}>
                                                        {activeCalcTab === 'co2' 
                                                            ? `${formData.socialImpact?.co2Saved} kg`
                                                            : `${formData.socialImpact?.totalPoints}`
                                                        }
                                                    </span>
                                                </p>
                                                <p className={`text-[10px] font-bold mt-1 uppercase tracking-widest ${activeCalcTab === 'co2' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                                                    {activeCalcTab === 'co2' ? 'CO2' : 'POIN'}
                                                </p>
                                            </div>

                                            {/* SECTION 3: RINCIAN TOTAL */}
                                            <p className="font-bold text-orange-500 mb-2 text-[10px] uppercase tracking-widest">
                                                PERHITUNGAN LEBIH LANJUT (BATCH TOTAL)
                                            </p>
                                            <p className="text-[9px] font-bold text-stone-500 mb-2 uppercase tracking-widest">
                                                RINCIAN KOMPONEN TERDETEKSI:
                                            </p>

                                            <div className="space-y-3">
                                                {(activeCalcTab === 'co2' 
                                                    ? formData.socialImpact?.co2Breakdown 
                                                    : formData.socialImpact?.socialBreakdown
                                                )?.map((item: ImpactBreakdownItem, idx: number) => (
                                                    <div key={idx} className="flex justify-between items-center text-[10px] border-b border-white/5 pb-2 last:border-0">
                                                        <div className="flex flex-col">
                                                            <span className="text-stone-300 font-bold">{item.name}</span>
                                                        </div>
                                                        <div className="text-right font-mono">
                                                            <div className="text-stone-400 text-[9px]">
                                                                {item.weightKg}kg x {formData.socialImpact?.portionCount} x {item.factor} =
                                                            </div>
                                                            <span className={`font-bold ${activeCalcTab === 'co2' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                                                {(item.result * (formData.socialImpact?.portionCount || 1)).toFixed(1)} {activeCalcTab === 'co2' ? 'kg' : 'pts'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-4 pt-3 border-t-2 border-white/10 flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest">TOTAL {activeCalcTab === 'co2' ? 'EMISI' : 'POIN'}</span>
                                                    <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest">TERCEGAH</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`text-xl font-black block leading-none ${activeCalcTab === 'co2' ? 'text-emerald-500' : 'text-indigo-500'}`}>
                                                        {activeCalcTab === 'co2' 
                                                            ? `${formData.socialImpact?.co2Saved} kg`
                                                            : `${formData.socialImpact?.totalPoints}`
                                                        }
                                                    </span>
                                                    <span className={`text-[10px] font-bold uppercase ${activeCalcTab === 'co2' ? 'text-emerald-700' : 'text-indigo-700'}`}>
                                                        {activeCalcTab === 'co2' ? 'CO2' : 'POIN'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div>
                            {isEditing ? (
                                <div className="mb-4">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">Nama Produk</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full text-3xl font-black text-stone-900 dark:text-white bg-transparent border-b-2 border-stone-200 focus:border-orange-500 outline-none pb-2"
                                    />
                                </div>
                            ) : (
                                <h1 className="text-4xl font-black text-stone-900 dark:text-white leading-tight mb-4">{formData.name}</h1>
                            )}
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-orange-100 dark:border-orange-800 flex items-center gap-1.5">
                                    <Truck className="w-3 h-3" /> {formData.deliveryMethod === 'both' ? 'Pick-up & Diantar' : formData.deliveryMethod}
                                </span>
                                <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-blue-100 dark:border-orange-800 flex items-center gap-1.5">
                                    <ShoppingBag className="w-3 h-3" /> Min: {formData.minQuantity || 1} • Max: {formData.maxQuantity || 5}
                                </span>
                            </div>
                            
                            {/* EDITABLE DESCRIPTION SECTION */}
                            <div className={`bg-stone-50 dark:bg-stone-900/50 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 transition-all ${isEditing ? 'ring-2 ring-orange-500/20 bg-white' : ''}`}>
                                {isEditing ? (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Deskripsi Produk</label>
                                        <textarea 
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            className="w-full p-3 bg-stone-100 dark:bg-stone-800 rounded-xl text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[120px]"
                                            placeholder="Tulis deskripsi makanan..."
                                        />
                                    </div>
                                ) : (
                                    <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed font-medium">
                                        {isDescExpanded ? fullDescription : firstSentence}
                                        {isLongDescription && !isDescExpanded && (
                                            <button 
                                                onClick={() => setIsDescExpanded(true)}
                                                className="ml-2 text-sm font-black text-orange-500 hover:text-orange-600 uppercase tracking-wide cursor-pointer inline-flex items-center gap-1"
                                            >
                                                Lihat Selengkapnya
                                            </button>
                                        )}
                                        {isLongDescription && isDescExpanded && (
                                            <button 
                                                onClick={() => setIsDescExpanded(false)}
                                                className="ml-2 text-sm font-black text-stone-400 hover:text-stone-600 uppercase tracking-wide cursor-pointer inline-flex items-center gap-1"
                                            >
                                                Tutup
                                            </button>
                                        )}
                                    </p>
                                )}

                                {/* EDITABLE INGREDIENTS LIST */}
                                <div className="mt-6 pt-6 border-t border-stone-200 dark:border-stone-700">
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                                            <List className="w-3 h-3" /> Bahan Terdeteksi
                                        </p>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {formData.aiVerification?.ingredients && formData.aiVerification.ingredients.length > 0 ? (
                                            formData.aiVerification.ingredients.map((ing, i) => (
                                                <span key={i} className="group relative px-3 py-1.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-bold text-stone-700 dark:text-stone-300 pr-3">
                                                    {ing}
                                                    {isEditing && (
                                                        <button 
                                                            onClick={() => handleRemoveIngredient(i)}
                                                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-2.5 h-2.5" />
                                                        </button>
                                                    )}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-stone-400 text-sm italic">Belum ada data bahan.</span>
                                        )}
                                    </div>

                                    {isEditing && (
                                        <div className="mt-4 flex gap-2">
                                            <input 
                                                type="text" 
                                                value={newIngredient}
                                                onChange={(e) => setNewIngredient(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
                                                placeholder="+ Tambah bahan..."
                                                className="flex-1 px-4 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                            <button 
                                                onClick={handleAddIngredient}
                                                className="px-3 bg-stone-200 dark:bg-stone-700 hover:bg-orange-500 hover:text-white rounded-xl transition-colors"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Dibuat Pada</p>
                                <p className="font-bold text-stone-900 dark:text-stone-200 text-sm flex items-center gap-2">
                                    <Timer className="w-4 h-4 text-orange-500" /> {new Date(formData.createdAt).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                            <div className="p-4 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Expired Date</p>
                                <p className="font-bold text-red-600 text-sm flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> {formatDateTime(formData.distributionEnd)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border-t border-stone-200 dark:border-stone-800 z-50 flex gap-4">
                <Button variant="outline" onClick={onClose} className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest">
                    KEMBALI KE LIST
                </Button>
            </div>
        </div>
    );
};
