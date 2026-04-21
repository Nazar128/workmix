import { z } from 'zod'

export const TagSchema = z.object({
  org_id: z.string().uuid(),
  name: z.string().min(1, 'Etiket adı boş olamaz'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Geçerli bir hex renk girin').optional(),
})

export type Tag = z.infer<typeof TagSchema>