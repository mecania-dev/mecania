import { auth } from '@/auth'
import { Logo } from '@/components/icons/logo'
import { Mecania } from '@/components/icons/mecania'
import { cookies } from '@/lib/cookies'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const isAuthorized = await auth({
    redirectUrl: '/',
    async custom({ isAuthenticated, setRedirectUrl }) {
      const callbackUrl = await cookies('callback-url')
      setRedirectUrl(callbackUrl ?? '/')
      return !isAuthenticated
    }
  })

  if (!isAuthorized) return null

  return (
    <div className="box-content flex grow flex-col items-center justify-center gap-6 p-5 sm:p-20">
      <div>
        <Logo className="mx-auto h-auto w-1/5" />
        <Mecania className="mx-auto w-4/5" />
      </div>
      {children}
    </div>
  )
}
