export const mapPropsVariants = <T extends Record<string, any>, K extends keyof T>(
  props: T,
  variantKeys?: K[],
  removeVariantProps = true
): readonly [Omit<T, K>, Pick<T, K>] => {
  if (!variantKeys) {
    return [props, {}] as any
  }

  const result = Object.keys(props).reduce(
    (acc, key) => {
      const includes = variantKeys.includes(key as K)
      const shouldAddToFirstArray = !removeVariantProps || !includes

      // Only include the key in `picked` if it exists in `props`
      if (includes) acc[1][key as K] = props[key]
      // Remove keys that are in variantKeys
      if (shouldAddToFirstArray) acc[0][key as K] = props[key]

      return acc
    },
    [{}, {}] as [T, T]
  )

  return removeVariantProps ? (result as [Omit<T, K>, Pick<T, K>]) : (result as [T, Pick<T, K>])
}
