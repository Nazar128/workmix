"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Clock, CheckCircle2, MessageSquare, Inbox, Search, Send, Shield, Sparkles, HelpCircle, ChevronLeft } from "lucide-react";

export default function AdminSupportPanel() {
  const supabase = createClient();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [adminReply, setAdminReply] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAdminTickets();
  }, []);

  const fetchAdminTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          ticket_messages (*)
        `)
        .order('status', { ascending: true }) 
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Veriler çekilemedi: " + error.message);
      } else {
        setTickets(data || []);
        if (data && data.length > 0 && !selectedTicketId && window.innerWidth >= 768) {
          setSelectedTicketId(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Sistemsel bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (ticketId: string, userId: string) => {
    if (!adminReply.trim()) return;
    setIsSending(true);

    try {
      const res = await fetch('/api/support/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          message: adminReply,
          userId: userId 
        }),
      });

      if (res.ok) {
        toast.success("Yanıt iletildi.");
        setAdminReply("");
        await fetchAdminTickets(); 
      } else {
        toast.error("Mesaj gönderilemedi.");
      }
    } catch (err) {
      toast.error("Bağlantı hatası oluştu.");
    } finally {
      setIsSending(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const isClosed = ticket.status === 'pending' || ticket.status === 'closed';
    const matchesFilter = 
      filter === "all" || 
      (filter === "pending" && !isClosed) || 
      (filter === "resolved" && isClosed);
      
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user_id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);
  const userMessage = selectedTicket?.ticket_messages?.find((m: any) => !m.is_admin_reply);
  const replyFromAdmin = selectedTicket?.ticket_messages?.find((m: any) => m.is_admin_reply);
  const isSelectedClosed = selectedTicket?.status === 'pending' || selectedTicket?.status === 'closed';

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 via-slate-50 to-indigo-100/40 dark:from-[#030303] dark:via-[#0a0a12] dark:to-[#120d26] font-sans antialiased text-slate-900 dark:text-zinc-50 flex flex-col h-screen overflow-hidden p-0 sm:p-4">
      
      <div className="flex flex-col h-full w-full max-w-[1600px] mx-auto bg-white/70 dark:bg-[#0d0d15]/50 backdrop-blur-2xl border border-slate-200/50 dark:border-white/[0.06] sm:rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
        
        <header className="h-12 md:h-16 mt-4 border-b border-slate-200/60 dark:border-white/[0.05] bg-white/40 dark:bg-[#0f0f1b]/40 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center  gap-3.5">
            {selectedTicketId && (
              <button 
                onClick={() => setSelectedTicketId(null)}
                className="flex md:hidden p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-zinc-400 active:scale-95 transition-transform"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-7 h-7 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 dark:shadow-purple-500/20">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">Destek Operasyonları</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Sistem Canlı</span>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden w-full relative">
          
          <aside className={`w-full md:w-[340px] lg:w-[400px] border-r border-slate-200/60 dark:border-white/[0.05] bg-white/20 dark:bg-[#0b0b14]/20 flex flex-col shrink-0 overflow-hidden h-full transition-all duration-300 ${
            selectedTicketId ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="p-2 md:p-4 border-b border-slate-100 dark:border-white/[0.03] space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                <input 
                  type="text"
                  placeholder="Konu veya kullanıcı ID ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-100/70 dark:bg-[#07070c]/80 border border-slate-200/50 dark:border-white/[0.05] rounded-xl text-xs outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 shadow-inner"
                />
              </div>

              <div className="flex bg-slate-200/60 dark:bg-[#07070c]/60 p-1 rounded-xl text-[11px] font-bold border border-slate-200/30 dark:border-white/[0.02]">
                <button onClick={() => setFilter("all")} className={`flex-1 py-1.5 rounded-lg transition-all text-center ${filter === "all" ? "bg-white dark:bg-[#161624] shadow-md dark:shadow-indigo-950/20 text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"}`}>
                  Tümü
                </button>
                <button onClick={() => setFilter("pending")} className={`flex-1 py-1.5 rounded-lg transition-all text-center ${filter === "pending" ? "bg-white dark:bg-[#161624] shadow-md dark:shadow-indigo-950/20 text-amber-600 dark:text-amber-400" : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"}`}>
                  Bekleyen
                </button>
                <button onClick={() => setFilter("resolved")} className={`flex-1 py-1.5 rounded-lg transition-all text-center ${filter === "resolved" ? "bg-white dark:bg-[#161624] shadow-md dark:shadow-indigo-950/20 text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"}`}>
                  Çözülen
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/[0.03]">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="h-20 bg-slate-200/40 dark:bg-white/[0.02] rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center h-48">
                  <Inbox className="w-8 h-8 text-slate-300 dark:text-zinc-700 mb-2" />
                  <p className="text-xs font-medium text-slate-400 dark:text-zinc-500">Eşleşen talep bulunamadı.</p>
                </div>
              ) : (
                filteredTickets.map((ticket) => {
                  const isClosed = ticket.status === 'pending' || ticket.status === 'closed';
                  const isSelected = ticket.id === selectedTicketId;
                  const msg = ticket.ticket_messages?.find((m: any) => !m.is_admin_reply);

                  return (
                    <button
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`w-full text-left p-4 flex flex-col gap-2 transition-all relative ${
                        isSelected 
                          ? 'bg-gradient-to-r from-indigo-500/10 via-indigo-500/[0.02] to-transparent dark:from-indigo-500/15 dark:via-indigo-500/[0.02] border-r-2 border-indigo-500 dark:border-indigo-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
                          : 'hover:bg-slate-100/40 dark:hover:bg-white/[0.01]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full gap-2">
                        <span className="font-semibold text-xs text-slate-800 dark:text-zinc-200 truncate flex-1">
                          {ticket.subject}
                        </span>
                        <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full border shrink-0 backdrop-blur-md ${
                          !isClosed 
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-400/20' 
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-400/20'
                        }`}>
                          {!isClosed ? 'Bekliyor' : 'Çözüldü'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 dark:text-zinc-500 line-clamp-1 font-medium">
                        {msg?.message || "İçerik yok"}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500 mt-1 font-medium">
                        <span className="font-mono bg-slate-100 dark:bg-white/[0.03] px-1 py-0.5 rounded text-[9px]">ID: {ticket.user_id.substring(0, 8)}</span>
                        <div className="flex items-center gap-1 opacity-80">
                          <Clock className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                          <span>{new Date(ticket.created_at).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <main className={`flex-1 bg-slate-50/10 dark:bg-[#07070c]/10 flex flex-col overflow-hidden h-full ${
            !selectedTicketId ? 'hidden md:flex' : 'flex'
          }`}>
            {selectedTicket ? (
              <div className="flex flex-col h-full overflow-hidden">
                
                <div className="h-10 md:h-14 border-b border-slate-200/60 dark:border-white/[0.05] bg-white/40 dark:bg-[#0d0d15]/40 px-4 sm:px-6 flex items-center justify-between shrink-0">
                  <div className="min-w-0 flex-1 pr-2">
                    <h2 className="text-xs font-bold text-slate-800 dark:text-zinc-100 truncate tracking-wide">{selectedTicket.subject}</h2>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5 font-medium truncate">
                      <span className="font-mono bg-slate-200/50 dark:bg-white/[0.04] px-1.5 py-0.5 rounded text-slate-600 dark:text-zinc-300 truncate max-w-[180px] sm:max-w-none">Kullanıcı: {selectedTicket.user_id}</span>
                      <span>•</span>
                      <span className="shrink-0">{new Date(selectedTicket.created_at).toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-6 bg-gradient-to-b from-transparent to-slate-100/20 dark:to-black/20">
                  
                  <div className="flex gap-3 max-w-2xl w-[95%] sm:w-auto">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-slate-200 dark:bg-white/[0.04] border border-slate-300/30 dark:border-white/[0.02] flex items-center justify-center shrink-0 text-xs font-bold shadow-sm text-slate-600 dark:text-zinc-300">
                      U
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="bg-white dark:bg-[#11111e]/90 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200/60 dark:border-white/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.01)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.2)] break-words">
                        <p className="text-xs text-slate-700 dark:text-zinc-200 leading-relaxed font-medium whitespace-pre-wrap">
                          {userMessage?.message || "Mesaj içeriği bulunamadı."}
                        </p>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 pl-1 uppercase tracking-wider">Kullanıcı Mesajı</span>
                    </div>
                  </div>

                  {replyFromAdmin && (
                    <div className="flex gap-3 max-w-2xl ml-auto flex-row-reverse w-[95%] sm:w-auto">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-md shadow-indigo-500/10">
                        A
                      </div>
                      <div className="space-y-1 text-right min-w-0 flex-1">
                        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 dark:from-indigo-500 dark:via-indigo-600 dark:to-purple-600 text-white px-4 py-3 rounded-2xl rounded-tr-none shadow-lg shadow-indigo-500/5 dark:shadow-indigo-500/10 text-left border border-indigo-400/20 break-words">
                          <p className="text-xs leading-relaxed font-medium whitespace-pre-wrap">
                            {replyFromAdmin.message}
                          </p>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 pr-1 uppercase tracking-wider">Yönetici Yanıtı</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:p-4 bg-white/40 dark:bg-[#0d0d15]/40 border-t border-slate-200/60 dark:border-white/[0.05] shrink-0 backdrop-blur-md">
                  {!isSelectedClosed ? (
                    <div className="relative bg-white/90 dark:bg-[#07070c]/90 border border-slate-200 dark:border-white/[0.06] rounded-xl focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/5 transition p-2 flex flex-col gap-2 shadow-sm">
                      <textarea
                        value={adminReply}
                        onChange={(e) => setAdminReply(e.target.value)}
                        placeholder="Kullanıcıya çözüm odaklı bir yanıt yazın..."
                        className="w-full bg-transparent border-none outline-none resize-none text-xs p-1 min-h-[70px] text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500"
                      />
                      <div className="flex items-center justify-end border-t border-slate-100 dark:border-white/[0.03] pt-2 px-1">
                        <button
                          disabled={isSending || !adminReply.trim()}
                          onClick={() => handleReplySubmit(selectedTicket.id, selectedTicket.user_id)}
                          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md shadow-indigo-500/10 transition-all disabled:opacity-30 flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          {isSending ? "İletiliyor..." : "Yanıtı Gönder"}
                          <Send className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/5 py-3 px-4 rounded-xl border border-emerald-500/20 text-xs font-semibold backdrop-blur-md shadow-sm text-center">
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> Bu destek talebi başarıyla çözüldü ve arşivlendi.
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-500/10 dark:border-white/[0.04] flex items-center justify-center mb-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <HelpCircle className="w-5 h-5 text-indigo-500 dark:text-indigo-400 animate-pulse" />
                </div>
                <h3 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Seçili Talep Yok</h3>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 max-w-[260px] mt-1 font-medium leading-relaxed">Detayları ve konuşma akışını canlı görüntülemek için sol menu den bir bilet seçin.</p>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}