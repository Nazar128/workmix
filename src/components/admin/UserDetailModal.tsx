"use client";

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

interface Props {
  user: User;
  onClose: () => void;
}

export default function UserDetailModal({ user, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        
        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900 z-10">
          <h2 className="text-xl font-bold text-white">Kullanıcı Detayları</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-2xl">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-5">
            <img 
              src={user.avatar_url || 'https://via.placeholder.com/80'} 
              className="w-24 h-24 rounded-full border-2 border-blue-600 object-cover shadow-lg" 
            />
            <div>
              <h3 className="text-2xl font-bold text-white">{user.name || 'İsimsiz Kullanıcı'}</h3>
              <p className="text-blue-400 font-medium">{user.job_title || 'Ünvan Yok'}</p>
              <p className="text-gray-500 text-sm">{user.department || 'Departman Belirtilmedi'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InfoBox label="E-Posta" value={user.email} />
            <InfoBox label="Telefon" value={user.phone || 'Girilmemiş'} />
            <InfoBox label="Sistem Rolü" value={user.system_role} highlight />
            <InfoBox label="Organizasyon" value={user.organization_id || 'Bağımsız'} />
            <InfoBox label="Kayıt Tarihi" value={user.created_at ? new Date(user.created_at).toLocaleString('tr-TR') : '-'} />
            <InfoBox label="Son Giriş" value={user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('tr-TR') : 'Giriş Yok'} />
            <InfoBox label="Doğrulama" value={user.email_verified ? 'Onaylı' : 'Onaysız'} />
            <InfoBox label="Durum" value={user.is_active ? 'Aktif' : 'Pasif'} statusColor={user.is_active} />
          </div>

          <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
            <h4 className="text-[10px] uppercase text-gray-500 font-black tracking-widest mb-2">Biyografi</h4>
            <p className="text-gray-300 text-sm italic">
              "{user.bio || 'Henüz bir açıklama eklenmemiş.'}"
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-800 flex justify-end bg-gray-900/50">
          <button 
            onClick={onClose}
            className="bg-gray-800 hover:bg-white hover:text-black text-white px-8 py-2.5 rounded-xl font-bold transition-all duration-200"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value, highlight, statusColor }: any) {
  return (
    <div className="bg-gray-800/20 p-3 rounded-lg border border-gray-800/50 flex flex-col justify-center">
      <span className="text-[10px] text-gray-500 uppercase font-bold">{label}</span>
      <span className={`text-sm font-medium mt-0.5 ${
        highlight ? 'text-blue-400' : 
        statusColor === true ? 'text-emerald-400' : 
        statusColor === false ? 'text-red-400' : 'text-gray-200'
      }`}>
        {value}
      </span>
    </div>
  );
}