type PageHeroIntroProps = {
  headline: React.ReactNode
  /** Renders below the headline at full container width (e.g. legal “Last updated”). */
  fullWidthTagline?: React.ReactNode
  tagline?: React.ReactNode
  body?: React.ReactNode
  button?: React.ReactNode
}

/** Shared hero-style intro: display headline, optional full-width tagline, then tagline + body grid. */
export function PageHeroIntro({
  headline,
  fullWidthTagline,
  tagline,
  body,
  button,
}: PageHeroIntroProps) {
  return (
    <>
      {headline}
      {fullWidthTagline}
      {(tagline || body || button) && (
        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-start">
          <div className="space-y-6">{tagline}</div>
          <div className="space-y-6">
            {body}
            {button}
          </div>
        </div>
      )}
    </>
  )
}
