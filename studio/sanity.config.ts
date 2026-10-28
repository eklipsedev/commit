import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {assist} from '@sanity/assist'
import {media} from 'sanity-plugin-media'
import {muxInput} from 'sanity-plugin-mux-input'
import {
  hydrateBlockPreviewUrls,
  listenForBlockPreviewUpdates,
} from './lib/block-preview-urls'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {resolve} from './presentation/resolve'

// Hosted Studio previews the live site; local dev sets localhost in .env.local.
const previewOrigin =
  (typeof process !== 'undefined' && process.env.SANITY_STUDIO_PREVIEW_ORIGIN) ||
  'https://commitbranding.com'

await hydrateBlockPreviewUrls()
listenForBlockPreviewUpdates()

export default defineConfig({
  name: 'default',
  title: 'Commit',

  projectId: '9khzz3db',
  dataset: 'production',

  // Hide Releases from the tools menu; editors publish directly.
  releases: {enabled: false},

  plugins: [
    structureTool({structure}),
    presentationTool({
      resolve,
      previewUrl: {
        origin: previewOrigin,
        preview: '/',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    assist(),
    media(),
    muxInput({
      max_resolution_tier: '1080p',
    }),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev.filter((template) => template.schemaType !== 'page'),
      {
        id: 'landing-page',
        title: 'Landing page',
        schemaType: 'page',
        value: {kind: 'general'},
      },
      {
        id: 'sales-page',
        title: 'Sales page',
        schemaType: 'page',
        value: {kind: 'sales'},
      },
    ],
  },
})
