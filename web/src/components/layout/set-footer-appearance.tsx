'use client'

import {createContext, useContext, useEffect, useMemo, useState, type ReactNode} from 'react'
import type {FooterAppearance} from '@/sanity/types'

const FooterAppearanceContext = createContext<{
  appearance: FooterAppearance | null
  setAppearance: (appearance: FooterAppearance | null) => void
} | null>(null)

export function FooterAppearanceProvider({children}: {children: ReactNode}) {
  const [appearance, setAppearance] = useState<FooterAppearance | null>(null)
  const value = useMemo(() => ({appearance, setAppearance}), [appearance])
  return <FooterAppearanceContext.Provider value={value}>{children}</FooterAppearanceContext.Provider>
}

export function useFooterAppearance() {
  const ctx = useContext(FooterAppearanceContext)
  if (!ctx) return {appearance: null, setAppearance: () => {}}
  return ctx
}

export function SetFooterAppearance({appearance}: {appearance?: FooterAppearance | null}) {
  const {setAppearance} = useFooterAppearance()

  useEffect(() => {
    setAppearance(appearance ?? null)
    return () => setAppearance(null)
  }, [appearance, setAppearance])

  return null
}
