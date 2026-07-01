'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, TrendingUp, Home, CalendarCheck, MessageSquare, Star, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const STATUT_COLORS: Record<string, string> = {
  en_attente: 'bg-yellow-50 text-yellow-700',
  acceptee: 'bg-green-50 text-green-700',
  refusee: 'bg-red-50 text-red-700',
  terminee: 'bg-gray-50 text-gray-500',
}

const STATUT_LABELS: Record<string, string> = {
  en_attente: '⏳ En attente',
  acceptee: '✓ Acceptée',
  refusee: '✗ Refusée',
  terminee: '✓ Terminée',
}

export default function ProprietairePage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'annonces' | 'reservations' | 'messages'>('dashboard')
  const [userName, setUserName] = useState('')
  const [listings, setListings] = useState<any[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/auth'); return }

      // Nom depuis le profil ou les metadata
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single()

      setUserName(
        profile?.full_name ||
        session.user.user_metadata?.full_name ||
        session.user.email?.split('@')[0] ||
        'Propriétaire'
      )

      // Annonces du proprio connecté
      const { data: myListings } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', session.user.id)
        .order('created_at', { ascending: false })

      setListings(myListings ?? [])

      // Réservations sur ses annonces
      if (myListings && myListings.length > 0) {
        const listingIds = myListings.map((l: any) => l.id)
        const { data: myReservations } = await supabase
          .from('reservations')
          .select('*, listing:listings(title, city), tenant:profiles!tenant_id(full_name)')
          .in('listing_id', listingIds)
          .order('created_at', { ascending: false })

        setReservations(myReservations ?? [])
      }

      setChecking(false)
    })
  }, [router])

  async function updateReservationStatut(id: string, statut: 'acceptee' | 'refusee') {
    setBusyId(id)
    const { error } = await supabase.from('reservations').update({ statut }).eq('id', id)
    if (!error) {
      setReservations(prev => prev.map(r => r.id === id ? { ...r, statut } : r))
    }
    setBusyId(null)
  }

  async function toggleListingAvailable(id: string, current: boolean) {
    setBusyId(id)
    const { error } = await supabase.from('listings').update({ available: !current }).eq('id', id)
    if (!error) {
      setListings(prev => prev.map(l => l.id === id ? { ...l, available: !current } : l))
    }
    setBusyId(null)
  }

  if (checking) return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-gray-400 text-sm">Chargement...</div>
    </div>
  )

  const firstName = userName.split(' ')[0]
  const activeListings = listings.filter(l => l.available)
  const activeReservations = reservations.filter(r => r.statut === 'acceptee')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Espace propriétaire</h1>
          <p className="text-gray-500 text-sm mt-1">Bienvenue, {firstName} ✓</p>
        </div>
        <Link
          href="/proprietaire/nouvelle-annonce"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition"
        >
          <Plus size={16}/>
          Nouvelle annonce
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 overflow-x-auto">
        {[
          { key: 'dashboard', label: 'Vue d\'ensemble', icon: <TrendingUp size={14}/> },
          { key: 'annonces', label: 'Mes annonces', icon: <Home size={14}/> },
          { key: 'reservations', label: 'Réservations', icon: <CalendarCheck size={14}/> },
          { key: 'messages', label: 'Messages', icon: <MessageSquare size={14}/> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === tab.key ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard tab */}
      {activeTab === 'dashboard' && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: <Home size={20}/>, val: String(activeListings.length), label: 'Annonces actives', color: 'bg-blue-50 text-[#1e3a5f]' },
              { icon: <CalendarCheck size={20}/>, val: String(activeReservations.length), label: 'Réservations en cours', color: 'bg-green-50 text-green-700' },
              { icon: <TrendingUp size={20}/>, val: listings.length > 0 ? `${reservations.reduce((s, r) => s + (r.price_total ?? 0), 0)}€` : '—', label: 'Revenus totaux', color: 'bg-orange-50 text-orange-600' },
              { icon: <Star size={20}/>, val: '—', label: 'Note moyenne', color: 'bg-yellow-50 text-yellow-600' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-xl font-bold text-gray-800">{stat.val}</div>
                <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {listings.length === 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
              <div className="text-5xl mb-4">🏡</div>
              <h3 className="font-semibold text-gray-700 mb-2">Vous n'avez pas encore d'annonce</h3>
              <p className="text-sm text-gray-400 mb-5">Publiez votre premier logement en 2 minutes et commencez à recevoir des locataires.</p>
              <Link
                href="/proprietaire/nouvelle-annonce"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition"
              >
                <Plus size={16}/> Créer ma première annonce
              </Link>
            </div>
          )}

          {/* Recent reservations */}
          {reservations.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-700 mb-4">Réservations récentes</h3>
              <div className="space-y-3">
                {reservations.slice(0, 3).map(r => (
                  <div key={r.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {(r.tenant?.full_name ?? '?')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-800">{r.tenant?.full_name}</div>
                      <div className="text-xs text-gray-400 truncate">{r.listing?.title} · {r.date_start} → {r.date_end}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-semibold text-sm text-gray-800">{r.price_total}€</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUT_COLORS[r.statut]}`}>
                        {STATUT_LABELS[r.statut]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Annonces tab */}
      {activeTab === 'annonces' && (
        <div className="space-y-4">
          {listings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="font-semibold text-gray-700 mb-2">Aucune annonce publiée</h3>
              <p className="text-sm text-gray-400 mb-5">Ajoutez votre logement pour attirer des techniciens.</p>
              <Link href="/proprietaire/nouvelle-annonce" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition">
                <Plus size={16}/> Créer une annonce
              </Link>
            </div>
          ) : (
            <>
              {listings.map(l => (
                <div key={l.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-start">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {l.photos?.[0] && <img src={l.photos[0]} alt="" className="w-full h-full object-cover"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {l.available ? '● Disponible' : '● Complet'}
                      </span>
                      <span className="text-xs text-gray-400">⚛ {l.site_name}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">{l.title}</h3>
                    <div className="text-xs text-gray-400 mt-0.5">{l.city} · {l.surface_m2}m² · {l.price_week}€/sem</div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Link href={`/proprietaire/annonce/${l.id}/modifier`} className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition text-center">
                      Modifier
                    </Link>
                    <button
                      onClick={() => toggleListingAvailable(l.id, l.available)}
                      disabled={busyId === l.id}
                      className="text-xs border border-red-100 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition disabled:opacity-40"
                    >
                      {l.available ? 'Désactiver' : 'Réactiver'}
                    </button>
                  </div>
                </div>
              ))}
              <Link href="/proprietaire/nouvelle-annonce" className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl py-8 text-gray-400 hover:border-orange-300 hover:text-orange-500 transition">
                <Plus size={18}/> Ajouter une annonce
              </Link>
            </>
          )}
        </div>
      )}

      {/* Reservations tab */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="font-semibold text-gray-700 mb-2">Aucune réservation</h3>
              <p className="text-sm text-gray-400">Les demandes de réservation apparaîtront ici.</p>
            </div>
          ) : (
            reservations.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="font-semibold text-gray-800">{r.tenant?.full_name}</div>
                    <div className="text-sm text-gray-500">{r.listing?.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">📅 {r.date_start} → {r.date_end}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-800">{r.price_total}€</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUT_COLORS[r.statut]}`}>
                      {STATUT_LABELS[r.statut]}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-50">
                  {r.statut === 'en_attente' && (
                    <>
                      <button
                        onClick={() => updateReservationStatut(r.id, 'acceptee')}
                        disabled={busyId === r.id}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-40"
                      >
                        Accepter
                      </button>
                      <button
                        onClick={() => updateReservationStatut(r.id, 'refusee')}
                        disabled={busyId === r.id}
                        className="flex-1 border border-red-200 text-red-500 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition disabled:opacity-40"
                      >
                        Refuser
                      </button>
                    </>
                  )}
                  {(r.statut === 'acceptee' || r.statut === 'terminee') && (
                    <Link
                      href={`/facture?res=${r.id}`}
                      className="flex items-center gap-1.5 border border-[#1e3a5f] text-[#1e3a5f] px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
                    >
                      <FileText size={13}/> Générer la facture
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Messages tab */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="text-4xl mb-3">💬</div>
          <h3 className="font-semibold text-gray-700 mb-1">Messagerie</h3>
          <p className="text-sm text-gray-400">Vos conversations avec les locataires apparaîtront ici.</p>
        </div>
      )}
    </div>
  )
}
