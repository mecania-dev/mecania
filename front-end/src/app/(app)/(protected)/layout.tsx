import { ProtectedSidebar } from './sidebar'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedSidebar>{children}</ProtectedSidebar>
}
