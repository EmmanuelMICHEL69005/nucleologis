'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown, LogOut, Home, FileText, CalendarCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const meta = session.user.user_metadata
        setUser({
          name: meta?.full_name || session.user.email?.split('@')[0] || 'Mon compte',
          email: session.user.email ?? '',
        })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const meta = session.user.user_metadata
        setUser({
          name: meta?.full_name || session.user.email?.split('@')[0] || 'Mon compte',
          email: session.user.email ?? '',
        })
      } else {
        setUser(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setDropdownOpen(false)
    router.push('/')
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : ''

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
          {user ? (
            <div ref={dropdownRef} className="relative hidden md:block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
              >
                <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
                <span className="text-sm font-medium max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}/>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden text-gray-800">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="font-semibold text-sm truncate">{user.name}</div>
                    <div className="text-xs text-gray-400 truncate">{user.email}</div>
                  </div>
                  <Link href="/proprietaire" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition">
                    <Home size={14} className="text-gray-400"/> Espace propriétaire
                  </Link>
                  <Link href="/mes-reservations" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition">
                    <CalendarCheck size={14} className="text-gray-400"/> Mes réservations
                  </Link>
                  <Link href="/facture" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition">
                    <FileText size={14} className="text-gray-400"/> Mes factures
                  </Link>
                  <div className="border-t border-gray-100">
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition">
                      <LogOut size={14}/> Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth" className="hidden md:block text-sm hover:text-orange-400 transition">Connexion</Link>
              <Link href="/auth" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition hidden md:block">
                S'inscrire
              </Link>
            </>
          )}

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#172554] px-4 pb-4 space-y-1 text-sm">
          <Link href="/rechercher" className="block py-2.5 border-b border-white/10" onClick={() => setOpen(false)}>Trouver un logement</Link>
          <Link href="/proprietaire" className="block py-2.5 border-b border-white/10" onClick={() => setOpen(false)}>Espace propriétaire</Link>
          <Link href="/facture" className="block py-2.5 border-b border-white/10" onClick={() => setOpen(false)}>🧾 Générer une facture</Link>
          {user ? (
            <>
              <Link href="/mes-reservations" className="block py-2.5 border-b border-white/10" onClick={() => setOpen(false)}>Mes réservations</Link>
              <div className="py-2.5 border-b border-white/10 text-white/60 text-xs">{user.email}</div>
              <button onClick={handleLogout} className="block py-2.5 text-red-400 w-full text-left">
                Se déconnecter
              </button>
            </>
          ) : (
            <Link href="/auth" className="block py-2.5" onClick={() => setOpen(false)}>Connexion / Inscription</Link>
          )}
        </div>
      )}
    </nav>
  )
}
