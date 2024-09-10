import { fiscalIdentificationMask } from './masks/fiscal-identification'

export function uniqueId() {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000)
}

export function generateCNPJ() {
  const randomDigits = (): number => Math.floor(Math.random() * 9)
  const calculateCheckDigits = (base: string): string => {
    const factors = [6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9, 2, 3]
    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += parseInt(base.charAt(i), 10) * factors[i + 1]
    }
    let checkDigit1 = sum % 11
    checkDigit1 = checkDigit1 < 2 ? 0 : 11 - checkDigit1

    sum = 0
    base += checkDigit1
    for (let i = 0; i < 13; i++) {
      sum += parseInt(base.charAt(i), 10) * factors[i]
    }
    let checkDigit2 = sum % 11
    checkDigit2 = checkDigit2 < 2 ? 0 : 11 - checkDigit2

    return base + checkDigit1.toString() + checkDigit2.toString()
  }

  let base = ''
  for (let i = 0; i < 12; i++) {
    base += randomDigits().toString()
  }

  return fiscalIdentificationMask(calculateCheckDigits(base), 'CNPJ')
}
