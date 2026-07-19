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
    <div className={cn('w-full', showRule && 'space-y-4', className)}>
      <p
        className="font-mono text-xs tracking-normal md:text-sm"
        style={{color: 'var(--section-tagline, var(--foreground))'}}
      >
        {children}
      </p>
      {showRule && <Rule />}
    </div>
  )
}
