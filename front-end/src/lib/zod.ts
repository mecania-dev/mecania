import { z } from 'zod'

import { isNumeric } from './assertions'
import { len } from './object'

type StringParams = Parameters<typeof z.string>[0]
type NumberParams = Parameters<typeof z.number>[0]
type EnumParams = Parameters<typeof z.enum>[1]

interface ZodDefaultProps {
  name?: string
  min?: number
  minMessage?: string
  max?: number
  maxMessage?: string
  isMasculine?: boolean
}

interface ZodStringProps extends ZodDefaultProps {
  allowEmpty?: boolean
}

export function string(
  { name, min = -Infinity, minMessage, max = Infinity, maxMessage, isMasculine = true, allowEmpty }: ZodStringProps,
  params: StringParams = {}
) {
  params.required_error = params.required_error || `${name} é obrigatóri${isMasculine ? 'o' : 'a'}.`
  const schema = z
    .string(params)
    .min(
      min,
      minMessage || min <= 1
        ? params.required_error
        : `${name} deve ter pelo menos ${min} caractere${min > 1 ? 's' : ''}.`
    )
    .max(max, maxMessage || `${name} deve ter no máximo ${max} caractere${max > 1 ? 's' : ''}.`)
    .trim()

  if (allowEmpty) {
    return schema.or(z.literal(''))
  }

  return schema
}

export function number(
  { name, min = -Infinity, minMessage, max = Infinity, maxMessage, isMasculine = true }: ZodDefaultProps,
  params: NumberParams = {}
) {
  params.required_error = params.required_error || `${name} é obrigatóri${isMasculine ? 'o' : 'a'}.`

  return z
    .number(params)
    .min(min, minMessage || `${name} deve ser pelo menos ${min}.`)
    .max(max, maxMessage || `${name} deve ser no máximo ${max}.`)
}

interface OneOfProps {
  name: string
  isMasculine?: boolean
}

export function oneOf<U extends string, T extends Readonly<[U, ...U[]]>>(
  values: Readonly<T>,
  { name, isMasculine = true }: OneOfProps,
  params: EnumParams = {}
) {
  params.required_error = params.required_error || `${name} é obrigatóri${isMasculine ? 'o' : 'a'}.`
  return z.enum(values, params)
}

interface StringNumericProps extends ZodDefaultProps {
  int?: boolean
  NaN?: string
}

export function stringNumeric(
  { name, min = -Infinity, minMessage, max = Infinity, maxMessage, int, NaN }: StringNumericProps,
  params: StringParams = {}
) {
  const schema = z
    .string(params)
    .or(z.number(params))
    .refine(value => len(value) > 0, { message: `${name} é obrigatório.` })
    .refine(value => isNumeric(value), { message: NaN || 'O valor passado não é numérico.' })
    .transform(v => Number(v))
    .refine(num => num >= min, { message: minMessage || `${name} deve ser maior ou igual a ${min}.` })
    .refine(num => num <= max, { message: maxMessage || `${name} deve ser menor ou igual a ${max}.` })

  if (int) {
    return schema.refine(num => Number.isInteger(num), { message: `${name} deve ser um número inteiro.` })
  }

  return schema
}
