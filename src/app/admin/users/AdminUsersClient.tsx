"use client";

import { suspendUser } from '@/actions/admin';
import { useTransition, useState } from 'react';
import UserDetailModal from '@/components/admin/UserDetailModal';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url: string;
  system_role: string;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
  bio?: string;
  job_title?: string;
  department?: string;
  organization_id?: string;
  email_verified?: boolean;
  last_sign_in_at?: string;
}

export default function AdminUsersClient({ users }: { users: User[] }) {
  const [isPending, startTransition] = useTransition();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSuspend = (user: User) => {
    const actionText = user.is_active ? "askıya almak" : "aktif etmek";
    if (confirm(`${user.name} kullanıcısını ${actionText} istediğinize emin misiniz?`)) {
      startTransition(async () => {
        try {
          await suspendUser(user.id, user.is_active);
        } catch (error: any) {
          alert(error.message || "İşlem başarısız oldu.");
        }
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className='text-2xl text-gray-100 font-bold uppercase tracking-tight'>
          Kullanıcı Yönetimi ({users?.length ?? 0})
        </h1>
      </div>

      <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
        <table className='w-full text-sm text-left'>
          <thead className="bg-gray-800/50 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Kullanıcı</th>
              <th className="px-6 py-4">İletişim</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Durum</th>
              <th className="px-6 py-4">Kayıt Tarihi</th>
              <th className="px-6 py-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img 
                    src={user.avatar_url || 'https://via.placeholder.com/40'} 
                    className="w-10 h-10 rounded-full border border-gray-700 object-cover"
                  />
                  <span className="font-medium text-gray-200">{user.name}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-300">{user.email}</div>
                  <div className="text-gray-500 text-xs">{user.phone || 'Telefon yok'}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs font-semibold">
                    {user.system_role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 ${user.is_active ? 'text-emerald-400' : 'text-red-400'}`}>
                    <span className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    {user.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR') : '-'}
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg font-bold text-xs hover:bg-blue-600 hover:text-white transition-all"
                  >
                    DETAY
                  </button>
                  <button
                    onClick={() => handleSuspend(user)}
                    disabled={isPending}
                    className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
                      user.is_active 
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' 
                        : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                    } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isPending ? '...' : (user.is_active ? 'Askıya Al' : 'Aktif Et')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <UserDetailModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
}