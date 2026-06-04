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
        className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-5 py-3 rounded-xl transition-all shadow-md font-bold text-xs uppercase tracking-wider active:scale-95 whitespace-nowrap flex-shrink-0"
      >
        <Plus className="w-4 h-4" /> Yeni Proje
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed h-screen inset-0 z-50 flex justify-center items-start p-4 overflow-y-auto bg-slate-900/50">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl m-4 md:m-24 w-full max-w-md shadow-xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600 text-white rounded-lg shadow-sm">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <h2 className="text-md md:text-lg font-bold text-slate-800 tracking-tight">Yeni Proje Başlat</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-purple-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form action={action} className="p-6 space-y-4 overflow-y-auto text-left">
                <div className="space-y-1.5">
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                    <Layout className="w-3 h-3" /> Proje Adı
                  </label>
                  <input
                    name="name"
                    placeholder="E-ticaret Mobil Uygulama..."
                    className="w-full bg-slate-50 text-xs md:text-sm border border-slate-100 p-3.5 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-slate-700"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                    <AlignLeft className="w-3 h-3" /> Açıklama
                  </label>
                  <textarea
                    name="description"
                    placeholder="Projenin hedefleri ve kapsamı..."
                    className="w-full bg-slate-50 text-xs md:text-sm border border-slate-100 p-3.5 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-slate-700 min-h-[100px] resize-none"
                    rows={3}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Çalışma Alanı</label>
                  <select
                    name="org_id"
                    className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl font-medium text-xs md:text-sm text-slate-600 outline-none cursor-pointer"
                    required
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>🏢 {org.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" /> Başlangıç
                    </label>
                    <input type="date" name="start_date" className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl font-medium text-slate-600 outline-none text-xs md:text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" /> Hedef Bitiş
                    </label>
                    <input type="date" name="end_date" className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl font-medium text-slate-600 outline-none text-xs md:text-sm" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-500 rounded-xl font-medium hover:bg-slate-200 transition-all"
                  >
                    İptal
                  </button>
                  <button type="submit" className="flex-1 bg-purple-700 text-white px-4 py-3 rounded-xl font-bold shadow-md hover:bg-purple-800 transition-all uppercase text-xs tracking-wider">
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