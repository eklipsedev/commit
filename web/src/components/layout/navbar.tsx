'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useId, useRef, useState} from 'react'
import {createPortal} from 'react-dom'
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

function isActivePath(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(href))
}

function navLinkClass(variant: 'light' | 'dark', active?: boolean) {
  return cn(
    'font-mono text-sm tracking-normal transition-colors',
    variant === 'dark' ? 'text-white/70 hover:text-white' : 'text-brand-charcoal',
    'underline-offset-4 hover:underline',
    active && 'underline',
  )
}

/**
 * Dropdown item hover: charcoal underline (same language as top-level nav).
 * Avoids a second yellow-dot motif competing with Get Started.
 */
function DropdownLink({
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
  const active = isActivePath(pathname, href)

  return (
    <li>
      <Link
        href={href}
        className={cn(
          'inline-block whitespace-nowrap font-mono text-sm tracking-normal underline-offset-4',
          'transition-colors hover:underline',
          variant === 'dark' ? 'text-white/80 hover:text-white' : 'text-brand-charcoal',
          active && 'underline',
        )}
      >
        {label}
      </Link>
    </li>
  )
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
  const label = item.label || resolveLinkLabel(item.link)
  const children = item.children?.filter((child) => resolveLinkHref(child.link)) ?? []
  const hasMenu = children.length > 0
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const menuId = useId()

  const active =
    (href ? isActivePath(pathname, href) : false) ||
    children.some((child) => {
      const childHref = resolveLinkHref(child.link)
      return childHref ? isActivePath(pathname, childHref) : false
    })

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  function openMenu() {
    clearCloseTimer()
    setOpen(true)
  }

  function scheduleClose() {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  useEffect(() => () => clearCloseTimer(), [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  if (!hasMenu) {
    if (!href) return null
    return (
      <Link href={href} className={navLinkClass(variant, active)}>
        {label}
      </Link>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocusCapture={openMenu}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setOpen(false)
        }
      }}
    >
      {href ? (
        <Link
          href={href}
          className={navLinkClass(variant, active || open)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls={menuId}
        >
          {label}
        </Link>
      ) : (
        <button
          type="button"
          className={navLinkClass(variant, active || open)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          {label}
        </button>
      )}

      <div
        id={menuId}
        hidden={!open}
        className={cn(
          'absolute left-0 top-full z-50 pt-3',
          !open && 'pointer-events-none',
        )}
      >
        {/*
          Open list under the parent — solid header-matching surface so hero
          type doesn’t show through; no card chrome (matches the mock).
        */}
        <ul
          className={cn(
            'min-w-max space-y-2.5 p-4',
            variant === 'dark' ? 'bg-black' : 'bg-brand-white',
          )}
        >
          {children.map((child) => (
            <DropdownLink
              key={child._key ?? child.label}
              item={child}
              variant={variant}
              pathname={pathname}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

function flattenNavItems(items?: NavItem[]) {
  const flat: {item: NavItem; depth: number}[] = []
  for (const item of items ?? []) {
    flat.push({item, depth: 0})
    for (const child of item.children ?? []) {
      flat.push({item: child, depth: 1})
    }
  }
  return flat
}

export function Navbar({data, variant = 'light'}: NavbarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navItems = flattenNavItems(data?.items)
  const {logoRef, introActive} = useIntroLogo()
  const isContact = pathname === '/contact'
  /** Contact: transparent over page color until scroll (or mobile menu open). */
  const solidNav = !isContact || scrolled || open

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (!open) return
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-[background-color,backdrop-filter] duration-300',
        variant === 'dark'
          ? 'bg-black text-white'
          : solidNav
            ? 'bg-brand-white/95 text-brand-charcoal backdrop-blur-sm'
            : 'bg-transparent text-brand-charcoal',
      )}
    >
      <Container className="pt-2 md:pt-3">
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
                'relative z-20 font-mono text-sm tracking-normal',
                variant === 'dark' ? 'text-white' : 'text-brand-charcoal',
              )}
            >
              Menu
            </button>
            {open && (
              <div
                className={cn(
                  'absolute right-0 top-full z-50 mt-2 min-w-[14rem] rounded-md border py-2 shadow-lg',
                  variant === 'dark'
                    ? 'border-white/10 bg-black text-white'
                    : 'border-neutral-200 bg-brand-white text-brand-charcoal',
                )}
              >
                {navItems.map(({item, depth}) => {
                  const itemHref = resolveLinkHref(item.link)
                  const label = item.label || resolveLinkLabel(item.link)
                  if (!itemHref) return null
                  return (
                    <Link
                      key={item._key ?? `${depth}-${label}`}
                      href={itemHref}
                      className={cn(
                        'block py-2 font-mono text-sm underline-offset-4 hover:underline',
                        depth === 0 ? 'px-4' : 'px-4 pl-7 opacity-80',
                      )}
                    >
                      {label}
                    </Link>
                  )
                })}
                {data?.button?.label && (
                  <div className="mt-3 border-t border-brand-charcoal px-4 py-4">
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

        {open &&
          typeof document !== 'undefined' &&
          createPortal(
            <button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-[39] cursor-default bg-transparent md:hidden"
              onClick={() => setOpen(false)}
            />,
            document.body,
          )}

        {/* Rule at top of page only — hides once scrolled */}
        <hr
          aria-hidden
          className={cn(
            'w-full border-0 border-t transition-all duration-300',
            variant === 'dark' ? 'border-white' : 'border-brand-charcoal',
            scrolled ? 'mt-0 h-0 opacity-0' : 'mt-2 opacity-100',
          )}
        />
      </Container>
    </header>
  )
}
