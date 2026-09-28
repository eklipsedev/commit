'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {colorHex} from '@/lib/colors'
import {Container} from '@/components/ui/container'
import {FadeIn} from '@/components/ui/fade-in'
import {SanityImage} from '@/components/ui/sanity-image'
import {Section} from '@/components/ui/section'
import type {PageBuilderBlock, SanityImage as SanityImageType} from '@/sanity/types'

type LogoImage = SanityImageType & {
  dimensions?: {width?: number; height?: number}
}

type LogoDocument = {
  _id?: string
  name?: string
  image?: LogoImage
  /** 40–100. Missing means fill the frame. */
  scale?: number
  href?: string
  projectSlug?: string
}

function logoScale(scale?: number) {
  if (typeof scale !== 'number' || Number.isNaN(scale)) return 100
  return Math.min(100, Math.max(40, scale))
}

/** Pixel size of the artwork after a Sanity crop, so the row can hug the mark. */
function logoPixelSize(image?: LogoImage) {
  const width = image?.dimensions?.width
  const height = image?.dimensions?.height
  if (!width || !height) return {width: 160, height: 56}
  const crop = image.crop
  if (!crop) return {width, height}
  return {
    width: Math.max(1, Math.round(width * (1 - (crop.left ?? 0) - (crop.right ?? 0)))),
    height: Math.max(1, Math.round(height * (1 - (crop.top ?? 0) - (crop.bottom ?? 0)))),
  }
}

type LogosBlock = PageBuilderBlock & {
  variant?: 'fullWidth' | 'limited'
  logos?: LogoDocument[]
}

function resolveLogoHref(logo: LogoDocument) {
  if (logo.projectSlug) return `/work/${logo.projectSlug}`
  if (logo.href) return logo.href
  return null
}

function LogoItemView({logo}: {logo: LogoDocument}) {
  const href = resolveLogoHref(logo)
  const alt = logo.image?.alt || logo.name || 'Logo'
  const scale = logoScale(logo.scale)
  const pixels = logoPixelSize(logo.image)
  const content = (
    <div
      className="flex h-12 shrink-0 items-center grayscale md:h-14"
      style={{['--logo-scale' as string]: String(scale / 100)}}
    >
      {logo.image && (
        <SanityImage
          image={logo.image}
          alt={alt}
          width={pixels.width}
          height={pixels.height}
          sizes="160px"
          style={{width: 'auto', height: 'auto'}}
          className="w-auto object-contain max-h-[calc(var(--logo-scale)*3rem)] max-w-[calc(var(--logo-scale)*8rem)] md:max-h-[calc(var(--logo-scale)*3.5rem)] md:max-w-[calc(var(--logo-scale)*10rem)]"
        />
      )}
    </div>
  )

  if (!href) return content

  const external = href.startsWith('http')
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="shrink-0">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className="shrink-0">
      {content}
    </Link>
  )
}

/**
 * Enough repeats that a short set still covers a wide screen before measurement.
 * ResizeObserver then keeps one extra set off to the right so the loop never gaps.
 */
const MARQUEE_COPIES_BEFORE_MEASURE = 4

function LogoMarquee({logos}: {logos: LogoDocument[]}) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [setEl, setSetEl] = useState<HTMLDivElement | null>(null)
  const [copies, setCopies] = useState(MARQUEE_COPIES_BEFORE_MEASURE)
  const [shift, setShift] = useState(0)

  useEffect(() => {
    if (!container || !setEl) return

    const measure = () => {
      const setWidth = setEl.getBoundingClientRect().width
      const view = container.getBoundingClientRect().width
      if (setWidth <= 0 || view <= 0) return
      // One full set must remain offscreen after the shift, or the right edge goes blank.
      const needed = Math.ceil(view / setWidth) + 1
      setCopies(Math.max(2, needed))
      setShift(setWidth)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    observer.observe(setEl)
    return () => observer.disconnect()
  }, [container, setEl, logos.length])

  return (
    <div ref={setContainer} className="relative overflow-hidden">
      <div
        className="marquee-track flex w-max"
        style={shift > 0 ? ({['--marquee-shift' as string]: `${shift}px`} as React.CSSProperties) : undefined}
      >
        {Array.from({length: copies}, (_, copy) => (
          <div
            key={copy}
            ref={copy === 0 ? setSetEl : undefined}
            className="flex shrink-0 items-center gap-8 pr-8 md:gap-16 md:pr-16"
            aria-hidden={copy > 0}
            inert={copy > 0}
          >
            {logos.map((logo, index) => (
              <LogoItemView key={`${logo._id ?? logo.name ?? index}-${copy}`} logo={logo} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function MarqueeEdgeFade({side, color}: {side: 'left' | 'right'; color: string}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 z-10 w-16 md:w-24 ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
      style={{
        background:
          side === 'left'
            ? `linear-gradient(to right, ${color}, transparent)`
            : `linear-gradient(to left, ${color}, transparent)`,
      }}
    />
  )
}

export function LogosSection({block}: {block: LogosBlock}) {
  const logos = (block.logos ?? []).filter((logo) => logo?.image || logo?.name)
  if (!logos.length) return null

  if (block.variant === 'limited') {
    return (
      <Section {...block}>
        <Container>
          <FadeIn>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 md:gap-x-14">
              {logos.slice(0, 6).map((logo) => (
                <LogoItemView key={logo._id ?? logo.name} logo={logo} />
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>
    )
  }

  const fadeColor = colorHex(block.backgroundColor, 'white')

  return (
    <Section {...block} className="overflow-hidden">
      <FadeIn>
        <div className="relative">
          <MarqueeEdgeFade side="left" color={fadeColor} />
          <MarqueeEdgeFade side="right" color={fadeColor} />
          <LogoMarquee logos={logos} />
        </div>
      </FadeIn>
    </Section>
  )
}
