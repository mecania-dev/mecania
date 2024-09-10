import { VariantProps, tv } from '@nextui-org/react'

const collapse = tv({
  base: 'overflow-hidden'
})

export type CollapseVariantProps = VariantProps<typeof collapse>
export type CollapseSlots = keyof ReturnType<typeof collapse>

export { collapse }
