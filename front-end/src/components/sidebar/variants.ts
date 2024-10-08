import { VariantProps, tv } from '@nextui-org/react'

export const sidebarRoute = tv({
  slots: {
    base: 'group flex min-w-0 shrink-0 cursor-pointer items-center justify-start gap-2 rounded-small p-2.5',
    icon: 'h-5 w-5 shrink-0',
    text: 'grow whitespace-nowrap font-semibold group-data-[open=false]:hidden'
  },
  variants: {
    isSubRoute: {
      true: { base: 'p-1.5', icon: 'h-4 w-4' }
    }
  }
})

export type SidebarRouteVariantProps = VariantProps<typeof sidebarRoute>
export type SidebarRouteSlots = keyof ReturnType<typeof sidebarRoute>
