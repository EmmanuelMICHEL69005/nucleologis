'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MOCK_LISTINGS, MOCK_RESERVATIONS as RESERVATIONS_DATA } from '@/lib/data'
import { Plus, TrendingUp, Home, CalendarCheck, MessageSquare, Star, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const MOCK_RESERVATIONS = [
  { id: 'r1', tenant: 'Jean-Pierre M.', listing: 'Appartement T2 — 2 km du Tricastin', dates: '12 jan → 8 fév 2026', statut: 'acceptee', total: 2600 },
  { id: 'r2', tenant: 'Karim B.', listing: 'Chambre privée — Pierrelatte', dates: '15 jan → 12 fév 2026', statut: 'acceptee', total: 560 },
  { id: 'r3', tenant: 'Thomas V.', listing: 'Appartement T2 — 2 km du Tricastin', dates: '10 fév → 10 mar 2026', statut: 'terminee', total: 2800 },
]

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/auth')
      else setChecking(false)
    })
  }, [router])

  if (checking) return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-gray-400 text-sm">Vérification...</div>
    </div>
  )
  const myListings = MOCK_LISTINGS.filter(l => ['1', '4'].includes(l.id ?? ''))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Espace propriétaire</h1>
          <p className="text-gray-500 text-sm mt-1">Bienvenue, Marie D. ✓</p>
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
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: <Home size={20}/>, val: '2', label: 'Annonces actives', color: 'bg-blue-50 text-[#1e3a5f]' },
              { icon: <CalendarCheck size={20}/>, val: '3', label: 'Réservations en cours', color: 'bg-green-50 text-green-700' },
              { icon: <TrendingUp size={20}/>, val: '6 340€', label: 'Revenus ce mois', color: 'bg-orange-50 text-orange-600' },
              { icon: <Star size={20}/>, val: '4.85', label: 'Note moyenne', color: 'bg-yellow-50 text-yellow-600' },
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

          {/* Revenue bars (simple visual) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">Revenus des 6 derniers mois</h3>
            <div className="flex items-end gap-3 h-32">
              {[
                { month: 'Jan', val: 5200 },
                { month: 'Fév', val: 4800 },
                { month: 'Mar', val: 6100 },
                { month: 'Avr', val: 3900 },
                { month: 'Mai', val: 5700 },
                { month: 'Jun', val: 6340 },
              ].map(m => {
                const pct = (m.val / 7000) * 100
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs text-gray-500 font-medium">{m.val >= 1000 ? `${(m.val / 1000).toFixed(1)}k` : m.val}€</div>
                    <div className="w-full rounded-t-lg bg-[#1e3a5f]/80" style={{ height: `${pct}%` }}/>
                    <div className="text-xs text-gray-400">{m.month}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent reservations */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-700 mb-4">Réservations récentes</h3>
            <div className="space-y-3">
              {MOCK_RESERVATIONS.slice(0, 3).map(r => (
                <div key={r.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {r.tenant[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-800">{r.tenant}</div>
                    <div className="text-xs text-gray-400 truncate">{r.listing} · {r.dates}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-semibold text-sm text-gray-800">{r.total}€</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUT_COLORS[r.statut]}`}>
                      {STATUT_LABELS[r.statut]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Annonces tab */}
      {activeTab === 'annonces' && (
        <div className="space-y-4">
          {myListings.map(l => (
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
                <div className="flex items-center gap-1 mt-1">
                  <Star size={11} className="text-yellow-400 fill-yellow-400"/>
                  <span className="text-xs font-medium text-gray-700">{l.avg_rating?.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({l.review_count} avis)</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">Modifier</button>
                <button className="text-xs border border-red-100 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">Désactiver</button>
              </div>
            </div>
          ))}
          <Link href="/proprietaire/nouvelle-annonce" className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl py-8 text-gray-400 hover:border-orange-300 hover:text-orange-500 transition">
            <Plus size={18}/>
            Ajouter une annonce
          </Link>
        </div>
      )}

      {/* Reservations tab */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {MOCK_RESERVATIONS.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="font-semibold text-gray-800">{r.tenant}</div>
                  <div className="text-sm text-gray-500">{r.listing}</div>
                  <div className="text-xs text-gray-400 mt-0.5">📅 {r.dates}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-800">{r.total}€</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUT_COLORS[r.statut]}`}>
                    {STATUT_LABELS[r.statut]}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-50">
                {r.statut === 'en_attente' && (
                  <>
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition">Accepter</button>
                    <button className="flex-1 border border-red-200 text-red-500 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition">Refuser</button>
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
                <button className="border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Message</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Messages tab */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="text-4xl mb-3">💬</div>
          <h3 className="font-semibold text-gray-700 mb-1">Messagerie</h3>
          <p className="text-sm text-gray-400">Vos conversations avec les locataires apparaîtront ici.</p>
          <p className="text-xs text-orange-500 mt-3">Connectez Supabase pour activer la messagerie temps réel</p>
        </div>
      )}
    </div>
  )
}
