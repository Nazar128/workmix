"use client";

import { useState, useEffect, useRef } from "react";
import { useChatRealtime } from "@/hooks/use-chat-realtime";
import { sendChatMessage, updateChatMessage, deleteChatMessage, pinChatMessage, uploadChatImage } from "@/actions/chat";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function getDayLabel(d: string) {
  const date = new Date(d);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (same(date, today)) return "Bugün";
  if (same(date, yesterday)) return "Dün";
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function getInitials(name: string) {
  if (!name) return "??";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function ChatTest() {
  const [userOrgId, setUserOrgId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const { messages, setMessages } = useChatRealtime(userOrgId || "");

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        const { data: profile } = await supabase
          .from("users")
          .select("organization_id, system_role")
          .eq("id", user.id)
          .single();
        if (profile?.organization_id) setUserOrgId(profile.organization_id);
        if (profile?.system_role) setCurrentUserRole(profile.system_role);
      }
    };
    getData();
  }, []);

  const handleSend = async () => {
    if ((!text.trim() && !previewImage) || !userOrgId) return;
    const currentText = text.trim();
    const currentImg = previewImage;
    setText("");
    setPreviewImage(null);
    try {
      await sendChatMessage(currentText, currentImg ?? undefined);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { url } = await uploadChatImage(fd);
      setPreviewImage(url);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleEditSave = async (id: string) => {
    if (!editText.trim()) return;
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, content: editText.trim() } : msg))
    );
    setEditingId(null);
    setEditText("");
    try {
      await updateChatMessage(id, editText.trim());
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silinsin mi?")) return;
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditText("");
    }
    try {
      await deleteChatMessage(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePinToggle = async (id: string, currentPinned: boolean) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, pinned: !currentPinned } : msg))
    );
    try {
      await pinChatMessage(id, !currentPinned);
    } catch (error) {
      console.error(error);
    }
  };

  const canPin = ["admin", "manager"].includes(currentUserRole);
  let lastDay = "";

  if (!userOrgId) return (
    <div className="fixed bottom-4 right-4 text-white bg-red-900/20 p-4 rounded-xl border border-red-500/50">
      Organizasyon ID bulunamadı!
    </div>
  );

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-[#0f1115] border border-white/10 rounded-2xl flex flex-col p-4 z-50 shadow-2xl">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2">
        {messages.map((msg: any) => {
          const isOwn = msg.sender_id === currentUserId;
          const name = msg.users?.name ?? "Bilinmeyen";
          const avatar = msg.users?.avatar_url ?? null;
          const dayLabel = getDayLabel(msg.created_at);
          const showDay = dayLabel !== lastDay;
          lastDay = dayLabel;
          return (
            <div key={msg.id}>
              {showDay && (
                <div className="flex items-center gap-2 my-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[10px] text-gray-500">{dayLabel}</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
              )}
              <div className={`flex gap-2 group items-end ${isOwn ? "flex-row-reverse" : ""}`}>
                {!isOwn && (
                  avatar
                    ? <Image src={avatar} alt={name} width={28} height={28} className="w-7 h-7 rounded-full object-cover" />
                    : <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white">{getInitials(name)}</div>
                )}
                <div className={`flex flex-col max-w-[80%] ${isOwn ? "items-end" : "items-start"}`}>
                  {!isOwn && <span className="text-[10px] text-gray-500 mb-1 ml-1">{name}</span>}
                  {editingId === msg.id ? (
                    <div className="flex gap-1">
                      <input
                        autoFocus
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditSave(msg.id);
                          if (e.key === "Escape") { setEditingId(null); setEditText(""); }
                        }}
                        className="bg-white/10 rounded-lg px-2 py-1 text-white text-sm outline-none"
                      />
                      <button onClick={() => handleEditSave(msg.id)} className="text-blue-400 text-xs px-1">✓</button>
                      <button onClick={() => { setEditingId(null); setEditText(""); }} className="text-gray-500 text-xs px-1">✕</button>
                    </div>
                  ) : (
                    <div className={`px-3 py-2 rounded-2xl text-sm ${isOwn ? "bg-blue-600 text-white rounded-tr-none" : "bg-white/10 text-gray-200 rounded-tl-none"} ${msg.pinned ? "ring-1 ring-yellow-500/40" : ""}`}>
                      {msg.pinned && <span className="text-yellow-400 text-xs mr-1">📌</span>}
                      {msg.content && <p>{msg.content}</p>}
                      {msg.image_url && (
                        <Image
                          src={msg.image_url}
                          alt="görsel"
                          width={200}
                          height={150}
                          className="rounded-lg mt-1 cursor-pointer object-cover"
                          onClick={() => window.open(msg.image_url, "_blank")}
                        />
                      )}
                      {msg.updated_at && <span className={`text-[10px] ${isOwn ? "text-blue-200" : "text-gray-500 ml-1"}`}>(düzenlendi)</span>}
                    </div>
                  )}
                  <div className={`flex items-center gap-1 mt-0.5 ${isOwn ? "flex-row-reverse" : ""}`}>
                    <span className="text-[10px] text-gray-600">{formatTime(msg.created_at)}</span>
                    <div className="hidden group-hover:flex items-center gap-1">
                      {isOwn && editingId !== msg.id && (
                        <button onClick={() => { setEditingId(msg.id); setEditText(msg.content ?? ""); }} className="text-gray-500 hover:text-blue-400 text-xs">✏️</button>
                      )}
                      {isOwn && (
                        <button onClick={() => handleDelete(msg.id)} className="text-gray-500 hover:text-red-400 text-xs">🗑️</button>
                      )}
                      {canPin && (
                        <button onClick={() => handlePinToggle(msg.id, !!msg.pinned)} className={`text-xs ${msg.pinned ? "text-yellow-400" : "text-gray-500 hover:text-yellow-400"}`}>📌</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {previewImage && (
        <div className="flex items-center gap-2 mb-2 px-1">
          <Image src={previewImage} alt="önizleme" width={40} height={40} className="w-10 h-10 rounded-lg object-cover" />
          <span className="text-xs text-gray-400 flex-1">Görsel eklenecek</span>
          <button onClick={() => setPreviewImage(null)} className="text-gray-500">✕</button>
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="text-gray-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none"
          placeholder="Mesaj yaz..."
        />
        <button onClick={handleSend} disabled={(!text.trim() && !previewImage) || uploading} className="bg-blue-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg">Gönder</button>
      </div>
    </div>
  );
}