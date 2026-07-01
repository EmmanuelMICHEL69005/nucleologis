import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition">
        <ChevronLeft size={15}/> Retour à l'accueil
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mentions légales</h1>
      <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="font-semibold text-gray-800 mb-1">Éditeur du site</h2>
          <p>NucléoLogis est un service en cours de développement (MVP). Les informations légales complètes de la société éditrice seront publiées avant l'ouverture commerciale du service.</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-800 mb-1">Hébergement</h2>
          <p>Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-800 mb-1">Nature du service</h2>
          <p>NucléoLogis met en relation des propriétaires de logements meublés et des travailleurs en mission à proximité de sites industriels. La plateforme ne perçoit aucune commission sur les transactions : le paiement est convenu directement entre le propriétaire et le locataire.</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-800 mb-1">Propriété intellectuelle</h2>
          <p>L'ensemble des contenus présents sur ce site (textes, logo, charte graphique) est la propriété de NucléoLogis, sauf mention contraire.</p>
        </section>
      </div>
    </div>
  )
}
