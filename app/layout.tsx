import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rohan Nimje - Technical Founder & AI Architect',
  description: 'Technical Founder & AI Automation Architect. Building AI agents, full-stack cloud architecture, and autonomous workflows.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f8fafc',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <head>
        {/* ============================================
            CRITICAL: Network Preconnections & DNS Prefetch
            ============================================ */}
        
        {/* Cloudinary CDN - Primary media hosting for images/videos */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        
        {/* Vercel Analytics - Non-critical, lower priority */}
        <link rel="dns-prefetch" href="https://cdn.vercel-analytics.com" />
        
        {/* ============================================
            CRITICAL: Eager Resource Hints
            ============================================ */}
        
        {/* Hero section profile image - HIGHEST PRIORITY */}
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/doyiqcna9/image/upload/v1783672197/rohan_nimje_profile_zkmb5q.jpg"
          imageSrcSet="https://res.cloudinary.com/doyiqcna9/image/upload/c_scale,w_400,q_auto/v1783672197/rohan_nimje_profile_zkmb5q.jpg 400w, https://res.cloudinary.com/doyiqcna9/image/upload/c_scale,w_600,q_auto/v1783672197/rohan_nimje_profile_zkmb5q.jpg 600w"
          imageSizes="(max-width: 768px) 208px, (max-width: 1024px) 256px, 288px"
          fetchPriority="high"
        />
        
        {/* Featured project MVP video - CRITICAL for above-fold */}
        <link
          rel="preload"
          as="video"
          href="https://res.cloudinary.com/doyiqcna9/video/upload/v1783673286/Ai_Daily_Coach_automation_qzojiw.mp4"
          type="video/mp4"
        />
        
        {/* First 3 certification carousel images - CRITICAL ABOVE-FOLD */}
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/doyiqcna9/image/upload/v1783666765/Python_dtzvco.png"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/doyiqcna9/image/upload/v1783666876/mvp_certification_k5sedb.png"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/doyiqcna9/image/upload/v1783666902/genrative_ai_shqice.png"
          fetchPriority="high"
        />
        
        {/* ============================================
            BELOW-FOLD: Prefetch Strategy
            ============================================ */}
        
        {/* Remaining project videos */}
        <link
          rel="prefetch"
          as="video"
          href="https://res.cloudinary.com/doyiqcna9/video/upload/v1783772817/Infrastruture_Demo_Video_rvobvw.mp4"
          type="video/mp4"
        />
        <link
          rel="prefetch"
          as="video"
          href="https://res.cloudinary.com/doyiqcna9/video/upload/v1783668274/Automation_Anywhere_Project_-_Hackathon_Finder_1_ez6s0w.mp4"
          type="video/mp4"
        />
        
        {/* Honors/Awards carousel images */}
        <link
          rel="prefetch"
          as="image"
          href="https://res.cloudinary.com/doyiqcna9/image/upload/v1783672981/innovator_hackthon_wrh0cm.jpg"
        />
        <link
          rel="prefetch"
          as="image"
          href="https://res.cloudinary.com/doyiqcna9/image/upload/v1783672736/ZCWRN38D0K_kvrcoa.png"
        />
        
        {/* Remaining certifications (lazy-load below fold) */}
        <link
          rel="prefetch"
          as="image"
          href="https://res.cloudinary.com/doyiqcna9/image/upload/v1783667496/Salesforce_nqv0z9.png"
        />
        <link
          rel="prefetch"
          as="image"
          href="https://res.cloudinary.com/doyiqcna9/image/upload/v1783667223/XPM_4.0_emxpxe.jpg"
        />
        <link
          rel="prefetch"
          as="image"
          href="https://res.cloudinary.com/doyiqcna9/image/upload/v1783667271/sql_nwfd8x.jpg"
        />
        <link
          rel="prefetch"
          as="image"
          href="https://res.cloudinary.com/doyiqcna9/image/upload/v1783667286/boostrap_flexbox_nimhpn.png"
        />
        
        {/* ============================================
            Non-critical Prefetch (Below fold)
            ============================================ */}
        
        <link
          rel="prefetch"
          as="image"
          href="https://res.cloudinary.com/doyiqcna9/image/upload/v1783673671/make_lpslhr.jpg"
        />
        
        {/* ============================================
            Font Optimization (if using web fonts)
            ============================================ */}
        
        {/* Optimize font loading with font-display: swap for instant text rendering */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-background text-foreground pb-32 md:pb-0">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
