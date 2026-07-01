import type { Listing, Profile, Reservation } from '@/types/database'

export const SITES_NUCLEAIRES = [
  { id: 'tricastin', name: 'Tricastin', ville: 'Saint-Paul-Trois-Châteaux', departement: 'Drôme (26)', reacteurs: 4 },
  { id: 'cruas', name: 'Cruas-Meysse', ville: 'Cruas', departement: 'Ardèche (07)', reacteurs: 4 },
  { id: 'flamanville', name: 'Flamanville', ville: 'Flamanville', departement: 'Manche (50)', reacteurs: 3 },
  { id: 'paluel', name: 'Paluel', ville: 'Paluel', departement: 'Seine-Maritime (76)', reacteurs: 4 },
  { id: 'belleville', name: 'Belleville', ville: 'Belleville-sur-Loire', departement: 'Cher (18)', reacteurs: 2 },
  { id: 'civaux', name: 'Civaux', ville: 'Civaux', departement: 'Vienne (86)', reacteurs: 2 },
]

export const AMENITY_LABELS: Record<string, string> = {
  wifi: 'WiFi haut débit',
  parking: 'Parking',
  washing: 'Lave-linge',
  kitchen: 'Cuisine équipée',
  tv: 'Télévision',
  ac: 'Climatisation',
  terrace: 'Terrasse / Jardin',
  dishwasher: 'Lave-vaisselle',
  dryer: 'Sèche-linge',
  linens: 'Draps & serviettes',
  breakfast: 'Petit-déjeuner optionnel',
  shuttle: 'Navette site à proximité',
}

export const AMENITY_ICONS: Record<string, string> = {
  wifi: '📶', parking: '🅿️', washing: '🫧', kitchen: '🍳',
  tv: '📺', ac: '❄️', terrace: '🌿', dishwasher: '🍽️',
  dryer: '💨', linens: '🛏️', breakfast: '☕', shuttle: '🚌',
}

// Profil du propriétaire connecté (simulé — viendra de Supabase Auth)
export const MOCK_OWNER_PROFILE: Profile = {
  id: 'o1',
  email: 'marie.dupont@exemple.fr',
  full_name: 'Marie Dupont',
  role: 'proprietaire',
  avatar_url: null,
  company: null,
  phone: '06 12 34 56 78',
  verified: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

// Adresse du propriétaire (stockée dans son profil étendu)
export const MOCK_OWNER_ADDRESS = {
  adresse: '3 chemin des Oliviers',
  ville: 'Pierrelatte',
  zip: '26700',
}

// Réservations liées aux annonces du proprio connecté
export const MOCK_RESERVATIONS: (Partial<Reservation> & {
  tenant_name: string
  tenant_societe: string
  tenant_adresse: string
  listing_title: string
  listing_adresse: string
  listing_ville: string
  listing_zip: string
  listing_site: string
  listing_site_name: string
  listing_prix_semaine: number
})[] = [
  {
    id: 'r1',
    listing_id: '1',
    tenant_id: 't1',
    date_start: '2026-01-12',
    date_end: '2026-02-08',
    price_total: 2600,
    statut: 'acceptee',
    tenant_name: 'Jean-Pierre Martin',
    tenant_societe: 'ORANO Services',
    tenant_adresse: '8 rue du Général de Gaulle, Lyon 69003',
    listing_title: 'Appartement T2 meublé — 2 km du Tricastin',
    listing_adresse: '12 rue des Lavandes',
    listing_ville: 'Pierrelatte',
    listing_zip: '26700',
    listing_site: 'tricastin',
    listing_site_name: 'Tricastin',
    listing_prix_semaine: 280,
  },
  {
    id: 'r2',
    listing_id: '4',
    tenant_id: 't2',
    date_start: '2026-01-15',
    date_end: '2026-02-12',
    price_total: 560,
    statut: 'acceptee',
    tenant_name: 'Karim Benali',
    tenant_societe: 'EDF Direction Industrielle',
    tenant_adresse: '22 avenue Jean Jaurès, Marseille 13005',
    listing_title: 'Chambre privée chez l\'habitant — Pierrelatte',
    listing_adresse: '5 avenue de la République',
    listing_ville: 'Pierrelatte',
    listing_zip: '26700',
    listing_site: 'tricastin',
    listing_site_name: 'Tricastin',
    listing_prix_semaine: 140,
  },
  {
    id: 'r3',
    listing_id: '1',
    tenant_id: 't3',
    date_start: '2026-02-10',
    date_end: '2026-03-10',
    price_total: 2800,
    statut: 'terminee',
    tenant_name: 'Thomas Vidal',
    tenant_societe: 'Framatome',
    tenant_adresse: '14 rue Pasteur, Valence 26000',
    listing_title: 'Appartement T2 meublé — 2 km du Tricastin',
    listing_adresse: '12 rue des Lavandes',
    listing_ville: 'Pierrelatte',
    listing_zip: '26700',
    listing_site: 'tricastin',
    listing_site_name: 'Tricastin',
    listing_prix_semaine: 280,
  },
]

// Mock listings pour le développement (avant connexion Supabase)
export const MOCK_LISTINGS: Partial<Listing>[] = [
  {
    id: '1', site: 'tricastin', site_name: 'Tricastin', type: 'appartement',
    title: 'Appartement T2 meublé — 2 km du Tricastin',
    address: '12 rue des Lavandes', city: 'Pierrelatte', zip: '26700',
    distance_km: 2.1, bedrooms: 1, bathrooms: 1, surface_m2: 48,
    price_week: 280, price_month: 650, available: true,
    amenities: ['wifi', 'parking', 'washing', 'kitchen', 'tv', 'ac'],
    photos: ['https://images.unsplash.com/photo-1600762849691-4b51bc94009c?auto=format&fit=crop&w=800&q=80'],
    avg_rating: 4.9, review_count: 31,
    description: 'Appartement T2 entièrement meublé à 2 km de la centrale du Tricastin. Cuisine ouverte, chambre avec rangements, parking privé.',
    owner: { id: 'o1', full_name: 'Marie D.', verified: true, role: 'proprietaire', email: '', created_at: '', updated_at: '' },
  },
  {
    id: '2', site: 'tricastin', site_name: 'Tricastin', type: 'maison',
    title: 'Maison 3 chambres — Saint-Paul-Trois-Châteaux',
    address: '8 chemin des Vignes', city: 'Saint-Paul-Trois-Châteaux', zip: '26130',
    distance_km: 4.8, bedrooms: 3, bathrooms: 2, surface_m2: 95,
    price_week: 480, price_month: 1100, available: true,
    amenities: ['wifi', 'parking', 'washing', 'kitchen', 'tv', 'terrace', 'dishwasher'],
    photos: ['https://images.unsplash.com/photo-CrDUaldMlNM?auto=format&fit=crop&w=800&q=80'],
    avg_rating: 4.7, review_count: 18,
    description: 'Grande maison 95m² avec jardin. Idéale équipe ou famille. 3 chambres, 2 SDB, terrasse. Parking 2 voitures, accès A7 à 3 km.',
    owner: { id: 'o2', full_name: 'Paul M.', verified: true, role: 'proprietaire', email: '', created_at: '', updated_at: '' },
  },
  {
    id: '3', site: 'tricastin', site_name: 'Tricastin', type: 'studio',
    title: 'Studio meublé — Bollène, 8 km Tricastin',
    address: '3 rue du Marché', city: 'Bollène', zip: '84500',
    distance_km: 7.9, bedrooms: 0, bathrooms: 1, surface_m2: 28,
    price_week: 195, price_month: 480, available: true,
    amenities: ['wifi', 'kitchen', 'tv', 'washing'],
    photos: ['https://images.unsplash.com/photo-1592651563903-4b13924f3c06?auto=format&fit=crop&w=800&q=80'],
    avg_rating: 4.5, review_count: 42,
    description: 'Studio tout équipé. Literie neuve, cuisine équipée, lave-linge. Transports en commun à 200m.',
    owner: { id: 'o3', full_name: 'Sophie K.', verified: false, role: 'proprietaire', email: '', created_at: '', updated_at: '' },
  },
  {
    id: '4', site: 'tricastin', site_name: 'Tricastin', type: 'chambre',
    title: 'Chambre privée chez l\'habitant — Pierrelatte',
    address: '5 avenue de la République', city: 'Pierrelatte', zip: '26700',
    distance_km: 1.5, bedrooms: 1, bathrooms: 1, surface_m2: 18,
    price_week: 140, price_month: 380, available: true,
    amenities: ['wifi', 'parking', 'washing', 'kitchen', 'tv', 'breakfast', 'shuttle'],
    photos: ['https://images.unsplash.com/photo-rGqEO2rTUs0?auto=format&fit=crop&w=800&q=80'],
    avg_rating: 4.8, review_count: 57,
    description: 'Chambre privée chez habitant expérimenté. Comprend les horaires décalés. Navette site à 300m.',
    owner: { id: 'o4', full_name: 'André B.', verified: true, role: 'proprietaire', email: '', created_at: '', updated_at: '' },
  },
  {
    id: '6', site: 'cruas', site_name: 'Cruas-Meysse', type: 'appartement',
    title: 'Appartement T2 — Cruas, 1 km du site',
    address: '2 impasse des Platanes', city: 'Cruas', zip: '07350',
    distance_km: 1.2, bedrooms: 1, bathrooms: 1, surface_m2: 44,
    price_week: 260, price_month: 610, available: true,
    amenities: ['wifi', 'parking', 'washing', 'kitchen', 'tv'],
    photos: ['https://images.unsplash.com/photo-1661962646245-5ec5dd3d0bcd?auto=format&fit=crop&w=800&q=80'],
    avg_rating: 4.8, review_count: 23,
    description: 'T2 à 1,2 km du portail principal de Cruas-Meysse. Calme, lumineux, tout équipé. Proprio souple sur horaires.',
    owner: { id: 'o5', full_name: 'Christophe V.', verified: true, role: 'proprietaire', email: '', created_at: '', updated_at: '' },
  },
  {
    id: '7', site: 'cruas', site_name: 'Cruas-Meysse', type: 'maison',
    title: 'Maison de village — Rochemaure, 2 km Cruas',
    address: '14 rue du Château', city: 'Rochemaure', zip: '07400',
    distance_km: 2.3, bedrooms: 2, bathrooms: 1, surface_m2: 72,
    price_week: 390, price_month: 880, available: true,
    amenities: ['wifi', 'parking', 'washing', 'kitchen', 'tv', 'terrace'],
    photos: ['https://images.unsplash.com/photo-v8tngVQMS9k?auto=format&fit=crop&w=800&q=80'],
    avg_rating: 4.9, review_count: 8,
    description: 'Maison de village rénovée. 2 chambres, terrasse vue Rhône. Garage 1 voiture. Gare Montélimar à 15 min.',
    owner: { id: 'o6', full_name: 'Nathalie G.', verified: true, role: 'proprietaire', email: '', created_at: '', updated_at: '' },
  },
  {
    id: '8', site: 'cruas', site_name: 'Cruas-Meysse', type: 'studio',
    title: 'Studio équipé — Montélimar, 12 km Cruas',
    address: '7 place du Marché', city: 'Montélimar', zip: '26200',
    distance_km: 12.4, bedrooms: 0, bathrooms: 1, surface_m2: 30,
    price_week: 210, price_month: 510, available: true,
    amenities: ['wifi', 'kitchen', 'tv'],
    photos: ['https://images.unsplash.com/photo-1593455427837-93e1f58b0df2?auto=format&fit=crop&w=800&q=80'],
    avg_rating: 4.4, review_count: 36,
    description: 'Studio centre-ville Montélimar. A7 à 2 min. Commerces, restaurants à pied.',
    owner: { id: 'o7', full_name: 'Laurent T.', verified: false, role: 'proprietaire', email: '', created_at: '', updated_at: '' },
  },
  {
    id: '9', site: 'cruas', site_name: 'Cruas-Meysse', type: 'appartement',
    title: 'Appartement T3 — Le Teil, 3 km Cruas',
    address: '18 boulevard Gambetta', city: 'Le Teil', zip: '07400',
    distance_km: 3.4, bedrooms: 2, bathrooms: 2, surface_m2: 75,
    price_week: 420, price_month: 960, available: true,
    amenities: ['wifi', 'parking', 'washing', 'kitchen', 'tv', 'ac', 'dishwasher', 'linens'],
    photos: ['https://images.unsplash.com/photo-nPWwHpUI35E?auto=format&fit=crop&w=800&q=80'],
    avg_rating: 4.7, review_count: 12,
    description: 'Grand T3 tout confort, 2 ch. doubles, 2 SDB, clim. Parking couvert 2 places. Draps inclus.',
    owner: { id: 'o8', full_name: 'Pierre L.', verified: true, role: 'proprietaire', email: '', created_at: '', updated_at: '' },
  },
]
