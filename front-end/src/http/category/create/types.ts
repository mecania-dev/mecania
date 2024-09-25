import { string } from '@/lib/zod'
import { z } from 'zod'

export const categoryCreateSchema = z.object({
  name: string({ name: 'Nome', min: 1, max: 255 }),
  description: string({ name: 'Descrição', min: 1, max: 255, allowEmpty: true }).optional()
})

export const categoryCreateFields = Object.keys(categoryCreateSchema.shape)

export type CategoryCreateInput = z.input<typeof categoryCreateSchema>
export type CategoryCreateOutput = z.output<typeof categoryCreateSchema>
