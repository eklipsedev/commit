'use client'

import {Stack, Text} from '@sanity/ui'
import {type StringInputProps} from 'sanity'

function CharacterCountInput({
  props,
  maxLength,
}: {
  props: StringInputProps
  maxLength: number
}) {
  const length = props.value?.length ?? 0
  const remaining = maxLength - length
  const over = length > maxLength

  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      <Text
        size={1}
        muted={!over}
        weight={over ? 'medium' : undefined}
        style={over ? {color: 'var(--card-badge-critical-fg-color)'} : undefined}
      >
        {over
          ? `${length - maxLength} character${length - maxLength === 1 ? '' : 's'} over the ${maxLength}-character limit`
          : `${remaining} character${remaining === 1 ? '' : 's'} remaining (max ${maxLength})`}
      </Text>
    </Stack>
  )
}

/** Live character counter for SEO titles (60 max). */
export function SeoTitleInput(props: StringInputProps) {
  return <CharacterCountInput props={props} maxLength={60} />
}

/** Live character counter for SEO descriptions (160 max). */
export function SeoDescriptionInput(props: StringInputProps) {
  return <CharacterCountInput props={props} maxLength={160} />
}
