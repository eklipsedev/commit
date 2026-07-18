'use client'

import {createContext, useCallback, useContext, useMemo, useState, type ReactNode} from 'react'
import type {OfferingCard, PersonCard} from '@/sanity/types'

type OverlayContextValue = {
  person: PersonCard | null
  offering: OfferingCard | null
  openPerson: (person: PersonCard) => void
  openOffering: (offering: OfferingCard) => void
  close: () => void
}

const OverlayContext = createContext<OverlayContextValue | null>(null)

export function OverlayProvider({children}: {children: ReactNode}) {
  const [person, setPerson] = useState<PersonCard | null>(null)
  const [offering, setOffering] = useState<OfferingCard | null>(null)

  const close = useCallback(() => {
    setPerson(null)
    setOffering(null)
  }, [])

  const openPerson = useCallback((p: PersonCard) => {
    setOffering(null)
    setPerson(p)
  }, [])

  const openOffering = useCallback((o: OfferingCard) => {
    setPerson(null)
    setOffering(o)
  }, [])

  const value = useMemo(
    () => ({person, offering, openPerson, openOffering, close}),
    [person, offering, openPerson, openOffering, close],
  )

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>
}

export function useOverlay() {
  const ctx = useContext(OverlayContext)
  if (!ctx) throw new Error('useOverlay must be used within OverlayProvider')
  return ctx
}
