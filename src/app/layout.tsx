import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Toaster } from 'sonner'

import './globals.css'

export const metadata = {
  title: 'ChefGPT',
  description: 'AI Recipe Generator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.className} ${GeistMono.variable} bg-background text-foreground antialiased selection:bg-primary/30 selection:text-primary-foreground`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
