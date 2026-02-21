import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Image from 'next/image'
import Link from 'next/link'
import { logout } from './actions/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pocket Money',
  description: 'Debt Ledger for SRSMA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen text-slate-900`}>
        {/* We only render the header globally. The middleware handles logic, but to prevent header on login,
            we could make a layout just for (auth) and (app). For simplicity, we can render the header everywhere
            and let users naturally use it. */}
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200">
                <Image src="/img/logo.jpeg" alt="Logo" fill className="object-cover" />
              </div>
              <span className="font-semibold text-lg tracking-tight">Pocket Money</span>
            </Link>

            <form action={logout}>
              <button className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Logout
              </button>
            </form>
          </div>
        </header>

        <main className="max-w-md mx-auto relative h-full">
          {children}
        </main>
      </body>
    </html>
  )
}
