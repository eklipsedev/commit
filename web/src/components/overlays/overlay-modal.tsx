'use client'

import {cn} from '@/lib/cn'

export const OVERLAY_TRANSITION_MS = 280

export function OverlayCloseIcon({className}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1L11 11M11 1L1 11"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  )
}

type OverlayModalProps = {
  visible: boolean
  onClose: () => void
  background: string
  textColor: string
  header: React.ReactNode
  children?: React.ReactNode
}

/**
 * Shared overlay shell — same size, close control, colors, and enter/exit motion
 * for person and offering (and any future) overlays.
 */
export function OverlayModal({
  visible,
  onClose,
  background,
  textColor,
  header,
  children,
}: OverlayModalProps) {
  const closeStyle = {backgroundColor: textColor, color: background}

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-8">
      <button
        type="button"
        aria-label="Close overlay"
        className={cn(
          'absolute inset-0 bg-black/50 transition-opacity ease-out',
          visible ? 'opacity-100' : 'opacity-0',
        )}
        style={{transitionDuration: `${OVERLAY_TRANSITION_MS}ms`}}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden md:max-w-3xl lg:max-w-4xl',
          'origin-center transition-[opacity,transform] ease-out',
          visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-95 opacity-0',
        )}
        style={{
          backgroundColor: background,
          color: textColor,
          transitionDuration: `${OVERLAY_TRANSITION_MS}ms`,
        }}
      >
        <div className="relative shrink-0 px-8 pt-8 md:px-12 md:pt-12">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full transition-opacity hover:opacity-80 md:right-6 md:top-6"
            style={closeStyle}
          >
            <OverlayCloseIcon className="size-3" />
          </button>
          <div className="pr-10">{header}</div>
        </div>

        {children ? (
          <div className="min-h-0 flex-1 overflow-y-auto px-8 py-8 md:px-12 md:pb-12">{children}</div>
        ) : null}
      </div>
    </div>
  )
}
