"use client"
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { User, Clock, CheckCircle2, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminSupportPanel() {
  const supabase = createClient();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminReply, setAdminReply] = useState("");
  const [isSending, setIsSending] = useState(false);

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
      }
    } catch (err) {
      console.error(err);
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
      toast.error("Bağlantı hatası.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Destek Talepleri</h1>
          <p className="text-slate-500 mt-1">Sistem üzerinden gelen tüm mesajlar.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid gap-6">
        {loading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse font-medium">Yükleniyor...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20 bg-white border-2 border-dashed rounded-3xl text-slate-400">Henüz talep yok.</div>
        ) : (
          tickets.map((ticket) => {
            const userMessage = ticket.ticket_messages?.find((m: any) => !m.is_admin_reply);
            const replyFromAdmin = ticket.ticket_messages?.find((m: any) => m.is_admin_reply);
            const isClosed = ticket.status === 'pending' || ticket.status === 'closed';

            return (
              <div key={ticket.id} className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all ${!isClosed ? 'border-l-8 border-l-purple-600' : 'border-l-8 border-l-slate-300'}`}>
                <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
                  
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${!isClosed ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>
                        {!isClosed ? 'Bekliyor' : 'Yanıtlandı'}
                      </span>
                      <h2 className="text-xl font-bold text-slate-800">{ticket.subject}</h2>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                        <User className="w-3.5 h-3.5 text-purple-500" /> 
                        Kullanıcı: {ticket.user_id.substring(0,8)}
                      </div>
                      <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(ticket.created_at).toLocaleString('tr-TR')}</div>
                    </div>

                    <div className="space-y-3 mt-2">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm italic relative">
                        <span className="absolute -top-2 left-4 bg-white px-2 text-[9px] font-bold text-slate-400 border rounded">KULLANICI</span>
                        "{userMessage?.message || "İçerik yok"}"
                      </div>

                      {replyFromAdmin && (
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-purple-900 text-sm relative ml-4">
                          <span className="absolute -top-2 left-4 bg-white px-2 text-[9px] font-bold text-purple-400 border border-purple-100 rounded">ADMİN YANITI</span>
                          {replyFromAdmin.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-end gap-3 min-w-[200px]">
                    {!isClosed ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Yanıtla
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                          <div className="bg-purple-800 p-6 text-white text-center">
                            <DialogTitle className="text-xl font-bold">Kullanıcıya Yanıt Gönder</DialogTitle>
                          </div>
                          <div className="p-6 bg-white space-y-4">
                            <textarea 
                              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-purple-500 outline-none text-sm min-h-[150px]"
                              placeholder="Cevabınızı buraya yazın..."
                              value={adminReply}
                              onChange={(e) => setAdminReply(e.target.value)}
                            />
                            <button 
                              disabled={isSending || !adminReply.trim()}
                              onClick={() => handleReplySubmit(ticket.id, ticket.user_id)}
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                            >
                              {isSending ? "Gönderiliyor..." : "Mesajı İlet"}
                            </button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-5 py-3 rounded-2xl border border-green-100">
                         <CheckCircle2 className="w-5 h-5" /> İşlem Tamamlandı
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}