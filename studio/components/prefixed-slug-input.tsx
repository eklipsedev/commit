'use client'

import {Box, Card, Flex, Text} from '@sanity/ui'
import {type ObjectInputProps, type SlugValue} from 'sanity'

/**
 * Slug input with a fixed URL prefix shown to the left (e.g. `/work/` or `/legal/`).
 * The stored value remains only the slug segment (`current`), not the full path.
 */
export function createPrefixedSlugInput(prefix: string) {
  function PrefixedSlugInput(props: ObjectInputProps<SlugValue>) {
    return (
      <Flex align="center" gap={2}>
        <Card
          padding={3}
          radius={2}
          tone="transparent"
          border
          style={{flexShrink: 0, background: 'var(--card-muted-bg-color)'}}
        >
          <Text size={1} muted style={{fontFamily: 'var(--font-family-mono, monospace)'}}>
            {prefix}
          </Text>
        </Card>
        <Box flex={1} style={{minWidth: 0}}>
          {props.renderDefault(props)}
        </Box>
      </Flex>
    )
  }

  PrefixedSlugInput.displayName = `PrefixedSlugInput(${prefix})`
  return PrefixedSlugInput
}

export const WorkSlugInput = createPrefixedSlugInput('/work/')
export const LegalSlugInput = createPrefixedSlugInput('/legal/')
