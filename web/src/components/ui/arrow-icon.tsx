import {cn} from '@/lib/cn'

type ArrowIconProps = {
  direction?: 'left' | 'right'
  className?: string
}

/** Line arrow from Commit design system (`design/icons/arrow-left.png`). */
export function ArrowIcon({direction = 'left', className}: ArrowIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 26"
      fill="none"
      aria-hidden="true"
      className={cn(direction === 'right' && 'rotate-180', className)}
    >
      <path
        d="M30.5 13H3.5M3.5 13L11.5 5M3.5 13L11.5 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  )
}
