
import React, { useState } from 'react';
import { Crown, UserPlus, Edit, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { AdminUser, SystemLog } from '../../../types';

export const AdminList: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: '1', name: 'Super Admin', email: 'root@foodai.com', role: 'super_admin', permissions: ['all'], status: 'active', lastLogin: 'Baru Saja' },
    { id: '2', name: 'Ops Manager', email: 'ops@foodai.com', role: 'admin_manager', permissions: ['moderation', 'distribution'], status: 'active', lastLogin: '2 jam lalu' },
  ]);
  const [logs, setLogs] = useState<SystemLog[]>([
    { id: '1', timestamp: '2025-02-24 10:00', actor: 'System', action: 'Auto Backup', details: 'Database backup completed (2.4GB)', severity: 'info' },
    { id: '2', timestamp: '2025-02-24 09:45', actor: 'Budi (Vol)', action: 'Failed Login', details: '3 failed attempts from IP 192.168.1.1', severity: 'warning' },
    { id: '3', timestamp: '2025-02-24 08:30', actor: 'Super Admin', action: 'Config Change', details: 'Updated AI Threshold to 85%', severity: 'critical' },
    // Dummy logs for pagination
    ...Array.from({length: 20}, (_, i) => ({
        id: `log-${i+4}`,
        timestamp: '2025-02-24 08:00',
        actor: 'System',
        action: 'Routine Check',
        details: 'System health check passed.',
        severity: 'info' as const
    }))
  ]);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({ id: '', name: '', email: '', role: 'admin_manager', permissions: [] as string[], status: 'active' });
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);

  // Pagination for logs
  const [logPage, setLogPage] = useState(1);
  const logsPerPage = 10;
  
  const indexOfLastLog = logPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalLogPages = Math.ceil(logs.length / logsPerPage);

  const handleAddAdmin = (e: React.FormEvent) => {
      e.preventDefault();
      if (isEditingAdmin && newAdminForm.id) {
          setAdmins(admins.map(a => a.id === newAdminForm.id ? { 
              ...a, 
              name: newAdminForm.name, 
              email: newAdminForm.email, 
              role: newAdminForm.role as any, 
              permissions: newAdminForm.permissions,
              status: newAdminForm.status as any
          } : a));
          alert("Data admin diperbarui!");
      } else {
          const newAdmin: AdminUser = {
              id: Date.now().toString(),
              name: newAdminForm.name,
              email: newAdminForm.email,
              role: newAdminForm.role as any,
              permissions: newAdminForm.permissions,
              status: newAdminForm.status as any || 'active',
              lastLogin: '-'
          };
          setAdmins([...admins, newAdmin]);
          alert("Admin baru berhasil ditambahkan!");
      }
      setShowAddAdminModal(false);
      setNewAdminForm({ id: '', name: '', email: '', role: 'admin_manager', permissions: [], status: 'active' });
      setIsEditingAdmin(false);
  };

  const handleEditAdmin = (admin: AdminUser) => {
      setNewAdminForm({ 
          id: admin.id, 
          name: admin.name, 
          email: admin.email, 
          role: admin.role, 
          permissions: admin.permissions,
          status: admin.status 
      });
      setIsEditingAdmin(true);
      setShowAddAdminModal(true);
  };

  const handleDeleteAdmin = (id: string) => {
      if (confirm('Apakah anda yakin ingin menghapus admin ini?')) {
          setAdmins(admins.filter(a => a.id !== id));
          alert("Admin dihapus.");
      }
  };

  const togglePermission = (perm: string) => {
    if (newAdminForm.permissions.includes(perm)) {
        setNewAdminForm({ ...newAdminForm, permissions: newAdminForm.permissions.filter(p => p !== perm) });
    } else {
        setNewAdminForm({ ...newAdminForm, permissions: [...newAdminForm.permissions, perm] });
    }
  };

  const handleExportLogs = () => {
      const csvContent = "data:text/csv;charset=utf-8," + logs.map(e => Object.values(e).join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "system_logs.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("Logs diexport ke CSV");
  };

  return (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center">
             <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                 <Crown className="w-6 h-6 text-orange-500" /> Admin Management
             </h2>
             <div className="flex gap-2">
                 <Button variant="outline" className="text-xs h-9" onClick={handleExportLogs}>Download Logs</Button>
                 <Button className="text-xs h-9" onClick={() => { setIsEditingAdmin(false); setNewAdminForm({ id: '', name: '', email: '', role: 'admin_manager', permissions: [], status: 'active' }); setShowAddAdminModal(true); }}><UserPlus className="w-4 h-4 mr-2" /> Add Admin</Button>
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
                    <div className="p-4 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 font-bold text-sm text-stone-900 dark:text-white">
                        Admin List
                    </div>
                    <div className="p-4 space-y-4">
                        {admins.map(admin => (
                            <div key={admin.id} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center font-bold text-stone-500">
                                        {admin.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-stone-900 dark:text-white">{admin.name} {admin.id === '1' && <span className="text-orange-500 text-xs">(You)</span>}</p>
                                        <p className="text-xs text-stone-500">{admin.email} • {admin.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${admin.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{admin.status}</span>
                                    {admin.role !== 'super_admin' && (
                                        <div className="flex gap-1 ml-2">
                                            <button onClick={() => handleEditAdmin(admin)} className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-800 rounded text-stone-500"><Edit className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDeleteAdmin(admin.id)} className="p-1.5 hover:bg-red-100 rounded text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm h-fit">
                <div className="p-4 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 font-bold text-sm flex justify-between items-center text-stone-900 dark:text-white">
                    <span>Audit Logs</span>
                </div>
                <div className="overflow-y-auto p-2 min-h-[400px]">
                    {currentLogs.map(log => (
                        <div key={log.id} className="p-3 border-b border-stone-100 dark:border-stone-800 last:border-0 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors rounded-lg">
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${log.severity === 'critical' ? 'bg-red-100 text-red-600' : log.severity === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{log.severity}</span>
                                <span className="text-[10px] text-stone-400 font-mono">{log.timestamp}</span>
                            </div>
                            <p className="text-xs font-bold text-stone-800 dark:text-stone-200">{log.action}</p>
                            <p className="text-[10px] text-stone-500">{log.details}</p>
                        </div>
                    ))}
                </div>
                {/* Pagination Controls for Logs */}
                {logs.length > 0 && (
                    <div className="p-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950">
                        <button 
                            onClick={() => setLogPage(p => Math.max(p - 1, 1))} 
                            disabled={logPage === 1}
                            className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-800 disabled:opacity-30"
                        >
                            <ChevronLeft className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                        </button>
                        <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300">
                            {logPage} / {totalLogPages}
                        </span>
                        <button 
                            onClick={() => setLogPage(p => Math.min(p + 1, totalLogPages))} 
                            disabled={logPage === totalLogPages}
                            className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-800 disabled:opacity-30"
                        >
                            <ChevronRight className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* Add/Edit Admin Modal */}
        {showAddAdminModal && (
            <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setShowAddAdminModal(false)} className="absolute top-4 right-4"><X className="w-5 h-5 text-stone-400 hover:text-stone-900 dark:hover:text-white" /></button>
                    <h3 className="font-bold text-lg mb-4 text-stone-900 dark:text-white">{isEditingAdmin ? 'Edit Admin' : 'Add New Admin'}</h3>
                    <form onSubmit={handleAddAdmin} className="space-y-4">
                        <Input label="Name" value={newAdminForm.name} onChange={e => setNewAdminForm({...newAdminForm, name: e.target.value})} required />
                        <Input label="Email" type="email" value={newAdminForm.email} onChange={e => setNewAdminForm({...newAdminForm, email: e.target.value})} required />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Role</label>
                                <select className="w-full p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-200" value={newAdminForm.role} onChange={e => setNewAdminForm({...newAdminForm, role: e.target.value})}>
                                    <option value="admin_manager">Manager</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Status</label>
                                <select className="w-full p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-200" value={newAdminForm.status} onChange={e => setNewAdminForm({...newAdminForm, status: e.target.value})}>
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Permissions</label>
                            <div className="flex flex-wrap gap-2">
                                {['all', 'moderation', 'distribution', 'users'].map(perm => (
                                    <button 
                                      type="button" 
                                      key={perm}
                                      onClick={() => togglePermission(perm)}
                                      className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${newAdminForm.permissions.includes(perm) ? 'bg-orange-500 text-white border-orange-500' : 'bg-stone-100 text-stone-500 border-stone-200 dark:bg-stone-800 dark:border-stone-700'}`}
                                    >
                                        {perm}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="ghost" onClick={() => setShowAddAdminModal(false)}>Cancel</Button>
                            <Button type="submit">Save Admin</Button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};
