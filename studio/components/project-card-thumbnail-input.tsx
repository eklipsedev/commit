'use client'

import {useEffect, useState} from 'react'
import {Box, Stack, Text} from '@sanity/ui'
import {set, unset, useClient, useFormValue, type StringInputProps} from 'sanity'

type Alternate = {_key: string; label?: string; mediaType?: string}

/**
 * Thumbnail choice for a hand-picked project card.
 * Lists the selected project's alternate thumbnails. Empty means the default.
 */
export function ProjectCardThumbnailInput(props: StringInputProps) {
  const {value, onChange, readOnly, path} = props
  const client = useClient({apiVersion: '2026-02-01'})
  const project = useFormValue([...path.slice(0, -1), 'project']) as {_ref?: string} | undefined
  const projectId = project?._ref
  const [alternates, setAlternates] = useState<Alternate[] | null>(null)

  useEffect(() => {
    if (!projectId) {
      setAlternates([])
      return
    }

    let cancelled = false
    client
      .fetch<Alternate[] | null>(
        `*[_id == $id || _id == $draftId] | order(_updatedAt desc)[0].alternateThumbnails[]{_key, label, mediaType}`,
        {id: projectId, draftId: `drafts.${projectId}`},
      )
      .then((rows) => {
        if (!cancelled) setAlternates(rows?.filter((row) => row._key) ?? [])
      })
      .catch(() => {
        if (!cancelled) setAlternates([])
      })

    return () => {
      cancelled = true
    }
  }, [client, projectId])

  if (!projectId) {
    return (
      <Text size={1} muted>
        Choose a project first.
      </Text>
    )
  }

  if (alternates === null) {
    return (
      <Text size={1} muted>
        Loading thumbnail versions…
      </Text>
    )
  }

  if (alternates.length === 0) {
    return (
      <Text size={1} muted>
        This project uses its default thumbnail. Add alternate thumbnails on the project to choose
        another version here.
      </Text>
    )
  }

  const known = !value || alternates.some((alt) => alt._key === value)

  return (
    <Stack space={3}>
      <ThumbnailOption
        label="Default thumbnail"
        checked={!value}
        disabled={readOnly}
        onPick={() => onChange(unset())}
      />
      {known ? null : (
        <Text size={1} muted>
          The selected version is no longer on this project. Choose the default or another version.
        </Text>
      )}
      {alternates.map((alt) => (
        <ThumbnailOption
          key={alt._key}
          label={
            alt.mediaType === 'video'
              ? `${alt.label || 'Untitled version'} · Video`
              : alt.label || 'Untitled version'
          }
          checked={value === alt._key}
          disabled={readOnly}
          onPick={() => onChange(set(alt._key))}
        />
      ))}
    </Stack>
  )
}

function ThumbnailOption({
  label,
  checked,
  disabled,
  onPick,
}: {
  label: string
  checked: boolean
  disabled?: boolean
  onPick: () => void
}) {
  return (
    <Box
      as="label"
      style={{display: 'flex', gap: 8, alignItems: 'center', cursor: disabled ? 'default' : 'pointer'}}
    >
      <input type="radio" checked={checked} disabled={disabled} onChange={onPick} />
      <Text size={1}>{label}</Text>
    </Box>
  )
}
