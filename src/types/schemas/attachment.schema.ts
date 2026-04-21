import { z } from 'zod'

export const AttachmentSchema = z.object({
  task_id: z.string().uuid(),
  file_name: z.string().min(1),
  file_url: z.string().url(),
  file_type: z.string().optional(),
  file_size: z.number().int().positive().optional(),
})

export type Attachment = z.infer<typeof AttachmentSchema>