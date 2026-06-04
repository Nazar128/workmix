"use client";

import { useState } from "react";
import { createTask } from "@/actions/tasks";
import { Plus, X, ListTodo, Calendar, AlertCircle, User2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddTaskModal({ projects, members }: { projects: any[]; members: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-5 py-3 rounded-xl transition-all shadow-md font-bold text-xs uppercase tracking-wider active:scale-95 whitespace-nowrap flex-shrink-0"
      >
        <Plus className="w-4 h-4" /> Yeni Görev
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-center p-4 overflow-y-auto bg-slate-900/50">
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
              className="relative bg-white rounded-3xl m-4 md:m-24 w-full max-w-md shadow-xl border border-slate-100 overflow-hidden flex flex-col max-h-[calc(80vh-2rem)]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600 text-white rounded-lg shadow-sm">
                    <ListTodo className="w-5 h-5" />
                  </div>
                  <h2 className="text-md md:text-lg font-bold text-slate-800 tracking-tight">Yeni Görev Oluştur</h2>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form 
                action={async (fd) => { await createTask(fd); setIsOpen(false); }} 
                className="p-6 space-y-4 overflow-y-auto text-left"
              >
                <div className="space-y-1.5">
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Görev Nedir?</label>
                  <input name="title" placeholder="Yapılacak işi yazın..." className="w-full bg-slate-50 text-xs md:text-sm border border-slate-100 p-3.5 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none font-medium text-slate-700" required />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1"><User2 className="w-3 h-3" /> Görev Atanan Personel</label>
                  <select name="assignee_id" className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl font-medium text-xs md:text-sm text-slate-600 outline-none cursor-pointer" required>
                    <option value="">Personel Seçin...</option>
                    {members.map((member) => (<option key={member.id} value={member.id}>{member.full_name} ({member.role})</option>))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">İlgili Proje</label>
                  <select name="project_id" className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl font-medium text-xs md:text-sm text-slate-600 outline-none cursor-pointer" required>
                    {projects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Öncelik</label>
                    <select name="priority" className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl font-medium text-xs md:text-sm text-slate-600 outline-none">
                      <option value="low">Düşük</option>
                      <option value="medium">Orta</option>
                      <option value="high">Yüksek</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Son Tarih</label>
                    <input type="date" name="due_date" className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl font-medium  text-slate-600 outline-none text-xs  md:text-sm" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsOpen(false)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-500 rounded-xl font-medium hover:bg-slate-200 transition-all">İptal</button>
                  <button type="submit" className="flex-1 bg-purple-700 text-white px-4 py-3 rounded-xl font-bold shadow-md hover:bg-purple-800 transition-all uppercase text-xs tracking-wider">Oluştur ve Ata</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}