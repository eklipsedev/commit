/**
 * GROQ queries for the Commit frontend.
 */

const LINK_PROJECTION = `{
  label,
  linkType,
  href,
  email,
  phone,
  openInNewTab,
  internalLink->{
    _type,
    slug
  }
}`

const BUTTON_PROJECTION = `{
  label,
  variant,
  backgroundColor,
  textColor,
  hoverBackgroundColor,
  hoverTextColor,
  link ${LINK_PROJECTION}
}`

const CTA_CONTENT_PROJECTION = `{
  tagline,
  headline,
  headingSize,
  headlineSize,
  backgroundColor,
  headingColor,
  taglineColor,
  collapsePaddingTop,
  collapsePaddingBottom,
  button ${BUTTON_PROJECTION}
}`

const MIXED_LIST_ITEMS_PROJECTION = `items[]{
  _type == "reference" => @->{
    _id,
    title
  },
  defined(_type) && _type != "reference" => {
    _key,
    _type,
    text
  },
  !defined(_type) => @
}`

const TEXT_GRID_PROJECTION = `{
  ...,
  groups[]{
    ...,
    ${MIXED_LIST_ITEMS_PROJECTION}
  }
}`

const CUSTOM_MODULE_ITEM_PROJECTION = `{
  ...,
  _key,
  _type,
  _type == "textGrid" => ${TEXT_GRID_PROJECTION},
  _type == "moduleStringList" => {
    ...,
    ${MIXED_LIST_ITEMS_PROJECTION},
    button ${BUTTON_PROJECTION}
  },
  _type == "moduleButton" => {
    ...,
    button ${BUTTON_PROJECTION}
  }
}`

const PAGE_BUILDER_PROJECTION = `pageBuilder[]{
  ...,
  _key,
  _type,
  _type == "twoColCards" => {
    ...,
    button ${BUTTON_PROJECTION},
    "projects": select(
      projectsSource == "all" => *[_type == "project"] | order(orderRank) {
        _id,
        title,
        slug,
        thumbnail,
        categories,
        summary
      },
      projects[]->{
        _id,
        title,
        slug,
        thumbnail,
        categories,
        summary
      }
    )
  },
  _type == "cardsText" => {
    ...,
    offerings[]->{
      _id,
      title,
      slug,
      timeline,
      cardDescription,
      cardButtonLabel,
      cardBackgroundColor,
      cardHeadingColor,
      cardBodyColor,
      buttonBackgroundColor,
      buttonTextColor,
      snippet,
      body[]{
        ...,
        _key,
        _type,
        modules[]{..., _key, _type},
        left[]{..., _key, _type},
        right[]{..., _key, _type}
      },
      details
    }
  },
  _type == "team" => {
    ...,
    people[]->{
      _id,
      name,
      slug,
      role,
      photo,
      cardBackgroundColor,
      cardHoverBackgroundColor,
      buttonBackgroundColor,
      buttonTextColor,
      bio,
      textColor
    }
  },
  _type == "sliderTestimonials" => {
    ...,
    testimonials[]{
      _key,
      _type,
      _type == "testimonialReference" => {
        backgroundColor,
        textColor,
        testimonial->{
          _id,
          quote,
          "defaultBackgroundColor": backgroundColor,
          "defaultTextColor": textColor,
          person->{
            _id,
            name,
            role,
            photo
          }
        }
      },
      _type == "testimonialEntry" => {
        quote,
        backgroundColor,
        textColor,
        person->{
          _id,
          name,
          role,
          photo
        }
      }
    }
  },
  _type == "hero" => {
    ...,
    button ${BUTTON_PROJECTION}
  },
  _type == "cta" => {
    ...,
    useSiteDefault,
    button ${BUTTON_PROJECTION}
  },
  _type == "logos" => {
    ...,
    logos[]{
      _type == "reference" => @->{
        _id,
        name,
        image,
        href,
        "projectSlug": project->slug.current
      },
      // Legacy inline logoItem (pre-document model)
      _type != "reference" => {
        "name": alt,
        image,
        "href": link,
        "projectSlug": null
      }
    }
  },
  _type == "gridMixed" => {
    ...,
    button ${BUTTON_PROJECTION}
  },
  _type == "gridText" => {
    ...,
    items[]{
      ...,
      link ${LINK_PROJECTION}
    }
  },
  _type == "customSection" => {
    ...,
    modules[]{
      ...,
      _key,
      _type,
      _type == "moduleSplit" => {
        ...,
        content[]${CUSTOM_MODULE_ITEM_PROJECTION},
        left[]${CUSTOM_MODULE_ITEM_PROJECTION},
        right[]${CUSTOM_MODULE_ITEM_PROJECTION},
        // Legacy fixed left-headline / right-content fields
        button ${BUTTON_PROJECTION},
        listServices[]->{
          _id,
          title
        },
        textGrid${TEXT_GRID_PROJECTION}
      },
      _type == "textGrid" => ${TEXT_GRID_PROJECTION},
      _type == "moduleStringList" => {
        ...,
        ${MIXED_LIST_ITEMS_PROJECTION},
        button ${BUTTON_PROJECTION}
      },
      _type == "moduleButton" => {
        ...,
        button ${BUTTON_PROJECTION}
      }
    }
  }
}`

export const DEFAULT_CTA_QUERY = `*[_id == "defaultCta"][0]{
  cta ${CTA_CONTENT_PROJECTION}
}`

export const DEFAULT_SEO_QUERY = `*[_id == "defaultSeo"][0]{
  siteName,
  title,
  description,
  image
}`

export const NAVIGATION_QUERY = `*[_id == "navigation"][0]{
  logo,
  items[]{
    _key,
    label,
    link ${LINK_PROJECTION},
    children[]{
      _key,
      label,
      link ${LINK_PROJECTION}
    }
  },
  button ${BUTTON_PROJECTION}
}`

export const FOOTER_QUERY = `*[_id == "footer"][0]{
  logo,
  copyrightText,
  legalLinks[] ${LINK_PROJECTION},
  linkColumns[]{
    _key,
    title,
    links[] ${LINK_PROJECTION}
  },
  newsletter
}`

export const HOME_PAGE_QUERY = `*[_id == "homePage"][0]{
  title,
  footerAppearance,
  seo,
  ${PAGE_BUILDER_PROJECTION}
}`

export const PAGE_BY_SLUG_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  title,
  slug,
  footerAppearance,
  seo,
  ${PAGE_BUILDER_PROJECTION}
}`

export const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  thumbnail,
  categories,
  summary,
  heroMediaType,
  heroImage,
  "heroVideo": heroVideo.asset->{
    playbackId,
    assetId,
    filename,
    status,
    thumbTime,
    "aspectRatio": data.aspect_ratio
  },
  eyebrow,
  headline,
  collapseLineBreaksOnMobile,
  overviewBody,
  overviewServices[]->{
    _id,
    title
  },
  mediaRows[]{
    _key,
    layout,
    image,
    leftImage,
    rightImage,
    poster,
    "video": video.asset->{
      playbackId,
      assetId,
      filename,
      status,
      thumbTime,
      "aspectRatio": data.aspect_ratio
    }
  },
  testimonial->{
    _id,
    quote,
    backgroundColor,
    textColor,
    person->{
      _id,
      name,
      role,
      photo
    }
  },
  testimonials[]{
    _key,
    _type,
    backgroundColor,
    textColor,
    testimonial->{
      _id,
      quote,
      "defaultBackgroundColor": backgroundColor,
      "defaultTextColor": textColor,
      person->{
        _id,
        name,
        role,
        photo
      }
    }
  },
  ctaMode,
  cta ${CTA_CONTENT_PROJECTION},
  "defaultCta": *[_id == "defaultCta"][0].cta ${CTA_CONTENT_PROJECTION},
  footerAppearance,
  seo,
  "siblings": *[_type == "project"] | order(orderRank) {
    _id,
    title,
    "slug": slug.current
  }
}`

export const PERSON_BY_SLUG_QUERY = `*[_type == "person" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  role,
  photo,
  bio,
  cardHoverBackgroundColor,
  textColor
}`

export const OFFERING_BY_SLUG_QUERY = `*[_type == "offering" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  snippet,
  cardBackgroundColor,
  cardHeadingColor,
  body[]{
    ...,
    _key,
    modules[]{..., _key, _type},
    left[]{..., _key, _type},
    right[]{..., _key, _type}
  },
  details
}`

export const CONTACT_PAGE_QUERY = `*[_id == "contactPage"][0]{
  heading,
  tagline,
  attributes[]{
    _key,
    label,
    value,
    link ${LINK_PROJECTION}
  },
  footerAppearance,
  seo
}`

export const LEGAL_PAGE_BY_SLUG_QUERY = `*[_type == "legalPage" && slug.current == $slug][0]{
  heading,
  collapseLineBreaksOnMobile,
  slug,
  description,
  body,
  _updatedAt,
  footerAppearance,
  seo
}`
