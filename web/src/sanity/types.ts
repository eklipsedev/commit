import type {PortableTextBlock} from '@portabletext/types'
import type {BrandColorToken} from '@/sanity/brand-colors'

export type SanityImage = {
  asset?: {_ref?: string; _id?: string}
  alt?: string
  hotspot?: {x: number; y: number}
  crop?: {top: number; bottom: number; left: number; right: number}
}

export type RichHeadline = PortableTextBlock[]

export type ButtonValue = {
  label?: string
  variant?: 'primary' | 'secondary' | 'dot'
  link?: import('@/lib/links').LinkValue
  backgroundColor?: BrandColorToken | string
  textColor?: BrandColorToken | string
  hoverBackgroundColor?: BrandColorToken | string
  hoverTextColor?: BrandColorToken | string
}

export type SectionStyle = {
  collapsePaddingTop?: boolean
  collapsePaddingBottom?: boolean
  backgroundColor?: string | null
  headingColor?: string | null
  bodyColor?: string | null
  taglineColor?: string | null
  accentColor?: string | null
  headingSize?: string | null
  /** @deprecated Prefer `headingSize` */
  headlineSize?: string | null
  /** When true, Enter line breaks only apply from `md` up. */
  collapseLineBreaksOnMobile?: boolean
}

export type FooterAppearance = {
  buttonHoverBackgroundColor?: string | null
  buttonHoverTextColor?: string | null
}

export type PageSeo = {
  title?: string | null
  description?: string | null
  image?: SanityImage | null
  noIndex?: boolean | null
}

export type DefaultSeo = {
  siteName?: string | null
  title?: string | null
  description?: string | null
  image?: SanityImage | null
}

export type NavItem = {
  _key?: string
  label?: string
  link?: import('@/lib/links').LinkValue
  children?: NavItem[]
}

export type NavigationData = {
  logo?: SanityImage & {alt?: string}
  items?: NavItem[]
  button?: ButtonValue
}

export type FooterData = {
  logo?: SanityImage & {alt?: string}
  copyrightText?: string
  legalLinks?: import('@/lib/links').LinkValue[]
  linkColumns?: {
    _key?: string
    title?: string
    links?: import('@/lib/links').LinkValue[]
  }[]
  newsletter?: {
    title?: string
    placeholder?: string
    buttonText?: string
    buttonVariant?: 'primary' | 'secondary'
    buttonBackgroundColor?: string
    buttonTextColor?: string
    buttonHoverBackgroundColor?: string
    buttonHoverTextColor?: string
  }
}

export type PersonCard = {
  _id: string
  name?: string
  slug?: {current?: string}
  role?: string
  photo?: SanityImage
  cardBackgroundColor?: string
  cardHoverBackgroundColor?: string
  buttonBackgroundColor?: string
  buttonTextColor?: string
  bio?: PortableTextBlock[]
  textColor?: string
}

export type OfferingCard = {
  _id: string
  title?: string
  slug?: {current?: string}
  timeline?: string
  cardDescription?: string
  cardButtonLabel?: string
  cardBackgroundColor?: string
  cardHeadingColor?: string
  cardBodyColor?: string
  buttonBackgroundColor?: string
  buttonTextColor?: string
  snippet?: string
  body?: OverlayRow[]
  details?: DetailAttributes
}

export type ProjectCard = {
  _id: string
  title?: string
  slug?: {current?: string}
  thumbnail?: SanityImage
  categories?: string[]
  summary?: string
}

export type MuxVideoAsset = {
  playbackId?: string
  assetId?: string
  filename?: string
  status?: string
  thumbTime?: number
  aspectRatio?: string
}

export type CaseStudyMediaRow = {
  _key?: string
  layout?: 'full' | 'twoCol' | 'video'
  image?: SanityImage
  leftImage?: SanityImage
  rightImage?: SanityImage
  video?: MuxVideoAsset
  poster?: SanityImage
}

export type DetailAttributes = {
  label?: string
  attributes?: {label?: string; values?: string[]}[]
}

export type OverlayModule =
  | {_type: 'overlayLabeledList'; _key?: string; title?: string; items?: string[]}
  | {_type: 'overlayText'; _key?: string; style?: 'body' | 'caption'; text?: string}
  | {
      _type: 'overlayStringList'
      _key?: string
      label?: string
      items?: string[]
      columns?: number
    }

export type OverlayRow = {
  _key?: string
  layout?: 'full' | 'twoColumn'
  modules?: OverlayModule[]
  left?: OverlayModule[]
  right?: OverlayModule[]
}

export type PageBuilderBlock = {
  _key: string
  _type: string
} & SectionStyle &
  Record<string, unknown>

export type CaseStudyProject = ProjectCard & {
  heroMediaType?: 'image' | 'video'
  heroImage?: SanityImage
  heroVideo?: MuxVideoAsset
  eyebrow?: string
  headline?: string
  collapseLineBreaksOnMobile?: boolean
  overviewBody?: PortableTextBlock[]
  overviewServices?: {_id: string; title?: string}[]
  mediaRows?: CaseStudyMediaRow[]
  testimonial?: {
    _id?: string
    quote?: string
    backgroundColor?: string
    textColor?: string
    person?: {
      _id?: string
      name?: string
      role?: string
      photo?: SanityImage
    }
  }
  testimonials?: TestimonialSlide[]
  ctaMode?: 'default' | 'custom' | 'hidden'
  cta?: SectionStyle & {
    tagline?: string
    headline?: RichHeadline
    button?: ButtonValue
  }
  defaultCta?: SectionStyle & {
    tagline?: string
    headline?: RichHeadline
    button?: ButtonValue
  }
  siblings?: {_id: string; title?: string; slug?: string}[]
  footerAppearance?: FooterAppearance
}

export type TestimonialPerson = {
  _id?: string
  name?: string
  role?: string
  photo?: SanityImage
}

export type TestimonialSlide = {
  _key?: string
  _type?: string
  quote?: string
  backgroundColor?: string
  textColor?: string
  person?: TestimonialPerson
  /** @deprecated Legacy inline fields — prefer `person` */
  name?: string
  role?: string
  image?: SanityImage
  testimonial?: {
    quote?: string
    defaultBackgroundColor?: string
    defaultTextColor?: string
    person?: TestimonialPerson
    /** @deprecated */
    name?: string
    role?: string
    image?: SanityImage
  }
}
