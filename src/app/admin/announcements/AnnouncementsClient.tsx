"use client";

import { createAnnouncement, deleteAnnouncement, toggleAnnouncement } from "@/actions/announcements";
import { useState, useTransition } from "react";
import { Bell, Plus, Trash2, Info, AlertTriangle, XCircle, CheckCircle2, Calendar, Loader2, Megaphone } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

const TYPE_STYLES: Record<string, { card: string; badge: string; icon: any; iconColor: string }> = {
  info: {
    card: "bg-blue-50/60 border-blue-100 text-blue-900 shadow-sm shadow-blue-50/50",
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    iconColor: "text-blue-600",
    icon: Info,
  },
  warning: {
    card: "bg-amber-50/60 border-amber-100 text-amber-900 shadow-sm shadow-amber-50/50",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    iconColor: "text-amber-600",
    icon: AlertTriangle,
  },
  error: {
    card: "bg-rose-50/60 border-rose-100 text-rose-900 shadow-sm shadow-rose-50/50",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    iconColor: "text-rose-600",
    icon: XCircle,
  },
  success: {
    card: "bg-emerald-50/60 border-emerald-100 text-emerald-900 shadow-sm shadow-emerald-50/50",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    iconColor: "text-emerald-600",
    icon: CheckCircle2,
  },
};

const TYPE_LABELS: Record<string, string> = {
  info: "Bilgilendirme",
  warning: "Önemli Uyarı",
  error: "Sistem Hatası",
  success: "Başarı Raporu",
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
    if (!confirm("Bu duyuruyu kalıcı olarak silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      try {
        await deleteAnnouncement(id);
      } catch (e: any) {
        alert(e.message);
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 bg-gradient-to-br from-purple-50/30 via-slate-50 to-indigo-50/20 min-h-screen text-gray-800 antialiased">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-purple-100">
        <div className="flex items-center gap-3 mt-2">
          <div className="p-3 bg-white border border-purple-100 rounded-2xl text-purple-600 shadow-md shadow-purple-100/50">
            <Bell className="w-4 h-4 md:w-6 md:h-6 text-purple-600 animate-swing" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Duyuru Yönetimi
            </h1>
            <p className="text-sm font-medium text-gray-400 mt-0.5">Tüm kullanıcılara veya organizasyonlara iletilecek sistem bildirimleri.</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 md:px-5 p-2.5 rounded-xl text-[11px] md:text-sm font-bold transition-all shadow-md active:scale-95 ${
            showForm 
              ? "bg-slate-200 text-slate-700 hover:bg-slate-300" 
              : "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200"
          }`}
        >
          <Plus className={`w-4 h-4 transition-transform ${showForm ? "rotate-45" : ""}`} />
          {showForm ? "Kapat" : "Yeni Duyuru Yayınla"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-purple-100 rounded-2xl m-6 p-2 md:p-6 shadow-xl shadow-purple-100/40 relative overflow-hidden transition-all animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
          <h2 className="text-sm md:text-base font-black text-slate-900 mb-5 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-purple-500" /> Yeni Duyuru Detayları
          </h2>
          
          <div className="space-y-2 md:space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500  tracking-wider mb-1.5">Duyuru Başlığı</label>
              <input
                type="text"
                placeholder="Örn: Sistem Bakım Çalışması Hakkında"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-1 md:px-4 md:py-2.5 text-xs md:text-sm font-medium outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500  tracking-wider mb-1.5">Duyuru Mesajı</label>
              <textarea
                placeholder="Kullanıcılara gösterilecek detaylı metni buraya yazın..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-1 md:px-4 md:py-2.5 text-xs md:text-sm font-medium outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500  tracking-wider mb-1.5">Duyuru Tipi</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-1 md:px-4 md:py-2.5 text-xs md:text-sm font-bold outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all shadow-sm"
                >
                  <option value="info">Bilgi</option>
                  <option value="warning"> Uyarı</option>
                  <option value="error"> Hata / Acil durum</option>
                  <option value="success">Başarı / Yenilik</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500  tracking-wider mb-1.5">Geçerlilik Bitiş Tarihi </label>
                <input
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-600 rounded-xl p-1 md:px-4 md:py-2.5 text-xs md:text-sm font-medium outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-gray-500 hover:text-gray-700 text-xs md:text-sm font-bold transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={handleCreate}
                disabled={isPending || !form.title || !form.message}
                className="bg-purple-600 hover:bg-purple-700 text-white p-2 md:px-6 md:py-2.5 rounded-xl text-xs md:text-sm font-black transition-all shadow-md shadow-purple-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Duyuruyu Paylaş
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="m-6 space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-purple-100 p-12 text-center shadow-sm">
            <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <div className="text-base font-bold text-slate-700">Aktif Duyuru Bulunmuyor</div>
            <p className="text-sm text-gray-400 mt-1">Sistem genelinde yayınlanmış herhangi bir bildirim kaydı yok.</p>
          </div>
        ) : (
          announcements.map((a) => {
            const style = TYPE_STYLES[a.type] || TYPE_STYLES.info;
            const IconComponent = style.icon;

            return (
              <div
                key={a.id}
                className={`border rounded-2xl p-5 flex flex-col sm:flex-row items-start justify-between gap-4 transition-all relative overflow-hidden group ${
                  a.is_active 
                    ? `${style.card}` 
                    : "bg-white text-gray-400 border-slate-200 opacity-65 shadow-inner"
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-1 md:p-2.5 rounded-xl border bg-white shadow-sm shrink-0 ${a.is_active ? style.iconColor : "text-gray-400 border-gray-100"}`}>
                    <IconComponent className="w-3 h-3 md:w-5 md:h-5" />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-black text-sm md:text-base ${a.is_active ? "text-slate-900" : "text-gray-500 line-through"}`}>
                        {a.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black  border tracking-wider ${
                        a.is_active ? style.badge : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}>
                        {TYPE_LABELS[a.type]}
                      </span>
                      {!a.is_active && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-md font-bold  tracking-wider"> Yayından Kaldırıldı</span>
                      )}
                    </div>
                    
                    <p className={`text-xs md:text-sm leading-relaxed ${a.is_active ? "text-slate-700" : "text-gray-400"}`}>
                      {a.message}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[10px] md:text-xs font-semibold opacity-60">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(a.created_at).toLocaleDateString("tr-TR", {
                          day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </span>
                      {a.expires_at && (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-100/50 px-2 py-0.5 rounded-md font-bold">
                          Bitiş: {new Date(a.expires_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 shrink-0">
                  <button
                    onClick={() => handleToggle(a.id, a.is_active)}
                    disabled={isPending}
                    className={`relative inline-flex w-10 h-6 md:w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      a.is_active ? "bg-purple-600" : "bg-slate-200"
                    } disabled:opacity-50`}
                    title={a.is_active ? "Duyuruyu Gizle / Pasif Et" : "Duyuruyu Yayına Al"}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        a.is_active ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => handleDelete(a.id)}
                    disabled={isPending}
                    className="p-1 md:p-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-xl transition-all shadow-sm active:scale-90"
                    title="Duyuruyu Kalıcı Olarak Sil"
                  >
                    <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}