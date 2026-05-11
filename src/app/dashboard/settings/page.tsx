"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import SettingItem from "@/components/SettingItem";
import { useRouter } from "next/navigation";

export default function UserSettings() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();
        if (!error) setUser(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (column: string, value: any) => {
    if (!user) return;
    const prevValue = user[column];
    setUser((prev: any) => ({ ...prev, [column]: value }));

    startTransition(async () => {
      const { error } = await supabase
        .from("users")
        .update({ [column]: value, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) {
        setUser((prev: any) => ({ ...prev, [column]: prevValue }));
        alert("Hata: " + error.message);
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    if (confirm("Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
      const { error } = await supabase.from("users").delete().eq("id", user.id);
      if (!error) {
        await supabase.auth.signOut();
        router.push("/register");
      }
    }
  };

  if (loading || !user) return <div className="p-10 text-white">Yükleniyor...</div>;

  return (
    <div className="max-w-4xl mx-auto p-2 text-white  min-h-screen">
      <header className="mb-4 border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-indigo-400">Tercihler ve Hesap</h1>
        <p className="text-gray-400 text-sm mt-1">Platform deneyiminizi teknik düzeyde yapılandırın.</p>
      </header>

      <section className="mb-6 space-y-4">
        <h2 className="text-lg font-medium text-indigo-400">Arayüz ve Deneyim</h2>
        <SettingItem 
          label="Tema Seçimi"
          description="Koyu tema (Dark) veya Açık tema (Light) arasında geçiş yapın."
          value={user.theme_preference === 'dark'}
          type="switch"
          onUpdate={(val) => handleUpdate("theme_preference", val ? 'dark' : 'light')}
          loading={isPending}
        />
        <SettingItem 
          label="Kompakt Görünüm"
          description="Daha fazla veri görmek için liste yoğunluğunu artırın."
          value={user.compact_view}
          type="switch"
          onUpdate={(val) => handleUpdate("compact_view", val)}
          loading={isPending}
        />
      </section>

      <section className="mb-4 space-y-4">
        <h2 className="text-lg font-medium text-indigo-400">Hesap Durumu</h2>
        <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-green-950">Hesap Durumu: {user.is_active ? 'Aktif' : 'Kısıtlı'}</span>
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-widest">{user.system_role}</span>
        </div>
      </section>

      <section className="mt-12 space-y-4 border-t border-red-500/20 pt-8">
        <h2 className="text-lg font-medium text-red-500">Tehlikeli Alan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handleLogout}
            className="p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left"
          >
            <h4 className="text-sm font-semibold text-red-900">Oturumu Kapat</h4>
            <p className="text-xs text-gray-500 mt-1">Mevcut oturumunuzu güvenli bir şekilde sonlandırın.</p>
          </button>
          <button 
            onClick={handleDeleteAccount}
            className="p-4 border border-red-500/10 rounded-xl bg-red-500/5 hover:bg-red-500/10 transition-all text-left group"
          >
            <h4 className="text-sm font-semibold text-red-500">Hesabı Sil</h4>
            <p className="text-xs text-gray-500 mt-1 group-hover:text-red-400">Tüm verileriniz kalıcı olarak silinecektir.</p>
          </button>
        </div>
      </section>
    </div>
  );
}