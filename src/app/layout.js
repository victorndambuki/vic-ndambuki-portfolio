import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import Cursor from '../components/Cursor'

// ── Open Graph / Social preview ───────────────────────────────────────────────
// The og:image below points to /images/vic-profile.jpg (already in your public folder).
// For best results on LinkedIn/Twitter, consider creating a dedicated 1200×630px
// banner image (e.g. /images/og-banner.jpg) and updating the path below.
// ─────────────────────────────────────────────────────────────────────────────

const SITE_URL = 'https://vic-design-portfolio.vercel.app'
const OG_IMAGE = `${SITE_URL}/images/vic-profile.jpg`
const TITLE    = 'Vic Ndambuki | Mechanical Engineer'
const DESC     = 'Portfolio of Vic Ndambuki — mechanical engineer specialising in CAD design, precision laser cutting, and 3D printing fabrication in Nairobi, Kenya.'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title:        TITLE,
  description:  DESC,
  keywords:     'Vic Ndambuki, mechanical engineering, laser cutting, 3D printing, CAD, SolidWorks, Kenya',

  openGraph: {
    title:       TITLE,
    description: DESC,
    url:         SITE_URL,
    siteName:    'Vic Ndambuki',
    type:        'website',
    locale:      'en_KE',
    images: [{
      url:    OG_IMAGE,
      width:  1200,
      height: 630,
      alt:    'Vic Ndambuki — Mechanical Engineer · Nairobi, Kenya',
    }],
  },

  twitter: {
    card:        'summary_large_image',
    title:       TITLE,
    description: DESC,
    images:      [OG_IMAGE],
  },

  robots: {
    index:  true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Cursor />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
