"use client";

import { useState } from "react";
import { updateProject } from "@/actions/projects";

export function EditProjectModal({ project }: { project: any }) {
  const [isOpen, setIsOpen] = useState(false);

  async function action(formData: FormData) {
    await updateProject(project.id, formData);
    setIsOpen(false);
  }

  if (!isOpen)
    return (
      <button onClick={() => setIsOpen(true)} className="text-blue-600 mr-2">
        Düzenle
      </button>
    );

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Projeyi Düzenle</h2>
        <form action={action} className="space-y-4">
          <input
            name="name" 
            defaultValue={project.name}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            name="description"
            defaultValue={project.description ?? ""}
            className="w-full border p-2 rounded"
            rows={3}
          />
          <select
            name="visibility"
            defaultValue={project.visibility}
            className="w-full border p-2 rounded"
          >
            <option value="private">Özel</option>
            <option value="public">Herkese Açık</option>
          </select>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-100 rounded"
            >
              İptal
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Güncelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}