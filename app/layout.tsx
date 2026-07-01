import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NucléoLogis — Logements pour travailleurs du nucléaire',
  description: 'Trouvez un logement meublé proche des centrales EDF. Tricastin, Cruas-Meysse, et bientôt tous les sites EDF de France.',
  keywords: ['logement nucléaire', 'grand arrêt', 'EDF', 'Tricastin', 'Cruas', 'travailleur nucléaire', 'maintenance centrale'],
  openGraph: {
    title: 'NucléoLogis',
    description: 'Logements meublés pour travailleurs du nucléaire — proches des sites EDF',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-gray-50`}>
        <Navbar/>
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-800 text-gray-400 py-8 px-4 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-bold text-white">NucléoLogis ☢</div>
            <div className="text-sm flex gap-6">
              <a href="#" className="hover:text-white transition">Mentions légales</a>
              <a href="#" className="hover:text-white transition">CGU</a>
              <a href="#" className="hover:text-white transition">RGPD</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
            <div className="text-xs">© 2026 NucléoLogis · Tous droits réservés</div>
          </div>
        </footer>
      </body>
    </html>
  )
}
