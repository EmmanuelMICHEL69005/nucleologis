'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { SITES_NUCLEAIRES, AMENITY_LABELS, AMENITY_ICONS } from '@/lib/data'
import AddressAutocomplete from '@/components/AddressAutocomplete'

const STEPS = ['Logement', 'Détails', 'Équipements', 'Prix & photos']

const TYPES = [
  { val: 'studio', label: 'Studio', icon: '🏠', desc: '1 pièce, jusqu\'à 35m²' },
  { val: 'appartement', label: 'Appartement', icon: '🏢', desc: 'T1 à T5+' },
  { val: 'maison', label: 'Maison', icon: '🏡', desc: 'Individuelle ou mitoyenne' },
  { val: 'chambre', label: 'Chambre chez l\'habitant', icon: '🛏️', desc: 'Chambre privée, parties communes partagées' },
]

export default function NouvelleAnnoncePage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    type: '',
    site: '',
    address: '',
    city: '',
    zip: '',
    distance_km: '',
    surface_m2: '',
    bedrooms: '1',
    bathrooms: '1',
    amenities: [] as string[],
    price_week: '',
    price_month: '',
    min_duration_weeks: '1',
    photos: [] as string[],
    description: '',
  })

  function update(k: string, v: string | string[]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function toggleAmenity(a: string) {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a],
    }))
  }

  const canNext = [
    form.type && form.site,
    form.address && form.city && form.zip && form.surface_m2,
    true, // amenities are optional
    form.price_week && form.price_month && form.description,
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <Link href="/proprietaire" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition">
        <ChevronLeft size={15}/> Retour
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Publier une annonce</h1>
      <p className="text-gray-500 text-sm mb-8">Renseignez les informations de votre logement en 4 étapes.</p>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-400'}`}>
              {i < step ? <Check size={14}/> : i + 1}
            </div>
            <span className={`ml-2 text-sm font-medium hidden sm:block ${i === step ? 'text-gray-800' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-green-500' : 'bg-gray-100'}`}/>}
          </div>
        ))}
      </div>

      {/* Step 0 — Type & Site */}
      {step === 0 && (
        <div>
          <h2 className="font-semibold text-gray-700 mb-4">Type de logement</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {TYPES.map(t => (
              <button
                key={t.val}
                onClick={() => update('type', t.val)}
                className={`p-4 rounded-2xl border-2 text-left transition ${form.type === t.val ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
              >
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="font-semibold text-sm text-gray-800">{t.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>

          <h2 className="font-semibold text-gray-700 mb-3">Site nucléaire le plus proche</h2>
          <div className="grid grid-cols-2 gap-2">
            {SITES_NUCLEAIRES.map(s => (
              <button
                key={s.id}
                onClick={() => update('site', s.id)}
                className={`p-3 rounded-xl border-2 text-left transition ${form.site === s.id ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
              >
                <div className="font-semibold text-sm text-gray-800">⚛ {s.name}</div>
                <div className="text-xs text-gray-400">{s.departement}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1 — Address & Details */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-700 mb-2">Adresse du logement</h2>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Adresse</label>
            <AddressAutocomplete
              value={form.address}
              onChange={v => update('address', v)}
              onSelect={r => setForm(f => ({ ...f, address: r.street, city: r.city, zip: r.zip }))}
              placeholder="12 rue des Lavandes, Pierrelatte"
            />
            <p className="text-xs text-gray-400 mt-1">Commencez à taper pour voir les suggestions</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Ville</label>
              <input type="text" placeholder="Pierrelatte" value={form.city} onChange={e => update('city', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Code postal</label>
              <input type="text" placeholder="26700" value={form.zip} onChange={e => update('zip', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Distance au site (km)</label>
            <input type="number" placeholder="2.5" value={form.distance_km} onChange={e => update('distance_km', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          <h2 className="font-semibold text-gray-700 mt-2 mb-2">Caractéristiques</h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Surface (m²)</label>
              <input type="number" placeholder="45" value={form.surface_m2} onChange={e => update('surface_m2', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Chambres</label>
              <select value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['0 (studio)', '1', '2', '3', '4', '5+'].map((v, i) => <option key={i} value={i}>{v}</option>)}
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
      )}

      {/* Step 2 — Amenities */}
      {step === 2 && (
        <div>
          <h2 className="font-semibold text-gray-700 mb-1">Équipements disponibles</h2>
          <p className="text-sm text-gray-400 mb-4">Sélectionnez tout ce que vous proposez.</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(AMENITY_LABELS).map(([key, label]) => {
              const selected = form.amenities.includes(key)
              return (
                <button
                  key={key}
                  onClick={() => toggleAmenity(key)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition ${selected ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <span className="text-lg">{AMENITY_ICONS[key]}</span>
                  <span className="text-sm text-gray-700">{label}</span>
                  {selected && <Check size={14} className="ml-auto text-[#1e3a5f] flex-shrink-0"/>}
                </button>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 mt-4">{form.amenities.length} équipement{form.amenities.length !== 1 ? 's' : ''} sélectionné{form.amenities.length !== 1 ? 's' : ''}</p>
        </div>
      )}

      {/* Step 3 — Price & Photos & Description */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="font-semibold text-gray-700 mb-2">Tarifs</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Prix / semaine (€)</label>
              <input type="number" placeholder="280" value={form.price_week} onChange={e => update('price_week', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Prix / mois (€)</label>
              <input type="number" placeholder="650" value={form.price_month} onChange={e => update('price_month', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Durée minimale (semaines)</label>
            <select value={form.min_duration_weeks} onChange={e => update('min_duration_weeks', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {['1', '2', '3', '4', '6', '8'].map(v => <option key={v} value={v}>{v} semaine{parseInt(v) > 1 ? 's' : ''}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
            <textarea
              rows={4}
              placeholder="Décrivez votre logement : ambiance, accès au site, points forts, conditions particulières..."
              value={form.description}
              onChange={e => update('description', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Photos</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400">
              <div className="text-4xl mb-2">📸</div>
              <p className="text-sm">Glissez vos photos ici ou cliquez pour sélectionner</p>
              <p className="text-xs mt-1">Formats acceptés : JPG, PNG, WebP · Max 10 Mo/photo</p>
              <button className="mt-3 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm transition">
                Choisir des photos
              </button>
              <p className="text-xs text-orange-500 mt-2">Upload vers Supabase Storage (à connecter)</p>
            </div>
          </div>

          {/* Preview pricing */}
          {form.price_week && form.price_month && (
            <div className="bg-blue-50 rounded-xl p-4 text-sm">
              <div className="font-semibold text-[#1e3a5f] mb-2">Simulation de revenus</div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Grand arrêt 6 semaines</span>
                <span className="font-semibold">{6 * parseInt(form.price_week)}€ brut</span>
              </div>
              <div className="flex justify-between text-gray-400 text-xs">
                <span>Après commission NucléoLogis (8%)</span>
                <span>{Math.round(6 * parseInt(form.price_week) * 0.92)}€</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-1 px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={15}/> Précédent
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext[step]}
            className="flex items-center gap-1 bg-[#1e3a5f] hover:bg-[#2d5fa0] text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Suivant <ChevronRight size={15}/>
          </button>
        ) : (
          <button
            disabled={!canNext[3]}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Check size={15}/> Publier l'annonce
          </button>
        )}
      </div>
    </div>
  )
}
