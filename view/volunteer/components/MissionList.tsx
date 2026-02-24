
import React, { useState } from 'react';
import { Filter, Navigation, ScanLine, Search, ChevronRight, Eye, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { EmptyState } from '../../common/EmptyState';
import { VolunteerTask } from '../../../types';

interface MissionListProps {
  tasks: VolunteerTask[];
  activeTab: 'available' | 'active';
  onAcceptTask: (id: number) => void;
  onScanQr: (taskId: string | number) => void;
  onSelectTask: (task: VolunteerTask) => void;
  isLoading?: boolean;
  completedTaskIds?: Set<string | number>; // Prop baru untuk locking UI
}

export const MissionList: React.FC<MissionListProps> = ({ tasks, activeTab, onAcceptTask, onScanQr, onSelectTask, isLoading, completedTaskIds }) => {
  const [filterDistance, setFilterDistance] = useState<'all' | 'near'>('all');

  const filteredTasks = tasks.filter(t => {
      // Logic status sudah difilter di parent, tapi double check aman
      if (filterDistance === 'near' && t.distance > 2) return false;
      return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in">
        {activeTab === 'available' && (
          <div className="flex items-center justify-end mb-4">
               <div className="flex items-center gap-2 bg-white dark:bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800">
                  <Filter className="w-4 h-4 text-stone-400" />
                  <select 
                    value={filterDistance} 
                    onChange={(e) => setFilterDistance(e.target.value as any)}
                    className="bg-transparent text-sm font-medium text-stone-600 dark:text-stone-300 focus:outline-none"
                  >
                      <option value="all">Semua Jarak</option>
                      <option value="near">Terdekat (&lt; 2km)</option>
                  </select>
               </div>
          </div>
        )}

        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-stone-900 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 min-h-[300px]">
                <div className="relative mb-4">
                    <div className="w-16 h-16 border-4 border-stone-100 dark:border-stone-800 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div>
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-1">Mencari Misi...</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">Menghubungkan ke database misi area Anda.</p>
            </div>
        ) : filteredTasks.length === 0 ? (
            <EmptyState 
                icon={Search}
                title="Tidak Ada Misi"
                description={activeTab === 'available' ? "Saat ini belum ada misi pengantaran yang tersedia di area Anda." : "Anda belum mengambil misi apapun."}
            />
        ) : (
            filteredTasks.map(task => {
                const isCompletedLocally = completedTaskIds?.has(task.id);
                // Task dianggap selesai jika statusnya 'history' (completed) ATAU ID-nya ada di set completedTaskIds
                const isTaskFinished = task.status === 'history' || isCompletedLocally;

                return (
                <div 
                    key={task.id} 
                    onClick={() => onSelectTask(task)}
                    className={`bg-white dark:bg-stone-900 p-5 rounded-2xl border ${isCompletedLocally ? 'border-green-500/30 bg-green-50/10' : 'border-orange-100 dark:border-stone-800'} relative overflow-hidden shadow-sm cursor-pointer hover:border-orange-300 dark:hover:border-stone-600 transition-all active:scale-[0.98]`}
                >
                <div className={`absolute top-0 left-0 w-1 h-full ${isCompletedLocally ? 'bg-green-500' : 'bg-gradient-to-b from-orange-500 to-amber-500'}`} />
                
                <div className="flex justify-between items-start mb-4">
                    <div>
                    <h3 className="font-bold text-stone-900 dark:text-white text-lg">{task.items}</h3>
                    </div>
                    {activeTab === 'active' && (
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${task.stage === 'pickup' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-300'}`}>
                        {task.stage === 'pickup' ? 'Menjemput' : 'Mengantar'}
                    </div>
                    )}
                </div>

                <div className="space-y-3 relative">
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-stone-200 dark:bg-stone-800" />
                    
                    <div className={`flex items-center gap-3 relative z-10 ${task.stage === 'pickup' ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white dark:border-stone-900" />
                    <div>
                        <p className="text-xs text-stone-500 dark:text-stone-500">Ambil dari</p>
                        <p className="text-sm font-medium text-stone-700 dark:text-stone-200">{task.from}</p>
                    </div>
                    </div>

                    <div className={`flex items-center gap-3 relative z-10 ${task.stage === 'dropoff' ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-white dark:border-stone-900" />
                    <div>
                        <p className="text-xs text-stone-500 dark:text-stone-500">Antar ke</p>
                        <p className="text-sm font-medium text-stone-700 dark:text-stone-200">{task.to}</p>
                    </div>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    {activeTab === 'available' ? (
                    <Button onClick={(e) => { e.stopPropagation(); onSelectTask(task); }} className="bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white shadow-none border-0">
                        <Eye className="w-4 h-4 mr-2" /> Lihat Detail Misi
                    </Button>
                    ) : (
                    <>
                        <Button variant="outline" onClick={(e) => { e.stopPropagation(); onSelectTask(task); }}>
                            <Navigation className="w-4 h-4 mr-2" /> Rute
                        </Button>
                        <Button 
                            onClick={(e) => { 
                                if (!isTaskFinished) {
                                    e.stopPropagation(); 
                                    onScanQr(task.id); 
                                }
                            }} 
                            disabled={isTaskFinished}
                            className={`transition-all ${isTaskFinished ? 'bg-stone-200 text-stone-400 cursor-not-allowed border-0 shadow-none' : task.stage === 'dropoff' ? 'bg-green-600 hover:bg-green-500' : ''}`}
                        >
                            {isTaskFinished ? (
                                <><CheckCircle2 className="w-4 h-4 mr-2" /> Selesai</>
                            ) : (
                                <><ScanLine className="w-4 h-4 mr-2" /> {task.stage === 'pickup' ? 'Scan QR Penyedia' : 'Scan QR Penerima'}</>
                            )}
                        </Button>
                    </>
                    )}
                </div>
                </div>
            )})
        )}
    </div>
  );
};
