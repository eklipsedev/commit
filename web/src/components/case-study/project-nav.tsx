import Link from 'next/link'
import {Container} from '@/components/ui/container'
import {HEADING_SIZE_CLASSES} from '@/lib/heading-styles'

type Sibling = {_id: string; title?: string; slug?: string}

export function CaseStudyProjectNav({
  currentId,
  siblings,
}: {
  currentId?: string
  siblings?: Sibling[]
}) {
  if (!siblings?.length || !currentId) return null

  const index = siblings.findIndex((project) => project._id === currentId)
  if (index === -1) return null

  const prev = siblings[(index - 1 + siblings.length) % siblings.length]
  const next = siblings[(index + 1) % siblings.length]

  if (siblings.length < 2) return null

  return (
    <Container>
      <nav
        aria-label="Project navigation"
        className="flex items-start justify-between gap-8 md:gap-12"
      >
        <Link
          href={`/work/${prev.slug}`}
          className="group min-w-0 flex-1 space-y-2 text-brand-charcoal"
        >
          <p className="font-mono text-xs tracking-normal md:text-sm">Previous</p>
          <p
            className={`${HEADING_SIZE_CLASSES.h3} break-words underline-offset-4 group-hover:underline`}
          >
            {prev.title}
          </p>
        </Link>

        <Link
          href={`/work/${next.slug}`}
          className="group min-w-0 flex-1 space-y-2 text-right text-brand-charcoal"
        >
          <p className="font-mono text-xs tracking-normal md:text-sm">Next</p>
          <p
            className={`${HEADING_SIZE_CLASSES.h3} break-words underline-offset-4 group-hover:underline`}
          >
            {next.title}
          </p>
        </Link>
      </nav>
    </Container>
  )
}
