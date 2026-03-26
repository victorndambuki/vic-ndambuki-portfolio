import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import Cursor from '../components/Cursor'
import ThemeProvider from '../components/ThemeProvider'

// ── Open Graph / Social preview ───────────────────────────────────────────────
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-flash script: applies saved theme class before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('vic-theme');
                  if (!t) {
                    t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  if (t === 'light') document.documentElement.classList.add('light');
                } catch(e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <Cursor />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
