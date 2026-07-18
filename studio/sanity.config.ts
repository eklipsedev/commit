import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {assist} from '@sanity/assist'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import {muxInput} from 'sanity-plugin-mux-input'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {resolve} from './presentation/resolve'

const previewOrigin =
  (typeof process !== 'undefined' && process.env.SANITY_STUDIO_PREVIEW_ORIGIN) ||
  'http://localhost:3000'

export default defineConfig({
  name: 'default',
  title: 'Commit',

  projectId: '9khzz3db',
  dataset: 'production',

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
    visionTool(),
    assist(),
    media(),
    muxInput({
      max_resolution_tier: '1080p',
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
