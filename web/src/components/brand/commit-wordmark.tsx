import {cn} from '@/lib/cn'

type CommitWordmarkProps = {
  className?: string
  /** Accessible title when used as a standalone logo */
  title?: string
  /** Period fill — defaults to charcoal; use brand yellow after intro / in nav */
  periodClassName?: string
  periodStyle?: React.CSSProperties
}

/**
 * Official Commit lockup (1296×193). Letter fill is currentColor;
 * period can be styled separately (charcoal → yellow during intro fade).
 */
export function CommitWordmark({
  className,
  title = 'Commit',
  periodClassName,
  periodStyle,
}: CommitWordmarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1296 193"
      fill="none"
      className={cn('text-brand-charcoal', className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path
        d="M99.7463 146.843C71.7696 146.843 48.7836 124.138 48.7836 92.9982C48.7836 68.1143 71.7696 45.4095 99.7463 45.4095C116.898 45.4095 132.081 53.915 141.36 66.2164L178.897 42.879C162.659 16.3784 133.628 0 99.7463 0C47.7995 0 0 38.2396 0 92.7873C0 151.131 41.8246 192.323 99.7463 192.323C136.158 192.323 163.502 175.944 178.686 149.303L140.587 125.614C131.308 138.759 116.406 146.843 99.6761 146.843H99.7463Z"
        fill="currentColor"
      />
      <path
        d="M407.425 92.7877C407.425 151.131 365.6 192.323 307.679 192.323C249.757 192.323 207.932 151.201 207.932 92.7877C208.003 38.24 255.872 0.000366211 307.749 0.000366211C359.625 0.000366211 407.495 38.24 407.495 92.7877H407.425ZM256.786 92.9986C256.786 124.068 279.772 146.843 307.749 146.843C335.726 146.843 358.712 124.139 358.712 92.9986C358.712 68.1147 335.726 45.4099 307.749 45.4099C279.772 45.4099 256.786 68.1147 256.786 92.9986Z"
        fill="currentColor"
      />
      <path
        d="M469.624 5.97557H515.737L552.36 102.348L591.091 5.97557H637.696L664.97 186.278H618.084L604.939 82.4548H604.447L561.146 186.278H542.519L501.116 82.4548H500.624L485.581 186.278H438.976L469.624 5.97557Z"
        fill="currentColor"
      />
      <path
        d="M732.875 5.97557H778.988L815.61 102.348L854.342 5.97557H900.947L928.221 186.278H881.335L868.19 82.4548H867.698L824.397 186.278H805.769L764.367 82.4548H763.874L748.832 186.278H702.227L732.875 5.97557Z"
        fill="currentColor"
      />
      <path d="M1024.31 186.278H977.425V5.97557H1024.31V186.278Z" fill="currentColor" />
      <path
        d="M1155.34 186.278H1108.46V45.6913H1062.7V5.97557H1201.1V45.6913H1155.34V186.278Z"
        fill="currentColor"
      />
      <path
        d="M1259.17 192.252C1279.51 192.252 1296 175.761 1296 155.419C1296 135.076 1279.51 118.585 1259.17 118.585C1238.82 118.585 1222.33 135.076 1222.33 155.419C1222.33 175.761 1238.82 192.252 1259.17 192.252Z"
        className={cn(!periodClassName && !periodStyle && 'fill-current', periodClassName)}
        style={periodStyle}
      />
    </svg>
  )
}
