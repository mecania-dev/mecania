export type Dict<T = any> = Record<string, T>

export const isServer = typeof window === 'undefined'

export const isNullOrEmpty = (value: any) => value == null || value === ''

export const isArray = <T = any>(value: any): value is T[] => !isNullOrEmpty(value) && Array.isArray(value)

export const isObject = <T = Record<any, any>>(value: any): value is T => typeof value === 'object' && !isArray(value)

export const isFunction = <T extends Function = Function>(value: any): value is T => typeof value === 'function'

export const isNumeric = <T extends number | string = string>(value?: any): value is T =>
  !isNullOrEmpty(value) && !isNaN(Number(value))
