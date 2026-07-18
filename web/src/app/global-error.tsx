'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & {digest?: string}
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{fontFamily: 'system-ui, sans-serif', padding: '2rem'}}>
        <h1 style={{fontSize: '1.25rem', marginBottom: '0.75rem'}}>Something went wrong</h1>
        <p style={{color: '#555', marginBottom: '1rem'}}>{error.message}</p>
        <button type="button" onClick={reset}>
          Try again
        </button>
      </body>
    </html>
  )
}
