'use client'

import {Flex, Text, TextInput} from '@sanity/ui'
import {type StringInputProps, set, unset} from 'sanity'

/** Hex string field with a native color picker for project palette swatches. */
export function HexColorInput(props: StringInputProps) {
  const {value, onChange, readOnly, elementProps} = props
  const hex = value && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value) ? value : '#000000'

  return (
    <Flex align="center" gap={3}>
      <input
        type="color"
        value={hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex}
        disabled={readOnly}
        onChange={(event) => onChange(set(event.currentTarget.value.toUpperCase()))}
        style={{
          width: 40,
          height: 40,
          padding: 0,
          border: '1px solid rgba(0,0,0,0.15)',
          borderRadius: 6,
          cursor: readOnly ? 'default' : 'pointer',
          background: 'transparent',
        }}
        aria-label="Pick color"
      />
      <TextInput
        {...elementProps}
        value={value ?? ''}
        readOnly={readOnly}
        placeholder="#FEE064"
        onChange={(event) => {
          const next = event.currentTarget.value
          onChange(next ? set(next) : unset())
        }}
      />
      {value ? (
        <Text muted size={1} style={{whiteSpace: 'nowrap'}}>
          {value}
        </Text>
      ) : null}
    </Flex>
  )
}
