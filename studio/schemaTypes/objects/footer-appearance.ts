import {defineField, defineType} from 'sanity'
import {BlockElementIcon} from '../../lib/icons'
import {brandColorField} from '../shared/section-fields'

/**
 * Per-page footer appearance overrides.
 * Global footer singleton holds shared content + default button styles;
 * pages can override subscribe button hover colors.
 */
export const footerAppearanceType = defineType({
  name: 'footerAppearance',
  title: 'Footer appearance',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    brandColorField('buttonHoverBackgroundColor', 'Subscribe hover background', {
      description: 'Overrides the global footer subscribe hover background on this page',
    }),
    brandColorField('buttonHoverTextColor', 'Subscribe hover text', {
      description: 'Overrides the global footer subscribe hover text on this page',
    }),
  ],
})
