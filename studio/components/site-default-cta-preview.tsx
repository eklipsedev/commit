'use client'

import {useCallback, useEffect, useMemo, useState} from 'react'
import {Box, Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {
  type ObjectInputProps,
  type PreviewProps,
  unset,
  useClient,
  useFormValue,
} from 'sanity'
import {BoltIcon} from '../lib/icons'

type DefaultCtaPreview = {
  tagline?: string
  buttonLabel?: string
  headlinePlain?: string
}

type CtaValue = {
  tagline?: string
  headline?: unknown[]
  button?: {label?: string; link?: unknown}
  useSiteDefault?: boolean
}

const DEFAULT_CTA_QUERY = `*[_id == "defaultCta"][0].cta{
  tagline,
  "buttonLabel": button.label,
  "headlinePlain": pt::text(headline)
}`

function useDefaultCtaPreview() {
  const client = useClient({apiVersion: '2026-02-01'})
  const [data, setData] = useState<DefaultCtaPreview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    client
      .fetch<DefaultCtaPreview | null>(DEFAULT_CTA_QUERY)
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch(() => {
        if (!cancelled) setData(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [client])

  return {data, loading}
}

function hasCtaOverrides(value?: CtaValue | null) {
  return Boolean(
    value?.tagline?.trim() ||
      (Array.isArray(value?.headline) && value.headline.length > 0) ||
      value?.button?.label ||
      value?.button?.link ||
      value?.useSiteDefault,
  )
}

/**
 * CTA object input: site-default hint + reset, then the normal fields.
 */
export function CtaObjectInput(props: ObjectInputProps<CtaValue>) {
  const {onChange, readOnly, renderDefault, value} = props
  const docType = useFormValue(['_type']) as string | undefined
  const showHint = docType !== 'defaultCta' && docType !== 'project'
  const {data, loading} = useDefaultCtaPreview()
  const canReset = useMemo(() => hasCtaOverrides(value), [value])

  const resetToDefaults = useCallback(() => {
    onChange([
      unset(['tagline']),
      unset(['headline']),
      unset(['button']),
      unset(['useSiteDefault']),
    ])
  }, [onChange])

  return (
    <Stack space={5}>
      {showHint && (
        <Card padding={5} radius={3} tone="transparent" border>
          <Stack space={5}>
            <Stack space={3}>
              <Flex align="flex-start" gap={3}>
                <Box style={{marginTop: 2}}>
                  <BoltIcon />
                </Box>
                <Stack space={3} flex={1}>
                  <Text size={1} weight="semibold">
                    Site default fallbacks
                  </Text>
                  <Text size={1} muted style={{lineHeight: 1.5}}>
                    Leave a field blank to use default CTA. Fill only what you want to override.
                  </Text>
                </Stack>
              </Flex>
            </Stack>

            {loading ? (
              <Text size={1} muted>
                Loading defaults…
              </Text>
            ) : data ? (
              <Stack space={4}>
                <HintRow label="Default tagline" value={data.tagline || '—'} />
                <HintRow label="Default headline" value={data.headlinePlain || '—'} />
                <HintRow label="Default button" value={data.buttonLabel || '—'} />
              </Stack>
            ) : (
              <Text size={1} muted style={{lineHeight: 1.5}}>
                No Default CTA published yet. Open Config → Default CTA to set one.
              </Text>
            )}

            <Box>
              <Button
                text="Reset to site defaults"
                mode="ghost"
                tone="primary"
                fontSize={1}
                disabled={readOnly || !canReset}
                onClick={resetToDefaults}
              />
            </Box>
          </Stack>
        </Card>
      )}

      {renderDefault(props)}
    </Stack>
  )
}

function HintRow({label, value}: {label: string; value: string}) {
  return (
    <Stack space={2}>
      <Text size={0} muted style={{textTransform: 'uppercase', letterSpacing: '0.06em'}}>
        {label}
      </Text>
      <Text size={1} style={{lineHeight: 1.45}}>
        {value}
      </Text>
    </Stack>
  )
}

type CtaPreviewProps = PreviewProps & {
  tagline?: string
}

/** List preview — custom tagline if set, otherwise the live site-default tagline. */
export function CtaBlockPreview(props: CtaPreviewProps) {
  const {tagline, renderDefault} = props
  const {data, loading} = useDefaultCtaPreview()

  if (tagline?.trim()) {
    return renderDefault(props)
  }

  const defaultTagline = data?.tagline
  const title = loading ? 'CTA…' : defaultTagline ? `${defaultTagline}` : 'CTA'

  return renderDefault({
    ...props,
    title,
    subtitle: props.subtitle
      ? `${typeof props.subtitle === 'string' ? props.subtitle : 'CTA'} · site defaults`
      : 'CTA · site defaults',
  })
}
