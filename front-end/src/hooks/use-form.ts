import { useEffect, useState } from 'react'
import { FieldValues, UseFormProps, UseFormReturn, useForm as useReactHookForm } from 'react-hook-form'

type FormProps<TFieldValues extends FieldValues = FieldValues, TContext = any> = UseFormProps<TFieldValues, TContext>

type FormReturn<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
> = UseFormReturn<TFieldValues, TContext, TTransformedValues> & {
  errorMessage?: string
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
}

export function useForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
>(props?: FormProps<TFieldValues, TContext>): FormReturn<TFieldValues, TContext, TTransformedValues> {
  const form = useReactHookForm(props)
  const { errors } = form.formState
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const formError = Object.values(errors).find(err => err?.message)
    formError?.message && setErrorMessage(formError.message as string)
  }, [errors])

  return { ...form, errorMessage, setErrorMessage }
}
