'use client'

import {useLayoutEffect} from 'react'

/**
 * Sets the page canvas color for the current route and clears it on leave.
 * The sticky nav reads `--page-background`, so it stays the same color.
 */
export function SetPageBackground({color}: {color: string}) {
  useLayoutEffect(() => {
    const root = document.documentElement
    const previousBody = document.body.style.backgroundColor
    const previousVar = root.style.getPropertyValue('--page-background')
    document.body.style.backgroundColor = color
    root.style.setProperty('--page-background', color)
    return () => {
      document.body.style.backgroundColor = previousBody
      if (previousVar) root.style.setProperty('--page-background', previousVar)
      else root.style.removeProperty('--page-background')
    }
  }, [color])

  return null
}
