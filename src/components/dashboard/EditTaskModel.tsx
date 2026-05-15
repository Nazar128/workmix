"use client";

import { useState } from "react";
import { updateTask } from "@/actions/tasks";
import { Settings2, X, AlertCircle, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditTaskModal({ task }: { task: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all border border-transparent hover:border-purple-100">
        <Settings2 className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-[2rem] w-full max-w-md shadow-2xl border border-white overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <Settings2 className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Görevi Düzenle</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
              </div>

              <form action={async (fd) => { await updateTask(task.id, fd); setIsOpen(false); }} className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Görev Başlığı</label>
                  <input name="title" defaultValue={task.title} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500/20 outline-none font-bold text-slate-800" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><AlertCircle className="w-3 h-3" /> Öncelik</label>
                    <select name="priority" defaultValue={task.priority} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-700 outline-none cursor-pointer">
                      <option value="low">Düşük</option>
                      <option value="medium">Orta</option>
                      <option value="high">Yüksek</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Tarih</label>
                    <input type="date" name="due_date" defaultValue={task.due_date ? task.due_date.split('T')[0] : ''} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-700 outline-none text-sm" />
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button type="button" onClick={() => setIsOpen(false)} className="flex-1 px-4 py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-100 transition-all">Vazgeç</button>
                  <button type="submit" className="flex-1 bg-purple-700 text-white px-4 py-4 rounded-2xl font-black shadow-lg hover:bg-purple-800 transition-all uppercase text-xs tracking-widest">Güncelle</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}