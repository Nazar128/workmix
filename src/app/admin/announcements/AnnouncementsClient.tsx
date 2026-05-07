"use client";

import { createAnnouncement, deleteAnnouncement, toggleAnnouncement } from "@/actions/announcements";
import { useState, useTransition } from "react";
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

const TYPE_STYLES: Record<string, string> = {
  info: "bg-blue-900/30 text-blue-400 border-blue-800",
  warning: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
  error: "bg-red-900/30 text-red-400 border-red-800",
  success: "bg-emerald-900/30 text-emerald-400 border-emerald-800",
};

const TYPE_LABELS: Record<string, string> = {
  info: "Bilgi",
  warning: "Uyarı",
  error: "Hata",
  success: "Başarı",
};

export default function AnnouncementsClient({ announcements }: { announcements: Announcement[] }) {
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "info",
    expiresAt: "",
  });

  const handleCreate = () => {
    if (!form.title || !form.message) return;
    startTransition(async () => {
      try {
        await createAnnouncement(form.title, form.message, form.type, form.expiresAt || undefined);
        setForm({ title: "", message: "", type: "info", expiresAt: "" });
        setShowForm(false);
      } catch (e: any) {
        alert(e.message);
      }
    });
  };

  const handleToggle = (id: string, current: boolean) => {
    startTransition(async () => {
      try {
        await toggleAnnouncement(id, !current);
      } catch (e: any) {
        alert(e.message);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      try {
        await deleteAnnouncement(id);
      } catch (e: any) {
        alert(e.message);
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl text-gray-100 font-bold uppercase tracking-tight flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Duyuru Yönetimi ({announcements.length})
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          Yeni Duyuru
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-gray-200 font-semibold mb-4">Yeni Duyuru Oluştur</h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Başlık"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="Mesaj"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
              className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="info">Bilgi</option>
                <option value="warning">Uyarı</option>
                <option value="error">Hata</option>
                <option value="success">Başarı</option>
              </select>
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-400 hover:text-gray-200 text-sm transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleCreate}
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
              >
                {isPending ? "Oluşturuluyor..." : "Oluştur"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {announcements.length === 0 && (
          <div className="text-center text-gray-500 py-12">Henüz duyuru yok.</div>
        )}
        {announcements.map((a) => (
          <div
            key={a.id}
            className={`border rounded-xl p-4 flex items-start justify-between gap-4 ${
              a.is_active ? TYPE_STYLES[a.type] : "bg-gray-900/30 text-gray-500 border-gray-800"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{a.title}</span>
                <span className="text-xs opacity-70 uppercase">
                  {TYPE_LABELS[a.type]}
                </span>
                {!a.is_active && (
                  <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded">Pasif</span>
                )}
              </div>
              <p className="text-sm opacity-80">{a.message}</p>
              <p className="text-xs opacity-50 mt-1">
                {new Date(a.created_at).toLocaleDateString("tr-TR", {
                  day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                })}
                {a.expires_at && ` · ${new Date(a.expires_at).toLocaleDateString("tr-TR")} tarihinde sona erer`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggle(a.id, a.is_active)}
                disabled={isPending}
                className="opacity-70 hover:opacity-100 transition-opacity"
                title={a.is_active ? "Pasife al" : "Aktif et"}
              >
                {a.is_active
                  ? <ToggleRight className="w-5 h-5" />
                  : <ToggleLeft className="w-5 h-5" />
                }
              </button>
              <button
                onClick={() => handleDelete(a.id)}
                disabled={isPending}
                className="opacity-70 hover:opacity-100 transition-opacity"
                title="Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}