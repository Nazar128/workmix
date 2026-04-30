"use client";

import { useState } from "react";
import { createTask } from "@/actions/tasks";

export default function AddTaskModal({ projects }: { projects: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  async function action(formData: FormData) {
    try {
      await createTask(formData);
      setIsOpen(false);
    } catch (error) {
      alert("Görev kaydedilirken bir hata oluştu: " + (error as Error).message);
    }
  }
  

  if (!isOpen)
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Yeni Görev Ekle
      </button>
    );

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md border border-gray-300 shadow-xl">
        <h2 className="text-xl text-purple-800 font-bold mb-4 border-b pb-2">
          Yeni Görev Oluştur
        </h2>
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">Başlık</label>
            <input name="title" className="w-full border border-gray-300 p-2 rounded mt-1" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Proje</label>
            <select name="project_id" className="w-full border border-gray-300 p-2 rounded mt-1" required>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Öncelik</label>
            <select name="priority" className="w-full border border-gray-300 p-2 rounded mt-1">
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Son Tarih</label>
            <input type="date" name="due_date" className="w-full border border-gray-300 p-2 rounded mt-1" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-100 rounded border text-red-700"
            >
              İptal
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}