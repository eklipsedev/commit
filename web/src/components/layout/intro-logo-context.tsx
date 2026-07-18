'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'

type IntroLogoContextValue = {
  logoRef: RefObject<HTMLAnchorElement | null>
  introActive: boolean
  setIntroActive: (active: boolean) => void
}

const IntroLogoContext = createContext<IntroLogoContextValue | null>(null)

export function IntroLogoProvider({children}: {children: ReactNode}) {
  const logoRef = useRef<HTMLAnchorElement | null>(null)
  const [introActive, setIntroActiveState] = useState(false)

  const setIntroActive = useCallback((active: boolean) => {
    setIntroActiveState(active)
  }, [])

  const value = useMemo(
    () => ({logoRef, introActive, setIntroActive}),
    [introActive, setIntroActive],
  )

  return <IntroLogoContext.Provider value={value}>{children}</IntroLogoContext.Provider>
}

export function useIntroLogo() {
  const ctx = useContext(IntroLogoContext)
  if (!ctx) {
    throw new Error('useIntroLogo must be used within IntroLogoProvider')
  }
  return ctx
}
