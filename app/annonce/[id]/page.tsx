'use client'
import { useState, useEffect, use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star, ChevronLeft, Share2, Loader2, CheckCircle } from 'lucide-react'
import { MOCK_LISTINGS, AMENITY_LABELS, AMENITY_ICONS } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import type { Listing } from '@/types/database'

export default function AnnoncePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [listing, setListing] = useState<Partial<Listing> | null | undefined>(undefined)
  const [photoIdx, setPhotoIdx] = useState(0)
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [msg, setMsg] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user.id ?? null)
      setCheckingAuth(false)
    })
  }, [])

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('listings')
        .select('*, owner:profiles!owner_id(*)')
        .eq('id', id)
        .single()

      if (data) { setListing(data); return }

      const mock = MOCK_LISTINGS.find(l => l.id === id)
      setListing(mock ?? null)
    }
    load()
  }, [id])

  if (listing === undefined) return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-gray-400 text-sm">Chargement...</div>
    </div>
  )

  if (listing === null) notFound()

  const nights = dateStart && dateEnd
    ? Math.max(0, Math.round((new Date(dateEnd).getTime() - new Date(dateStart).getTime()) / (1000 * 60 * 60 * 24 * 7)))
    : 0
  const total = nights * (listing.price_week ?? 0)

  async function handleReserve() {
    if (!userId || !dateStart || !dateEnd) return
    setSubmitting(true)
    setSubmitError('')
    const { error } = await supabase.from('reservations').insert({
      listing_id: id,
      tenant_id: userId,
      date_start: dateStart,
      date_end: dateEnd,
      price_total: total,
      statut: 'en_attente',
      stripe_payment_intent: null,
      message_initial: msg || null,
    })
    if (error) {
      setSubmitError("Erreur lors de l'envoi de la demande : " + error.message)
    } else {
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back */}
      <Link href="/rechercher" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition">
        <ChevronLeft size={15}/> Retour aux annonces
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT */}
        <div className="flex-1 min-w-0">
          {/* Photo */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-2" style={{ height: 320 }}>
            {listing.photos?.[photoIdx] && (
              <img
                src={listing.photos[photoIdx]}
                alt={listing.title}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {photoIdx + 1}/{listing.photos?.length ?? 1}
            </div>
          </div>
          {/* Thumbs */}
          {(listing.photos?.length ?? 0) > 1 && (
            <div className="flex gap-2 mb-6">
              {listing.photos?.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setPhotoIdx(i)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition ${i === photoIdx ? 'border-orange-500' : 'border-transparent'}`}
                >
                  <img src={p} alt="" className="w-full h-full object-cover"/>
                </button>
              ))}
            </div>
          )}

          {/* Title & meta */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium bg-blue-50 text-[#1e3a5f] px-2 py-0.5 rounded-full">
                  ⚛ {listing.site_name}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${listing.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {listing.available ? '✓ Disponible' : '✗ Complet'}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{listing.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <MapPin size={13} className="text-orange-400"/>
                {listing.city} · <strong className="text-gray-700">{listing.distance_km} km</strong> du site
                <span className="text-gray-200">·</span>
                {listing.review_count ? (
                  <>
                    <Star size={12} className="text-yellow-400 fill-yellow-400"/>
                    <span className="font-medium text-gray-700">{listing.avg_rating?.toFixed(1)}</span>
                    <span className="text-gray-400">({listing.review_count} avis)</span>
                  </>
                ) : (
                  <span className="text-gray-400 text-xs">Nouvelle annonce</span>
                )}
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition flex-shrink-0">
              <Share2 size={18}/>
            </button>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { icon: '📐', val: `${listing.surface_m2} m²`, label: 'Surface' },
              { icon: '🛏️', val: listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} ch.`, label: 'Chambres' },
              { icon: '🚿', val: `${listing.bathrooms} SDB`, label: 'Sanitaires' },
              { icon: '📍', val: `${listing.distance_km} km`, label: 'Du site' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="font-semibold text-sm text-gray-800">{s.val}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{listing.description}</p>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-800 mb-3">Équipements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {listing.amenities?.map(a => (
                <div key={a} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                  <span>{AMENITY_ICONS[a]}</span>
                  <span>{AMENITY_LABELS[a]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Owner */}
          <div className="mb-6 bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {listing.owner?.full_name?.[0]}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">
                {listing.owner?.full_name}
                {listing.owner?.verified && <span className="ml-2 text-green-500 text-sm">✓ Vérifié</span>}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Propriétaire · Habitué aux horaires décalés</p>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm" style={{ height: 180 }}>
            📍 Carte — {listing.city} ({listing.distance_km} km du site)
          </div>
        </div>

        {/* RIGHT — Contact widget */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm sticky top-24">
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-2xl font-bold text-[#1e3a5f]">{listing.price_week}€</span>
              <span className="text-gray-400 text-sm">/semaine</span>
            </div>
            <div className="text-sm text-gray-400 mb-1">{listing.price_month}€/mois</div>
            <p className="text-xs text-gray-400 mb-5 border-b border-gray-100 pb-4">Paiement convenu directement entre vous et le propriétaire.</p>

            {submitted ? (
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                <CheckCircle size={28} className="text-green-500 mx-auto mb-2"/>
                <div className="font-semibold text-green-700 text-sm mb-1">Demande envoyée !</div>
                <p className="text-xs text-green-600">Le propriétaire va examiner votre demande. Suivez son statut depuis votre espace.</p>
                <Link href="/mes-reservations" className="inline-block mt-3 text-xs font-medium text-green-700 hover:underline">
                  Voir mes réservations →
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Arrivée souhaitée</label>
                    <input
                      type="date"
                      value={dateStart}
                      onChange={e => setDateStart(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Départ prévu</label>
                    <input
                      type="date"
                      value={dateEnd}
                      onChange={e => setDateEnd(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Votre message</label>
                    <textarea
                      value={msg}
                      onChange={e => setMsg(e.target.value)}
                      placeholder="Bonjour, je suis technicien pour le grand arrêt du Tricastin, je cherche un logement du..."
                      rows={4}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                {nights > 0 && (
                  <div className="bg-blue-50 rounded-xl p-3 mb-4 text-sm">
                    <div className="flex justify-between text-gray-700 font-medium">
                      <span>Estimation {nights} sem.</span>
                      <span>{total}€</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">À confirmer avec le propriétaire</div>
                  </div>
                )}

                {submitError && (
                  <div className="text-xs bg-red-50 text-red-600 rounded-lg p-3 border border-red-100 mb-3">
                    {submitError}
                  </div>
                )}

                {checkingAuth ? (
                  <div className="w-full bg-gray-100 text-gray-400 text-center py-3 rounded-xl font-semibold text-sm">...</div>
                ) : !userId ? (
                  <Link href="/auth" className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-xl font-semibold transition">
                    Se connecter pour réserver
                  </Link>
                ) : (
                  <button
                    onClick={handleReserve}
                    disabled={!dateStart || !dateEnd || submitting}
                    className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-center py-3 rounded-xl font-semibold transition"
                  >
                    {submitting ? <><Loader2 size={16} className="animate-spin"/> Envoi...</> : 'Envoyer la demande'}
                  </button>
                )}
              </>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link href="/facture" className="flex items-center justify-center gap-2 text-sm text-[#1e3a5f] hover:underline font-medium">
                🧾 Générer une facture pour remboursement
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
