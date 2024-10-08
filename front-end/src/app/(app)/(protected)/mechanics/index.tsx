'use client'

import { FaTools } from 'react-icons/fa'

import { AsyncScroll } from '@/components/async-scroll'
import { User } from '@/types/entities/user'
import { range } from 'lodash'

import { MechanicCard } from './mechanic-card'

export function MechanicsList() {
  return (
    <AsyncScroll<User> url="users/mechanics/" className="grow">
      {(mechanics, { isMounted }) => {
        if (isMounted && !mechanics?.length) {
          return (
            <div className="flex flex-col items-center justify-center space-y-4 p-10 text-center">
              <FaTools className="animate-pulse text-6xl text-default-400" />
              <p className="text-large font-medium text-default-600">Nenhuma oficina cadastrada.</p>
              <p className="text-default-500">Assim que novas oficinas forem cadastradas, você poderá vê-las aqui.</p>
            </div>
          )
        }

        return (
          <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2 xl:grid-cols-3">
            {!isMounted
              ? range(10).map(i => <MechanicCard key={i} isLoaded={isMounted} />)
              : mechanics?.map(mechanic => (
                  <MechanicCard mechanic={mechanic} href={`/mechanics/${mechanic.id}`} key={mechanic.id} />
                ))}
          </div>
        )
      }}
    </AsyncScroll>
  )
}
