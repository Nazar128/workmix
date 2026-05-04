"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useChatRealtime(organizationId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (!organizationId) return;

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
          event: "*",
          schema: "public",
          table: "chat_messages"
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            if (payload.new.organization_id !== organizationId) return;

            const { data: userData } = await supabase
              .from("users")
              .select("name, avatar_url")
              .eq("id", payload.new.sender_id)
              .single();

            setMessages((prev) => {
              if (prev.some((m) => m.id === payload.new.id)) return prev;
              return [
                ...prev,
                {
                  ...payload.new,
                  users: userData ?? { name: "Bilinmeyen", avatar_url: null },
                },
              ];
            });
          }

          if (payload.eventType === "UPDATE") {
            if (payload.new.organization_id !== organizationId) return;

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id
                  ? { ...msg, ...payload.new, users: msg.users }
                  : msg
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organizationId]);

  return { messages, setMessages };
}