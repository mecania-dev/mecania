import { auth } from '@/auth'

import { ProtectedSidebar } from './sidebar'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = await auth()
  return isAuthenticated ? <ProtectedSidebar>{children}</ProtectedSidebar> : null
}
