import {defineField} from 'sanity'

/** Nested alt field for Sanity image fields. */
export function imageAltField(options?: {description?: string}) {
  return defineField({
    name: 'alt',
    type: 'string',
    title: 'Alt text',
    description: options?.description,
  })
}

/**
 * Image field options that enable AI Assist “Generate caption” for the alt field.
 * @see https://www.sanity.io/docs/studio/install-and-configure-sanity-ai-assist
 */
export function imageFieldOptions(options?: {hotspot?: boolean}) {
  return {
    hotspot: options?.hotspot ?? true,
    aiAssist: {
      imageDescriptionField: 'alt',
    },
  }
}
