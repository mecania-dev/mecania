'use client'

import { useState } from 'react'

import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { FileInput } from '@/components/input/file'
import { useIsLoading } from '@/hooks/use-is-loading'
import { createCategory, createService } from '@/http'
import { processCSV } from '@/lib/csv'
import { mutate } from 'swr'

import { ServicesTable } from './services-table'

export function ServicesPage() {
  const [files, setFiles] = useState<File[]>()
  const [newServices, setNewServices] = useState<Record<string, string[]>>()
  const [notSaved, setNotSaved] = useState<Record<string, string[]>>()
  const [onSave, isSaving] = useIsLoading(async () => {
    for (const [key, value] of Object.entries(newServices || {})) {
      const res = await createCategory({ name: key })
      for (const v of value) {
        if (v) {
          const serviceRes = await createService({ category: res.ok ? String(res.data.id) : key, name: v })
          if (!serviceRes.ok) {
            setNotSaved(prev => {
              if (!prev) prev = {}
              prev[key] = prev[key] || []
              prev[key].push(`Erro ao adicionar ${v}`)
              return { ...prev }
            })
          }
        }
      }
    }
    await mutate('services/')
    setNewServices(undefined)
    setFiles(undefined)
  })
  const serviceNumber = Object.values(newServices || {})
    .flat()
    .filter(v => v).length

  async function onFileChange(files?: File[]) {
    setFiles(files)
    if (!files?.[0]) return onClear()
    const newServices = await processCSV(files[0])
    setNewServices(newServices)
  }

  function onClear() {
    setNewServices(undefined)
    setNotSaved(undefined)
  }

  return (
    <div className="space-y-4 p-5">
      <ServicesTable />
      <div className="flex items-end justify-between gap-2">
        <FileInput accept=".csv" multiple={false} value={files} onValueChange={onFileChange}>
          Adicionar serviços via CSV
        </FileInput>
        {newServices && (
          <Button onPress={onSave} isLoading={isSaving}>
            {`Adicionar ${serviceNumber} serviços`}
          </Button>
        )}
      </div>
      {(newServices || notSaved) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {Object.entries(newServices || notSaved || {}).map(([key, value]) => (
            <Card key={key}>
              <Card.Header className="pb-0 font-bold">{key}</Card.Header>
              <Card.Body as="ul" className="list-inside list-disc">
                {value.map((v, i) => v && <li key={i}>{v}</li>)}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
