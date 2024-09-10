import { Metadata } from 'next'

import { ProfileForm } from './profile-form'

export const metadata: Metadata = {
  title: 'Perfil'
}

export default function Page() {
  return (
    <div className="p-5 lg:px-[10%] xl:px-[15%]">
      <ProfileForm />
    </div>
  )
}
