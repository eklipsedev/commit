'use client'

import {useEffect} from 'react'

/** Sets `document.body` background for the current route; clears on leave. */
export function SetPageBackground({color}: {color: string}) {
  useEffect(() => {
    const previous = document.body.style.backgroundColor
    document.body.style.backgroundColor = color
    return () => {
      document.body.style.backgroundColor = previous
    }
  }, [color])

  return null
}
