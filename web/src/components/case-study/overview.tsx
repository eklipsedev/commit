import {Container} from '@/components/ui/container'
import {Tagline} from '@/components/ui/tagline'
import {BodyPortableText} from '@/components/portable-text/body-portable-text'
import type {PortableTextBlock} from '@portabletext/types'

export function CaseStudyOverview({
  body,
  services,
}: {
  body?: PortableTextBlock[]
  services?: {_id?: string; title?: string}[]
}) {
  const items = (services ?? []).filter((s) => s.title)
  const hasBody = Boolean(body?.length)
  if (!hasBody && !items.length) return null

  return (
    <Container className="space-y-8 md:space-y-10">
      <Tagline>Project Overview</Tagline>

      <div className="grid md:grid-cols-2 md:gap-x-14">
        <div className="hidden md:block" aria-hidden />
        <div className="space-y-10 md:space-y-14">
          {hasBody && (
            <BodyPortableText
              value={body}
              className="text-brand-charcoal [&_p]:text-base [&_p]:leading-[1.5] md:[&_p]:text-lg"
            />
          )}
          {items.length > 0 && (
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
          )}
        </div>
      </div>
    </Container>
  )
}
