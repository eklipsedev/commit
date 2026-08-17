'use client'

import {useId, useState} from 'react'
import {Container} from '@/components/ui/container'
import {FadeIn} from '@/components/ui/fade-in'
import {Rule} from '@/components/ui/rule'
import {BodyPortableText} from '@/components/portable-text/body-portable-text'
import {cn} from '@/lib/cn'
import type {PortableTextBlock} from '@portabletext/types'

export function CaseStudyOverview({
  body,
  services,
  collapsible = true,
}: {
  body?: PortableTextBlock[]
  services?: {_id?: string; title?: string}[]
  /** When false the body is always visible and the (+) toggle is hidden. */
  collapsible?: boolean
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const items = (services ?? []).filter((s) => s.title)
  const hasBody = Boolean(body?.length)
  if (!hasBody && !items.length) return null

  const isCollapsible = hasBody && collapsible
  const bodyVisible = hasBody && (!isCollapsible || open)

  const bodyMarkup = hasBody ? (
    <BodyPortableText
      value={body}
      className={cn(
        'text-brand-charcoal [&_p]:text-base [&_p]:leading-[1.5] md:[&_p]:text-lg',
        items.length > 0 && 'pb-10 md:pb-14',
      )}
    />
  ) : null

  return (
    <Container className="space-y-8 md:space-y-10">
      <FadeIn>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-xs tracking-normal normal-case text-brand-charcoal md:text-sm">
              Project Overview
            </p>
            {isCollapsible ? (
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                aria-label={open ? 'Close project overview' : 'Open project overview'}
                onClick={() => setOpen((value) => !value)}
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full',
                  'border border-brand-charcoal text-brand-charcoal',
                  'transition-opacity hover:opacity-70',
                )}
              >
                <PlusIcon
                  className={cn(
                    'size-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    open && 'rotate-45',
                  )}
                />
              </button>
            ) : null}
          </div>
          <Rule />
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-2 md:gap-x-14">
        <div className="hidden md:block" aria-hidden />
        <FadeIn>
          {isCollapsible ? (
            <div
              id={panelId}
              className={cn(
                'grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden" aria-hidden={!bodyVisible}>
                {bodyMarkup}
              </div>
            </div>
          ) : (
            bodyMarkup
          )}

          {items.length > 0 ? (
            <ul className="grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2">
              {items.map((item) => (
                <li
                  key={item._id ?? item.title}
                  className="text-base leading-snug text-brand-charcoal md:text-lg"
                >
                  {item.title}
                </li>
              ))}
            </ul>
          ) : null}
        </FadeIn>
      </div>
    </Container>
  )
}

function PlusIcon({className}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 1V11M1 6H11"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  )
}
