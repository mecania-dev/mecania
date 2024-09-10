import { useState } from 'react'

import { isFunction } from '@/lib/assertions'

export function useArrayState<T>(initialState: T[] = []) {
  const [state, setState] = useState<T[]>(initialState)

  function add(value: T) {
    setState(prev => [...prev, value])
  }

  function update(index: number, value: T | ((prev: T) => T)) {
    setState(prev => prev.map((item, i) => (i === index ? (isFunction(value) ? value(item) : value) : item)))
  }

  function remove(index: number) {
    setState(prev => prev.filter((_, i) => i !== index))
  }

  const actions = {
    add,
    update,
    remove
  }

  return [state, actions, setState] as const
}
