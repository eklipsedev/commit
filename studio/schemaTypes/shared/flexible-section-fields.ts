import {defineArrayMember, defineField} from 'sanity'
import {brandColorField, sectionSpacingFields, COLORS_FIELDSET} from './section-fields'

/** Modules allowed in Flexible sections and section templates (and split columns). */
export const FLEXIBLE_SECTION_MODULES = [
  defineArrayMember({type: 'moduleTagline'}),
  defineArrayMember({type: 'moduleHeadline'}),
  defineArrayMember({type: 'moduleBody'}),
  defineArrayMember({type: 'moduleSplit'}),
  defineArrayMember({type: 'moduleStringList'}),
  defineArrayMember({type: 'detailAttributes'}),
  defineArrayMember({type: 'moduleSteps'}),
  defineArrayMember({type: 'moduleButton'}),
  defineArrayMember({type: 'moduleSpacer'}),
]

/** Content + style fields shared by `customSection` and `flexibleSectionTemplate`. */
export function flexibleSectionContentFields(options?: {modulesRequired?: boolean}) {
  const modulesRequired = options?.modulesRequired ?? true

  return [
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      description: 'Compose the section from reusable modules (tagline, headline, split, lists, etc.)',
      of: FLEXIBLE_SECTION_MODULES,
      validation: modulesRequired ? (rule) => rule.min(1) : undefined,
      group: 'content',
    }),
    defineField({...sectionSpacingFields[0], group: 'style'}),
    defineField({...sectionSpacingFields[1], group: 'style'}),
    {...brandColorField('backgroundColor', 'Background color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('headingColor', 'Heading color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('bodyColor', 'Body color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('taglineColor', 'Tagline color'), group: 'style', fieldset: 'colors'},
    {...brandColorField('accentColor', 'Accent color'), group: 'style', fieldset: 'colors'},
  ]
}

export {COLORS_FIELDSET}
