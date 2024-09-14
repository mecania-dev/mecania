'use client'

import { useState } from 'react'

import { Input } from '@/components/input'
import { ZipCodeInput } from '@/components/input/zip-code'
import { ZipCodeResponse } from '@/http'

export function Addresses() {
  const [address, setAddress] = useState<ZipCodeResponse>()

  async function onCEPChange(cep: ZipCodeResponse) {
    setAddress(cep)
  }

  return (
    <div className="space-y-2">
      <ZipCodeInput placeholder="CEP" onZipCodeChange={onCEPChange} />
      <Input placeholder="Estado" value={address?.state} isReadOnly />
      <Input placeholder="Cidade" value={address?.city} isReadOnly />
      <Input placeholder="Bairro" value={address?.neighborhood} isReadOnly />
      <Input placeholder="Rua" value={address?.street} isReadOnly />
      <Input placeholder="Número" />
      <Input placeholder="Complemento" />
    </div>
  )
}
