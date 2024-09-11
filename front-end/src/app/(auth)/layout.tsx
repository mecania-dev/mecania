import { Logo } from '@/components/icons/logo'
import { Mecania } from '@/components/icons/mecania'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
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
