/**
 * Default overlay attributes for new offerings.
 * Editors can rename, reorder, add, or remove these freely.
 */
export const DEFAULT_OFFERING_DETAILS = {
  label: 'The details.',
  attributes: [
    {_type: 'detailAttribute' as const, _key: 'attr-flat-fee', label: 'Flat Fee', values: ['']},
    {_type: 'detailAttribute' as const, _key: 'attr-timeline', label: 'Timeline', values: ['']},
    {
      _type: 'detailAttribute' as const,
      _key: 'attr-potential-team',
      label: 'Potential Team',
      values: [''],
    },
    {
      _type: 'detailAttribute' as const,
      _key: 'attr-time-commitment',
      label: 'Time Commitment',
      values: [''],
    },
  ],
}
