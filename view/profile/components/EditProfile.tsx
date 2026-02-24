
import React, { useState } from 'react';
import { User, Mail, Camera, Loader2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { db } from '../../../services/db';
import { UserData } from '../../../types';

interface EditProfileProps {
    userData: UserData; 
    onSave: (data: UserData) => void;
}

export const EditProfile: React.FC<EditProfileProps> = ({ userData, onSave }) => {
    const [form, setForm] = useState<UserData>(userData);
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        // Auto format +62
        if (val.startsWith('62')) val = val.substring(2);
        if (val.startsWith('0')) val = val.substring(1);
        val = val.substring(0, 13);
        
        let formatted = val;
        // Simple visual formatting for UI only
        if (val.length > 3) formatted = val.substring(0, 3) + '-' + val.substring(3);
        if (val.length > 7) formatted = formatted.substring(0, 8) + '-' + val.substring(7);

        setPhoneError(val.length < 9 ? 'Nomor terlalu pendek' : '');
        setForm({ ...form, phone: formatted });
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setForm({...form, email: val});
        setEmailError(!val.includes('@') ? 'Format email salah' : '');
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                try {
                    // Upload to Drive (Profiles Folder)
                    const url = await db.uploadImage(base64, `avatar_${Date.now()}.jpg`, 'profiles');
                    setForm({ ...form, avatar: url });
                } catch (error) {
                    console.error("Avatar upload failed", error);
                    alert("Gagal mengunggah foto profil. Periksa koneksi.");
                } finally {
                    setIsUploading(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // 1. Prepare Payload & Deep Copy
            const payload = { ...form };

            // 2. Clean Phone Number (Remove non-digits for Backend)
            if (payload.phone) {
                // Ensure string before replace to avoid "replace is not a function" error if phone is number
                payload.phone = String(payload.phone).replace(/\D/g, '');
            }

            // 3. REMOVE NON-EDITABLE & SENSITIVE FIELDS
            // This prevents overwriting sensitive data (like points) with potentially stale local state
            // The backend's partial update logic will keep existing DB values for these fields.
            delete (payload as any).password;
            delete (payload as any).points;
            delete (payload as any).role;
            delete (payload as any).status;
            delete (payload as any).joinDate;

            if (payload.id) {
                console.log("Saving user to DB:", payload);
                // Perform real DB update
                await db.upsertUser(payload);
            } else {
                console.warn("User ID missing, skipping DB update");
            }
            
            // Update parent state (we can keep the visual format or update it)
            onSave(form); 
            alert("Profil berhasil diperbarui!");
        } catch (error) {
            console.error("Failed to save profile:", error);
            alert("Gagal menyimpan perubahan ke server. Pastikan koneksi aman.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-stone-900 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-8 animate-in fade-in">
            <div className="flex flex-col items-center">
                <div className="w-28 h-28 rounded-full bg-stone-800 relative mb-4 ring-4 ring-orange-50 dark:ring-stone-800 group overflow-hidden">
                    <img src={form.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name}`} className="w-full h-full rounded-full object-cover" alt="avatar" />
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                    <label className="absolute bottom-1 right-1 bg-orange-500 hover:bg-orange-600 p-2 rounded-full text-white transition-colors shadow-lg cursor-pointer z-20">
                        <Camera className="w-5 h-5" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={isUploading} />
                    </label>
                </div>
                <p className="text-sm text-stone-500">Ketuk ikon kamera untuk ubah foto</p>
            </div>
            <div className="space-y-5">
                <Input 
                    label="Nama Lengkap" 
                    value={form.name} 
                    onChange={(e) => setForm({...form, name: e.target.value})} 
                    icon={<User className="w-4 h-4" />} 
                    placeholder={
                        form.role === 'receiver' ? "Cth: Panti Asuhan Kasih Ibu" : 
                        form.role === 'provider' ? "Cth: Toko Roti Berkah" : 
                        "Contoh: Budi Santoso"
                    }
                />
                <Input label="Email Address" type="email" value={form.email} onChange={handleEmailChange} icon={<Mail className="w-4 h-4" />} error={emailError} />
                <Input label="Nomor Telepon" type="tel" value={form.phone} onChange={handlePhoneChange} leftAddon={<span className="text-stone-600 dark:text-stone-400">+62</span>} placeholder="8xx-xxxx-xxxx" error={phoneError} />
            </div>
            <div className="pt-4">
                <Button onClick={handleSave} disabled={!!phoneError || !!emailError || isUploading || isSaving}>
                    {isUploading ? 'Mengunggah Foto...' : isSaving ? 'Menyimpan ke Database...' : 'Simpan Perubahan'}
                </Button>
            </div>
        </div>
    );
};
