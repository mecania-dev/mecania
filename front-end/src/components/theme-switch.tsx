'use client'

import { IoMdMoon } from 'react-icons/io'
import { MdSunny } from 'react-icons/md'

import { useTheme } from '@/hooks/use-theme'

export function ThemeSwitch() {
  const { theme, systemTheme, setTheme } = useTheme()
  const acctualTheme = theme === 'system' ? systemTheme : theme
  const ThemeIcon = acctualTheme === 'light' ? MdSunny : IoMdMoon

  function toggleTheme() {
    setTheme(acctualTheme === 'light' ? 'dark' : 'light')
  }

  return <ThemeIcon size={24} className="cursor-pointer" onClick={toggleTheme} />
}
