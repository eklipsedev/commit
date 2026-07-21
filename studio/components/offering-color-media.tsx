import {getBrandColor} from '../lib/brand-colors'

type OfferingColorMediaProps = {
  background?: string | null
  foreground?: string | null
}

/** Two-column color swatch for offering list/reorder previews. */
export function OfferingColorMedia({background, foreground}: OfferingColorMediaProps) {
  const left = getBrandColor(background)?.hex ?? '#E8E8E8'
  const right = getBrandColor(foreground)?.hex ?? '#B0B0B0'

  return (
    <span
      aria-hidden
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <span style={{flex: 1, backgroundColor: left}} />
      <span style={{flex: 1, backgroundColor: right}} />
    </span>
  )
}
