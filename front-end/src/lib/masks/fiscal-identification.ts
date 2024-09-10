export type FiscalIdentificationType = 'CPF' | 'CNPJ'

export function fiscalIdentificationMask(value: string, type: FiscalIdentificationType) {
  // Remove all non-digit characters
  value = value.replace(/\D/g, '')
  const maxLength = type === 'CPF' ? 14 : 18
  let maskedValue = ''

  switch (type) {
    case 'CPF':
      // Apply CPF mask (XXX.XXX.XXX-XX)
      for (let i = 0; i < value.length; i++) {
        if (i === 3 || i === 6) {
          maskedValue += '.'
        }
        if (i === 9) {
          maskedValue += '-'
        }
        maskedValue += value.charAt(i)
        if (maskedValue.length >= maxLength) break
      }
      return maskedValue
    case 'CNPJ':
      // Apply CNPJ mask (XX.XXX.XXX/XXXX-XX)
      for (let i = 0; i < value.length; i++) {
        if (i === 2 || i === 5) {
          maskedValue += '.'
        }
        if (i === 8) {
          maskedValue += '/'
        }
        if (i === 12) {
          maskedValue += '-'
        }
        maskedValue += value.charAt(i)
        if (maskedValue.length >= maxLength) break
      }
      return maskedValue
    default:
      return value.substring(0, maxLength)
  }
}

export function isValidFiscalIdentification(
  value?: string,
  type: FiscalIdentificationType = 'CPF',
  includeFormatting = false
) {
  if (!value) return false

  const cleanedValue = value.replace(/\D/g, '')

  if (type === 'CPF') {
    if (cleanedValue.length !== 11) {
      return false
    }

    if (includeFormatting && value !== cleanedValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')) {
      return false
    }

    const cpfDigits = cleanedValue.split('').map(Number)

    if (cpfDigits.every(digit => digit === cpfDigits[0])) {
      return false
    }

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += cpfDigits[i] * (10 - i)
    }
    let verificationDigit1 = sum % 11
    verificationDigit1 = verificationDigit1 < 2 ? 0 : 11 - verificationDigit1

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += cpfDigits[i] * (11 - i)
    }
    let verificationDigit2 = sum % 11
    verificationDigit2 = verificationDigit2 < 2 ? 0 : 11 - verificationDigit2

    return cpfDigits[9] === verificationDigit1 && cpfDigits[10] === verificationDigit2
  } else if (type === 'CNPJ') {
    if (cleanedValue.length !== 14) {
      return false
    }

    if (includeFormatting && value !== cleanedValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')) {
      return false
    }

    const cnpjDigits = cleanedValue.split('').map(Number)

    if (cnpjDigits.every(digit => digit === cnpjDigits[0])) {
      return false
    }

    let sum = 0
    let multiplier = 5
    for (let i = 0; i < 12; i++) {
      sum += cnpjDigits[i] * multiplier
      multiplier = multiplier === 2 ? 9 : multiplier - 1
    }
    let verificationDigit1 = sum % 11
    verificationDigit1 = verificationDigit1 < 2 ? 0 : 11 - verificationDigit1

    sum = 0
    multiplier = 6
    for (let i = 0; i < 13; i++) {
      sum += cnpjDigits[i] * multiplier
      multiplier = multiplier === 2 ? 9 : multiplier - 1
    }
    let verificationDigit2 = sum % 11
    verificationDigit2 = verificationDigit2 < 2 ? 0 : 11 - verificationDigit2

    return cnpjDigits[12] === verificationDigit1 && cnpjDigits[13] === verificationDigit2
  } else {
    return false
  }
}
