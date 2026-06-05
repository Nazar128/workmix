"use client";

import { changePassword, updateAvatarUrl, updateProfile } from "@/actions/profile";
import AvatarUpload from "@/components/dashboard/AvatarUpload";
import { useState, useTransition } from "react";
import { User, Building2, ShieldCheck, Save, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";

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

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-purple-900/60 uppercase tracking-wider mb-2">
      {children}
    </label>
  );
}

function Input({ id, value,name, onChange, placeholder, type = "text", disabled = false, autoComplete = "off" }: { id?: string; value: string; name?: string; onChange?: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean; autoComplete?: string }) {
  return (
    <input 
      id={id}
      name={name}
      type={type} 
      value={value} 
      onChange={(e) => onChange?.(e.target.value)} 
      placeholder={placeholder} 
      disabled={disabled} 
      autoComplete={autoComplete}
      className="w-full bg-white/70 backdrop-blur-sm border border-slate-200/80 px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 rounded-xl transition-all text-sm shadow-sm disabled:opacity-50" 
    />
  );
}

function Textarea({id, value, onChange, placeholder, autoComplete = "off" }: { id?: string; value: string; onChange: (v: string) => void; placeholder?: string; autoComplete?: string }) {
  return (
    <textarea 
      id={id}
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder} 
      rows={3} 
      className="w-full bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all shadow-sm" 
    />
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 border border-purple-100 uppercase tracking-wider shadow-sm">
      {label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 px-1">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-700">{value}</span>
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="border border-white/20 bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-5">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        {icon && <span className="text-purple-600">{icon}</span>}
        <h2 className="text-base font-bold text-slate-800 tracking-tight">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
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
        setProfileMsg({ ok: true, text: "Profil başarıyla güncellendi." });
      } catch (error) {
        setProfileMsg({ ok: false, text: "Güncelleme sırasında hata oluştu." });
      }
      setTimeout(() => setProfileMsg(null), 3000);
    });
  };

  const handlePasswordSave = () => {
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ ok: false, text: "Şifreler birbiriyle eşleşmiyor." });
      return;
    }
    startPassword(async () => {
      try {
        await changePassword(newPassword);
        setPasswordMsg({ ok: true, text: "Şifreniz başarıyla değiştirildi." });
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        setPasswordMsg({ ok: false, text: "Şifre güncellenirken hata oluştu." });
      }
      setTimeout(() => setPasswordMsg(null), 3000);
    });
  };

  return (
    <div className="min-h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-50/40 via-slate-50 to-indigo-50/20 max-w-4xl mx-auto px-6 py-8 space-y-8">
      
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Profil Ayarları</h1>
        <p className="text-sm text-gray-500">Kişisel bilgilerinizi, kurum verilerinizi ve hesap güvenliğinizi yapılandırın.</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-950 p-8 shadow-xl text-white flex flex-col md:flex-row items-center gap-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-purple-500/10 blur-2xl" />
        
        <div className="relative z-10 shrink-0 ring-4 ring-white/10 rounded-full p-1 bg-white/5 backdrop-blur-md">
          <AvatarUpload 
            currentUrl={profile.avatar_url} 
            userId={profile.id} 
            userName={profile.name} 
            onUploadComplete={async (url) => { await updateAvatarUrl(url); }} 
          />
        </div>
        
        <div className="text-center md:text-left space-y-3 relative z-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{profile.name}</h2>
            <p className="text-sm text-purple-200/60 mt-0.5">{profile.job_title || "Unvan Belirtilmemiş"} • {profile.department || "Departman Belirtilmemiş"}</p>
          </div>
          <p className="text-sm text-purple-100/80 max-w-md leading-relaxed">{profile.bio || "Henüz bir biyografi eklenmemiş."}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
            {profile.system_role && <Badge label={profile.system_role} />}
            {profile.is_active && <Badge label="Aktif Hesap" />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="Kişisel Bilgiler" icon={<User size={18} />}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="full-name">Ad Soyad</Label>
              <Input  id="full-name" autoComplete="name" value={name} onChange={setName} placeholder="Adınızı ve soyadınızı girin" />
            </div>
            <div>
              <Label htmlFor="phone-number">Telefon</Label>
              <Input  id="phone-number" name="phone" type="tel" autoComplete="tel" value={phone} onChange={setPhone} placeholder="Telefon numaranızı girin" />
            </div>
            <div>
              <Label htmlFor="bio">Biyografi</Label>
              <Textarea id="bio"  autoComplete="bio" value={bio} onChange={setBio} placeholder="Kendinizden kısaca bahsedin..." />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Kurum Bilgileri" icon={<Building2 size={18} />}>
          <div className="space-y-4 flex flex-col h-full justify-between">
            <div className="space-y-4">
              <div>
                <Label htmlFor="jobTitle">Ünvan</Label>
                <Input type="text" id="jobTitle" value={jobTitle} onChange={setJobTitle} placeholder="Örn: Kıdemli Yazılım Geliştirici" />
              </div>
              <div>
                <Label htmlFor="department">Departman</Label>
                <Input type="text" id="department" value={department} onChange={setDepartment} placeholder="Örn: Ar-Ge Müdürlüğü" />
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-100 shadow-inner mt-4 space-y-1">
              <InfoRow label="E-Posta Adresi" value={profile.email} />
              <InfoRow label="Kayıt Tarihi" value={new Date(profile.created_at).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })} />
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-6">
        <button 
          onClick={handleProfileSave} 
          disabled={isPendingProfile} 
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-all shadow-md shadow-purple-600/10 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          <Save size={16} />
          <span>{isPendingProfile ? "Değişiklikler Kaydediliyor..." : "Değişiklikleri Kaydet"}</span>
        </button>
        {profileMsg && (
          <div className={`flex items-center gap-1.5 text-sm font-medium ${profileMsg.ok ? "text-emerald-600" : "text-red-600"}`}>
            {profileMsg.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{profileMsg.text}</span>
          </div>
        )}
      </div>

      <SectionCard title="Güvenlik ve Şifre Güncelleme" icon={<ShieldCheck size={18} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="newPassword">Yeni Şifre</Label>
            <Input type="password" id="newPassword" value={newPassword} onChange={setNewPassword} placeholder="••••••••" />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Yeni Şifre Tekrar</Label>
            <Input type="password" id="confirmPassword" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button 
            onClick={handlePasswordSave} 
            disabled={isPendingPassword || !newPassword}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-30 flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <KeyRound size={15} />
            <span>{isPendingPassword ? "Şifre Güncelleniyor..." : "Şifreyi Güncelle"}</span>
          </button>
          {passwordMsg && (
            <div className={`flex items-center gap-1.5 text-sm font-medium ${passwordMsg.ok ? "text-emerald-600" : "text-red-600"}`}>
              {passwordMsg.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{passwordMsg.text}</span>
            </div>
          )}
        </div>
      </SectionCard>

    </div>
  );
}