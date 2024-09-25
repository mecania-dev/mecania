import Papa from 'papaparse'

export type PapaConfig<T> = NonNullable<Parameters<typeof Papa.parse<T>>[1]>

export async function processCSV<T extends Record<string, string[]>, C>(
  csvData?: File | string,
  config?: PapaConfig<C>
) {
  const result = {} as T
  if (!csvData) return result

  return new Promise<T>((resolve, reject) => {
    Papa.parse(csvData, {
      ...config,
      header: true,
      complete: parsedResult => {
        const rows = parsedResult.data as { [key: string]: string }[]

        for (const row of rows) {
          Object.keys(row).forEach(key => {
            if (key) {
              if (!result[key]) result[key as keyof T] = [] as unknown as T[keyof T]
              result[key].push(row[key])
            }
          })
        }

        resolve(result)
      },
      error: error => reject(error)
    })
  })
}
