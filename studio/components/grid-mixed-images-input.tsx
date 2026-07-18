'use client'

import {Card} from '@sanity/ui'
import {type FieldProps, type ObjectInputProps} from 'sanity'
import styled from 'styled-components'

export type GridMixedImagesValue = {
  _type?: 'gridMixedImages'
  topLeft?: unknown
  topRight?: unknown
  leftTall?: unknown
  centerSquare?: unknown
  rightSquare?: unknown
  bottomLeft?: unknown
  bottomWide?: unknown
}

/** Drop field titles so slots are image-only. */
export function GridMixedSlotField(props: FieldProps) {
  return <>{props.children}</>
}

/**
 * Turns the default object Stack into the 7-slot collage grid.
 * Using renderDefault (not ObjectInputMember) keeps image clear / alt
 * edits on the normal patch path — custom member layouts were crashing
 * with “Cannot read properties of undefined (reading 'length')”.
 */
const CollageRoot = styled.div`
  & > [data-ui='Stack'] {
    display: grid !important;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-template-areas:
      'topLeft topLeft topLeft topRight topRight topRight'
      'leftTall leftTall centerSquare centerSquare rightSquare rightSquare'
      'bottomLeft bottomLeft bottomWide bottomWide bottomWide bottomWide';
    gap: 8px !important;
    align-items: start;
  }

  /* Schema field order → grid areas */
  & > [data-ui='Stack'] > *:nth-child(1) {
    grid-area: topLeft;
    min-height: 120px;
    min-width: 0;
    overflow: auto;
  }
  & > [data-ui='Stack'] > *:nth-child(2) {
    grid-area: topRight;
    min-height: 120px;
    min-width: 0;
    overflow: auto;
  }
  & > [data-ui='Stack'] > *:nth-child(3) {
    grid-area: leftTall;
    min-height: 160px;
    min-width: 0;
    overflow: auto;
  }
  & > [data-ui='Stack'] > *:nth-child(4) {
    grid-area: centerSquare;
    min-height: 140px;
    min-width: 0;
    overflow: auto;
  }
  & > [data-ui='Stack'] > *:nth-child(5) {
    grid-area: rightSquare;
    min-height: 140px;
    min-width: 0;
    overflow: auto;
  }
  & > [data-ui='Stack'] > *:nth-child(6) {
    grid-area: bottomLeft;
    min-height: 120px;
    min-width: 0;
    overflow: auto;
  }
  & > [data-ui='Stack'] > *:nth-child(7) {
    grid-area: bottomWide;
    min-height: 120px;
    min-width: 0;
    overflow: auto;
  }

  /* Tighten space between image preview and alt / file controls */
  & [data-ui='Stack'] [data-ui='Stack'] {
    gap: 2px !important;
  }

  & [data-ui='Box'] {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
`

export function GridMixedImagesInput(props: ObjectInputProps<GridMixedImagesValue>) {
  return (
    <Card padding={2} radius={2} shadow={1} tone="transparent" border>
      <CollageRoot>{props.renderDefault(props)}</CollageRoot>
    </Card>
  )
}
