import type {StructureResolver} from 'sanity/structure'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {
  BoltIcon,
  BlockElementIcon,
  BulletOutlineIcon,
  CogIcon,
  CommentIcon,
  DocumentIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  HomeIcon,
  ImageIcon,
  ImagesIcon,
  LinkIcon,
  MenuIcon,
  PackageIcon,
  UserIcon,
} from './lib/icons'

const HIDDEN_FROM_LIST = [
  'navigation',
  'footer',
  'homePage',
  'contactPage',
  'page',
  'legalPage',
  'project',
  'logo',
  'person',
  'testimonial',
  'offering',
  'service',
  'defaultCta',
  'blockPreviews',
  'redirects',
  // Managed inside the Media / Mux tools — don't list in the desk
  'media.tag',
  'mux.videoAsset',
  'mux.apiKey',
]

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.divider().title('Website pages'),
      S.listItem()
        .title('Home')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage').title('Home')),
      S.listItem()
        .title('Contact')
        .icon(EnvelopeIcon)
        .child(S.document().schemaType('contactPage').documentId('contactPage').title('Contact')),
      S.listItem()
        .title('Pages')
        .icon(DocumentIcon)
        .child(S.documentTypeList('page').title('Pages')),
      S.listItem()
        .title('Legal pages')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('legalPage').title('Legal pages')),
      S.divider().title('Content library'),
      orderableDocumentListDeskItem({
        type: 'project',
        title: 'Projects',
        icon: ImagesIcon,
        S,
        context,
      }),
      S.listItem()
        .title('Logos')
        .icon(ImageIcon)
        .child(S.documentTypeList('logo').title('Logos')),
      S.listItem()
        .title('Offerings')
        .icon(PackageIcon)
        .child(S.documentTypeList('offering').title('Offerings')),
      S.listItem()
        .title('Services')
        .icon(BulletOutlineIcon)
        .child(S.documentTypeList('service').title('Services')),
      S.listItem()
        .title('People')
        .icon(UserIcon)
        .child(
          S.list()
            .title('People')
            .items([
              S.listItem()
                .title('Employees')
                .child(
                  S.documentTypeList('person')
                    .title('Employees')
                    .filter('_type == "person" && kind == "employee"'),
                ),
              S.listItem()
                .title('Testimonial people')
                .child(
                  S.documentTypeList('person')
                    .title('Testimonial people')
                    .filter('_type == "person" && kind == "testimonial"'),
                ),
              S.listItem()
                .title('All people')
                .child(S.documentTypeList('person').title('All people')),
            ]),
        ),
      S.listItem()
        .title('Testimonials')
        .icon(CommentIcon)
        .child(S.documentTypeList('testimonial').title('Testimonials')),
      S.divider().title('Site settings'),
      S.listItem()
        .title('Navigation')
        .icon(MenuIcon)
        .child(S.document().schemaType('navigation').documentId('navigation').title('Navigation')),
      S.listItem()
        .title('Footer')
        .icon(BlockElementIcon)
        .child(S.document().schemaType('footer').documentId('footer').title('Footer')),
      S.listItem()
        .title('Config')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Config')
            .items([
              S.listItem()
                .title('Default CTA')
                .icon(BoltIcon)
                .child(
                  S.document()
                    .schemaType('defaultCta')
                    .documentId('defaultCta')
                    .title('Default CTA'),
                ),
              S.listItem()
                .title('Section previews')
                .icon(ImagesIcon)
                .child(
                  S.document()
                    .schemaType('blockPreviews')
                    .documentId('blockPreviews')
                    .title('Section previews'),
                ),
              S.listItem()
                .title('Redirects')
                .icon(LinkIcon)
                .child(
                  S.document().schemaType('redirects').documentId('redirects').title('Redirects'),
                ),
            ]),
        ),
      ...S.documentTypeListItems().filter(
        (item) => !HIDDEN_FROM_LIST.includes(item.getId() as string),
      ),
    ])
