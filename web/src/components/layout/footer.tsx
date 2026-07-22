'use client'

import Link from 'next/link'
import {useState} from 'react'
import {CommitWordmark} from '@/components/brand/commit-wordmark'
import {useFooterAppearance} from '@/components/layout/set-footer-appearance'
import {colorHex} from '@/lib/colors'
import {resolveLinkHref, resolveLinkLabel} from '@/lib/links'
import {Container} from '@/components/ui/container'
import {Heading} from '@/components/ui/heading'
import type {FooterData} from '@/sanity/types'

type FooterProps = {
  data?: FooterData | null
}

export function Footer({data}: FooterProps) {
  const [email, setEmail] = useState('')
  const {appearance} = useFooterAppearance()
  const year = new Date().getFullYear()
  const newsletter = data?.newsletter

  const restText = colorHex(newsletter?.buttonTextColor, 'charcoal')
  const hoverBg = colorHex(
    appearance?.buttonHoverBackgroundColor ||
      newsletter?.buttonHoverBackgroundColor ||
      newsletter?.buttonBackgroundColor,
    'charcoal',
  )
  const hoverText = colorHex(
    appearance?.buttonHoverTextColor ||
      newsletter?.buttonHoverTextColor ||
      newsletter?.buttonTextColor,
    'charcoal',
  )

  return (
    <footer className="bg-brand-white text-[1rem] leading-[1.2] text-brand-charcoal">
      <Container className="py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="space-y-6">
            {newsletter?.title && (
              <Heading size="md" className="max-w-md text-brand-charcoal">
                {newsletter.title}
              </Heading>
            )}
            <form
              className="flex max-w-sm items-center gap-4 sm:max-w-md"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="sr-only" htmlFor="newsletter-email">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletter?.placeholder ?? 'Email Address'}
                className="h-10 min-w-0 flex-1 border-0 border-b border-brand-charcoal bg-transparent font-mono text-[1rem] leading-none text-brand-charcoal placeholder:text-brand-charcoal/70 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border px-6 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: restText,
                  borderColor: restText,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hoverBg
                  e.currentTarget.style.color = hoverText
                  e.currentTarget.style.borderColor = hoverBg
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = restText
                  e.currentTarget.style.borderColor = restText
                }}
              >
                {newsletter?.buttonText ?? 'Subscribe'}
              </button>
            </form>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {data?.linkColumns?.map((column) => (
              <div key={column._key ?? column.title} className="space-y-3">
                {column.title && (
                  <p className="font-mono text-[1rem] leading-[1.2] tracking-normal text-brand-charcoal">
                    {column.title}
                  </p>
                )}
                <ul className="space-y-2">
                  {column.links?.map((link, i) => {
                    const href = resolveLinkHref(link)
                    const label = resolveLinkLabel(link)
                    if (!href || !label) return null
                    const external = link.linkType === 'external'
                    return (
                      <li key={`${label}-${i}`}>
                        <Link
                          href={href}
                          className="font-mono text-[1rem] leading-[1.2] text-brand-charcoal underline-offset-4 hover:underline"
                          target={external && link.openInNewTab ? '_blank' : undefined}
                          rel={external && link.openInNewTab ? 'noopener noreferrer' : undefined}
                        >
                          {label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 md:mt-20">
          <CommitWordmark
            className="h-auto w-full text-brand-charcoal"
            periodClassName="fill-brand-yellow"
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-brand-charcoal pt-6 font-mono text-sm leading-[1.2] text-brand-charcoal md:text-[1rem] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {data?.copyrightText ?? 'Commit, All Rights Reserved'}
          </p>
          <div className="flex flex-wrap gap-4">
            {data?.legalLinks?.map((link, i) => {
              const href = resolveLinkHref(link)
              const label = resolveLinkLabel(link)
              if (!href || !label) return null
              return (
                <Link
                  key={`${label}-${i}`}
                  href={href}
                  className="underline-offset-4 hover:underline"
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </div>
      </Container>
    </footer>
  )
}
