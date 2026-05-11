"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import SettingItem from "@/components/SettingItem";

export default function AdminSettings() {
  const supabase = createClient();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
 const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("system_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle(); 

      if (supabaseError) throw supabaseError;

      if (!data) {
        setError("Sistem ayarları bulunamadı. Lütfen veritabanında id=1 olan bir satır olduğundan emin olun.");
      } else {
        setSettings(data);
      }
    } catch (err: any) {
      console.error("Yükleme hatası:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    fetchSettings();
  }, []);

  const handleUpdate = async (column: string, value: any) => {
    if (!settings) return;

    const prevValue = settings[column];
    setSettings((prev: any) => ({ ...prev, [column]: value }));

    startTransition(async () => {
      const { error: updateError } = await supabase
        .from("system_settings")
        .update({ [column]: value, updated_at: new Date().toISOString() })
        .eq("id", 1);

      if (updateError) {
        setSettings((prev: any) => ({ ...prev, [column]: prevValue }));
        alert("Güncelleme başarısız: " + updateError.message);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="animate-pulse">Sistem ayarları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white p-6">
        <div className="bg-red-500/10 border border-red-500 p-4 rounded-lg max-w-md text-center">
          <h2 className="text-red-500 font-bold mb-2">Bir Hata Oluştu</h2>
          <p className="text-sm text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500 px-4 py-2 rounded text-sm hover:bg-red-600 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-white bg-[#0a0a0a] min-h-screen">
      <header className="mb-8 border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-blue-400">Sistem Ayarları</h1>
        <p className="text-gray-400 text-sm mt-1">WorkMix platform parametrelerini yönetin.</p>
      </header>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-medium text-blue-400">Erişim ve Bakım</h2>
        <SettingItem 
          label="Bakım Modu"
          description="Sistemi tüm kullanıcılara kapatır."
          value={settings.is_maintenance_mode}
          type="switch"
          onUpdate={(val) => handleUpdate("is_maintenance_mode", val)}
          loading={isPending}
        />
        <SettingItem 
          label="Bakım Mesajı"
          description="Bakım modunda kullanıcılara gösterilecek metin."
          value={settings.maintenance_message || ""}
          type="text"
          onUpdate={(val) => handleUpdate("maintenance_message", val)}
          loading={isPending}
        />
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-medium text-green-400">Sistem Limitleri</h2>
        <SettingItem 
          label="Global Ticket Limiti"
          description="Kullanıcı başına aktif bilet sınırı."
          value={settings.global_ticket_limit}
          type="number"
          onUpdate={(val) => handleUpdate("global_ticket_limit", val)}
          loading={isPending}
        />
        <SettingItem 
          label="Yeni Kayıt Alımı"
          description="Sisteme yeni kayıt yapılabilmesini kontrol eder."
          value={settings.registration_enabled}
          type="switch"
          onUpdate={(val) => handleUpdate("registration_enabled", val)}
          loading={isPending}
        />
      </section>
    </div>
  );
}