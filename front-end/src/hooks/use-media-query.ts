'use client'

import { useEffect, useState } from 'react'

import { isServer } from '@/lib/assertions'

import { useFirstRenderEffect } from './use-first-render-effect'

const sizes = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

export type Sizes = typeof sizes

interface UseMediaQueryProps {
  size?: keyof Sizes | number
}

export interface UseMediaQueryResponse {
  matches: boolean
  systemTheme: 'light' | 'dark'
  screenSize: {
    width: number
    height: number
  }
  sizes: Sizes
}

function getSystemTheme() {
  if (isServer) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getScreenMatch(size: keyof Sizes | number) {
  if (isServer || !size) return false
  const screenSize = typeof size === 'number' ? size : sizes[size]
  const mql = window.matchMedia(`(max-width: ${screenSize}px)`)
  return mql.matches
}

export function useMediaQuery({ size = 0 }: UseMediaQueryProps = { size: 0 }): UseMediaQueryResponse {
  const [systemTheme, setSystemTheme] = useState<UseMediaQueryResponse['systemTheme']>(getSystemTheme())
  const [matches, setMatches] = useState(getScreenMatch(size))
  const [screenSize, setScreenSize] = useState({
    width: isServer ? 0 : window.innerWidth,
    height: isServer ? 0 : window.innerHeight
  })

  useFirstRenderEffect(() => {
    function handleSystemThemeChange(e: MediaQueryListEvent) {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    function handleResize() {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    const isSystemDarkMQ = window.matchMedia('(prefers-color-scheme: dark)')
    isSystemDarkMQ.addEventListener('change', handleSystemThemeChange)
    window.addEventListener('resize', handleResize)

    return () => {
      isSystemDarkMQ.removeEventListener('change', handleSystemThemeChange)
      window.removeEventListener('resize', handleResize)
    }
  })

  useEffect(() => {
    const screenSize = typeof size === 'number' ? size : sizes[size]
    const mql = window.matchMedia(`(max-width: ${screenSize}px)`)

    mql.addEventListener('change', resize)

    function resize(e: MediaQueryListEvent) {
      setMatches(e.matches)
    }

    return () => {
      mql.removeEventListener('change', resize)
    }
  }, [size])

  return { systemTheme, matches, screenSize, sizes }
}
