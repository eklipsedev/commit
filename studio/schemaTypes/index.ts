import {linkType} from './objects/link'
import {buttonType} from './objects/button'
import {seoType} from './objects/seo'
import {richHeadlineType, portableTextType} from './objects/portable-text'
import {navItemType, linkColumnType} from './objects/nav-item'
import {textGridType} from './objects/text-grid'
import {detailAttributesType} from './objects/detail-attributes'
import {testimonialEntryType} from './objects/testimonial-entry'
import {testimonialReferenceType} from './objects/testimonial-reference'
import {projectBrandColorType} from './objects/project-brand-color'
import {projectTestimonialType} from './objects/project-testimonial'
import {footerAppearanceType} from './objects/footer-appearance'
import {redirectRuleType} from './objects/redirect-rule'
import {
  overlayLabeledListType,
  overlayTextType,
  overlayStringListType,
  overlayRowType,
} from './objects/overlay-modules'
import {
  moduleTaglineType,
  moduleHeadlineType,
  moduleBodyType,
  moduleSplitType,
  moduleStringListType,
  moduleStepsType,
  moduleButtonType,
} from './objects/custom-modules'

import {navigationType} from './documents/navigation'
import {footerType} from './documents/footer'
import {homePageType} from './documents/home-page'
import {pageType} from './documents/page'
import {contactPageType} from './documents/contact-page'
import {legalPageType} from './documents/legal-page'
import {projectType} from './documents/project'
import {logoType} from './documents/logo'
import {personType} from './documents/person'
import {testimonialType} from './documents/testimonial'
import {offeringType} from './documents/offering'
import {serviceType} from './documents/service'
import {defaultCtaType} from './documents/default-cta'
import {defaultSeoType} from './documents/default-seo'
import {blockPreviewsType} from './documents/block-previews'
import {redirectsType} from './documents/redirects'

import {pageBuilderType} from './page-builder'
import {heroType} from './blocks/hero'
import {ctaType} from './blocks/cta'
import {logosType} from './blocks/logos'
import {twoColCardsType} from './blocks/two-col-cards'
import {twoColImageType} from './blocks/two-col-image'
import {textColumnsType} from './blocks/text-columns'
import {listTextType} from './blocks/list-text'
import {cardsTextType} from './blocks/cards-text'
import {gridTextType} from './blocks/grid-text'
import {gridMixedType} from './blocks/grid-mixed'
import {gridMixedImagesType} from './objects/grid-mixed-images'
import {teamType} from './blocks/team'
import {sliderTestimonialsType} from './blocks/slider-testimonials'
import {customSectionType} from './blocks/custom-section'

export const schemaTypes = [
  // Shared objects
  linkType,
  buttonType,
  seoType,
  richHeadlineType,
  portableTextType,
  navItemType,
  linkColumnType,
  textGridType,
  detailAttributesType,
  testimonialEntryType,
  testimonialReferenceType,
  projectBrandColorType,
  projectTestimonialType,
  footerAppearanceType,
  redirectRuleType,
  gridMixedImagesType,

  // Offer overlay modules
  overlayLabeledListType,
  overlayTextType,
  overlayStringListType,
  overlayRowType,

  // Custom section modules
  moduleTaglineType,
  moduleHeadlineType,
  moduleBodyType,
  moduleSplitType,
  moduleStringListType,
  moduleStepsType,
  moduleButtonType,

  // Documents
  navigationType,
  footerType,
  homePageType,
  pageType,
  contactPageType,
  legalPageType,
  projectType,
  logoType,
  personType,
  testimonialType,
  offeringType,
  serviceType,
  defaultCtaType,
  defaultSeoType,
  blockPreviewsType,
  redirectsType,

  // Page builder blocks
  pageBuilderType,
  heroType,
  ctaType,
  logosType,
  twoColCardsType,
  twoColImageType,
  textColumnsType,
  listTextType,
  cardsTextType,
  gridTextType,
  gridMixedType,
  teamType,
  sliderTestimonialsType,
  customSectionType,
]
