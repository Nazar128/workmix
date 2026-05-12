"use client";

import { useState, useRef } from "react";
import { X, Save, Trash2, Clock, Hash, Loader2 } from "lucide-react";
import TiptapEditor from "./TiptapEditor";
import { createNote, deleteNote } from "@/actions/notes";

export default function NoteDrawer({ 
  isOpen, 
  onClose, 
  projectId, 
  projectName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  projectId: string;
  projectName: string;
}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<any>(null);

  if (!isOpen) return null;

  async function handleSave() {
    if (!title.trim()) return alert("Lütfen bir başlık girin.");
    
    setLoading(true);
    try {
      const content = editorRef.current?.getJSON();
      const formData = new FormData();
      formData.append("title", title);
      formData.append("project_id", projectId);
      formData.append("content", JSON.stringify(content));

      await createNote(formData);
      onClose();
      setTitle("");
    } catch (error) {
      alert("Kaydedilirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[150] overflow-hidden">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-300">
        
        <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 rounded-md">
              <Hash className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <span className="text-xs font-semibold text-gray-500 truncate max-w-[200px]">
              {projectName || "Genel Notlar"}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Başlıksız Not" 
            className="w-full text-lg font-bold border-none focus:ring-0 placeholder:text-gray-300 p-0 outline-none text-gray-800"
          />
          
          <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Yeni Not Oluşturuluyor</span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-50">
            <TiptapEditor onUpdate={(editor) => (editorRef.current = editor)} />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center gap-2 bg-gray-50/50">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Kaydet
          </button>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-transparent"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}