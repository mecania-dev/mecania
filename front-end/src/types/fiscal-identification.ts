import { isValidFiscalIdentification } from '@/lib/masks/fiscal-identification'
import { string } from '@/lib/zod'

export const fiscalIdentificationSchema = string({ name: 'Número de Identificação', min: 1, allowEmpty: true })
  .optional()
  .refine(value => {
    if (!value) return true
    const isCPFValid = isValidFiscalIdentification(value, 'CPF', true)
    const isCNPJValid = isValidFiscalIdentification(value, 'CNPJ', true)
    return isCPFValid || isCNPJValid
  }, 'Insira um número de identificação válido')
