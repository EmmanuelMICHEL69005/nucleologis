import Link from 'next/link'
import { ChevronLeft, Mail } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition">
        <ChevronLeft size={15}/> Retour à l'accueil
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-3">Contact</h1>
      <p className="text-gray-500 text-sm mb-8">Une question, un souci technique, une suggestion ? Écrivez-nous, nous répondons sous 48h.</p>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <Mail size={20} className="text-orange-500"/>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Écrivez-nous à</div>
          <a href="mailto:contact@nucleologis.fr" className="font-semibold text-[#1e3a5f] hover:underline">contact@nucleologis.fr</a>
        </div>
      </div>
    </div>
  )
}
