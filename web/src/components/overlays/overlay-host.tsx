'use client'

import {useEffect, useState} from 'react'
import {
  getOverlayTheme,
  OfferingOverlayBody,
  OfferingOverlayHeader,
  PersonOverlayBody,
  PersonOverlayHeader,
} from '@/components/overlays/overlay-content'
import {OverlayModal, OVERLAY_TRANSITION_MS} from '@/components/overlays/overlay-modal'
import {useOverlay} from '@/components/overlays/overlay-provider'
import type {OfferingCard, PersonCard} from '@/sanity/types'

export function OverlayHost() {
  const {person, offering, close} = useOverlay()
  const open = Boolean(person || offering)

  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [activePerson, setActivePerson] = useState<PersonCard | null>(null)
  const [activeOffering, setActiveOffering] = useState<OfferingCard | null>(null)

  useEffect(() => {
    if (open) {
      setActivePerson(person)
      setActiveOffering(offering)
      setMounted(true)
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
      return () => cancelAnimationFrame(frame)
    }

    setVisible(false)
    const timeout = window.setTimeout(() => {
      setMounted(false)
      setActivePerson(null)
      setActiveOffering(null)
    }, OVERLAY_TRANSITION_MS)
    return () => window.clearTimeout(timeout)
  }, [open, person, offering])

  useEffect(() => {
    if (!mounted) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [mounted, close])

  if (!mounted) return null

  const theme = getOverlayTheme(activeOffering, activePerson)

  return (
    <OverlayModal
      visible={visible}
      onClose={close}
      background={theme.background}
      textColor={theme.text}
      header={
        activePerson ? (
          <PersonOverlayHeader person={activePerson} />
        ) : activeOffering ? (
          <OfferingOverlayHeader offering={activeOffering} />
        ) : null
      }
    >
      {activePerson ? <PersonOverlayBody person={activePerson} /> : null}
      {activeOffering ? <OfferingOverlayBody offering={activeOffering} /> : null}
    </OverlayModal>
  )
}
