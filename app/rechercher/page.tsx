'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import ListingCard from '@/components/ListingCard'
import { MOCK_LISTINGS, SITES_NUCLEAIRES } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import type { Listing } from '@/types/database'

const TYPES = ['studio', 'appartement', 'maison', 'chambre']
const BUDGETS = [
  { label: 'Tous budgets', min: 0, max: Infinity },
  { label: '< 200€/sem', min: 0, max: 200 },
  { label: '200–350€/sem', min: 200, max: 350 },
  { label: '350–500€/sem', min: 350, max: 500 },
  { label: '> 500€/sem', min: 500, max: Infinity },
]

function RechercherPageInner() {
  const searchParams = useSearchParams()
  const [site, setSite] = useState(searchParams.get('site') ?? '')
  const [type, setType] = useState('')
  const [budget, setBudget] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [realListings, setRealListings] = useState<Partial<Listing>[]>([])

  useEffect(() => {
    supabase
      .from('listings')
      .select('*, owner:profiles!owner_id(*)')
      .eq('available', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setRealListings(data ?? []))
  }, [])

  const allListings = useMemo(() => [...realListings, ...MOCK_LISTINGS], [realListings])

  const listings = useMemo(() => {
    const b = BUDGETS[budget]
    return allListings.filter(l => {
      if (site && l.site !== site) return false
      if (type && l.type !== type) return false
      if (l.price_week === undefined) return true
      if (l.price_week < b.min || l.price_week > b.max) return false
      return true
    })
  }, [site, type, budget, allListings])

  const hasFilters = site || type || budget > 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Logements disponibles</h1>
          <p className="text-gray-500 text-sm mt-1">{listings.length} annonce{listings.length !== 1 ? 's' : ''} trouvée{listings.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition md:hidden"
        >
          <SlidersHorizontal size={15}/>
          Filtres {hasFilters && <span className="w-2 h-2 bg-orange-500 rounded-full"/>}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Filters sidebar — desktop always visible, mobile conditional */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-56 flex-shrink-0`}>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm text-gray-700">Filtres</span>
              {hasFilters && (
                <button
                  onClick={() => { setSite(''); setType(''); setBudget(0) }}
                  className="text-xs text-orange-500 flex items-center gap-1"
                >
                  <X size={11}/> Réinitialiser
                </button>
              )}
            </div>

            {/* Site */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Site EDF</label>
              <div className="space-y-1">
                <button onClick={() => setSite('')} className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition ${!site ? 'bg-[#1e3a5f] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  Tous les sites
                </button>
                {SITES_NUCLEAIRES.map(s => (
                  <button key={s.id} onClick={() => setSite(s.id)} className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition ${site === s.id ? 'bg-[#1e3a5f] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Type</label>
              <div className="space-y-1">
                <button onClick={() => setType('')} className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition capitalize ${!type ? 'bg-[#1e3a5f] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  Tous types
                </button>
                {TYPES.map(t => (
                  <button key={t} onClick={() => setType(t)} className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition capitalize ${type === t ? 'bg-[#1e3a5f] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Budget</label>
              <div className="space-y-1">
                {BUDGETS.map((b, i) => (
                  <button key={i} onClick={() => setBudget(i)} className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition ${budget === i ? 'bg-[#1e3a5f] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results grid */}
        <div className="flex-1 min-w-0">
          {listings.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🏚️</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune annonce trouvée</h3>
              <p className="text-gray-400 text-sm">Essayez d'ajuster vos filtres</p>
              <button
                onClick={() => { setSite(''); setType(''); setBudget(0) }}
                className="mt-4 text-orange-500 text-sm font-medium hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map(l => (
                <ListingCard key={l.id} listing={l}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function RechercherPage() {
  return (
    <Suspense>
      <RechercherPageInner/>
    </Suspense>
  )
}
