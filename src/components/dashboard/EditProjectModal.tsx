"use client";

import { useState } from "react";
import { updateProject } from "@/actions/projects";
import { Settings2, X } from "lucide-react";

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

  if (!isOpen)
    return (
      <button 
        onClick={() => setIsOpen(true)} 
        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
      >
        <Settings2 className="w-4 h-4" />
      </button>
    );

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center  p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100">
        <div className="p-6 flex justify-between items-center border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Projeyi Düzenle</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form action={action} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Proje Adı</label>
            <input
              name="name" 
              defaultValue={project.name}
              className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Açıklama</label>
            <textarea
              name="description"
              defaultValue={project.description ?? ""}
              className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Görünürlük</label>
                <select
                  name="visibility"
                  defaultValue={project.visibility}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                >
                  <option value="private"> Özel</option>
                  <option value="public"> Herkese Açık</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Durum</label>
                <select
                  name="status"
                  defaultValue={project.status}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                >
                  <option value="active">Aktif</option>
                  <option value="passive">Pasif</option>
                  <option value="archived">Arşivle</option>
                </select>
             </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-3 bg-gray-50 text-gray-500 rounded-xl font-medium"
            >
              İptal
            </button>
            <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
              Güncelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}