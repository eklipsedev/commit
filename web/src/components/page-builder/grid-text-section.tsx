import Link from 'next/link'
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

export function GridTextSection({block}: {block: GridTextBlock}) {
  const accent = colorHex(block.accentColor, 'charcoal')

  return (
    <Section {...block}>
      <Container className="space-y-10">
        {block.tagline && <Tagline>{block.tagline}</Tagline>}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {block.items?.map((item) => {
            const href = resolveLinkHref(item.link)
            const linkLabel = resolveLinkLabel(item.link, 'Learn More')
            return (
              <div key={item._key ?? item.title} className="group space-y-4 border-t border-current/15 pt-6">
                <Heading
                  as="h3"
                  size="md"
                  style={{color: 'var(--section-heading)'}}
                >
                  {item.title}
                </Heading>
                {item.body && (
                  <p className="text-sm leading-relaxed md:text-base" style={{color: 'var(--section-body)'}}>
                    {item.body}
                  </p>
                )}
                {href && (
                  <Link
                    href={href}
                    className="inline-block font-mono text-sm underline-offset-4 transition-colors hover:underline"
                    style={{color: accent}}
                  >
                    {linkLabel}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
