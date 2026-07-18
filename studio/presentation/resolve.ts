import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

/**
 * Maps documents to front-end routes for Presentation Tool navigation.
 * Routes are scaffolded ahead of UI work — update when pages are implemented.
 */
export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    homePage: defineLocations({
      select: {title: 'title'},
      resolve: () => ({
        locations: [{title: 'Home', href: '/'}],
      }),
    }),
    page: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: doc?.slug
          ? [{title: doc.title || 'Page', href: `/${doc.slug}`}]
          : [],
      }),
    }),
    contactPage: defineLocations({
      select: {title: 'heading'},
      resolve: () => ({
        locations: [{title: 'Contact', href: '/contact'}],
      }),
    }),
    legalPage: defineLocations({
      select: {title: 'heading', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: doc?.slug
          ? [{title: doc.title || 'Legal', href: `/legal/${doc.slug}`}]
          : [],
      }),
    }),
    project: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: doc?.slug
          ? [
              {title: doc.title || 'Project', href: `/work/${doc.slug}`},
              {title: 'Work', href: '/work'},
            ]
          : [{title: 'Work', href: '/work'}],
      }),
    }),
  },
}
