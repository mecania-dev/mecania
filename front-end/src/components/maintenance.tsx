import React from 'react'
import { FaGear } from 'react-icons/fa6'

interface MaintenanceProps {
  title: string
  description: string
}

export function Maintenance({ title, description }: MaintenanceProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center text-default-800">
        <FaGear size={60} className="mx-auto mb-4 animate-[spin_4s_linear_infinite]" />
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-default-600">{description}</p>
      </div>
    </div>
  )
}
