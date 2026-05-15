"use client";

import { useState } from "react";
import { createTask } from "@/actions/tasks";
import { Plus, X, ListTodo, Calendar, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddTaskModal({ projects }: { projects: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-2xl transition-all shadow-lg font-black text-xs uppercase tracking-widest active:scale-95">
        <Plus className="w-5 h-5" /> Yeni Görev
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl border border-white overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-purple-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-200">
                    <ListTodo className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Yeni Görev</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-purple-600 transition-colors"><X className="w-6 h-6" /></button>
              </div>

              <form action={async (fd) => { await createTask(fd); setIsOpen(false); }} className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Görev Nedir?</label>
                  <input name="title" placeholder="Yapılacak işi yazın..." className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500/20 outline-none font-bold text-slate-700" required />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">İlgili Proje</label>
                  <select name="project_id" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-600 outline-none appearance-none cursor-pointer" required>
                    {projects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Öncelik</label>
                    <select name="priority" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-600 outline-none">
                      <option value="low">Düşük</option>
                      <option value="medium">Orta</option>
                      <option value="high">Yüksek</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Son Tarih</label>
                    <input type="date" name="due_date" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-600 outline-none text-sm" />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setIsOpen(false)} className="flex-1 px-4 py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-100 transition-all">İptal</button>
                  <button type="submit" className="flex-1 bg-purple-700 text-white px-4 py-4 rounded-2xl font-black shadow-lg shadow-purple-100 hover:bg-purple-800 transition-all uppercase text-xs tracking-widest">Oluştur</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}