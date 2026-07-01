'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileText, MapPin } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const STATUT_COLORS: Record<string, string> = {
  en_attente: 'bg-yellow-50 text-yellow-700',
  acceptee: 'bg-green-50 text-green-700',
  refusee: 'bg-red-50 text-red-700',
  annulee: 'bg-gray-50 text-gray-500',
  terminee: 'bg-gray-50 text-gray-500',
}

const STATUT_LABELS: Record<string, string> = {
  en_attente: '⏳ En attente de réponse',
  acceptee: '✓ Acceptée',
  refusee: '✗ Refusée',
  annulee: '✗ Annulée',
  terminee: '✓ Terminée',
}

export default function MesReservationsPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [reservations, setReservations] = useState<any[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/auth'); return }

      const { data } = await supabase
        .from('reservations')
        .select('*, listing:listings(title, city, site_name, address, zip, photos, price_week, owner:profiles!owner_id(full_name, phone))')
        .eq('tenant_id', session.user.id)
        .order('created_at', { ascending: false })

      setReservations(data ?? [])
      setChecking(false)
    })
  }, [router])

  if (checking) return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-gray-400 text-sm">Chargement...</div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800">Mes réservations</h1>
      <p className="text-gray-500 text-sm mt-1 mb-8">Suivez le statut de vos demandes de logement.</p>

      {reservations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-semibold text-gray-700 mb-2">Aucune réservation pour le moment</h3>
          <p className="text-sm text-gray-400 mb-5">Trouvez un logement proche de votre site de mission.</p>
          <Link href="/rechercher" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition">
            Chercher un logement
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {r.listing?.photos?.[0] && <img src={r.listing.photos[0]} alt="" className="w-full h-full object-cover"/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight">{r.listing?.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUT_COLORS[r.statut]}`}>
                    {STATUT_LABELS[r.statut]}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                  <MapPin size={11} className="text-orange-400"/> {r.listing?.city} · ⚛ {r.listing?.site_name}
                </div>
                <div className="text-xs text-gray-500">📅 {r.date_start} → {r.date_end} · <strong className="text-gray-700">{r.price_total}€</strong></div>
                {r.statut === 'acceptee' && r.listing?.owner?.phone && (
                  <div className="text-xs text-green-600 mt-1">☎ Contact propriétaire : {r.listing.owner.phone}</div>
                )}
                {(r.statut === 'acceptee' || r.statut === 'terminee') && (
                  <Link href={`/facture?res=${r.id}`} className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-[#1e3a5f] hover:underline">
                    <FileText size={12}/> Générer la facture
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
