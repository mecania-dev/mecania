import { useEffect, useState } from 'react'

export function useRefChange(ref?: React.RefObject<HTMLElement> | null, callback?: (ref?: HTMLElement | null) => void) {
  const [current, setCurrent] = useState(ref?.current)

  useEffect(() => {
    if (current !== ref?.current) {
      setCurrent(ref?.current)
      if (callback) callback(ref?.current)
    }
  }, [ref, current, callback])

  return ref
}
