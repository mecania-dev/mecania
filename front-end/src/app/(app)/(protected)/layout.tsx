import { Authorize } from '@/components/authorize'

import { ProtectedSidebar } from './sidebar'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Authorize redirect="/sign-in">
      <ProtectedSidebar>{children}</ProtectedSidebar>
    </Authorize>
  )
}
