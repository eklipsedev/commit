'use client'

import {type StringInputProps} from 'sanity'
import {BRAND_COLORS} from '../lib/brand-colors'
import {ColorSwatchPicker} from './color-swatch-picker'

export function BrandColorInput(props: StringInputProps) {
  const {value, onChange, readOnly} = props

  return (
    <ColorSwatchPicker
      value={value}
      readOnly={readOnly}
      onChange={onChange}
      emptyLabel="No color set — frontend will use defaults"
      groups={[
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
