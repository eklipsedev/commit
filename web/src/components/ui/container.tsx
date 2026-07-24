import {cn} from '@/lib/cn'

type ContainerProps = React.ComponentProps<'div'> & {
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav'
}

export function Container({as: Tag = 'div', className, children, ...props}: ContainerProps) {
  return (
    <Tag
      className={cn(
        // Padding only at 1440px and below — scoped with max-* so lg/md
        // utilities cannot override a min-* px-0 above that breakpoint.
        'mx-auto w-full max-w-[1320px]',
        'max-[1440px]:px-6 md:max-[1440px]:px-10 lg:max-[1440px]:px-14',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
