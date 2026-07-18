import path from 'node:path'
import {fileURLToPath} from 'node:url'
import type {NextConfig} from 'next'

const root = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    // Parent lockfiles confuse Next's workspace root inference.
    root,
  },
  images: {
    // Container content ~1200px; include 2x retina candidates up to ~2560.
    deviceSizes: [640, 750, 828, 1080, 1200, 1320, 1600, 1920, 2400, 2560],
    qualities: [75, 85, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'image.mux.com',
      },
    ],
  },
}

export default nextConfig
