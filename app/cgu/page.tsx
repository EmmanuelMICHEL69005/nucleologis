import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function CGUPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition">
        <ChevronLeft size={15}/> Retour à l'accueil
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Conditions générales d'utilisation</h1>
      <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="font-semibold text-gray-800 mb-1">1. Objet</h2>
          <p>NucléoLogis est une plateforme de mise en relation entre propriétaires de logements meublés et travailleurs en mission à proximité de sites industriels (grands arrêts, maintenance). L'inscription et la publication d'annonces sont gratuites.</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-800 mb-1">2. Rôle de la plateforme</h2>
          <p>NucléoLogis ne loue aucun bien en son nom propre et n'intervient pas dans la transaction financière entre le propriétaire et le locataire. Le paiement du loyer est convenu et effectué directement entre les deux parties.</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-800 mb-1">3. Comptes utilisateurs</h2>
          <p>Chaque utilisateur est responsable de l'exactitude des informations fournies lors de son inscription et de la confidentialité de ses identifiants de connexion.</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-800 mb-1">4. Annonces</h2>
          <p>Les propriétaires s'engagent à publier des annonces exactes et à jour. NucléoLogis se réserve le droit de retirer toute annonce non conforme ou trompeuse.</p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-800 mb-1">5. Responsabilité</h2>
          <p>NucléoLogis agit en simple intermédiaire technique et ne peut être tenu responsable des litiges relatifs à la location entre propriétaires et locataires.</p>
        </section>
      </div>
    </div>
  )
}
