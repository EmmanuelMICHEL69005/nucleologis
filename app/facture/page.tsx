'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Printer, CheckCircle } from 'lucide-react'
import { SITES_NUCLEAIRES, MOCK_OWNER_PROFILE, MOCK_OWNER_ADDRESS, MOCK_RESERVATIONS } from '@/lib/data'

interface FactureData {
  bailleur_nom: string
  bailleur_adresse: string
  bailleur_ville: string
  bailleur_zip: string
  bailleur_tel: string
  bailleur_email: string
  locataire_nom: string
  locataire_societe: string
  locataire_adresse: string
  adresse_logement: string
  ville_logement: string
  zip_logement: string
  site_nucleaire: string
  date_entree: string
  date_sortie: string
  prix_semaine: string
  numero_facture: string
  date_facture: string
}

function nbSemaines(d1: string, d2: string) {
  if (!d1 || !d2) return 0
  const diff = (new Date(d2).getTime() - new Date(d1).getTime()) / (1000 * 60 * 60 * 24 * 7)
  return Math.max(0, parseFloat(diff.toFixed(2)))
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatEuro(n: number) {
  return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

const STATUT_LABELS: Record<string, string> = {
  en_attente: '⏳ En attente',
  acceptee: '✓ Acceptée',
  terminee: '✓ Terminée',
}

function FacturePageInner() {
  const searchParams = useSearchParams()
  const resId = searchParams.get('res')
  const printRef = useRef<HTMLDivElement>(null)
  const [selectedRes, setSelectedRes] = useState<string>(resId ?? '')

  const [f, setF] = useState<FactureData>({
    bailleur_nom: '', bailleur_adresse: '', bailleur_ville: '', bailleur_zip: '',
    bailleur_tel: '', bailleur_email: '',
    locataire_nom: '', locataire_societe: '', locataire_adresse: '',
    adresse_logement: '', ville_logement: '', zip_logement: '',
    site_nucleaire: '', date_entree: '', date_sortie: '',
    prix_semaine: '', numero_facture: '', date_facture: '',
  })

  // Initialiser avec les données du proprio connecté + numéro auto
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const numAuto = `NL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`
    setF(prev => ({
      ...prev,
      bailleur_nom: MOCK_OWNER_PROFILE.full_name,
      bailleur_adresse: MOCK_OWNER_ADDRESS.adresse,
      bailleur_ville: MOCK_OWNER_ADDRESS.ville,
      bailleur_zip: MOCK_OWNER_ADDRESS.zip,
      bailleur_tel: MOCK_OWNER_PROFILE.phone ?? '',
      bailleur_email: MOCK_OWNER_PROFILE.email,
      numero_facture: prev.numero_facture || numAuto,
      date_facture: prev.date_facture || today,
    }))
  }, [])

  // Pré-remplir depuis une réservation sélectionnée
  useEffect(() => {
    if (!selectedRes) return
    const res = MOCK_RESERVATIONS.find(r => r.id === selectedRes)
    if (!res) return
    setF(prev => ({
      ...prev,
      locataire_nom: res.tenant_name,
      locataire_societe: res.tenant_societe,
      locataire_adresse: res.tenant_adresse,
      adresse_logement: res.listing_adresse,
      ville_logement: res.listing_ville,
      zip_logement: res.listing_zip,
      site_nucleaire: res.listing_site,
      date_entree: res.date_start ?? '',
      date_sortie: res.date_end ?? '',
      prix_semaine: String(res.listing_prix_semaine),
    }))
  }, [selectedRes])

  function set(k: keyof FactureData, v: string) {
    setF(prev => ({ ...prev, [k]: v }))
  }

  const semaines = nbSemaines(f.date_entree, f.date_sortie)
  const prixSemaine = parseFloat(f.prix_semaine) || 0
  const totalHT = semaines * prixSemaine
  const siteName = SITES_NUCLEAIRES.find(s => s.id === f.site_nucleaire)?.name ?? f.site_nucleaire
  const isReady = f.bailleur_nom && f.locataire_nom && f.date_entree && f.date_sortie && f.prix_semaine && f.ville_logement

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 print:p-0 print:max-w-none">

      {/* Header */}
      <div className="print:hidden mb-6">
        <Link href="/proprietaire" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4 transition">
          <ChevronLeft size={15}/> Espace propriétaire
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Générateur de facture</h1>
            <p className="text-gray-500 text-sm mt-1">
              Vos informations sont pré-remplies. Sélectionnez une réservation pour compléter automatiquement.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            disabled={!isReady}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition"
          >
            <Printer size={16}/>
            Imprimer / PDF
          </button>
        </div>
      </div>

      {/* Sélecteur de réservation */}
      <div className="print:hidden mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h3 className="font-semibold text-[#1e3a5f] mb-1 flex items-center gap-2">
            📋 Choisir une réservation
          </h3>
          <p className="text-xs text-blue-600 mb-4">Cliquez sur une réservation pour pré-remplir le formulaire automatiquement.</p>
          <div className="space-y-2">
            {MOCK_RESERVATIONS.map(res => {
              const isSelected = selectedRes === res.id
              return (
                <button
                  key={res.id}
                  onClick={() => setSelectedRes(isSelected ? '' : res.id!)}
                  className={`w-full text-left flex items-center gap-4 p-3 rounded-xl border-2 transition ${
                    isSelected
                      ? 'border-[#1e3a5f] bg-white shadow-sm'
                      : 'border-transparent bg-white/60 hover:bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {res.tenant_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-800">{res.tenant_name}
                      {res.tenant_societe && <span className="font-normal text-gray-400"> · {res.tenant_societe}</span>}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{res.listing_title}</div>
                    <div className="text-xs text-gray-400">
                      📅 {formatDate(res.date_start ?? '')} → {formatDate(res.date_end ?? '')}
                      &nbsp;·&nbsp;
                      {formatEuro(res.price_total ?? 0)}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      res.statut === 'terminee' ? 'bg-gray-100 text-gray-500'
                      : res.statut === 'acceptee' ? 'bg-green-50 text-green-700'
                      : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {STATUT_LABELS[res.statut ?? ''] ?? res.statut}
                    </span>
                    {isSelected && <CheckCircle size={16} className="text-[#1e3a5f]"/>}
                  </div>
                </button>
              )
            })}
          </div>
          {!selectedRes && (
            <p className="text-xs text-blue-500 mt-3 text-center">
              Ou remplissez manuellement les champs ci-dessous ↓
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Formulaire */}
        <div className="print:hidden lg:w-80 flex-shrink-0 space-y-5">

          {/* Bailleur — pré-rempli depuis le profil */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-gray-700">🏡 Bailleur (vous)</h3>
              {MOCK_OWNER_PROFILE.verified && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✓ Vérifié</span>
              )}
            </div>
            <div className="space-y-3">
              {([
                { k: 'bailleur_nom', label: 'Nom complet' },
                { k: 'bailleur_adresse', label: 'Adresse personnelle' },
                { k: 'bailleur_ville', label: 'Ville' },
                { k: 'bailleur_zip', label: 'Code postal' },
                { k: 'bailleur_tel', label: 'Téléphone' },
                { k: 'bailleur_email', label: 'Email' },
              ] as { k: keyof FactureData; label: string }[]).map(field => (
                <div key={field.k}>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={f[field.k]}
                    onChange={e => set(field.k, e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Pour modifier vos infos définitivement :{' '}
              <Link href="/proprietaire" className="text-orange-500 hover:underline">Espace propriétaire → Profil</Link>
            </p>
          </div>

          {/* Locataire — pré-rempli depuis la réservation */}
          <div className={`bg-white rounded-2xl border p-5 transition ${selectedRes ? 'border-blue-200' : 'border-gray-100'}`}>
            <h3 className="font-semibold text-sm text-gray-700 mb-3">
              🔧 Locataire (technicien)
              {selectedRes && <span className="ml-2 text-xs text-blue-500 font-normal">pré-rempli ✓</span>}
            </h3>
            <div className="space-y-3">
              {([
                { k: 'locataire_nom', label: 'Nom complet', placeholder: 'Jean-Pierre Martin' },
                { k: 'locataire_societe', label: 'Société / Prestataire', placeholder: 'ORANO Services' },
                { k: 'locataire_adresse', label: 'Adresse personnelle', placeholder: '5 rue de la Paix, Lyon 69000' },
              ] as { k: keyof FactureData; label: string; placeholder: string }[]).map(field => (
                <div key={field.k}>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={f[field.k]}
                    onChange={e => set(field.k, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Séjour — pré-rempli depuis la réservation */}
          <div className={`bg-white rounded-2xl border p-5 transition ${selectedRes ? 'border-blue-200' : 'border-gray-100'}`}>
            <h3 className="font-semibold text-sm text-gray-700 mb-3">
              📅 Séjour
              {selectedRes && <span className="ml-2 text-xs text-blue-500 font-normal">pré-rempli ✓</span>}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Site nucléaire</label>
                <select
                  value={f.site_nucleaire}
                  onChange={e => set('site_nucleaire', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choisir…</option>
                  {SITES_NUCLEAIRES.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              {([
                { k: 'adresse_logement', label: 'Adresse du logement', placeholder: '12 rue des Lavandes' },
                { k: 'ville_logement', label: 'Ville', placeholder: 'Pierrelatte' },
                { k: 'zip_logement', label: 'Code postal', placeholder: '26700' },
              ] as { k: keyof FactureData; label: string; placeholder: string }[]).map(field => (
                <div key={field.k}>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={f[field.k]}
                    onChange={e => set(field.k, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Entrée</label>
                  <input type="date" value={f.date_entree} onChange={e => set('date_entree', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Sortie</label>
                  <input type="date" value={f.date_sortie} onChange={e => set('date_sortie', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
              </div>
              {semaines > 0 && (
                <div className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
                  ≈ {semaines} semaine{semaines > 1 ? 's' : ''}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Loyer / semaine (€)</label>
                <input type="number" value={f.prix_semaine} onChange={e => set('prix_semaine', e.target.value)}
                  placeholder="280"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
            </div>
          </div>

          {/* Numéro de facture */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">📄 Références</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Numéro de facture</label>
                <input type="text" value={f.numero_facture} onChange={e => set('numero_facture', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Date d'émission</label>
                <input type="date" value={f.date_facture} onChange={e => set('date_facture', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
            </div>
          </div>
        </div>

        {/* Prévisualisation */}
        <div ref={printRef} className="flex-1 min-w-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 print:rounded-none print:border-0 print:p-10" style={{ minHeight: 700 }}>

            {/* En-tête facture */}
            <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-[#1e3a5f]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">☢</div>
                  <span className="font-bold text-lg text-[#1e3a5f]">NucléoLogis</span>
                </div>
                <div className="text-xs text-gray-400">Plateforme de location pour travailleurs du nucléaire</div>
                <div className="text-xs text-gray-400">nucleologis.fr</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#1e3a5f] mb-1">QUITTANCE DE LOYER</div>
                <div className="text-sm text-gray-500">N° {f.numero_facture || '—'}</div>
                <div className="text-sm text-gray-500">Émise le {formatDate(f.date_facture)}</div>
              </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Bailleur</div>
                <div className="font-semibold text-gray-800">{f.bailleur_nom || <span className="text-gray-300 italic">Nom du bailleur</span>}</div>
                {f.bailleur_adresse && <div className="text-sm text-gray-600">{f.bailleur_adresse}</div>}
                <div className="text-sm text-gray-600">{[f.bailleur_zip, f.bailleur_ville].filter(Boolean).join(' ') || <span className="text-gray-300 italic">Ville</span>}</div>
                {f.bailleur_tel && <div className="text-sm text-gray-600">Tél : {f.bailleur_tel}</div>}
                {f.bailleur_email && <div className="text-sm text-gray-600">{f.bailleur_email}</div>}
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Locataire</div>
                <div className="font-semibold text-gray-800">{f.locataire_nom || <span className="text-gray-300 italic">Nom du locataire</span>}</div>
                {f.locataire_societe && <div className="text-sm text-gray-600">{f.locataire_societe}</div>}
                {f.locataire_adresse && <div className="text-sm text-gray-600 mt-1">{f.locataire_adresse}</div>}
              </div>
            </div>

            {/* Logement */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Logement loué</div>
              <div className="font-medium text-gray-800">
                {f.adresse_logement && <>{f.adresse_logement}<br/></>}
                {[f.zip_logement, f.ville_logement].filter(Boolean).join(' ') || <span className="text-gray-400 italic">Adresse du logement</span>}
              </div>
              {siteName && <div className="text-sm text-gray-500 mt-1">⚛ Proximité du site EDF de {siteName}</div>}
            </div>

            {/* Tableau */}
            <table className="w-full mb-6 text-sm">
              <thead>
                <tr className="bg-[#1e3a5f] text-white">
                  <th className="px-4 py-2 text-left rounded-tl-lg">Description</th>
                  <th className="px-4 py-2 text-center">Période</th>
                  <th className="px-4 py-2 text-center">Durée</th>
                  <th className="px-4 py-2 text-right rounded-tr-lg">Montant</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-700">
                    Location meublée de courte durée
                    <div className="text-xs text-gray-400">{prixSemaine > 0 ? formatEuro(prixSemaine) : '—'} / semaine</div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600 text-xs">
                    {f.date_entree
                      ? <>{formatDate(f.date_entree)}<br/><span className="text-gray-400">au</span><br/>{formatDate(f.date_sortie)}</>
                      : <span className="text-gray-300 italic">dates à renseigner</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {semaines > 0 ? `${semaines} sem.` : '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">
                    {totalHT > 0 ? formatEuro(totalHT) : '—'}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-700 text-sm">
                    Total — TVA non applicable (location meublée non professionnelle)
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-xl text-[#1e3a5f]">
                    {totalHT > 0 ? formatEuro(totalHT) : '—'}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Attestation */}
            <div className="border border-gray-200 rounded-xl p-4 mb-6 text-sm text-gray-600">
              <div className="font-semibold text-gray-700 mb-1">Attestation de paiement</div>
              Je soussigné(e) <strong>{f.bailleur_nom || '____________________'}</strong>, bailleur du logement
              sis {f.adresse_logement ? `au ${[f.adresse_logement, f.zip_logement, f.ville_logement].filter(Boolean).join(', ')}` : 'à l\'adresse indiquée ci-dessus'},
              atteste avoir reçu de <strong>{f.locataire_nom || '____________________'}</strong>
              {f.locataire_societe ? ` (${f.locataire_societe})` : ''} la somme
              de <strong>{totalHT > 0 ? formatEuro(totalHT) : '____________________'}</strong> au titre
              du loyer pour la période du {formatDate(f.date_entree)} au {formatDate(f.date_sortie)}.
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 mt-8">
              <div>
                <div className="text-xs text-gray-400 mb-1">Signature du bailleur</div>
                <div className="border-b border-gray-300 h-14"/>
                <div className="text-xs text-gray-400 mt-1">{f.bailleur_nom}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Date</div>
                <div className="border-b border-gray-300 h-14"/>
                <div className="text-xs text-gray-400 mt-1">{formatDate(f.date_facture)}</div>
              </div>
            </div>

            <div className="mt-10 pt-4 border-t border-gray-100 text-xs text-gray-300 text-center">
              Document généré via NucléoLogis · nucleologis.fr ·
              Location meublée de courte durée entre particuliers · TVA non applicable ·
              Consultez un expert-comptable pour votre déclaration fiscale.
            </div>
          </div>

          {/* Bouton impression bas de page */}
          <div className="print:hidden mt-4 flex justify-end">
            <button
              onClick={() => window.print()}
              disabled={!isReady}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold text-sm transition"
            >
              <Printer size={16}/>
              Imprimer / Enregistrer en PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FacturePage() {
  return (
    <Suspense>
      <FacturePageInner/>
    </Suspense>
  )
}
