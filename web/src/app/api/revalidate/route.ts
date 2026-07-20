import {revalidatePath} from 'next/cache'
import {type NextRequest} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

/**
 * Sanity webhook target — revalidate the site when content is published.
 * Create a webhook in sanity.io/manage → API → Webhooks pointing here.
 */
export async function POST(req: NextRequest) {
  try {
    const {body, isValidSignature} = await parseBody(req, process.env.SANITY_REVALIDATE_SECRET)

    if (isValidSignature === false) {
      return new Response('Invalid signature', {status: 401})
    }

    if (!body?._type) {
      return new Response('Bad Request', {status: 400})
    }

    revalidatePath('/', 'layout')

    return Response.json({revalidated: true, now: Date.now()})
  } catch (error) {
    console.error('[revalidate]', error)
    return new Response(error instanceof Error ? error.message : 'Error', {status: 500})
  }
}
