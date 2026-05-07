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
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-800/50 text-gray-400 uppercase text-xs">
          <tr>
            <th className="px-6 py-4">İşlem</th>
            <th className="px-6 py-4">Yapan</th>
            <th className="px-6 py-4">Detay</th>
            <th className="px-6 py-4">IP</th>
            <th className="px-6 py-4">Zaman</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {logs.map((log) => {
            const meta = ACTION_LABELS[log.action] ?? { label: log.action, color: "text-gray-400 bg-gray-800" };
            return (
              <tr key={log.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${meta.color}`}>
                    {meta.label}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {log.users?.name ?? "Sistem"}
                  {log.users?.email && (
                    <div className="text-gray-500 text-xs">{log.users.email}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs max-w-xs truncate">
                  {log.new_value ? JSON.stringify(log.new_value) : "-"}
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs">
                  {log.ip_address ?? "-"}
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs whitespace-nowrap">
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
  );
}