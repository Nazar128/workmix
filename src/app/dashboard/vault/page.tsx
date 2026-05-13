"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function VaultPage() {
  const supabase = createClient();
  const [resources, setResources] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchResources();
      }
    };
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchResources();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchResources() {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setResources(data);
  }

  async function deleteResource(id: string) {
    if (!confirm("Bu kaynağı silmek istediğinize emin misiniz?")) return;
    await supabase.from("resources").delete().eq("id", id);
    fetchResources();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const tagArray = tags.split(",").map(t => t.trim()).filter(t => t !== "");

    const { error } = await supabase
      .from("resources")
      .insert([{
        title,
        url,
        content,
        tags: tagArray,
        user_id: user.id
      }]);

    if (!error) {
      setIsModalOpen(false);
      setTitle("");
      setUrl("");
      setContent("");
      setTags("");
      fetchResources();
    }
  };

  return (
    <div className="p-6 md:p-12 bg-[#F1F5F9] min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-2">
            Kaynaklar<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-slate-500 font-medium">Teknik dökümanlar, linkler ve önemli notlar deposu.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:bg-indigo-600 transition-all duration-300"
        >
          + Yeni Kaynak Ekle
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((item) => (
          <div key={item.id} className="group bg-white rounded-[2.5rem] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-white hover:border-indigo-100 transition-all relative flex flex-col h-full">
            <button
              onClick={() => deleteResource(item.id)}
              className="absolute top-6 right-6 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>

            <div className="flex flex-wrap gap-2 mb-6">
              {item.tags?.length > 0 ? item.tags.map((tag: string) => (
                <span key={tag} className="text-[9px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase font-black tracking-widest group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {tag}
                </span>
              )) : (
                <span className="text-[9px] bg-slate-50 text-slate-400 px-3 py-1 rounded-full uppercase font-black tracking-widest">Genel</span>
              )}
            </div>

            <h3 className="text-2xl font-black text-slate-800 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
              {item.title}
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow font-medium line-clamp-4">
              {item.content}
            </p>

            <div className="pt-6 border-t border-slate-50 mt-auto flex justify-between items-center">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:gap-3 transition-all"
                >
                  Linke Git 
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                </a>
              ) : (
                <span className="text-slate-300 font-black text-[10px] uppercase">Sadece Not</span>
              )}
              <span className="text-[10px] text-slate-400 font-bold">
                {new Date(item.created_at).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] p-10 md:p-14 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black tracking-tight">Depoya Ekle<span className="text-indigo-600">.</span></h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 p-3 rounded-2xl text-slate-400 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Başlık</label>
                <input
                  className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-bold transition-all shadow-inner"
                  placeholder="Kaynağın adı nedir?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">URL </label>
                <input
                  className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-bold transition-all shadow-inner"
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Açıklama / İçerik</label>
                <textarea
                  className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-medium h-32 resize-none transition-all shadow-inner"
                  placeholder="Bu kaynak hakkında neler bilmelisin?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Etiketler </label>
                <input
                  className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-bold transition-all shadow-inner"
                  placeholder="nextjs, api, tasarım"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all mt-4"
              >
                KAYNAĞI DEPOLA
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}