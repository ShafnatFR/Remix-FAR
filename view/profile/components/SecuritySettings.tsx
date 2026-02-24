
import React, { useState } from 'react';
import { Key, Eye, EyeOff, X, Check, Loader2, AlertTriangle, HelpCircle } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export const SecuritySettings: React.FC = () => {
    const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isResetSending, setIsResetSending] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (password.match(/[a-z]/)) strength += 25;
        if (password.match(/[A-Z]/)) strength += 25;
        if (password.match(/[0-9!@#$%^&*]/)) strength += 25;
        return strength;
    };

    const handlePasswordChange = (value: string) => {
        setForm({ ...form, newPassword: value });
        setPasswordStrength(calculatePasswordStrength(value));
    };

    const getStrengthLabel = () => {
        if (passwordStrength <= 25) return { text: 'Lemah', color: 'bg-red-500' };
        if (passwordStrength <= 50) return { text: 'Cukup', color: 'bg-orange-500' };
        if (passwordStrength <= 75) return { text: 'Kuat', color: 'bg-yellow-500' };
        return { text: 'Sangat Kuat', color: 'bg-green-500' };
    };

    const handleForgotPassword = async () => {
        setIsResetSending(true);
        // Simulate API call to send reset link to current user's email
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsResetSending(false);
        alert("Link untuk mereset password telah dikirim ke email terdaftar Anda.");
    };

    const handleSave = async () => {
        if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
            alert("Mohon lengkapi semua field");
            return;
        }
        if (form.newPassword.length < 8) {
            alert("Password baru minimal 8 karakter");
            return;
        }
        if (form.newPassword !== form.confirmPassword) {
            alert("Password baru dan konfirmasi tidak cocok");
            return;
        }

        setIsChangingPassword(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsChangingPassword(false);

        alert("✅ Password berhasil diubah!");
        setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordStrength(0);
    };

    return (
        <div className="p-6 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen animate-in fade-in">
            <div className="max-w-lg mx-auto space-y-6">
                {/* Change Password Section */}
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm">
                    <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                        <Key className="w-5 h-5 text-orange-500" /> Ganti Password
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <Input
                                label="Password Lama"
                                type={showPass.old ? "text" : "password"}
                                value={form.oldPassword}
                                onChange={e => setForm({ ...form, oldPassword: e.target.value })}
                                placeholder="Masukkan password lama"
                                rightElement={
                                    <button type="button" onClick={() => setShowPass({ ...showPass, old: !showPass.old })} className="text-stone-400 hover:text-stone-600 transition-colors">
                                        {showPass.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                }
                            />
                            <div className="flex justify-end mt-2">
                                <button 
                                    type="button" 
                                    onClick={handleForgotPassword}
                                    disabled={isResetSending}
                                    className="text-xs font-bold text-orange-500 hover:text-orange-600 hover:underline flex items-center gap-1 transition-colors disabled:opacity-50"
                                >
                                    {isResetSending ? <Loader2 className="w-3 h-3 animate-spin" /> : <HelpCircle className="w-3 h-3" />}
                                    Lupa Password Lama?
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Input
                                label="Password Baru"
                                type={showPass.new ? "text" : "password"}
                                value={form.newPassword}
                                onChange={e => handlePasswordChange(e.target.value)}
                                placeholder="Minimal 8 karakter"
                                rightElement={
                                    <button type="button" onClick={() => setShowPass({ ...showPass, new: !showPass.new })} className="text-stone-400 hover:text-stone-600 transition-colors">
                                        {showPass.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                }
                            />
                            {form.newPassword && (
                                <div className="space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full transition-colors ${passwordStrength >= i * 25 ? getStrengthLabel().color : 'bg-stone-200 dark:bg-stone-700'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs font-medium ${passwordStrength <= 25 ? 'text-red-500' :
                                            passwordStrength <= 50 ? 'text-orange-500' :
                                                passwordStrength <= 75 ? 'text-yellow-600' : 'text-green-500'
                                        }`}>
                                        Kekuatan: {getStrengthLabel().text}
                                    </p>
                                </div>
                            )}
                        </div>

                        <Input
                            label="Konfirmasi Password Baru"
                            type={showPass.confirm ? "text" : "password"}
                            value={form.confirmPassword}
                            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                            placeholder="Ulangi password baru"
                            rightElement={
                                <button type="button" onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })} className="text-stone-400 hover:text-stone-600 transition-colors">
                                    {showPass.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            }
                        />

                        {form.confirmPassword && form.newPassword && (
                            <div className={`flex items-center gap-2 text-xs font-medium ${form.newPassword === form.confirmPassword ? 'text-green-500' : 'text-red-500'
                                }`}>
                                {form.newPassword === form.confirmPassword ? (
                                    <><Check className="w-4 h-4" /> Password cocok</>
                                ) : (
                                    <><X className="w-4 h-4" /> Password tidak cocok</>
                                )}
                            </div>
                        )}

                        <Button
                            onClick={handleSave}
                            disabled={isChangingPassword || !form.oldPassword || !form.newPassword || form.newPassword !== form.confirmPassword}
                            className="mt-2"
                        >
                            {isChangingPassword ? (
                                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Menyimpan...</>
                            ) : (
                                'Ubah Password'
                            )}
                        </Button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-900/30">
                    <h3 className="font-bold text-lg text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Zona Berbahaya
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-400 mb-4">Tindakan ini tidak dapat dibatalkan.</p>
                    <Button
                        variant="danger"
                        onClick={() => alert("Fitur hapus akun memerlukan konfirmasi via email")}
                    >
                        Hapus Akun Saya
                    </Button>
                </div>
            </div>
        </div>
    );
};
