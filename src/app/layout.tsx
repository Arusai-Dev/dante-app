import { type Metadata } from 'next'
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Head from 'next/head'
import { Toaster } from 'sonner'

const interSans = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dante',
  description: '',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={interSans.className}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
        </Head>
        <body className="antialiased">
          <Toaster />
          <Navbar/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}