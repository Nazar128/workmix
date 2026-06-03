"use client";

import { useState, useRef } from "react";
import { X, Save, Trash2, Clock, FileText, Loader2, Plus, Folder } from "lucide-react";
import TiptapEditor from "./TiptapEditor";
import { createNote } from "@/actions/notes";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function NotesDashboard({ 
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
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const editorRef = useRef<any>(null);

  if (!isOpen) return null;

  async function handleSave() {
    if (!title.trim()) return alert("Lütfen bir başlık girin.");
    
    setLoading(true);
    try {
      const content = editorRef.current?.getJSON();
      const contentString = JSON.stringify(content);
      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("project_id", projectId);
      formData.append("content", contentString);
      if (selectedNoteId) {
        formData.append("note_id", selectedNoteId);
      }

      await createNote(formData);
      
      if (selectedNoteId) {
        setNotes((prev) =>
          prev.map((note) =>
            note.id === selectedNoteId
              ? { ...note, title: title, content: contentString, date: new Date().toLocaleDateString('tr-TR') }
              : note
          )
        );
      } else {
        const newNote: Note = {
          id: Math.random().toString(36).substr(2, 9),
          title: title,
          content: contentString,
          date: new Date().toLocaleDateString('tr-TR')
        };
        setNotes((prev) => [newNote, ...prev]);
        setSelectedNoteId(newNote.id);
      }
    } catch (error) {
      alert("Kaydedilirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  function handleNewNote() {
    setTitle("");
    setSelectedNoteId(null);
    if (editorRef.current) {
      editorRef.current.commands.clearContent();
    }
  }

  function handleSelectNote(note: Note) {
    setTitle(note.title);
    setSelectedNoteId(note.id);
    if (editorRef.current && note.content) {
      try {
        editorRef.current.commands.setContent(JSON.parse(note.content));
      } catch(e) {
        editorRef.current.commands.setContent(note.content);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[150] bg-purple-950/20 backdrop-blur-[4px] flex md:items-center justify-center py-8 px-4">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative bg-purple-50/40 w-full max-w-5xl  h-[90vh] rounded-3xl shadow-2xl border border-purple-100 overflow-hidden grid  md:flex text-gray-800 p-3 md:p-6 gap-6 animate-in fade-in zoom-in-95 duration-200 z-10">
        
        <div className="w-full md:w-80 shrink-0 flex flex-col gap-4 bg-white rounded-2xl border border-purple-100/80 shadow-sm p-5 h-30">
          <div className="flex justify-between items-center pb-0.5 md:pb-2 border-b border-purple-50">
            <h1 className="text-md md:text-lg  font-bold text-purple-950 tracking-tight">Notlar</h1>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="p-1 md:p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                title="Eski Notlar"
              >
                <Folder className="w-2 h-2 md:w-4 md:h-4" />
              </button>
              <button 
                onClick={handleNewNote}
                className="p-1 md:p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-sm"
                title="Yeni Not"
              >
                <Plus className="w-2 h-2 md:w-4 md:h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 md:space-y-2 pr-1">
            {notes.length === 0 ? (
              <div className="text-center py-2 md:py-8">
                <p className="text-xs font-medium text-purple-400">Henüz not yok</p>
              </div>
            ) : (
              notes.map((note) => (
                <div 
                  key={note.id} 
                  onClick={() => handleSelectNote(note)}
                  className={`p-1 md:p-4 rounded-xl border transition-all cursor-pointer space-y-2 text-left ${selectedNoteId === note.id ? "bg-purple-50 border-purple-300 shadow-sm" : "bg-purple-50/20 border-purple-100/60 hover:border-purple-300 hover:bg-white"}`}
                >
                  <h3 className="font-bold text-sm text-purple-950 truncate">{note.title || "Başlıksız Not"}</h3>
                  <div className="text-[9px] text-purple-400 font-medium bg-white border border-purple-100/50 w-fit px-1.5 py-0.5 rounded">
                    {note.date}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-purple-100/80 shadow-sm flex flex-col h-full overflow-hidden">
          <div className="px-6 py-4 border-b border-purple-50 flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-xl border border-purple-100">
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xs md:text-sm font-bold text-purple-950">
                  {selectedNoteId ? "Notu Düzenle" : "Not Yazma Alanı"}
                </h2>
                <p className="text-[8px] md:text-[10px] text-purple-400 font-medium">{projectName || "Genel Notlar"}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-purple-400 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2 px-6 md:py-6 space-y-2 md:space-y-5">
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Başlıksız Not" 
              className="w-full text-lg md:text-2xl font-extrabold border-none focus:ring-0 placeholder:text-purple-200 p-0 outline-none text-purple-950 bg-transparent tracking-tight"
            />
            
            <div className="flex items-center gap-3 text-[9px] md:text-[11px] text-purple-400 font-medium bg-purple-50/50 px-3 py-1.5 rounded-lg w-fit">
              <Clock className="w-2 h-2 md:w-3.5 md:h-3.5 text-purple-500" />
              <span>Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>

            <div className="pt-2 md:pt-4 border-t border-purple-50/80">
              <div className="border border-purple-200 rounded-xl overflow-hidden focus-within:border-purple-400 transition-colors shadow-sm bg-white">
                <TiptapEditor onUpdate={(editor) => (editorRef.current = editor)} />
              </div>
            </div>
          </div>

          <div className="p-2 md:p-4 border-t border-purple-100/80 flex items-center gap-3 bg-purple-50/30">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-1 md:py-3 rounded-xl text-xs md:text-sm font-semibold hover:bg-purple-700 active:scale-[0.98] transition-all shadow-md shadow-purple-200 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-2 h-2 md:w-4 md:h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {selectedNoteId ? "Değişiklikleri Kaydet" : "Notu Kaydet"}
            </button>
            <button 
              onClick={handleNewNote}
              className="p-2 md:p-3 text-purple-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all border border-purple-100 bg-white shadow-sm"
            >
              <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-purple-950/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-purple-50 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-xl border border-purple-100">
                  <Folder className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-purple-950">Eski Notlar Arşivi</h2>
                  <p className="text-xs text-purple-400 font-medium">Toplam {notes.length} kayıtlı not listeleniyor</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-purple-50 rounded-xl transition-colors text-purple-400 hover:text-purple-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {notes.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-purple-200 mx-auto mb-3" />
                  <p className="text-sm font-medium text-purple-950">Arşivde not bulunamadı</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {notes.map((note) => (
                    <div 
                      key={note.id}
                      onClick={() => {
                        handleSelectNote(note);
                        setIsModalOpen(false);
                      }}
                      className="bg-purple-50/30 p-4 rounded-xl border border-purple-100/70 hover:border-purple-300 hover:bg-white hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 text-left"
                    >
                      <h4 className="font-bold text-sm text-purple-950 line-clamp-1">{note.title || "Başlıksız Not"}</h4>
                      <div className="text-[10px] text-purple-400 font-medium bg-white border border-purple-100 w-fit px-2 py-0.5 rounded">
                        {note.date}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}