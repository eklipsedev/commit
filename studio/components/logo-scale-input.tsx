'use client'

import {Box, Flex, Stack, Text} from '@sanity/ui'
import {set, unset, useClient, useFormValue, type NumberInputProps} from 'sanity'

/** Matches the website logo slot: 160×56. */
const FRAME_RATIO = '160 / 56'
const MIN_SCALE = 40
const MAX_SCALE = 100

type LogoImage = {
  asset?: {_ref?: string}
  crop?: {top?: number; bottom?: number; left?: number; right?: number}
}

function logoPreviewUrl(
  image: LogoImage | undefined,
  projectId?: string,
  dataset?: string,
) {
  const ref = image?.asset?._ref
  if (!ref || !projectId || !dataset) return null
  const match = ref.match(/^image-([a-z0-9]+)-(\d+)x(\d+)-(\w+)$/i)
  if (!match) return null

  const [, id, width, height, format] = match
  const sourceWidth = Number(width)
  const sourceHeight = Number(height)
  const crop = image.crop
  const params = new URLSearchParams({w: '640', fit: 'max', auto: 'format'})

  if (crop && sourceWidth && sourceHeight) {
    const left = crop.left ?? 0
    const top = crop.top ?? 0
    const right = crop.right ?? 0
    const bottom = crop.bottom ?? 0
    const rectX = Math.round(left * sourceWidth)
    const rectY = Math.round(top * sourceHeight)
    const rectW = Math.max(1, Math.round((1 - left - right) * sourceWidth))
    const rectH = Math.max(1, Math.round((1 - top - bottom) * sourceHeight))
    params.set('rect', `${rectX},${rectY},${rectW},${rectH}`)
  }

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${width}x${height}.${format}?${params}`
}

/**
 * Scale a logo inside the same fixed frame the website uses.
 * 100% fills the frame. Lower values shrink a visually heavy mark.
 */
export function LogoScaleInput(props: NumberInputProps) {
  const {value, onChange, readOnly} = props
  const client = useClient({apiVersion: '2026-02-01'})
  const image = useFormValue(['image']) as LogoImage | undefined
  const scale = typeof value === 'number' ? value : MAX_SCALE
  const {projectId, dataset} = client.config()
  const src = logoPreviewUrl(image, projectId, dataset)

  function commit(next: number) {
    const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(next)))
    onChange(clamped === MAX_SCALE ? unset() : set(clamped))
  }

  return (
    <Stack space={3}>
      <Box
        style={{
          width: '100%',
          maxWidth: 360,
          aspectRatio: FRAME_RATIO,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fbfafa',
          border: '1px solid var(--card-border-color)',
        }}
      >
        <div
          style={{
            width: `${scale}%`,
            height: `${scale}%`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {src ? (
            <img
              src={src}
              alt=""
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                filter: 'grayscale(1)',
              }}
            />
          ) : (
            <Text size={1} muted>
              Add a logo image to preview the frame.
            </Text>
          )}
        </div>
      </Box>
      <Flex align="center" gap={3}>
        <input
          type="range"
          min={MIN_SCALE}
          max={MAX_SCALE}
          step={1}
          value={scale}
          disabled={readOnly}
          aria-label="Logo scale"
          onChange={(event) => commit(Number(event.target.value))}
          style={{flex: 1}}
        />
        <Text size={1} weight="medium">
          {scale}%
        </Text>
      </Flex>
      <Text size={1} muted>
        100% is as large as the website frame allows. Drag left to shrink a logo that looks too
        heavy next to the others.
      </Text>
    </Stack>
  )
}
