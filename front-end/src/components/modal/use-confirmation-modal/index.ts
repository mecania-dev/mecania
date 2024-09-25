import { useEffect, useState } from 'react'

import { Action, ConfirmationModalState } from './types'

export * from './types'

const listeners: Array<(state: ConfirmationModalState) => void> = []

let memoryState: ConfirmationModalState = { isOpen: false }

export const reducer = (state: ConfirmationModalState, action: Action): ConfirmationModalState => {
  switch (action.type) {
    case 'OPEN':
      return { isOpen: true, ...action.modal }

    case 'CLOSE':
      return { isOpen: false, size: state.size }
  }
}

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach(listener => {
    listener(memoryState)
  })
}

export function closeConfirmationModal() {
  dispatch({ type: 'CLOSE' })
}

export function confirmationModal(modal: Omit<ConfirmationModalState, 'isOpen'>) {
  dispatch({ type: 'OPEN', modal })
}
confirmationModal.close = closeConfirmationModal

export function useConfirmationModal() {
  const [state, setState] = useState<ConfirmationModalState>(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  function setIsLoading(isLoading: boolean) {
    setState(prev => ({ ...prev, isLoading }))
  }

  return {
    ...state,
    setIsLoading,
    confirmationModal
  }
}
