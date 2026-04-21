import z from "zod";

 export const TaskSchema = z.object({
    project_id: z.string().uuid(),
    parent_task_id: z.string().uuid().optional(),
    assignee_id: z.string().uuid().optional(),
    title: z.string().min(2, 'Görev başlığı en az 2 karakter olmalı'),
    description: z.string().optional(),
    status: z.enum(['todo','in_progress','review','done']).default('todo'),
    priority: z.enum(['low','medium','high','urgent']).default('medium'),
    estimated_hours: z.number().int().positive().optional(),
    actual_hours: z.number().int().positive().optional(),
  due_date: z.string().datetime().optional(),
})

export type Task = z.infer<typeof TaskSchema>