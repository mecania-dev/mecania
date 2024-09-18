import { DateFormatter, getLocalTimeZone, parseAbsolute } from '@internationalized/date'

export function formatDate(date: string | Date, options: Intl.DateTimeFormatOptions = {}) {
  if (Object.keys(options).length === 0) {
    options.dateStyle = 'medium'
    options.timeStyle = 'short'
  }

  const dateString = typeof date === 'string' ? date : date.toISOString()
  const timeZone = getLocalTimeZone()
  const parsedDate = parseAbsolute(dateString, timeZone)
  const formatter = new DateFormatter(navigator.language || 'pt-BR', { timeZone, ...options })

  return formatter.format(parsedDate.toDate())
}

export function compareDates(a: string | Date, b: string | Date, order: 'asc' | 'desc' = 'asc') {
  const timeZone = getLocalTimeZone()
  const aString = typeof a === 'string' ? a : a.toISOString()
  const bString = typeof b === 'string' ? b : b.toISOString()
  const parsedDateA = parseAbsolute(aString, timeZone).toDate().getTime()
  const parsedDateB = parseAbsolute(bString, timeZone).toDate().getTime()

  if (order === 'asc') {
    return parsedDateA - parsedDateB
  } else {
    return parsedDateB - parsedDateA
  }
}
