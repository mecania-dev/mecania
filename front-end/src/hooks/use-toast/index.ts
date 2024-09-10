import * as React from 'react'

import { Action, State, Toast, ToasterToast } from './types'

const DEFAULT_TOAST_LIMIT = 5
const DEFAULT_TOAST_DELAY = 6000

const removeQueue = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string, delay = DEFAULT_TOAST_DELAY) => {
  if (removeQueue.has(toastId)) {
    clearTimeout(removeQueue.get(toastId))
  }

  const timeout = setTimeout(() => {
    removeQueue.delete(toastId)
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId
    })
  }, delay)

  removeQueue.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      const { toast, delay } = action

      addToRemoveQueue(toast.id, delay)

      return {
        ...state,
        toasts: [...state.toasts, action.toast].slice(-DEFAULT_TOAST_LIMIT)
      }

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map(t => (t.id === action.toast.id ? { ...t, ...action.toast } : t))
      }

    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: []
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.toastId)
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach(listener => {
    listener(memoryState)
  })
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

function toast({ delay, ...props }: Toast) {
  const id = genId()

  const update = (props: Partial<ToasterToast>) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id }
    })
  const remove = () => dispatch({ type: 'REMOVE_TOAST', toastId: id })

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      onClose: remove,
      id
    },
    delay
  })

  return {
    id: id,
    update
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast
  }
}

export { useToast, toast }
