"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RoadmapPage() {
  const supabase = createClient();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [milestones, setMilestones] = useState([{ title: "", target_date: "", description: "" }]);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchRoadmaps();
      }
    };
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchRoadmaps();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchRoadmaps() {
    const { data, error } = await supabase
      .from("roadmaps")
      .select(`*, milestones(*)`)
      .order("created_at", { ascending: false });
    if (!error && data) setRoadmaps(data);
  }

  async function toggleMilestone(id: string, currentState: boolean) {
    await supabase
      .from("milestones")
      .update({ is_completed: !currentState })
      .eq("id", id);
    fetchRoadmaps();
  }

  async function deleteRoadmap(id: string) {
    if (!confirm("Bu yol haritasını silmek istediğinize emin misiniz?")) return;
    await supabase.from("roadmaps").delete().eq("id", id);
    fetchRoadmaps();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { data: roadmap, error: rError } = await supabase
      .from("roadmaps")
      .insert([{ title, user_id: user.id }])
      .select()
      .single();

    if (rError) return;

    if (roadmap) {
      const milestoneData = milestones
        .filter((m) => m.title.trim() !== "")
        .map((m) => ({
          roadmap_id: roadmap.id,
          user_id: user.id,
          title: m.title,
          description: m.description,
          target_date: m.target_date || null,
          is_completed: false,
        }));

      await supabase.from("milestones").insert(milestoneData);
      setIsModalOpen(false);
      setTitle("");
      setMilestones([{ title: "", target_date: "", description: "" }]);
      fetchRoadmaps();
    }
  };

  return (
    <div className="p-6 md:p-12 bg-[#F1F5F9] min-h-screen font-sans text-slate-900">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-2">
            Roadmap<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-slate-500 font-medium">Projelerinin ilerlemesini şık bir şekilde takip et.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:bg-indigo-600 transition-all duration-300"
        >
          <span className="relative z-10">+ Yeni Harita Oluştur</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-12">
        {roadmaps.map((roadmap) => (
          <div key={roadmap.id} className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-all"></div>
            
            <button
              onClick={() => deleteRoadmap(roadmap.id)}
              className="absolute top-10 right-10 text-slate-300 hover:text-red-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>

            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3">
                <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                  PROJE PLANI
                </div>
                <h2 className="text-4xl font-black text-slate-800 leading-[1.1] tracking-tight">{roadmap.title}</h2>
                <div className="mt-6 flex items-center gap-3">
                   <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold">NK</div>
                   </div>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Sana Özel</p>
                </div>
              </div>

              <div className="lg:w-2/3 space-y-8 relative">
                <div className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-slate-100 hidden md:block"></div>

                {roadmap.milestones
                  ?.sort((a: any, b: any) => a.created_at.localeCompare(b.created_at))
                  .map((step: any, index: number) => (
                    <div key={step.id} className="flex gap-6 relative group/item">
                      <div className={`z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-lg transition-all duration-500 shadow-sm
                        ${step.is_completed 
                          ? "bg-emerald-500 text-white rotate-[360deg] scale-110" 
                          : "bg-slate-900 text-white group-hover/item:bg-indigo-600"}`}>
                        {step.is_completed ? "✓" : index + 1}
                      </div>

                      <div className="flex-1 pt-1">
                        <div className="flex justify-between items-start">
                          <h3 className={`text-xl font-bold transition-all ${step.is_completed ? "text-slate-400 line-through" : "text-slate-800"}`}>
                            {step.title}
                          </h3>
                          <button 
                            onClick={() => toggleMilestone(step.id, step.is_completed)}
                            className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-400"
                          >
                            {step.is_completed ? "Geri Al" : "Tamamla"}
                          </button>
                        </div>
                        {step.target_date && (
                          <div className="inline-flex items-center gap-1.5 mt-1 bg-slate-100 px-2 py-0.5 rounded-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            <p className="text-slate-600 font-bold text-[10px]">{step.target_date}</p>
                          </div>
                        )}
                        <p className="text-slate-500 text-sm mt-3 leading-relaxed font-medium">{step.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[3.5rem] p-10 md:p-14 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-black tracking-tight">Yeni Harita<span className="text-indigo-600">.</span></h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 p-3 rounded-2xl hover:bg-red-50 transition-colors text-slate-400 hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Yol Haritası Başlığı</label>
                <input
                  className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-[2rem] outline-none font-bold text-xl transition-all shadow-inner"
                  placeholder="Örn: Next.js Öğrenme Maratonu"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-6">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Aşamalar (Milestones)</label>
                {milestones.map((m, i) => (
                  <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-200"></div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <input
                        className="flex-1 p-4 bg-white border-none rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Aşama başlığı nedir?"
                        value={m.title}
                        onChange={(e) => {
                          const newM = [...milestones];
                          newM[i].title = e.target.value;
                          setMilestones(newM);
                        }}
                        required
                      />
                      <input
                        type="date"
                        className="p-4 bg-white border-none rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={m.target_date}
                        onChange={(e) => {
                          const newM = [...milestones];
                          newM[i].target_date = e.target.value;
                          setMilestones(newM);
                        }}
                      />
                    </div>
                    <textarea
                      className="w-full p-4 bg-white border-none rounded-2xl text-sm h-28 resize-none shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                      placeholder="Detaylar, notlar veya kaynaklar..."
                      value={m.description}
                      onChange={(e) => {
                        const newM = [...milestones];
                        newM[i].description = e.target.value;
                        setMilestones(newM);
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => setMilestones([...milestones, { title: "", target_date: "", description: "" }])}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all"
                >
                  + Bir Aşama Daha Ekle
                </button>
                <button 
                  type="submit" 
                  className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
                >
                  YOL HARİTASINI OLUŞTUR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}