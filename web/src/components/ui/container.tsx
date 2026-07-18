import {cn} from '@/lib/cn'

type ContainerProps = React.ComponentProps<'div'> & {
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav'
}

export function Container({as: Tag = 'div', className, children, ...props}: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full max-w-[1320px] px-6 md:px-10 lg:px-14', className)} {...props}>
      {children}
    </Tag>
  )
}
