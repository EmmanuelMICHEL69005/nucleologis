'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Check, Loader2 } from 'lucide-react'
import { SITES_NUCLEAIRES, AMENITY_LABELS, AMENITY_ICONS } from '@/lib/data'
import AddressAutocomplete from '@/components/AddressAutocomplete'
import { supabase } from '@/lib/supabase'
import type { TypeLogement } from '@/types/database'

const TYPES = [
  { val: 'studio', label: 'Studio' },
  { val: 'appartement', label: 'Appartement' },
  { val: 'maison', label: 'Maison' },
  { val: 'chambre', label: 'Chambre chez l\'habitant' },
]

export default function ModifierAnnoncePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [checking, setChecking] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    type: '', site: '', address: '', city: '', zip: '',
    distance_km: '', surface_m2: '', bedrooms: '1', bathrooms: '1',
    amenities: [] as string[], price_week: '', price_month: '',
    min_duration_weeks: '1', description: '', available: true,
  })

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/auth'); return }

      const { data: listing } = await supabase.from('listings').select('*').eq('id', id).single()
      if (!listing || listing.owner_id !== session.user.id) { setNotFound(true); setChecking(false); return }

      setForm({
        type: listing.type ?? '', site: listing.site ?? '',
        address: listing.address ?? '', city: listing.city ?? '', zip: listing.zip ?? '',
        distance_km: String(listing.distance_km ?? ''), surface_m2: String(listing.surface_m2 ?? ''),
        bedrooms: String(listing.bedrooms ?? '1'), bathrooms: String(listing.bathrooms ?? '1'),
        amenities: listing.amenities ?? [], price_week: String(listing.price_week ?? ''),
        price_month: String(listing.price_month ?? ''), min_duration_weeks: String(listing.min_duration_weeks ?? '1'),
        description: listing.description ?? '', available: listing.available ?? true,
      })
      setChecking(false)
    })
  }, [id, router])

  function update(k: string, v: string | string[] | boolean) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function toggleAmenity(a: string) {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a],
    }))
  }

  async function handleSave() {
    setSaving(true)
    setSaveError('')
    const site = SITES_NUCLEAIRES.find(s => s.id === form.site)
    const { error } = await supabase.from('listings').update({
      type: form.type as TypeLogement,
      site: form.site,
      site_name: site?.name ?? form.site,
      address: form.address,
      city: form.city,
      zip: form.zip,
      distance_km: parseFloat(form.distance_km) || 0,
      surface_m2: parseInt(form.surface_m2) || 0,
      bedrooms: parseInt(form.bedrooms) || 0,
      bathrooms: parseInt(form.bathrooms) || 1,
      price_week: parseInt(form.price_week) || 0,
      price_month: parseInt(form.price_month) || 0,
      amenities: form.amenities,
      description: form.description,
      available: form.available,
      min_duration_weeks: parseInt(form.min_duration_weeks) || 1,
    }).eq('id', id)

    if (error) {
      setSaveError("Erreur lors de l'enregistrement : " + error.message)
    } else {
      setSaved(true)
      setTimeout(() => router.push('/proprietaire'), 1200)
    }
    setSaving(false)
  }

  if (checking) return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-gray-400 text-sm">Chargement...</div>
    </div>
  )

  if (notFound) return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center flex-col gap-3">
      <div className="text-gray-500 text-sm">Cette annonce n'existe pas ou ne vous appartient pas.</div>
      <Link href="/proprietaire" className="text-orange-500 text-sm font-medium hover:underline">Retour à l'espace propriétaire</Link>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/proprietaire" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition">
        <ChevronLeft size={15}/> Retour
      </Link>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'annonce</h1>
          <p className="text-gray-500 text-sm mt-1">Mettez à jour les informations de votre logement.</p>
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.available} onChange={e => update('available', e.target.checked)} className="w-4 h-4"/>
          Disponible
        </label>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-gray-700 mb-3">Type de logement</h2>
          <div className="grid grid-cols-2 gap-2">
            {TYPES.map(t => (
              <button
                key={t.val}
                onClick={() => update('type', t.val)}
                className={`p-3 rounded-xl border-2 text-left text-sm transition ${form.type === t.val ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-700 mb-3">Site nucléaire</h2>
          <div className="grid grid-cols-2 gap-2">
            {SITES_NUCLEAIRES.map(s => (
              <button
                key={s.id}
                onClick={() => update('site', s.id)}
                className={`p-2.5 rounded-xl border-2 text-left text-sm transition ${form.site === s.id ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
              >
                ⚛ {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-gray-700">Adresse</h2>
          <AddressAutocomplete
            value={form.address}
            onChange={v => update('address', v)}
            onSelect={r => setForm(f => ({ ...f, address: r.street, city: r.city, zip: r.zip }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Ville" value={form.city} onChange={e => update('city', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input type="text" placeholder="Code postal" value={form.zip} onChange={e => update('zip', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <input type="number" placeholder="Distance au site (km)" value={form.distance_km} onChange={e => update('distance_km', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>

        <div>
          <h2 className="font-semibold text-gray-700 mb-3">Caractéristiques</h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Surface (m²)</label>
              <input type="number" value={form.surface_m2} onChange={e => update('surface_m2', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Chambres</label>
              <select value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['0', '1', '2', '3', '4', '5'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">SDB</label>
              <select value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['1', '2', '3'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-700 mb-1">Équipements</h2>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.entries(AMENITY_LABELS).map(([key, label]) => {
              const selected = form.amenities.includes(key)
              return (
                <button
                  key={key}
                  onClick={() => toggleAmenity(key)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left text-sm transition ${selected ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <span>{AMENITY_ICONS[key]}</span>
                  <span className="text-gray-700">{label}</span>
                  {selected && <Check size={13} className="ml-auto text-[#1e3a5f]"/>}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-700 mb-3">Tarifs</h2>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Prix / semaine (€)" value={form.price_week} onChange={e => update('price_week', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input type="number" placeholder="Prix / mois (€)" value={form.price_month} onChange={e => update('price_month', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-700 mb-2">Description</h2>
          <textarea rows={4} value={form.description} onChange={e => update('description', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
        </div>

        {saveError && (
          <div className="text-xs bg-red-50 text-red-600 rounded-lg p-3 border border-red-100">{saveError}</div>
        )}
        {saved && (
          <div className="text-xs bg-green-50 text-green-700 rounded-lg p-3 border border-green-100">Annonce mise à jour ✓</div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 transition"
          >
            {saving ? <><Loader2 size={15} className="animate-spin"/> Enregistrement...</> : <><Check size={15}/> Enregistrer</>}
          </button>
        </div>
      </div>
    </div>
  )
}
