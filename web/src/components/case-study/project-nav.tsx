import Link from 'next/link'
import {Container} from '@/components/ui/container'
import {cn} from '@/lib/cn'
import {headingClassName} from '@/lib/heading-styles'

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
        className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-12"
      >
        <Link
          href={`/work/${prev.slug}`}
          className="group min-w-0 space-y-1 self-start text-left text-brand-charcoal md:flex-1"
        >
          <p className="font-mono text-xs leading-none tracking-normal md:text-sm">Previous</p>
          <p
            className={cn(
              headingClassName('h3', 'sans'),
              'break-words leading-none underline-offset-4 group-hover:underline',
            )}
          >
            {prev.title}
          </p>
        </Link>

        <Link
          href={`/work/${next.slug}`}
          className="group min-w-0 space-y-1 self-end text-right text-brand-charcoal md:flex-1"
        >
          <p className="font-mono text-xs leading-none tracking-normal md:text-sm">Next</p>
          <p
            className={cn(
              headingClassName('h3', 'sans'),
              'break-words leading-none underline-offset-4 group-hover:underline',
            )}
          >
            {next.title}
          </p>
        </Link>
      </nav>
    </Container>
  )
}
