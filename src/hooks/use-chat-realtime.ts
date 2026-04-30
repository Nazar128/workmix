"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useChatRealtime(organizationId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select(`
          *,
          users:sender_id (name, avatar_url)
        `)
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: true });
      
      if (!error && data) {
        setMessages(data);
      }
    };

    fetchHistory();

    const channel = supabase
      .channel(`org_chat_${organizationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `organization_id=eq.${organizationId}`,
        },
        async (payload) => {
          const { data: userData } = await supabase
            .from("users")
            .select("name, avatar_url")
            .eq("id", payload.new.sender_id)
            .single();

          const newMessage = {
            ...payload.new,
            users: userData || { name: "Bilinmeyen Kullanıcı", avatar_url: null }
          };

          setMessages((current) => [...current, newMessage]);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime bağlantısı başarılı!");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organizationId, supabase]);

  return { messages };
}