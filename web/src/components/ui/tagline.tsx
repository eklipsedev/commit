import {cn} from '@/lib/cn'
import {Rule} from '@/components/ui/rule'

type TaglineProps = {
  children: React.ReactNode
  className?: string
  showRule?: boolean
}

export function Tagline({children, className, showRule = true}: TaglineProps) {
  if (!children) return null

  return (
    <div
      className={cn(
        'w-full',
        // On phones the headline below reads farther from the rule than the
        // mono text above; open the top here, and the rule pulls the next block up.
        showRule && 'space-y-6 md:space-y-4',
        className,
      )}
    >
      <p
        className="font-mono text-xs tracking-normal normal-case md:text-sm"
        style={{color: 'var(--section-tagline, var(--foreground))'}}
      >
        {children}
      </p>
      {/* Negative margin on the rule adds to whatever gap the parent sets below. */}
      {showRule && <Rule className="max-md:-mb-2" />}
    </div>
  )
}
