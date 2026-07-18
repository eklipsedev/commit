'use client'

import {useCallback, useId, useRef, useState} from 'react'
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Popover,
  Stack,
  Text,
  Tooltip,
  useClickOutsideEvent,
} from '@sanity/ui'
import {set, unset} from 'sanity'

export type ColorSwatchOption = {
  title: string
  /** Stored field value — brand token or hex */
  value: string
  hex: string
}

type ColorSwatchGroup = {
  label: string
  colors: ColorSwatchOption[]
}

type ColorSwatchPickerProps = {
  value?: string
  readOnly?: boolean
  groups: ColorSwatchGroup[]
  emptyLabel?: string
  onChange: (patch: ReturnType<typeof set> | ReturnType<typeof unset>) => void
}

function resolveSelected(groups: ColorSwatchGroup[], value?: string) {
  for (const group of groups) {
    const match = group.colors.find((c) => c.value === value)
    if (match) return match
  }
  if (value?.startsWith('#')) {
    return {title: value, value, hex: value}
  }
  return null
}

function SwatchButton({
  color,
  selected,
  readOnly,
  onSelect,
}: {
  color: ColorSwatchOption
  selected: boolean
  readOnly?: boolean
  onSelect: (value: string) => void
}) {
  return (
    <Tooltip
      content={
        <Box padding={2}>
          <Text size={1}>
            {color.title}
            <br />
            <code>{color.hex}</code>
          </Text>
        </Box>
      }
      placement="top"
      portal
    >
      <button
        type="button"
        aria-label={color.title}
        aria-pressed={selected}
        disabled={readOnly}
        onClick={() => onSelect(color.value)}
        style={{
          width: 28,
          height: 28,
          padding: 0,
          borderRadius: 6,
          backgroundColor: color.hex,
          border: selected
            ? '2px solid var(--card-focus-ring-color, #2276fc)'
            : '1px solid rgba(0,0,0,0.2)',
          boxShadow: selected ? '0 0 0 1px #fff inset' : undefined,
          cursor: readOnly ? 'default' : 'pointer',
        }}
      />
    </Tooltip>
  )
}

/**
 * Compact color field: shows the current swatch, opens a popover grid of options.
 * Prefer this over long labeled card lists when many colors / groups are available.
 */
export function ColorSwatchPicker({
  value,
  readOnly,
  groups,
  emptyLabel = 'No color set',
  onChange,
}: ColorSwatchPickerProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const selected = resolveSelected(groups, value)

  useClickOutsideEvent(
    open ? () => setOpen(false) : false,
    () => [buttonRef.current, panelRef.current],
  )

  const handleSelect = useCallback(
    (next: string) => {
      if (readOnly) return
      onChange(value === next ? unset() : set(next))
      setOpen(false)
    },
    [onChange, readOnly, value],
  )

  const handleClear = useCallback(() => {
    if (readOnly) return
    onChange(unset())
    setOpen(false)
  }, [onChange, readOnly])

  return (
    <Stack space={2}>
      <Popover
        id={id}
        open={open}
        portal
        placement="bottom-start"
        content={
          <Card ref={panelRef} padding={3} radius={2} shadow={2} style={{maxWidth: 320}}>
            <Stack space={4}>
              {groups.map((group) =>
                group.colors.length ? (
                  <Stack key={group.label} space={2}>
                    <Text size={1} weight="semibold">
                      {group.label}
                    </Text>
                    <Grid columns={[6, 8]} gap={2}>
                      {group.colors.map((color) => (
                        <SwatchButton
                          key={color.value}
                          color={color}
                          selected={value === color.value}
                          readOnly={readOnly}
                          onSelect={handleSelect}
                        />
                      ))}
                    </Grid>
                  </Stack>
                ) : (
                  <Stack key={group.label} space={2}>
                    <Text size={1} weight="semibold">
                      {group.label}
                    </Text>
                    <Text muted size={1}>
                      No colors yet
                    </Text>
                  </Stack>
                ),
              )}
              <Button
                text="Clear color"
                mode="ghost"
                tone="default"
                fontSize={1}
                disabled={readOnly || !value}
                onClick={handleClear}
              />
            </Stack>
          </Card>
        }
      >
        <Button
          ref={buttonRef}
          mode="ghost"
          padding={2}
          disabled={readOnly}
          onClick={() => setOpen((v) => !v)}
          style={{width: '100%', justifyContent: 'flex-start'}}
        >
          <Flex align="center" gap={3}>
            <Box
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                backgroundColor: selected?.hex ?? 'transparent',
                border: '1px solid rgba(0,0,0,0.2)',
                backgroundImage: selected
                  ? undefined
                  : 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                backgroundSize: selected ? undefined : '8px 8px',
                backgroundPosition: selected ? undefined : '0 0, 0 4px, 4px -4px, -4px 0',
                flexShrink: 0,
              }}
            />
            <Stack space={1} style={{textAlign: 'left'}}>
              <Text size={1} weight="medium">
                {selected?.title ?? emptyLabel}
              </Text>
              {selected ? (
                <Text muted size={0}>
                  <code>
                    {selected.value === selected.hex
                      ? selected.hex
                      : `${selected.value} · ${selected.hex}`}
                  </code>
                </Text>
              ) : (
                <Text muted size={0}>
                  Click to choose
                </Text>
              )}
            </Stack>
          </Flex>
        </Button>
      </Popover>
    </Stack>
  )
}
