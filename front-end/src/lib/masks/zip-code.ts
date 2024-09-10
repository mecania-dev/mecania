export function isValidCEP(cep: string): boolean {
  const cepRegex = /^\d{5}-?\d{3}$/
  return cepRegex.test(cep)
}

export function CEPMask(cep: string) {
  cep = cep.replace(/\D/g, '')

  // Apply the mask based on the length of the remaining digits
  switch (cep.length) {
    case 5:
      // CEP with 5 digits (XXXXX)
      return cep.replace(/^(\d{5})/, '$1')
    case 6:
      // CEP with 6 digits (XXXXX-)
      return cep.replace(/^(\d{5})(\d{1})/, '$1-$2')
    case 7:
      // CEP with 7 digits (XXXXX-X)
      return cep.replace(/^(\d{5})(\d{2})/, '$1-$2')
    case 8:
      // CEP with 8 digits (XXXXX-XXX)
      return cep.replace(/^(\d{5})(\d{3})/, '$1-$2')
    case 9:
      // CEP with 9 digits (XXXXX-XXX)
      return cep.replace(/^(\d{5})(\d{3})(\d{1})/, '$1-$2')
    default:
      // If the length is not within the valid range, return as is
      return cep
  }
}
