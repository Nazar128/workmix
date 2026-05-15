"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Send, MessageSquare, CheckCircle, Clock, ChevronRight, Inbox, Plus, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

export default function SupportPage() {
  const supabase = createClient();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('tickets').select('*, ticket_messages(*)').eq('user_id', user.id).order('created_at', { ascending: false });
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
      toast.success("Mesaj başarıyla gönderildi");
      setForm({ ...form, subject: "", message: "" }); 
      fetchTickets();
    } else {
      toast.error("Bir hata oluştu");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff] p-6 md:p-12 text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1 w-8 bg-purple-600 rounded-full" />
              <span className="text-purple-600 font-bold text-xs uppercase tracking-[0.2em]">Destek Hattı</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Size nasıl <span className="text-purple-600">yardımcı</span> olabiliriz?
            </h1>
          </div>
          <p className="text-slate-500 max-w-xs text-sm leading-relaxed">
            Sorularınızı iletin, en kısa sürede profesyonel ekibimizle çözüm üretelim.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-5 bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-8 shadow-2xl shadow-purple-200/40"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-purple-600 rounded-xl shadow-lg shadow-purple-200">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Yeni Mesaj</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <input 
                  className="w-full bg-slate-100/50 border-none rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                  placeholder="İsim Soyisim"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-1">
                <input 
                  type="email"
                  className="w-full bg-slate-100/50 border-none rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                  placeholder="E-posta adresi"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-1">
                <input 
                  className="w-full bg-slate-100/50 border-none rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                  placeholder="Konu başlığı"
                  value={form.subject}
                  onChange={(e) => setForm({...form, subject: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-1">
                <textarea 
                  className="w-full bg-slate-100/50 border-none rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-slate-400 font-medium min-h-[140px] resize-none"
                  placeholder="Mesajınız..."
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-sm"
              >
                {loading ? "İşleniyor..." : <><Send className="w-4 h-4" /> Gönder</>}
              </button>
            </form>
          </motion.div>

          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Inbox className="w-4 h-4" /> Geçmiş Talepler
              </h3>
              <div className="h-px flex-1 bg-slate-200 mx-4" />
            </div>

            <div className="grid gap-4">
              <AnimatePresence>
                {tickets.length === 0 ? (
                  <div className="text-center py-20 bg-white/40 rounded-[2rem] border border-dashed border-slate-200">
                    <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm font-medium">Henüz bir talebiniz bulunmuyor.</p>
                  </div>
                ) : (
                  tickets.map((ticket, idx) => {
                    const adminReply = ticket.ticket_messages?.find((m: any) => m.is_admin_reply);

                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={ticket.id} 
                        className="group bg-white hover:bg-purple-50/50 border border-slate-100 rounded-[1.5rem] p-5 transition-all hover:shadow-lg hover:shadow-purple-100/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${adminReply ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                              {adminReply ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                            </div>
                            <div>
                              <h4 className="text-[15px] font-bold text-slate-800 group-hover:text-purple-700 transition-colors">{ticket.subject}</h4>
                              <p className="text-[11px] font-semibold text-slate-400 uppercase mt-0.5">
                                {new Date(ticket.created_at).toLocaleDateString('tr-TR')}
                              </p>
                            </div>
                          </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-purple-600 hover:text-white transition-all shadow-sm">
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg p-0 overflow-hidden border-none rounded-[2rem] shadow-3xl">
                              <div className="bg-purple-600 p-8 text-white">
                                <DialogTitle className="text-2xl font-bold tracking-tight">Talep Detayı</DialogTitle>
                                <p className="text-purple-100/80 text-xs mt-1 font-medium">{ticket.subject}</p>
                              </div>
                              <div className="p-8 space-y-6 bg-white">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mesajınız</label>
                                  <div className="p-4 bg-slate-50 rounded-2xl text-sm text-slate-600 leading-relaxed border border-slate-100">
                                    {ticket.ticket_messages.find((m:any) => !m.is_admin_reply)?.message}
                                  </div>
                                </div>
                                {adminReply && (
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest flex items-center gap-1">
                                      <Sparkles className="w-3 h-3" /> Ekibimizin Yanıtı
                                    </label>
                                    <div className="p-5 bg-purple-50 rounded-2xl text-sm text-slate-800 font-medium leading-relaxed border border-purple-100 shadow-inner">
                                      {adminReply.message}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}