export const BRAND_COLORS = [
  {title: 'Commit Yellow', value: 'yellow', hex: '#FEE064'},
  {title: 'Charcoal', value: 'charcoal', hex: '#303030'},
  {title: 'Soft Peach', value: 'peach', hex: '#FFD8BF'},
  {title: 'Burnt Orange', value: 'burnt-orange', hex: '#CF5B28'},
  {title: 'Soft Sage', value: 'sage', hex: '#DFE8D0'},
  {title: 'Butter Yellow', value: 'pale-yellow', hex: '#FBFFC0'},
  {title: 'Plum', value: 'plum', hex: '#A04D79'},
  {title: 'Dusty Blue', value: 'blue', hex: '#5A6BAB'},
  {title: 'Powder Blue', value: 'light-blue', hex: '#B9CDE8'},
  {title: 'Walnut', value: 'brown', hex: '#7B5630'},
  {title: 'Soft Lilac', value: 'lavender', hex: '#F3EEF6'},
  {title: 'Hot Pink', value: 'pink', hex: '#FAA0E2'},
  {title: 'Indigo', value: 'deep-blue', hex: '#4D60A6'},
  {title: 'Olive', value: 'olive', hex: '#817B42'},
  {title: 'Black', value: 'black', hex: '#000000'},
  {title: 'White', value: 'white', hex: '#FBFAFA'},
] as const

export type BrandColorToken = (typeof BRAND_COLORS)[number]['value']

export function getBrandColor(token?: string | null) {
  return BRAND_COLORS.find((color) => color.value === token)
}
