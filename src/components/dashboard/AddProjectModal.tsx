"use client";

import { useState } from "react";
import { createProject } from "@/actions/projects";
import { Plus, X, Rocket, Layout, Calendar as CalendarIcon, AlignLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddProjectModal({
  organizations,
}: {
  organizations: { id: string; name: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  async function action(formData: FormData) {
    try {
      await createProject(formData);
      setIsOpen(false);
    } catch (error) {
      alert("Hata: " + (error as Error).message);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white px-6 py-3 rounded-2xl transition-all shadow-xl shadow-purple-200 font-bold text-sm active:scale-95"
      >
        <Plus className="w-5 h-5" />
        Yeni Proje Başlat
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white"
            >
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-8 flex justify-between items-center border-b border-purple-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-purple-600">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl text-slate-900 font-black tracking-tight">Yeni Proje</h2>
                    <p className="text-purple-600/60 text-xs font-bold uppercase tracking-widest">Workmix Workspace</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-purple-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form action={action} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-tighter ml-1">
                    <Layout className="w-3.5 h-3.5" /> Proje Adı
                  </label>
                  <input
                    name="name"
                    placeholder="E-ticaret Mobil Uygulama..."
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-slate-700"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-tighter ml-1">
                    <AlignLeft className="w-3.5 h-3.5" /> Açıklama
                  </label>
                  <textarea
                    name="description"
                    placeholder="Projenin hedefleri ve kapsamı..."
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-slate-700 min-h-[100px] resize-none"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-tighter ml-1">Çalışma Alanı</label>
                  <select
                    name="org_id"
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none font-bold text-slate-600 appearance-none cursor-pointer"
                  >
                    <option value="">🏠 Bireysel Çalışma Alanı</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>🏢 {org.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-tighter ml-1">
                      <CalendarIcon className="w-3.5 h-3.5" /> Başlangıç
                    </label>
                    <input type="date" name="start_date" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500/20 outline-none font-bold text-slate-600 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-tighter ml-1">
                      <CalendarIcon className="w-3.5 h-3.5" /> Hedef Bitiş
                    </label>
                    <input type="date" name="end_date" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500/20 outline-none font-bold text-slate-600 text-sm" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                  >
                    İptal
                  </button>
                  <button type="submit" className="flex-1 bg-purple-700 text-white px-6 py-4 rounded-2xl font-black shadow-lg shadow-purple-200 hover:bg-purple-800 transition-all active:scale-95 uppercase tracking-widest text-xs">
                    Projeyi Oluştur
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