"use client";

import { useState } from "react";
import { updateTask } from "@/actions/tasks";

export default function EditTaskModal({ task }: { task: any }) {
  const [isOpen, setIsOpen] = useState(false);

  async function action(formData: FormData) {
    await updateTask(task.id, formData);
    setIsOpen(false);
  }

  if (!isOpen) return <button onClick={() => setIsOpen(true)} className="text-blue-600 mr-2">Düzenle</button>;

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Görevi Düzenle</h2>
        <form action={action} className="space-y-4">
          <input name="title" defaultValue={task.title} className="w-full border p-2 rounded" required />
          <select name="priority" defaultValue={task.priority} className="w-full border p-2 rounded">
            <option value="low">Düşük</option>
            <option value="medium">Orta</option>
            <option value="high">Yüksek</option>
          </select>
          <input type="date" name="due_date" defaultValue={task.due_date ? task.due_date.split('T')[0] : ''} className="w-full border p-2 rounded" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-100 rounded">İptal</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Güncelle</button>
          </div>
        </form>
      </div>
    </div>
  );
}