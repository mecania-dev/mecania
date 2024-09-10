import { forwardRef } from 'react'
import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form'

export interface FormProps<T extends FieldValues> extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<T, any, undefined>
  onSubmit: SubmitHandler<T>
}

export const Form = forwardRef(function Form<T extends FieldValues>(
  { children, form, onSubmit, ...props }: FormProps<T>,
  ref: React.ForwardedRef<HTMLFormElement>
) {
  return (
    <FormProvider {...form}>
      <form ref={ref} onSubmit={form.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </FormProvider>
  )
})
