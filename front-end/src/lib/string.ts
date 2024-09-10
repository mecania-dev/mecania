import { isArray, isNullOrEmpty, isObject } from './assertions'

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const toKebabCase = (string: string) =>
  string
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .trim()
export const removeAccents = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
export const escapeRegex = (value: string): string => value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
export const normalizeString = (string: string) => removeAccents(string).toLowerCase()
export const normalizeStrings = (...strings: string[]) => strings.map(normalizeString)

export const defaultStringValue = (value?: string | null, defaultValue?: string | null) =>
  !isNullOrEmpty(value) ? value : defaultValue

export function search<T, K extends keyof T>(
  array: T[] | undefined,
  searchParam: K | K[],
  searchTerm: string,
  shouldSort: boolean = true,
  orderBy?: OrderBy
) {
  if (!array) return []

  const searchParams = isArray(searchParam) ? searchParam : [searchParam]
  const filteredItems = array.filter(item => {
    const values = searchParams.map(searchParam => String(item[searchParam]))
    const [t, ...v] = normalizeStrings(String(searchTerm), ...values)
    return v.some(value => value.includes(t))
  })

  if (shouldSort) {
    return sort(filteredItems, searchParams[0], orderBy, searchTerm)
  }

  return filteredItems
}

type OrderBy = 'asc' | 'desc'

export function sort<T, K extends keyof T>(array: T[], sortBy: K, orderBy: OrderBy = 'asc', value?: string): T[] {
  if (!value) {
    return array.sort((a, b) => {
      const value1 = isObject(a) ? String(a?.[sortBy] ?? '') : String(a)
      const value2 = isObject(b) ? String(b?.[sortBy] ?? '') : String(b)

      if (orderBy === 'asc') {
        return value1.localeCompare(value2)
      } else {
        return value2.localeCompare(value1)
      }
    })
  }

  return array.sort((a, b) => {
    const value1 = isObject(a) ? String(a?.[sortBy] ?? '') : String(a)
    const value2 = isObject(b) ? String(b?.[sortBy] ?? '') : String(b)

    const [nA, nB, nS] = normalizeStrings(value1, value2, value)
    const indexA = nA.indexOf(nS)
    const indexB = nB.indexOf(nS)

    if (indexA === indexB) {
      // If value is at the same position or absent in both
      if (orderBy === 'asc') {
        return value1.localeCompare(value2)
      } else {
        return value2.localeCompare(value1)
      }
    } else if (indexA === -1) {
      // value is not in A, B should come first
      return 1
    } else if (indexB === -1) {
      // value is not in B, A should come first
      return -1
    } else {
      // If value is in different positions, sort based on its position
      return indexA - indexB
    }
  })
}
