'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useRef, useState} from 'react'
import {CommitWordmark} from '@/components/brand/commit-wordmark'
import {useIntroLogo} from '@/components/layout/intro-logo-context'
import {cn} from '@/lib/cn'
import {resolveLinkHref, resolveLinkLabel} from '@/lib/links'
import {DotButton} from '@/components/ui/dot-button'
import {Container} from '@/components/ui/container'
import type {NavigationData, NavItem} from '@/sanity/types'

type NavbarProps = {
  data?: NavigationData | null
  variant?: 'light' | 'dark'
}

function NavLink({
  item,
  variant,
  pathname,
}: {
  item: NavItem
  variant: 'light' | 'dark'
  pathname: string
}) {
  const href = resolveLinkHref(item.link)
  if (!href) return null

  const label = item.label || resolveLinkLabel(item.link)
  const active = pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={cn(
        'font-mono text-sm transition-colors',
        variant === 'dark' ? 'text-white/70 hover:text-white' : 'text-brand-charcoal',
        'underline-offset-4 hover:underline',
        active && 'underline',
      )}
    >
      {label}
    </Link>
  )
}

function flattenNavItems(items?: NavItem[]) {
  const flat: NavItem[] = []
  for (const item of items ?? []) {
    flat.push(item)
    if (item.children?.length) flat.push(...item.children)
  }
  return flat
}

export function Navbar({data, variant = 'light'}: NavbarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navItems = flattenNavItems(data?.items)
  const {logoRef, introActive} = useIntroLogo()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40',
        variant === 'dark' ? 'bg-black text-white' : 'bg-brand-white/95 text-brand-charcoal backdrop-blur-sm',
      )}
    >
      <Container className="space-y-2 pt-2 md:pt-3">
        <nav className="flex h-14 items-center justify-between gap-6 md:h-16">
          <Link
            href="/"
            ref={logoRef}
            className={cn(
              'relative z-10 shrink-0 transition-opacity duration-200',
              introActive && 'opacity-0',
            )}
            aria-label="Commit home"
          >
            <CommitWordmark
              className={cn(
                'h-7 w-auto',
                variant === 'dark' ? 'text-white' : 'text-brand-charcoal',
              )}
              periodClassName="fill-brand-yellow"
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <div className="flex items-center gap-6">
              {data?.items?.map((item) => (
                <NavLink
                  key={item._key ?? item.label}
                  item={item}
                  variant={variant}
                  pathname={pathname}
                />
              ))}
            </div>
            {data?.button && (
              <DotButton
                button={data.button}
                tone={variant === 'dark' ? 'dark' : 'light'}
              />
            )}
          </div>

          <div ref={menuRef} className="relative md:hidden">
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="true"
              onClick={() => setOpen((v) => !v)}
              className={cn(
                'font-mono text-sm tracking-normal',
                variant === 'dark' ? 'text-white' : 'text-brand-charcoal',
              )}
            >
              Menu
            </button>
            {open && (
              <div
                className={cn(
                  'absolute right-0 top-full mt-2 min-w-[12rem] rounded-md border py-2 shadow-lg',
                  variant === 'dark'
                    ? 'border-white/10 bg-black text-white'
                    : 'border-neutral-200 bg-brand-white text-brand-charcoal',
                )}
              >
                {navItems.map((item) => {
                  const href = resolveLinkHref(item.link)
                  const label = item.label || resolveLinkLabel(item.link)
                  if (!href) return null
                  return (
                    <Link
                      key={item._key ?? label}
                      href={href}
                      className="block px-4 py-2 font-mono text-sm underline-offset-4 hover:underline"
                    >
                      {label}
                    </Link>
                  )
                })}
                {data?.button?.label && (
                  <div className="mt-2 border-t border-brand-charcoal px-4 pt-2">
                    <DotButton
                      button={data.button}
                      tone={variant === 'dark' ? 'dark' : 'light'}
                      className="w-full justify-center"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Same rule weight as Tagline <hr>; tighter gap than section taglines */}
        <hr
          className={cn(
            'w-full border-0 border-t',
            variant === 'dark' ? 'border-white' : 'border-brand-charcoal',
          )}
        />
      </Container>
    </header>
  )
}
