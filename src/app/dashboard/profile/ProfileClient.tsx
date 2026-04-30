"use client";

import { changePassword, updateAvatarUrl, updateProfile } from "@/actions/profile";
import AvatarUpload from "@/components/dashboard/AvatarUpload";
import { useState, useTransition } from "react";

type Profile = { 
  id: string; 
  name: string; 
  email: string; 
  phone?: string | null; 
  bio?: string | null; 
  job_title?: string | null; 
  department?: string | null; 
  avatar_url?: string | null; 
  system_role?: string | null; 
  is_active?: boolean; 
  email_verified?: boolean; 
  last_login_at?: string | null; 
  created_at: string
};

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-gray-600 mb-1.5 tracking-wider">{children}</label>;
}

function Input({ value, onChange, placeholder, type = "text", disabled = false }: { value: string; onChange?: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean }) {
  return <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} disabled={disabled} className="w-full bg-white/5 border-2 border-purple-400 px-4 py-2.5 text-purple-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl" />;
}

function Textarea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full bg-white/5 border-2 border-purple-400 rounded-xl px-4 py-2.5 text-sm text-purple-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />;
}

function Badge({ label }: { label: string }) {
  return <span className="inline-flex items-center rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-400 border border-white/5">{label}</span>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2  last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm text-purple-800">{value}</span>
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-blue-500">{icon}</span>}
        <h2 className="text-purple-800 font-medium">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function ProfileClient({ initialProfile }: { initialProfile: Profile }) {
  const [profile] = useState<Profile>(initialProfile);
  
  const [name, setName] = useState(initialProfile.name ?? "");
  const [phone, setPhone] = useState(initialProfile.phone ?? "");
  const [bio, setBio] = useState(initialProfile.bio ?? "");
  const [jobTitle, setJobTitle] = useState(initialProfile.job_title ?? "");
  const [department, setDepartment] = useState(initialProfile.department ?? "");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [isPendingProfile, startProfile] = useTransition();
  const [isPendingPassword, startPassword] = useTransition();

  const handleProfileSave = () => {
    startProfile(async () => {
      try {
        await updateProfile({ name, phone, bio, job_title: jobTitle, department });
        setProfileMsg({ ok: true, text: "Profil güncellendi" });
      } catch (error) {
        setProfileMsg({ ok: false, text: "Güncelleme başarısız" });
      }
      setTimeout(() => setProfileMsg(null), 3000);
    });
  };

  const handlePasswordSave = () => {
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ ok: false, text: "Şifreler eşleşmiyor" });
      return;
    }
    startPassword(async () => {
      try {
        await changePassword(newPassword);
        setPasswordMsg({ ok: true, text: "Şifre değiştirildi" });
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        setPasswordMsg({ ok: false, text: "Hata oluştu" });
      }
      setTimeout(() => setPasswordMsg(null), 3000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-purple-800 text-3xl font-bold">Profilim</h1>
        <p className="text-gray-500 mt-1">Kişisel bilgilerinizi buradan yönetebilirsiniz.</p>
      </div>

      <div className="bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-transparent border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
        <AvatarUpload 
          currentUrl={profile.avatar_url} 
          userId={profile.id} 
          userName={profile.name} 
          onUploadComplete={async (url) => { await updateAvatarUrl(url); }} 
        />
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-purple-800 text-2xl font-semibold">{profile.name}</h2>
          <p className="text-gray-500 max-w-md">{profile.bio || "Henüz bir biyografi eklenmemiş."}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {profile.system_role && <Badge label={profile.system_role} />}
            {profile.is_active && <Badge label="Aktif Hesap" />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="Kişisel Bilgiler">
          <div className="space-y-4">
            <div >
              <Label>Ad Soyad</Label>
              <Input value={name} onChange={setName}  />
            </div>
            <div>
              <Label>Telefon</Label>
              <Input value={phone} onChange={setPhone} />
            </div>
            <div>
              <Label>Biyografi</Label>
              <Textarea value={bio} onChange={setBio} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Kurum Bilgileri">
          <div className="space-y-4">
            <div>
              <Label>Ünvan</Label>
              <Input value={jobTitle} onChange={setJobTitle} />
            </div>
            <div>
              <Label>Departman</Label>
              <Input value={department} onChange={setDepartment} />
            </div>
            <div className="pt-4 border-2 border-purple-400 space-y-1 ">
               <InfoRow label="Email" value={profile.email}  />
               <InfoRow label="Üyelik" value={new Date(profile.created_at).toLocaleDateString("tr-TR")} />
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={handleProfileSave} 
          disabled={isPendingProfile} 
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isPendingProfile ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
        {profileMsg && (
          <span className={profileMsg.ok ? "text-green-400" : "text-red-400"}>{profileMsg.text}</span>
        )}
      </div>

      <SectionCard title="Güvenlik ve Şifre">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Yeni Şifre</Label>
            <Input type="password" value={newPassword} onChange={setNewPassword} placeholder="••••••••" />
          </div>
          <div>
            <Label>Şifre Tekrar</Label>
            <Input type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" />
          </div>
        </div>
        <div className="flex items-center gap-4 pt-2">
          <button 
            onClick={handlePasswordSave} 
            disabled={isPendingPassword || !newPassword}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-30"
          >
            {isPendingPassword ? "Güncelleniyor..." : "Şifreyi Güncelle"}
          </button>
          {passwordMsg && (
            <span className={passwordMsg.ok ? "text-green-400" : "text-red-400"}>{passwordMsg.text}</span>
          )}
        </div>
      </SectionCard>
    </div>
  );
}