'use client'

import {useIsPresentationTool} from 'next-sanity/hooks'

export function DisableDraftMode() {
  const isPresentation = useIsPresentationTool()

  // Hide inside Presentation Tool iframe
  if (isPresentation) {
    return null
  }

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 right-4 z-50 rounded bg-neutral-900 px-4 py-2 text-sm text-white"
    >
      Disable draft mode
    </a>
  )
}
