import { BiSidebar } from 'react-icons/bi'

import { useSidebar } from '.'
import { Button } from '../button'

export function SidebarToggle() {
  const { toggleOpen } = useSidebar()

  return (
    <Button variant="faded" className="h-auto w-fit min-w-0 shrink-0 p-1" onPress={toggleOpen}>
      <BiSidebar size={28} className="shrink-0" />
    </Button>
  )
}
