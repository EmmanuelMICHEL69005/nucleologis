import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Wifi, Car, WashingMachine } from 'lucide-react'
import type { Listing } from '@/types/database'

interface Props {
  listing: Partial<Listing>
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi size={12}/>,
  parking: <Car size={12}/>,
  washing: <WashingMachine size={12}/>,
}

export default function ListingCard({ listing: l }: Props) {
  return (
    <Link href={`/annonce/${l.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-200 block">
      {/* Photo */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {l.photos?.[0] && (
          <img src={l.photos[0]} alt={l.title} className="w-full h-full object-cover" loading="lazy"/>
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {l.available ? 'Disponible' : 'Complet'}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-lg px-2 py-1 text-xs font-bold text-[#1e3a5f]">
          {l.price_month}€<span className="font-normal text-gray-500">/mois</span>
        </div>
        <div className="absolute bottom-3 left-3 text-white text-xs font-medium bg-black/30 backdrop-blur rounded-lg px-2 py-1">
          ⚛ {l.site_name}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">{l.title}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin size={11} className="text-orange-400"/>
          {l.city} · <strong className="text-gray-700">{l.distance_km} km</strong> du site
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Star size={11} className="text-yellow-400 fill-yellow-400"/>
          <span className="text-xs font-medium">{l.avg_rating?.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({l.review_count} avis)</span>
          <span className="text-gray-200">·</span>
          <span className="text-xs text-gray-500">{l.surface_m2}m² · {l.bedrooms === 0 ? 'Studio' : `${l.bedrooms} ch.`}</span>
        </div>

        {/* Amenities */}
        <div className="flex gap-1 flex-wrap mb-3">
          {l.amenities?.slice(0, 5).map(a => (
            <span key={a} className="w-7 h-7 bg-blue-50 rounded-md flex items-center justify-center text-[#1e3a5f]">
              {AMENITY_ICONS[a] ?? <span className="text-xs">✓</span>}
            </span>
          ))}
          {(l.amenities?.length ?? 0) > 5 && (
            <span className="w-7 h-7 bg-gray-50 rounded-md flex items-center justify-center text-xs text-gray-400">
              +{(l.amenities?.length ?? 0) - 5}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-bold">
              {l.owner?.full_name?.[0]}
            </div>
            <span className="text-xs text-gray-500">
              {l.owner?.full_name} {l.owner?.verified && <span className="text-green-500">✓</span>}
            </span>
          </div>
          <span className="text-xs font-bold text-orange-500">{l.price_week}€/sem</span>
        </div>
      </div>
    </Link>
  )
}
