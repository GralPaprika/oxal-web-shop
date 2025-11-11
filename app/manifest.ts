import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Oxal - Boutique Artesanal',
    short_name: 'Oxal',
    description: 'Descubre joyas y ropa artesanal premium de Colima, México',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f4f0ea',
    theme_color: '#525934',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/oxal-logo-name.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/landing-background.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/landing-background.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['shopping', 'business'],
    screenshots: [
      {
        src: '/landing-background.png',
        sizes: '540x720',
        type: 'image/png',
        form_factor: 'narrow',
      },
      {
        src: '/landing-background.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
    ],
    shortcuts: [
      {
        name: 'Ver Colecciones',
        short_name: 'Colecciones',
        description: 'Explora nuestras colecciones de joyas y ropa',
        url: '/#collections',
        icons: [{ src: '/oxal-logo-name.svg', sizes: '192x192' }],
      },
      {
        name: 'Contacto',
        short_name: 'Contacto',
        description: 'Ponte en contacto con nosotros',
        url: '/#contact',
        icons: [{ src: '/oxal-logo-name.svg', sizes: '192x192' }],
      },
    ],
    prefer_related_applications: false,
  };
}
