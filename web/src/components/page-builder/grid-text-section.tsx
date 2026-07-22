'use client'

import Link from 'next/link'
import {useCallback, useRef, useState} from 'react'
import {cn} from '@/lib/cn'
import {colorHex} from '@/lib/colors'
import {resolveLinkHref, resolveLinkLabel} from '@/lib/links'
import {Container} from '@/components/ui/container'
import {Heading} from '@/components/ui/heading'
import {Section} from '@/components/ui/section'
import {Tagline} from '@/components/ui/tagline'
import type {PageBuilderBlock} from '@/sanity/types'

type GridTextItem = {
  _key?: string
  title?: string
  body?: string
  link?: import('@/lib/links').LinkValue
}

type GridTextBlock = PageBuilderBlock & {
  tagline?: string
  items?: GridTextItem[]
}

const COLUMN_CLASSES = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
} as const

function GridTextCard({
  item,
  buttonBg,
  buttonText,
}: {
  item: GridTextItem
  buttonBg: string
  buttonText: string
}) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [hovered, setHovered] = useState(false)
  const [cursor, setCursor] = useState({x: 0, y: 0})

  const href = resolveLinkHref(item.link)
  const linkLabel = resolveLinkLabel(item.link, 'Learn More')
  const external = item.link?.linkType === 'external' && item.link.openInNewTab

  const updateCursor = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    setCursor({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }, [])

  const content = (
    <>
      <Heading as="h3" size="md" style={{color: 'var(--section-heading)'}}>
        {item.title}
      </Heading>
      {item.body && (
        <p
          className="text-sm leading-relaxed md:text-base"
          style={{color: 'var(--section-body)'}}
        >
          {item.body}
        </p>
      )}
    </>
  )

  if (!href) {
    return <div className="space-y-4">{content}</div>
  }

  return (
    <Link
      ref={cardRef}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onMouseEnter={(event) => {
        setHovered(true)
        updateCursor(event)
      }}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={updateCursor}
      className="group relative block space-y-4 text-left"
    >
      {content}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute z-10 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-opacity duration-200',
          hovered ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          left: cursor.x,
          top: cursor.y,
          transform: 'translate(0.5rem, calc(-100% - 0.5rem))',
          backgroundColor: buttonBg,
          color: buttonText,
        }}
      >
        {linkLabel || 'Learn More'}
      </span>
    </Link>
  )
}

export function GridTextSection({block}: {block: GridTextBlock}) {
  const buttonBg = colorHex(block.accentColor, 'burnt-orange')
  const buttonText = colorHex('white')
  const items = block.items ?? []
  const columns = Math.min(Math.max(items.length, 1), 4) as 1 | 2 | 3 | 4

  return (
    <Section {...block}>
      <Container className="space-y-10">
        {block.tagline && (
          <Tagline showRule={block.showTaglineRule !== false}>{block.tagline}</Tagline>
        )}
        <div className={cn('grid gap-8', COLUMN_CLASSES[columns])}>
          {items.map((item) => (
            <GridTextCard
              key={item._key ?? item.title}
              item={item}
              buttonBg={buttonBg}
              buttonText={buttonText}
            />
          ))}
        </div>
      </Container>
    </Section>
  )
}
