import { isAuthenticated } from '@/auth'
import { redirect } from 'next/navigation'

import { ProtectedSidebar } from './sidebar'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) return redirect('/sign-in')

  return <ProtectedSidebar>{children}</ProtectedSidebar>
}
