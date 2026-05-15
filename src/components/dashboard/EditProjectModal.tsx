"use client";

import { useState } from "react";
import { updateProject } from "@/actions/projects";
import { Settings2, X, Info, Globe, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function EditProjectModal({ project }: { project: any }) {
  const [isOpen, setIsOpen] = useState(false);

  async function action(formData: FormData) {
    try {
      await updateProject(project.id, formData);
      setIsOpen(false);
    } catch (error) {
      alert("Hata oluştu!");
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="p-2.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all border border-transparent hover:border-purple-100"
      >
        <Settings2 className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-[2rem] w-full max-w-md shadow-2xl border border-white overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <Settings2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Ayarları Düzenle</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-slate-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form action={action} className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Proje Başlığı</label>
                  <input
                    name="name" 
                    defaultValue={project.name}
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500/20 outline-none font-bold text-slate-700"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Info className="w-3 h-3" /> Açıklama
                  </label>
                  <textarea
                    name="description"
                    defaultValue={project.description ?? ""}
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500/20 outline-none font-medium text-slate-600 resize-none"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <Globe className="w-3 h-3" /> Görünürlük
                    </label>
                    <select
                      name="visibility"
                      defaultValue={project.visibility}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500/20 font-bold text-slate-600 outline-none cursor-pointer"
                    >
                      <option value="private">🔒 Özel</option>
                      <option value="public">🌐 Açık</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <Activity className="w-3 h-3" /> Durum
                    </label>
                    <select
                      name="status"
                      defaultValue={project.status}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500/20 font-bold text-slate-600 outline-none cursor-pointer"
                    >
                      <option value="active">⚡ Aktif</option>
                      <option value="passive">🌙 Pasif</option>
                      <option value="archived">📦 Arşiv</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                  >
                    Vazgeç
                  </button>
                  <button type="submit" className="flex-1 bg-slate-900 text-white px-4 py-4 rounded-2xl font-black shadow-lg shadow-slate-200 hover:bg-purple-700 transition-all uppercase text-xs tracking-widest">
                    Güncelle
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}