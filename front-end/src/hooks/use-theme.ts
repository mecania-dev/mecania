import { useTheme as useNextThemesTheme } from 'next-themes'

export function useTheme() {
  const theme = useNextThemesTheme()
  const acctualTheme = theme.theme === 'system' ? theme.systemTheme : theme.theme

  return {
    ...theme,
    theme: acctualTheme,
    isSystem: theme.theme === 'system'
  }
}
