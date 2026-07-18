'use client'

import {type StringInputProps, useFormValue} from 'sanity'
import {BRAND_COLORS} from '../lib/brand-colors'
import {ColorSwatchPicker} from './color-swatch-picker'

type PaletteSwatch = {
  _key?: string
  label?: string
  hex?: string
}

function isHex(value?: string) {
  return Boolean(value && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value))
}

/**
 * Brand tokens plus the current project's brandPalette hex swatches.
 * Compact popover swatch grid — used for project testimonial color overrides.
 */
export function ProjectBrandColorInput(props: StringInputProps) {
  const {value, onChange, readOnly} = props
  const palette = (useFormValue(['brandPalette']) as PaletteSwatch[] | undefined) ?? []
  const projectColors = palette
    .filter((c) => isHex(c.hex))
    .map((c) => ({
      title: c.label || c.hex!,
      value: c.hex!,
      hex: c.hex!,
    }))

  return (
    <ColorSwatchPicker
      value={value}
      readOnly={readOnly}
      onChange={onChange}
      emptyLabel="No override — uses the testimonial’s own colors"
      groups={[
        {
          label: 'This project’s palette',
          colors: projectColors,
        },
        {
          label: 'Commit brand',
          colors: BRAND_COLORS.map((color) => ({
            title: color.title,
            value: color.value,
            hex: color.hex,
          })),
        },
      ]}
    />
  )
}
