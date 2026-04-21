import { z } from 'zod'

export const CommentSchema = z.object({
  task_id: z.string().uuid(),
  parent_comment_id: z.string().uuid().optional(),
  content: z.string().min(1, 'Yorum boş olamaz'),
})

export type Comment = z.infer<typeof CommentSchema>