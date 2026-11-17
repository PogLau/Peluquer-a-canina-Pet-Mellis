import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  experimental: {
    // «Sugerir con foto»: el navegador reduce la imagen, pero se acepta hasta 4 MB por si no puede
    serverActions: { bodySizeLimit: '5mb' },
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

/*
  Demo estática para GitHub Pages (DEMO_ESTATICO=1, ver docs/demo.md): solo se compilan las páginas *.demo.tsx
  de src/app/(demo), que guardan los datos en el navegador. Sin servidor, sin Payload y sin base de datos.
*/
const demoConfig: NextConfig = {
  output: 'export',
  pageExtensions: ['demo.tsx', 'demo.ts'],
  basePath: process.env.DEMO_BASE_PATH || '',
  trailingSlash: true,
  distDir: '.next-demo',
  images: { unoptimized: true },
  turbopack: { root: path.resolve(dirname) },
}

export default process.env.DEMO_ESTATICO === '1'
  ? demoConfig
  : withPayload(nextConfig, { devBundleServerPackages: false })
