"use client";

import { useState } from "react";
import { createProject } from "@/actions/projects";
import { Plus, X } from "lucide-react";

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

  if (!isOpen)
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg font-medium"
      >
        <Plus className="w-4 h-4" />
        Yeni Proje Başlat
      </button>
    );

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-purple-50 p-6 flex justify-between items-center border-b border-purple-100">
          <h2 className="text-xl text-purple-900 font-bold">Yeni Proje</h2>
          <button onClick={() => setIsOpen(false)} className="text-purple-400 hover:text-purple-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form action={action} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Proje Adı</label>
            <input
              name="name"
              placeholder="Proje adını girin..."
              className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Açıklama</label>
            <textarea
              name="description"
              placeholder="Proje hakkında kısa bir bilgi..."
              className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Çalışma Alanı</label>
            <select
              name="org_id"
              className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white text-gray-700"
            >
              <option value="">Bireysel Çalışma Alanı</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Başlangıç</label>
              <input type="date" name="start_date" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bitiş</label>
              <input type="date" name="end_date" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 text-sm" />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-3 bg-gray-50 text-gray-600 rounded-xl font-medium hover:bg-gray-100 transition-all"
            >
              İptal
            </button>
            <button type="submit" className="flex-1 bg-purple-700 text-white px-4 py-3 rounded-xl font-bold hover:bg-purple-800 transition-all">
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}