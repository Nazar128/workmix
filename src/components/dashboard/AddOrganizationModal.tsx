"use client";

import { useState } from "react";
import { createOrganization } from "@/actions/organizations";

export default function AddOrganizationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function action(formData: FormData) {
    setLoading(true);
    try {
      await createOrganization(formData);
      setIsOpen(false);
    } catch (error) {
      alert("Organizasyon oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-purple-900 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition"
      >
        + Yeni Organizasyon
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-slate-900">Yeni Organizasyon</h2>
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Organizasyon Adı</label>
            <input
              name="name"
              type="text"
              className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-900 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition disabled:opacity-50"
            >
              {loading ? "Oluşturuluyor..." : "Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}