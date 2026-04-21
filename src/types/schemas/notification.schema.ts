import { z } from 'zod'

export const NotificationSchema = z.object({
  user_id: z.string().uuid(),
  task_id: z.string().uuid().optional(),
  type: z.enum(['task_assigned', 'comment_added', 'due_date_reminder', 'status_changed']),
  message: z.string().min(1),
})

export type Notification = z.infer<typeof NotificationSchema>