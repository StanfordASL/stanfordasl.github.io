import '@/styles/tailwind.css'
import type { Metadata } from 'next'
import { Source_Serif_4 } from 'next/font/google'

// Stanford's brand serif, used for the "Stanford University" co-brand wordmark.
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-source-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s - Stanford ASL',
    default: 'Autonomous Systems Lab - Stanford University',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={sourceSerif.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&amp;display=swap"
        />
      </head>
      <body className="text-gray-950 antialiased">
        {children}
      </body>
    </html>
  )
}
