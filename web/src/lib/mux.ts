/** Mux image CDN helpers (safe for Server Components). */

export function muxPosterUrl(playbackId: string, width = 1600) {
  return `https://image.mux.com/${playbackId}/thumbnail.jpg?width=${width}&fit_mode=preserve&time=0`
}
