import {defineLive} from 'next-sanity/live'
import {client} from './client'
import {token} from './token'

export const {sanityFetch, SanityLive} = defineLive({
  client: client.withConfig({
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-02-01',
    useCdn: false,
  }),
  serverToken: token,
  browserToken: token,
})
