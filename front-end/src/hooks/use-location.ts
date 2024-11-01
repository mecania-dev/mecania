import { useEffect, useState } from 'react'

export function useLocation() {
  const [location, setLocation] = useState<{ lat: number; lon: number }>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          })
        },
        error => {
          setError(error.message)
        }
      )
    } else {
      setError('Geolocation is not supported by this browser.')
    }
  }, [])

  return { ...location, error }
}
