import Link from 'next/link'
import {colorHex} from '@/lib/colors'
import {Container} from '@/components/ui/container'
import {SanityImage} from '@/components/ui/sanity-image'
import {Section} from '@/components/ui/section'
import type {PageBuilderBlock, SanityImage as SanityImageType} from '@/sanity/types'

type LogoDocument = {
  _id?: string
  name?: string
  image?: SanityImageType
  href?: string
  projectSlug?: string
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
  const content = (
    <div className="flex h-12 w-32 shrink-0 items-center justify-center grayscale md:h-14 md:w-40">
      {logo.image && (
        <SanityImage image={logo.image} alt={alt} className="max-h-full max-w-full object-contain" />
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
      <Section {...block} className="py-10">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-16">
            {logos.slice(0, 6).map((logo) => (
              <LogoItemView key={logo._id ?? logo.name} logo={logo} />
            ))}
          </div>
        </Container>
      </Section>
    )
  }

  const duplicated = [...logos, ...logos]
  const fadeColor = colorHex(block.backgroundColor, 'white')

  return (
    <Section {...block} className="overflow-hidden py-10">
      <div className="relative">
        <MarqueeEdgeFade side="left" color={fadeColor} />
        <MarqueeEdgeFade side="right" color={fadeColor} />
        <div className="flex">
          <div className="marquee-track flex min-w-max items-center gap-6 md:gap-20">
            {duplicated.map((logo, i) => (
              <LogoItemView key={`${logo._id ?? logo.name}-${i}`} logo={logo} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
