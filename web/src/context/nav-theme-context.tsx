'use client'

import {createContext, useContext, useMemo, useState, type ReactNode} from 'react'

type NavTheme = 'light' | 'dark'

const NavThemeContext = createContext<{
  theme: NavTheme
  setTheme: (theme: NavTheme) => void
} | null>(null)

export function NavThemeProvider({children, initialTheme = 'light'}: {children: ReactNode; initialTheme?: NavTheme}) {
  const [theme, setTheme] = useState<NavTheme>(initialTheme)
  const value = useMemo(() => ({theme, setTheme}), [theme])
  return <NavThemeContext.Provider value={value}>{children}</NavThemeContext.Provider>
}

export function useNavTheme() {
  const ctx = useContext(NavThemeContext)
  if (!ctx) return {theme: 'light' as NavTheme, setTheme: () => {}}
  return ctx
}
