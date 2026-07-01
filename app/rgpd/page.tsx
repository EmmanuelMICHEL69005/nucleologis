import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function RGPDPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition">
        <ChevronLeft size={15}/> Retour à l'accueil
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Politique de confidentialité (RGPD)</h1>
      <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="font-semibold text-gray-800 mb-1">Données collectées</h2>
          <p>Lors de votre inscription, nous collectons votre nom, prénom, adresse email, et éventuellement votre numéro de téléphone et l'adresse de votre logement si vous êtes propriétaire.</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-800 mb-1">Finalité du traitement</h2>
          <p>Ces données sont utilisées uniquement pour permettre la mise en relation entre propriétaires et locataires, la gestion de votre compte, et la génération de vos documents (factures, quittances).</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-800 mb-1">Conservation</h2>
          <p>Vos données sont conservées pendant toute la durée de vie de votre compte et supprimées sur demande.</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-800 mb-1">Vos droits</h2>
          <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Pour exercer ces droits, contactez-nous via la page Contact.</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-800 mb-1">Hébergement des données</h2>
          <p>Vos données sont stockées de façon sécurisée via Supabase, hébergé sur des infrastructures conformes aux standards de sécurité en vigueur.</p>
        </section>
      </div>
    </div>
  )
}
