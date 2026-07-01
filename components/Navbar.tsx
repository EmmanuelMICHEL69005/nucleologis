'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="bg-[#1e3a5f] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm">☢</div>
          Nucléo<span className="text-orange-400">Logis</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/rechercher" className="hover:text-orange-400 transition">Trouver un logement</Link>
          <Link href="/proprietaire" className="hover:text-orange-400 transition">Espace propriétaire</Link>
          <Link href="/facture" className="hover:text-orange-400 transition">🧾 Factures</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth" className="hidden md:block text-sm hover:text-orange-400 transition">Connexion</Link>
          <Link href="/auth?mode=register" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            S'inscrire
          </Link>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-[#172554] px-4 pb-4 space-y-3 text-sm">
          <Link href="/rechercher" className="block py-2 border-b border-white/10" onClick={() => setOpen(false)}>Trouver un logement</Link>
          <Link href="/proprietaire" className="block py-2 border-b border-white/10" onClick={() => setOpen(false)}>Espace propriétaire</Link>
          <Link href="/facture" className="block py-2 border-b border-white/10" onClick={() => setOpen(false)}>🧾 Générer une facture</Link>
          <Link href="/auth" className="block py-2" onClick={() => setOpen(false)}>Connexion</Link>
        </div>
      )}
    </nav>
  )
}
