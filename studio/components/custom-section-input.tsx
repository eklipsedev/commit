'use client'

import {useCallback, useEffect, useMemo, useState} from 'react'
import {Box, Button, Card, Flex, Grid, Spinner, Stack, Text} from '@sanity/ui'
import {set, unset, useClient, type ObjectInputProps} from 'sanity'
import {BlockContentIcon} from '../lib/icons'
import {
  cloneFlexibleSectionFromTemplate,
  type FlexibleSectionTemplateSource,
} from '../lib/clone-flexible-section'

type TemplateListItem = FlexibleSectionTemplateSource & {
  _id: string
  title?: string
  description?: string
  previewUrl?: string | null
}

type CustomSectionValue = {
  _type?: 'customSection'
  modules?: unknown[]
  collapsePaddingTop?: boolean
  collapsePaddingBottom?: boolean
  backgroundColor?: string | null
  headingColor?: string | null
  bodyColor?: string | null
  taglineColor?: string | null
  accentColor?: string | null
}

const TEMPLATES_QUERY = `*[_type == "flexibleSectionTemplate"] | order(title asc) {
  _id,
  title,
  description,
  "previewUrl": previewImage.asset->url,
  modules,
  collapsePaddingTop,
  collapsePaddingBottom,
  backgroundColor,
  headingColor,
  bodyColor,
  taglineColor,
  accentColor
}`

/**
 * Empty Flexible sections start with Blank vs From template.
 * Choosing a template deep-copies modules + styles (independent of the library doc).
 */
export function CustomSectionInput(props: ObjectInputProps<CustomSectionValue>) {
  const {onChange, readOnly, renderDefault, value} = props
  const hasModules = Boolean(value?.modules?.length)
  const [picking, setPicking] = useState(!hasModules)
  const [browsingTemplates, setBrowsingTemplates] = useState(false)
  const client = useClient({apiVersion: '2026-02-01'})
  const [templates, setTemplates] = useState<TemplateListItem[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (hasModules) setPicking(false)
  }, [hasModules])

  useEffect(() => {
    if (!browsingTemplates) return
    let cancelled = false
    setLoading(true)
    setError(null)
    client
      .fetch<TemplateListItem[]>(TEMPLATES_QUERY)
      .then((result) => {
        if (!cancelled) setTemplates(result ?? [])
      })
      .catch(() => {
        if (!cancelled) {
          setTemplates([])
          setError('Could not load templates.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [browsingTemplates, client])

  const applyTemplate = useCallback(
    (template: TemplateListItem) => {
      const seed = cloneFlexibleSectionFromTemplate(template)
      onChange([
        set(seed.modules, ['modules']),
        seed.collapsePaddingTop === undefined
          ? unset(['collapsePaddingTop'])
          : set(seed.collapsePaddingTop, ['collapsePaddingTop']),
        seed.collapsePaddingBottom === undefined
          ? unset(['collapsePaddingBottom'])
          : set(seed.collapsePaddingBottom, ['collapsePaddingBottom']),
        seed.backgroundColor == null
          ? unset(['backgroundColor'])
          : set(seed.backgroundColor, ['backgroundColor']),
        seed.headingColor == null ? unset(['headingColor']) : set(seed.headingColor, ['headingColor']),
        seed.bodyColor == null ? unset(['bodyColor']) : set(seed.bodyColor, ['bodyColor']),
        seed.taglineColor == null
          ? unset(['taglineColor'])
          : set(seed.taglineColor, ['taglineColor']),
        seed.accentColor == null ? unset(['accentColor']) : set(seed.accentColor, ['accentColor']),
      ])
      setBrowsingTemplates(false)
      setPicking(false)
    },
    [onChange],
  )

  const startBlank = useCallback(() => {
    setBrowsingTemplates(false)
    setPicking(false)
  }, [])

  const templateCountLabel = useMemo(() => {
    if (!templates) return null
    return `${templates.length} template${templates.length === 1 ? '' : 's'}`
  }, [templates])

  if (picking && !hasModules) {
    return (
      <Stack space={4}>
        <Card padding={4} radius={3} border tone="transparent">
          <Stack space={4}>
            <Stack space={2}>
              <Flex align="center" gap={2}>
                <BlockContentIcon />
                <Text size={2} weight="semibold">
                  Start this Flexible section
                </Text>
              </Flex>
              <Text size={1} muted>
                Start blank, or copy a template from Config → Flexible section templates. Copies are
                independent — editing this section will not change the template.
              </Text>
            </Stack>

            {!browsingTemplates ? (
              <Flex gap={2} wrap="wrap">
                <Button
                  text="Start blank"
                  mode="ghost"
                  disabled={readOnly}
                  onClick={startBlank}
                />
                <Button
                  text="From template…"
                  tone="primary"
                  disabled={readOnly}
                  onClick={() => setBrowsingTemplates(true)}
                />
              </Flex>
            ) : (
              <Stack space={3}>
                <Flex align="center" justify="space-between" gap={3}>
                  <Text size={1} weight="medium">
                    Choose a template{templateCountLabel ? ` · ${templateCountLabel}` : ''}
                  </Text>
                  <Button
                    text="Back"
                    mode="bleed"
                    fontSize={1}
                    disabled={readOnly}
                    onClick={() => setBrowsingTemplates(false)}
                  />
                </Flex>

                {loading && (
                  <Flex align="center" gap={2} padding={3}>
                    <Spinner muted />
                    <Text size={1} muted>
                      Loading templates…
                    </Text>
                  </Flex>
                )}

                {error && (
                  <Text size={1} style={{color: 'var(--card-badge-critical-fg-color)'}}>
                    {error}
                  </Text>
                )}

                {!loading && templates && templates.length === 0 && (
                  <Card padding={3} radius={2} tone="caution">
                    <Text size={1}>
                      No templates yet. Create one under Config → Flexible section templates, then
                      return here.
                    </Text>
                  </Card>
                )}

                {!loading && templates && templates.length > 0 && (
                  <Grid columns={[1, 1, 2]} gap={3}>
                    {templates.map((template) => (
                      <Card
                        key={template._id}
                        as="button"
                        type="button"
                        padding={0}
                        radius={2}
                        border
                        tone="transparent"
                        disabled={readOnly}
                        style={{
                          cursor: readOnly ? 'default' : 'pointer',
                          textAlign: 'left',
                          overflow: 'hidden',
                        }}
                        onClick={() => !readOnly && applyTemplate(template)}
                      >
                        {template.previewUrl ? (
                          <Box
                            style={{
                              aspectRatio: '16 / 10',
                              backgroundImage: `url(${template.previewUrl})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          />
                        ) : (
                          <Flex
                            align="center"
                            justify="center"
                            padding={4}
                            style={{
                              aspectRatio: '16 / 10',
                              background: 'var(--card-muted-bg-color)',
                            }}
                          >
                            <BlockContentIcon />
                          </Flex>
                        )}
                        <Stack space={2} padding={3}>
                          <Text size={1} weight="semibold">
                            {template.title || 'Untitled template'}
                          </Text>
                          {template.description && (
                            <Text size={1} muted>
                              {template.description}
                            </Text>
                          )}
                          <Text size={0} muted>
                            {template.modules?.length ?? 0} module
                            {(template.modules?.length ?? 0) === 1 ? '' : 's'}
                          </Text>
                        </Stack>
                      </Card>
                    ))}
                  </Grid>
                )}
              </Stack>
            )}
          </Stack>
        </Card>
      </Stack>
    )
  }

  return <>{renderDefault(props)}</>
}
