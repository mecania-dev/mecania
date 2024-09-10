import { Authorize } from '@/components/authorize'
import { Logo } from '@/components/icons/logo'
import { Mecania } from '@/components/icons/mecania'
import { Redirect } from '@/components/redirect'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Authorize
      fallback={
        <div className="box-content flex grow flex-col items-center justify-center gap-6 p-5 sm:p-20">
          <div>
            <Logo className="mx-auto h-auto w-1/5" />
            <Mecania className="mx-auto w-4/5" />
          </div>
          {children}
        </div>
      }
    >
      <Redirect url="/" />
    </Authorize>
  )
}
