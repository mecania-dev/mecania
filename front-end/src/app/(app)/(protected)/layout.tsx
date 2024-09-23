import { auth } from '@/auth'

import { ProtectedSidebar } from './sidebar'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const isAuthorized = await auth()
  return isAuthorized ? <ProtectedSidebar>{children}</ProtectedSidebar> : null
}
