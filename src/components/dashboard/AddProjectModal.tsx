"use client";

import { useState } from "react";
import { createProject } from "@/actions/projects";

export default function AddProjectModal({
  organizations,
}: {
  organizations: { id: string; name: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  async function action(formData: FormData) {
    await createProject(formData);
    setIsOpen(false);
  }

  if (!isOpen)
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-purple-900 text-white p-4 rounded-xl"
      >
        Yeni Proje Ekle
      </button>
    );

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md border border-gray-300 shadow-xl">
        <h2 className="text-xl text-purple-800 font-bold mb-4 border-b pb-2">
          Yeni Proje Oluştur 
        </h2>
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">Proje Adı</label>
            <input name="name" className="w-full border border-gray-300 p-2 rounded mt-1" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Organizasyon</label>
            <select name="org_id" className="w-full border border-gray-300 p-2 rounded mt-1" required>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Başlangıç Tarihi</label>
            <input type="date" name="start_date" className="w-full border border-gray-300 p-2 rounded mt-1" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Bitiş Tarihi</label>
            <input type="date" name="end_date" className="w-full border border-gray-300 p-2 rounded mt-1" />
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