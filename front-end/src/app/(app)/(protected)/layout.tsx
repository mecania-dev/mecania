import { auth } from '@/auth'

import { ProtectedSidebar } from './sidebar'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await auth()

  return <ProtectedSidebar>{children}</ProtectedSidebar>
}
