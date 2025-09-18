import type { Metadata } from 'next'

import '@/config/styles/globals.css'
import { LayoutModule } from '@/modules/layout'

import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import Providers from './providers'

export const metadata: Metadata = {
  title: {
    default: 'Blog',
    template: '%s | Blog',
  },
  description: 'Modern blog application built with Next.js',
  keywords: 'blog, nextjs, react, typescript',
}

// component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  // return
  return (
    <html lang='en'>
      <body suppressHydrationWarning>
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <LayoutModule>{children}</LayoutModule>
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  )
}
