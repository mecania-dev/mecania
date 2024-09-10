import { FieldPath, FieldPathValue, FieldValues } from 'react-hook-form'

import { get } from 'lodash'

import { isArray, isObject } from './assertions'

export function tryParseJSON<T = any>(value?: string, defaultValue?: any): T | undefined {
  try {
    return JSON.parse(value as any) as T | undefined
  } catch {
    return defaultValue !== undefined ? defaultValue :value as T | undefined
  }
}

export function len(value?: any) {
  if (value instanceof Map || value instanceof Set) {
    return value.size
  }
  if (isArray(value) || typeof value === 'string') {
    return value.length
  }
  if (isObject(value)) {
    return Object.keys(value).length
  }
  return 0
}

export function groupBy<T extends { [key: string]: any }, K extends keyof T>(
  array: T[],
  key: K,
  // eslint-disable-next-line no-unused-vars
  initialValue: { [key in T[K]]?: T[] } = {},
  defaultKey?: T[K]
  // eslint-disable-next-line no-unused-vars
): { [key in T[K]]?: T[] } {
  return array.reduce((acc, value) => {
    const keyValue = value[key] || defaultKey!
    acc[keyValue] = acc[keyValue] ?? []
    acc[keyValue]?.push(value)
    return acc
  }, initialValue)
}

export function filter<T extends object>(object: T, filter?: (value: any) => boolean) {
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(object).filter(([_, value]) =>
      filter ? filter(value) : value !== null && value !== undefined && value !== ''
    )
  ) as T
}

export function splitObject<T extends Record<string, any>, K extends keyof T>(
  rest: T,
  keys?: K[],
  addToRest = false
): readonly [Omit<T, K> | T, Pick<T, K>] {
  if (!keys) {
    return [rest, {}] as any
  }

  const result = Object.keys(rest).reduce(
    (acc, key) => {
      const includes = keys.includes(key as K)
      const shouldAddToFirstArray = addToRest || !includes

      // Only include the key in `picked` if it exists in `props`
      if (includes) acc[1][key as K] = rest[key]
      // Remove keys that are in keys prop
      if (shouldAddToFirstArray) acc[0][key as K] = rest[key]

      return acc
    },
    [{}, {}] as [T, T]
  )

  return addToRest ? (result as [T, Pick<T, K>]) : (result as [Omit<T, K>, Pick<T, K>])
}

export function find<TFieldValues extends FieldValues, TFieldName extends FieldPath<TFieldValues>>(
  array: TFieldValues[] | undefined,
  key: TFieldName,
  value?: FieldPathValue<TFieldValues, TFieldName>
) {
  if (!isArray(array)) return undefined
  return array.find(item => get(item, key) === value)
}

export function findMany<TFieldValues extends FieldValues, TFieldName extends FieldPath<TFieldValues>>(
  array: TFieldValues[] | undefined,
  key: TFieldName,
  value?: FieldPathValue<TFieldValues, TFieldName>
) {
  if (!isArray(array)) return []
  return array.filter(item => get(item, key) === value)
}

export function cut<T>(array: T[], index: number) {
  if (index === -1) {
    return [array, []]
  }
  return [array.slice(0, index), array.slice(index)]
}

interface SplitOptions {
  max?: number
  defaultValue?: 'undefined' | 'emptyArray'
}

export function split<T>(
  array: T[],
  chunkSize: number,
  { max = Infinity, defaultValue = 'undefined' }: SplitOptions = {}
) {
  const result = []
  const defaultChunk = defaultValue === 'emptyArray' ? [] : undefined
  let currentIndex = 0

  while (currentIndex < array.length && result.length < Math.min(array.length, max)) {
    const chunk = array.slice(currentIndex, currentIndex + chunkSize)
    result.push(chunk.length <= chunkSize ? chunk : defaultChunk)
    currentIndex += chunkSize
  }

  return result
}
