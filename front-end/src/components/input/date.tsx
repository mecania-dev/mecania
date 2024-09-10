import { forwardRef } from 'react'

import { DateInput as NextUIDateInput, DateInputProps as NextUIDateInputProps } from '@nextui-org/react'
import { I18nProvider, I18nProviderProps } from '@react-aria/i18n'

export type DateInputProps = NextUIDateInputProps & {
  locale?: I18nProviderProps['locale']
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(function DateInput(
  { locale = 'pt-BR', isInvalid, ...rest },
  ref
) {
  return (
    <I18nProvider locale={locale}>
      <NextUIDateInput ref={ref} isInvalid={isInvalid ?? !!rest.errorMessage} {...rest} />
    </I18nProvider>
  )
})
