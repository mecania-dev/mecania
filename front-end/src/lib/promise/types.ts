export type MaybePromise<T extends (...args: any[]) => any = () => any> =
  Parameters<T> extends []
    ? () => ReturnType<T> | Promise<ReturnType<T>>
    : (...args: Parameters<T>) => ReturnType<T> | Promise<ReturnType<T>>
