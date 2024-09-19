import { Card } from '@/components/card'
import { Metadata } from 'next'

import { ProfileForm } from './profile-form'

export const metadata: Metadata = {
  title: 'Perfil'
}

export default function Page() {
  return (
    <div className="p-5 lg:px-[10%] xl:px-[15%]">
      <Card className="mx-auto max-w-3xl p-5" isHoverable={false}>
        <ProfileForm />
      </Card>
    </div>
  )
}
