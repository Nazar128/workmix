"use client";

import { useState, useEffect } from "react";
import { useChatRealtime } from "@/hooks/use-chat-realtime";
import { sendChatMessage } from "@/actions/chat";
import { createClient } from "@/lib/supabase/client";

export default function ChatTest() {
  const [userOrgId, setUserOrgId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [text, setText] = useState("");
  
  const supabase = createClient();
  const { messages } = useChatRealtime(userOrgId || "");

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        const { data: profile } = await supabase
          .from("users")
          .select("organization_id")
          .eq("id", user.id)
          .single();
        
        if (profile?.organization_id) setUserOrgId(profile.organization_id);
      }
    };
    getData();
  }, [supabase]);

  const handleSend = async () => {
    if (!text.trim() || !userOrgId) return;
    await sendChatMessage(text);
    setText("");
  };

  if (!userOrgId) return <div className="fixed bottom-4 right-4 text-white bg-red-900/20 p-4 rounded-xl border border-red-500/50">Organizasyon ID bulunamadı!</div>;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-[#0f1115] border border-white/10 rounded-2xl flex flex-col p-4 z-50 shadow-2xl">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg: any) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender_id === currentUserId ? "items-end" : "items-start"}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender_id === currentUserId ? "bg-blue-600 text-white rounded-tr-none" : "bg-white/10 text-gray-200 rounded-tl-none"}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none" placeholder="Mesaj yaz..." />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Gönder</button>
      </div>
    </div>
  );
}