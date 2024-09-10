export function isValidPhoneNumber(phone: string, countryCode: boolean = false) {
  // Regex for validating phone numbers without country code
  const phoneRegexWithoutCC = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/
  // Regex for validating phone numbers with country code
  const phoneRegexWithCC = /^\+\d{1,3} \(\d{1,2}\) \d{4,5}-\d{4}$/

  if (countryCode) {
    return phoneRegexWithCC.test(phone)
  } else {
    return phoneRegexWithoutCC.test(phone)
  }
}

export function phoneNumberMask(phone: string) {
  phone = phone.replace(/\D/g, '')

  // Truncate the phone number to a maximum of 11 digits
  if (phone.length > 11) {
    phone = phone.substring(0, 11)
  }

  switch (phone.length) {
    case 8:
      // Phone with 8 digits (XXXX-XXXX)
      return phone.replace(/^(\d{4})(\d{4})/, '$1-$2')
    case 9:
      // Phone with 9 digits (XXXXX-XXXX)
      return phone.replace(/^(\d{5})(\d{4})/, '$1-$2')
    case 10:
      // Phone with 10 digits (XX XXXX-XXXX)
      return phone.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    case 11:
      // Phone with 11 digits (XX XXXXX-XXXX)
      return phone.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    default:
      // If the length is not within the valid range, return as is
      return phone
  }
}
