import { cookies } from '@/lib/cookies'
import { usePathname, useRouter } from 'next/navigation'

type NavigateOptions = NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>

export interface RedirectProps extends NavigateOptions {
  useCallbackUrl?: boolean
  callbackUrl?: string
}

export function useRedirect() {
  const pathname = usePathname()
  const router = useRouter()

  async function redirect(
    href: string,
    { useCallbackUrl = true, callbackUrl: customCallbackUrl, ...props }: RedirectProps = {}
  ) {
    const callbackUrl = await cookies('callback-url')

    if (customCallbackUrl) {
      useCallbackUrl = false
      await setCallbackUrl(customCallbackUrl)
    }

    if (!useCallbackUrl || !callbackUrl) {
      return router.push(href, props)
    }

    await cookies.delete('callback-url')
    router.push(callbackUrl, props)
  }

  async function setCallbackUrl(href?: string) {
    await cookies.set({ 'callback-url': href ?? pathname })
  }

  return { redirect, router, setCallbackUrl, pathname } as const
}
