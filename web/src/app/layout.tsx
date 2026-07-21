import {Geist, Geist_Mono} from 'next/font/google'
import {Lora} from 'next/font/google'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {DisableDraftMode} from '@/components/disable-draft-mode'
import {Footer} from '@/components/layout/footer'
import {IntroLoader} from '@/components/layout/intro-loader'
import {IntroLogoProvider} from '@/components/layout/intro-logo-context'
import {FooterAppearanceProvider} from '@/components/layout/set-footer-appearance'
import {Navbar} from '@/components/layout/navbar'
import {OverlayHost} from '@/components/overlays/overlay-host'
import {OverlayProvider} from '@/components/overlays/overlay-provider'
import {NavThemeProvider} from '@/context/nav-theme-context'
import {sanityFetch, SanityLive} from '@/sanity/live'
import {FOOTER_QUERY, NAVIGATION_QUERY} from '@/sanity/queries'
import type {FooterData, NavigationData} from '@/sanity/types'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const displaySerif = Lora({
  subsets: ['latin'],
  variable: '--font-display-serif',
  display: 'swap',
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [{data: navigation}, {data: footer}] = await Promise.all([
    sanityFetch({query: NAVIGATION_QUERY}),
    sanityFetch({query: FOOTER_QUERY}),
  ])

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} intro-pending h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-brand-white font-sans text-brand-charcoal">
        <FooterAppearanceProvider>
          <NavThemeProvider initialTheme="light">
            <IntroLogoProvider>
              <OverlayProvider>
                <IntroLoader />
                <Navbar data={navigation as NavigationData} variant="light" />
                <main className="flex-1">{children}</main>
                <Footer data={footer as FooterData} />
                <OverlayHost />
              </OverlayProvider>
            </IntroLogoProvider>
          </NavThemeProvider>
        </FooterAppearanceProvider>
        <SanityLive />
        {(await draftMode()).isEnabled && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
      </body>
    </html>
  )
}
