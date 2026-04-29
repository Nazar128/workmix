"use client";

import { useState } from "react";
import { DndContext, closestCorners, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createClient } from "@/lib/supabase/client";

type Task = { id: string; title: string; status: string; priority?: string };

const COLUMNS = [
  { id: "todo", label: "Bekliyor" },
  { id: "in_progress", label: "Devam Ediyor" },
  { id: "done", label: "Tamamlandı" },
];

function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      {...attributes}
      {...listeners}
      className="p-3 mb-2 bg-white border border-gray-200 rounded-lg text-sm cursor-grab shadow-sm hover:border-purple-300"
    >
      <p className="font-medium text-gray-800">{task.title}</p>
      {task.priority && <p className="text-xs text-gray-400 mt-1">{task.priority}</p>}
    </div>
  );
}

export default function KanbanBoard({ initialTasks, projectId }: { initialTasks: Task[]; projectId: string }) {
  const [tasks, setTasks] = useState(initialTasks);
  const supabase = createClient();

  function getByStatus(status: string) {
    return tasks.filter((t) => t.status === status);
  }

  function findStatus(taskId: string) {
    return tasks.find((t) => t.id === taskId)?.status;
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const overId = over.id as string;
    const targetStatus = COLUMNS.find((c) => c.id === overId)?.id
      ?? tasks.find((t) => t.id === overId)?.status;

    if (!targetStatus || findStatus(active.id as string) === targetStatus) return;

    setTasks((prev) => prev.map((t) => t.id === active.id ? { ...t, status: targetStatus } : t));
    await supabase.from("tasks").update({ status: targetStatus }).eq("id", active.id);
  }

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = getByStatus(col.id);
          return (
            <div key={col.id} className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-100 border-b border-gray-300 p-3 flex justify-between">
                <span className="font-semibold text-gray-700 text-sm">{col.label}</span>
                <span className="text-xs text-gray-500 bg-gray-200 rounded-full px-2 py-0.5">{colTasks.length}</span>
              </div>
              <div className="p-3 min-h-[150px]">
                <SortableContext items={colTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  {colTasks.map((task) => <TaskCard key={task.id} task={task} />)}
                </SortableContext>
                {colTasks.length === 0 && (
                  <p className="text-xs text-gray-400 text-center mt-4">Görev yok</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}