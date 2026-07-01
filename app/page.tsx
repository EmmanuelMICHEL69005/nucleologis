import Link from 'next/link'
import ListingCard from '@/components/ListingCard'
import { MOCK_LISTINGS, SITES_NUCLEAIRES } from '@/lib/data'

export default function Home() {
  const featured = MOCK_LISTINGS.slice(0, 4)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5fa0] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
            <span>⚛</span>
            <span>Plateforme dédiée aux travailleurs du nucléaire</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Logements meublés<br/>
            <span className="text-orange-400">proches des centrales EDF</span>
          </h1>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Trouvez rapidement un logement pour votre grand arrêt ou mission de maintenance.
            Propriétaires locaux de confiance, disponibilités synchronisées avec les plannings EDF.
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2 max-w-2xl mx-auto shadow-xl">
            <select className="flex-1 px-4 py-3 rounded-xl border border-gray-100 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tous les sites EDF</option>
              {SITES_NUCLEAIRES.map(s => (
                <option key={s.id} value={s.id}>{s.name} — {s.departement}</option>
              ))}
            </select>
            <select className="flex-1 px-4 py-3 rounded-xl border border-gray-100 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tous types</option>
              <option value="studio">Studio</option>
              <option value="appartement">Appartement</option>
              <option value="maison">Maison</option>
              <option value="chambre">Chambre</option>
            </select>
            <Link href="/rechercher" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition text-sm whitespace-nowrap">
              Rechercher
            </Link>
          </div>
        </div>
      </section>

      {/* Sites shortcuts */}
      <section className="bg-white border-b border-gray-100 py-6 px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-3 justify-center flex-wrap">
          {SITES_NUCLEAIRES.map(site => (
            <Link
              key={site.id}
              href={`/rechercher?site=${site.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition text-sm text-gray-700"
            >
              <span className="text-orange-500">⚛</span>
              <span className="font-medium">{site.name}</span>
              <span className="text-gray-400 text-xs">{site.departement}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Comment ça marche</h2>
          <p className="text-center text-gray-500 mb-10">Réservez en 3 étapes, même pour un grand arrêt de dernière minute</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '1', icon: '🔍', title: 'Cherchez', desc: 'Sélectionnez votre site EDF, vos dates de mission et votre budget. Annonces vérifiées, photos réelles.' },
              { n: '2', icon: '💬', title: 'Contactez', desc: 'Envoyez une demande au propriétaire. Il répond sous 24h. Messagerie intégrée sécurisée.' },
              { n: '3', icon: '🏠', title: 'Emménagez', desc: 'Paiement sécurisé, remise de clés flexible. Le propriétaire connaît les horaires décalés.' },
            ].map(step => (
              <div key={step.n} className="text-center">
                <div className="w-16 h-16 bg-[#1e3a5f] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="text-orange-500 font-bold text-sm mb-1">Étape {step.n}</div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Annonces du moment</h2>
              <p className="text-gray-500 text-sm mt-1">Logements disponibles sur Tricastin et Cruas-Meysse</p>
            </div>
            <Link href="/rechercher" className="text-[#1e3a5f] font-medium text-sm hover:underline">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(l => (
              <ListingCard key={l.id} listing={l}/>
            ))}
          </div>
        </div>
      </section>

      {/* PDF feature banner */}
      <section className="bg-orange-500 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="text-5xl flex-shrink-0">🧾</div>
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-1">Générez vos factures de logement en 1 clic</h3>
            <p className="text-orange-100 text-sm">Techniciens : produisez une facture conforme aux exigences de remboursement EDF/prestataires. Renseignez les infos du séjour, téléchargez le PDF, envoyez au service RH.</p>
          </div>
          <Link href="/facture" className="flex-shrink-0 bg-white text-orange-600 font-semibold px-6 py-3 rounded-xl hover:bg-orange-50 transition whitespace-nowrap">
            Générer une facture →
          </Link>
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-[#1e3a5f] text-white py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '56', label: 'Sites EDF couverts' },
            { n: '1 200+', label: 'Logements référencés' },
            { n: '4.8/5', label: 'Note propriétaires' },
            { n: '0€', label: 'Commission perçue' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-orange-400 mb-1">{stat.n}</div>
              <div className="text-blue-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Owner CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-4xl mb-4">🏡</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Vous êtes propriétaire près d'une centrale ?
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Les grands arrêts attirent des centaines de techniciens. Mettez votre logement en location
            sur NucléoLogis et bénéficiez d'une clientèle professionnelle, fiable, et récurrente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/proprietaire/nouvelle-annonce" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition">
              Publier mon annonce — c'est gratuit
            </Link>
            <Link href="/proprietaire" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">
              Espace propriétaire
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">Inscription et publication gratuites. Vous gérez le paiement directement avec le locataire.</p>
        </div>
      </section>
    </div>
  )
}
