"use client"
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Send, Mail, User, MessageSquare, Bell, X, CheckCircle, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function SupportPage() {
  const supabase = createClient();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('tickets')
      .select('*, ticket_messages(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setTickets(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch('/api/support/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("Mesajınız başarıyla iletildi!");
      setForm({ ...form, subject: "", message: "" }); 
      fetchTickets();
    } else {
      toast.error("Gönderilirken bir hata oluştu.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-4 space-y-10">
      
      <div className="flex flex-col gap-2 border-b pb-6">
        <h1 className="text-3xl font-black text-purple-950 tracking-tight">İletişim Merkezi</h1>
        <p className="text-slate-500">Bir sorunuz mu var? Formu doldurun, size en kısa sürede dönüş yapalım.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-100 bg-purple-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm"
                placeholder="Adınız Soyadınız"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="email"
                className="w-full pl-10 pr-4 py-3 text-purple-800 rounded-xl border border-slate-100 bg-purple-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm"
                placeholder="E-posta Adresiniz"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                required
              />
            </div>

            <input 
              className="w-full px-4 py-3 rounded-xl border text-purple-800 border-slate-100 bg-purple-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm"
              placeholder="Konu"
              value={form.subject}
              onChange={(e) => setForm({...form, subject: e.target.value})}
              required
            />

            <textarea 
              className="w-full px-4 py-3 rounded-xl border border-slate-100 text-purple-800 bg-purple-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm min-h-[150px]"
              placeholder="Mesajınız..."
              value={form.message}
              onChange={(e) => setForm({...form, message: e.target.value})}
              required
            />

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
            >
              {loading ? "Gönderiliyor..." : <><Send className="w-4 h-4" /> Mesajı Gönder</>}
            </button>
          </form>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-purple-600" /> Gönderdiğiniz Mesajlar
          </h3>

          <div className="grid gap-4">
            {tickets.length === 0 ? (
              <div className="p-10 border-2 border-dashed border-slate-200 rounded-3xl text-center text-slate-400 italic">
                Henüz bir mesaj göndermediniz.
              </div>
            ) : (
              tickets.map((ticket) => {
                const adminReply = ticket.ticket_messages?.find((m: any) => m.is_admin_reply);

                return (
                  <div key={ticket.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-purple-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${adminReply ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        {adminReply ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{ticket.subject}</h4>
                        <p className="text-xs text-slate-400">{new Date(ticket.created_at).toLocaleDateString('tr-TR')}</p>
                      </div>
                    </div>

                    {adminReply ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-xs font-bold hover:bg-purple-600 hover:text-white transition-all animate-pulse hover:animate-none">
                            <Bell className="w-3 h-3" /> Yanıtı Oku
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                          <div className="bg-purple-700 p-6 text-purple-400 relative">
                            <DialogTitle className="text-xl font-bold">Yönetici Yanıtı</DialogTitle>
                            <p className="text-purple-400 text-xs mt-1 italic">"{ticket.subject}" konusuna istinaden</p>
                          </div>
                          <div className="p-6 space-y-6 bg-slate-50">
                            <div className="space-y-1 text-sm">
                               <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">Sizin Mesajınız</span>
                               <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-100">{ticket.ticket_messages.find((m:any) => !m.is_admin_reply)?.message}</p>
                            </div>
                            <div className="space-y-2">
                               <span className="text-[10px] font-black text-purple-600 uppercase tracking-tighter">WorkMix Yanıtı</span>
                               <div className="bg-white p-5 rounded-2xl border-2 border-purple-100 shadow-sm relative">
                                  <div className="absolute -top-3 right-4 bg-purple-600 text-white text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-widest">RESMİ YANIT</div>
                                  <p className="text-slate-800 font-medium leading-relaxed">{adminReply.message}</p>
                               </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        İNCELENİYOR
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}