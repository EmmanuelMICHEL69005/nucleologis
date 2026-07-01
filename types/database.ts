export type SiteNucleaire = 'tricastin' | 'cruas' | 'flamanville' | 'paluel' | 'belleville' | 'civaux' | 'bugey' | 'chinon' | 'blayais' | 'golfech' | 'nogent' | 'penly' | 'saint_alban' | 'tricastin' | 'cattenom' | 'chooz' | 'cruas' | 'dampierre' | 'gravelines' | 'penley'
export type TypeLogement = 'studio' | 'appartement' | 'maison' | 'chambre'
export type UserRole = 'travailleur' | 'proprietaire'
export type StatutReservation = 'en_attente' | 'acceptee' | 'refusee' | 'annulee' | 'terminee'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      listings: {
        Row: Listing
        Insert: Omit<Listing, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Listing, 'id' | 'created_at'>>
      }
      reservations: {
        Row: Reservation
        Insert: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Reservation, 'id' | 'created_at'>>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at'>
        Update: never
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at'>
        Update: never
      }
    }
  }
}

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url: string | null
  company: string | null
  phone: string | null
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Listing {
  id: string
  owner_id: string
  site: string
  site_name: string
  type: TypeLogement
  title: string
  description: string
  address: string
  city: string
  zip: string
  distance_km: number
  surface_m2: number
  bedrooms: number
  bathrooms: number
  price_week: number
  price_month: number
  amenities: string[]
  photos: string[]
  available: boolean
  available_from: string | null
  min_duration_weeks: number
  created_at: string
  updated_at: string
  // joined
  owner?: Profile
  reviews?: Review[]
  avg_rating?: number
  review_count?: number
}

export interface Reservation {
  id: string
  listing_id: string
  tenant_id: string
  date_start: string
  date_end: string
  price_total: number
  statut: StatutReservation
  stripe_payment_intent: string | null
  message_initial: string | null
  created_at: string
  updated_at: string
  // joined
  listing?: Listing
  tenant?: Profile
}

export interface Message {
  id: string
  reservation_id: string
  sender_id: string
  content: string
  created_at: string
  // joined
  sender?: Profile
}

export interface Review {
  id: string
  listing_id: string
  author_id: string
  reservation_id: string
  rating: number
  comment: string
  created_at: string
  // joined
  author?: Profile
}
