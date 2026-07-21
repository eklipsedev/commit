# Engineering Architecture

## Tech stack

- Next.js 16
- React 19
- Tailwind v4
- Sanity Studio v6
- Vercel
- TypeScript

## Sanity project

| | |
|--|--|
| Project | Commit |
| Project ID | `9khzz3db` |
| Dataset | `production` |
| Studio | http://localhost:3333 (`pnpm --dir studio dev`) |
| Web | http://localhost:3000 (`pnpm --dir web dev`) |

## Repo layout

```
commit/
├── design/          # Figma screenshots + notes (source of truth for UI)
├── docs/            # Architecture + content model
├── studio/          # Standalone Sanity Studio
└── web/             # Next.js frontend (scaffolded; UI not built yet)
```

Studio stays standalone (Vite) beside the Next app — faster Studio builds, auto-updates, and TypeGen watch mode.

## Content model overview

| Kind | Types |
|------|--------|
| **Singletons** | `homePage`, `contactPage`, `navigation`, `footer` |
| **Documents** | `page`, `legalPage`, `project`, `offering`, `person`, `testimonial` |
| **Page builder blocks** | See below |
| **Shared objects** | `link`, `button`, `seo`, `textGrid`, `detailAttributes`, custom modules, overlay modules |

### Pages

| Page | Modeling | Notes |
|------|----------|-------|
| Home | Singleton `homePage` + page builder | |
| About | `page` + page builder | Team cards open person overlay |
| Work | `page` + page builder | Cards link to case study routes |
| Offerings | `page` + page builder | Cards open offering overlay |
| Sales audiences | `page` + page builder | One document per audience |
| Contact | Singleton `contactPage` (no builder) | |
| Legal | `legalPage` (no builder) | Last updated from `_updatedAt` |
| Case study | `project` document route | Card + scaffolded case study fields |

### Global

| Type | Modeling |
|------|----------|
| Navbar | Singleton `navigation` |
| Footer | Singleton `footer` — shared content + default subscribe styles. Each page has optional `footerAppearance` for subscribe hover colors |

### Reusable documents

| Type | Why |
|------|-----|
| `project` | Work cards + case study detail (page builder scaffolded) |
| `offering` | Card + offer overlay (body rows, attributes, colors) |
| `person` | Team card + about overlay (bio PT, colors) |
| `testimonial` | Slider items |

### Overlays (shared UI pattern)

| Overlay | Source | Fields |
|---------|--------|--------|
| About | `person` | name, role, bio (portable text), backgroundColor, textColor |
| Offer | `offering` | title, snippet, body rows, detailAttributes. Overlay uses `cardBackgroundColor` + `cardHeadingColor` |

Person cards also expose: `cardBackgroundColor`, `cardHoverBackgroundColor`, `buttonBackgroundColor`, `buttonTextColor`.

### Page builder blocks

| Block | Role |
|-------|------|
| `hero` | Tagline, rich headline, optional body + button |
| `cta` | Tagline, headline, button |
| `logos` | `fullWidth` marquee \| `limited` wrap |
| `twoColCards` | Project refs; optional header |
| `twoColImage` | Image + PT + attribution |
| `textColumns` | Tagline + asymmetric body |
| `listText` | Tagline, optional headline, ruled/list items |
| `cardsText` | Offering refs → open overlay |
| `gridText` | Audience/text columns with links |
| `gridMixed` | Mosaic images + CTA |
| `team` | Person refs → open about overlay |
| `sliderTestimonials` | Testimonial refs |
| `customSection` | Flexible stack of nested modules |

### Custom section modules

`customSection.modules[]`: moduleTagline, moduleHeadline, moduleBody, moduleSplit, textGrid, moduleStringList, detailAttributes, moduleSteps, moduleButton

### Design system in CMS

- Colors: brand token select only. Designer-facing titles (Commit Yellow, Soft Peach, etc.).
- Spacing: per-section collapse top/bottom padding.
- Fonts: Lust Text (display) + Bloyd (sans) + Geist Mono — frontend only.
- Buttons: background + text (+ hover) configurable sitewide via `button` object.

## Frontend (later)

- App Router + Live Content API (`defineLive`)
- Presentation Tool + draft mode (`/api/draft-mode/enable`)
- Shared overlay component for person + offering
- Case study route from `project.slug`
- Page builder renderer switch on `_type`

### Logos

Reusable `logo` documents (image, optional project / URL, “include in default set”). The `logos` page-builder block references an ordered list of logos and pre-fills from the default set when added.

### Presentation (ready now)

| App | URL |
|-----|-----|
| Studio | http://localhost:3333 → Presentation |
| Preview origin | http://localhost:3000 (`SANITY_STUDIO_PREVIEW_ORIGIN`) |

Run both `pnpm --dir studio dev` and `pnpm --dir web dev` for Presentation to load the Next.js preview iframe.
