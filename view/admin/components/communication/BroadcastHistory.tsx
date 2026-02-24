
import React from 'react';
import { Inbox } from 'lucide-react';
import { EmptyState } from '../../../common/EmptyState';
import { BroadcastMessage } from '../../../../types';

interface BroadcastHistoryProps {
    messages: BroadcastMessage[];
}

export const BroadcastHistory: React.FC<BroadcastHistoryProps> = ({ messages }) => {
    return (
        <div className="space-y-4">
            {messages.length === 0 && (
                <EmptyState
                    icon={Inbox}
                    title="Belum Ada Pesan"
                    description="Riwayat pesan broadcast yang dikirim akan muncul di sini."
                />
            )}
            {messages.map(msg => (
                <div key={msg.id} className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-stone-900 dark:text-white">{msg.title}</h4>
                        <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded font-bold uppercase">{msg.status}</span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-300 mb-3 whitespace-pre-wrap">{msg.content}</p>
                    <div className="flex justify-between text-xs text-stone-500">
                        <span>Target: {msg.target === 'all' ? 'Semua User' : msg.target}</span>
                        <span>Dibaca: {msg.readCount} users</span>
                        <span>{msg.sentAt}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
