"use client";

import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_value: any;
  new_value: any;
  ip_address: string | null;
  created_at: string;
  user_id: string | null;
  users?: { name: string; email: string } | null;
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  "user.created":               { label: "Kullanıcı Oluşturuldu",     color: "text-emerald-400 bg-emerald-900/30" },
  "user.suspended":             { label: "Kullanıcı Askıya Alındı",   color: "text-red-400 bg-red-900/30" },
  "user.activated":             { label: "Kullanıcı Aktif Edildi",    color: "text-emerald-400 bg-emerald-900/30" },
  "user.role_changed":          { label: "Rol Değiştirildi",          color: "text-blue-400 bg-blue-900/30" },
  "project.created":            { label: "Proje Oluşturuldu",         color: "text-emerald-400 bg-emerald-900/30" },
  "project.deleted":            { label: "Proje Silindi",             color: "text-red-400 bg-red-900/30" },
  "org.suspended":              { label: "Org. Askıya Alındı",        color: "text-red-400 bg-red-900/30" },
  "org.activated":              { label: "Org. Aktif Edildi",         color: "text-emerald-400 bg-emerald-900/30" },
  "org.limits_updated":         { label: "Limit Güncellendi",         color: "text-yellow-400 bg-yellow-900/30" },
  "org.ownership_transferred":  { label: "Sahiplik Devredildi",       color: "text-purple-400 bg-purple-900/30" },
  "announcement.created":       { label: "Duyuru Oluşturuldu",        color: "text-blue-400 bg-blue-900/30" },
  "announcement.deleted":       { label: "Duyuru Silindi",            color: "text-red-400 bg-red-900/30" },
  "announcement.toggled":       { label: "Duyuru Durumu Değişti",     color: "text-yellow-400 bg-yellow-900/30" },
};

export default function AuditLogTable({ logs }: { logs: AuditLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        Henüz kayıt yok.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/50 no-scrollbar">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full table-fixed divide-y divide-gray-800 text-sm text-left">
          <thead className="bg-gray-800/50 text-gray-400 uppercase text-xs">
            <tr>
              <th scope="col" className="w-[180px] px-4 sm:px-6 py-4 font-semibold">İşlem</th>
              <th scope="col" className="w-[180px] px-4 sm:px-6 py-4 font-semibold">Yapan</th>
              <th scope="col" className="w-[220px] px-4 sm:px-6 py-4 font-semibold">Detay</th>
              <th scope="col" className="w-[120px] px-4 sm:px-6 py-4 font-semibold">IP</th>
              <th scope="col" className="w-[140px] px-4 sm:px-6 py-4 font-semibold">Zaman</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-transparent">
            {logs.map((log) => {
              const meta = ACTION_LABELS[log.action] ?? { label: log.action, color: "text-gray-400 bg-gray-800" };
              return (
                <tr key={log.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`text-[11px] sm:text-xs font-semibold px-2 py-1 rounded inline-block truncate max-w-full ${meta.color}`}>
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-300 break-words">
                    <div className="font-medium truncate max-w-full">{log.users?.name ?? "Sistem"}</div>
                    {log.users?.email && (
                      <div className="text-gray-500 text-xs truncate max-w-full">{log.users.email}</div>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-400 text-xs truncate max-w-[220px]">
                    {log.new_value ? JSON.stringify(log.new_value) : "-"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                    {log.ip_address ?? "-"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-400 text-xs whitespace-nowrap">
                    {formatDistanceToNow(new Date(log.created_at), {
                      addSuffix: true,
                      locale: tr,
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}