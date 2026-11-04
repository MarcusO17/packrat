export type SpaceCategory = "warehouse" | "shoplot" | "residential"

export interface SpaceReview {
  id: string
  author: string
  role: string
  rating: number
  date: string
  comment: string
  sqFtBooked: number
  durationDays: number
}

export interface StorageSpace {
  id: string
  title: string
  subtitle: string
  category: SpaceCategory
  categoryLabel: string
  location: string
  region: string
  address: string
  pricePerDay: number // Base daily rate for standard allocation
  pricePerSqFtPerDay: number // Rate per sq.ft per day in MYR
  minSqFt: number
  maxSqFt: number
  availableSqFt: number
  totalSqFt: number
  defaultSqFt: number
  palletCapacity?: number
  rating: number
  reviewCount: number
  instantBook: boolean
  verified: boolean
  zeroLockIn: boolean
  featured?: boolean
  images: string[]
  mapCoords: {
    lat: number
    lng: number
    latLabel: string
    lngLabel: string
  }
  specs: {
    ceilingHeight: string
    floorLevel: string
    loadingAccess: string
    accessHours: string
    climateControl: string
    security: string
  }
  amenities: string[]
  idealFor: string[]
  compatibleVehicles: string[]
  host: {
    name: string
    role: string
    avatar: string
    responseTime: string
    joinedYear: string
    verifiedHost: boolean
    completedBookings: number
  }
  description: string
  accessInstructions: string
  reviews: SpaceReview[]
}

export interface RenterBooking {
  id: string
  spaceId: string
  spaceTitle: string
  spaceCategory: string
  location: string
  address: string
  image: string
  startDate: string
  endDate: string
  durationDays: number
  daysElapsed: number
  sqFtBooked: number
  pricePerDay: number
  logisticsCost: number
  totalPrice: number
  status: "active" | "upcoming" | "completed"
  accessPin: string
  bayAssignment: string
  moveInMethod: "self" | "lalamove"
  lalamoveVehicle?: string
  inventoryType: string
  billingMode: "upfront" | "daily-auto"
  createdAt: string
}

export const REGIONS = [
  "All Locations",
  "George Town, Penang",
  "Bayan Lepas, Penang",
  "Butterworth & Bukit Mertajam",
  "Kuala Lumpur & PJ",
  "Shah Alam, Selangor",
  "Johor Bahru, Johor",
] as const

export const REGION_VIEWPORTS: Record<
  string,
  { lat: number; lng: number; zoom: number }
> = {
  "All Locations": { lat: 5.388, lng: 100.355, zoom: 12 },
  "George Town, Penang": { lat: 5.416, lng: 100.325, zoom: 13 },
  "Bayan Lepas, Penang": { lat: 5.3185, lng: 100.287, zoom: 14 },
  "Butterworth & Bukit Mertajam": { lat: 5.36, lng: 100.424, zoom: 13 },
  "Kuala Lumpur & PJ": { lat: 3.1129, lng: 101.6398, zoom: 13 },
  "Shah Alam, Selangor": { lat: 3.0548, lng: 101.5492, zoom: 13 },
  "Johor Bahru, Johor": { lat: 1.5521, lng: 103.7815, zoom: 13 },
}

export const SPACE_CATEGORIES: {
  id: "all" | SpaceCategory
  label: string
  shortLabel: string
  description: string
}[] = [
  {
    id: "all",
    label: "All Storage Spaces",
    shortLabel: "All Spaces",
    description: "Every verified room, shoplot & warehouse bay",
  },
  {
    id: "warehouse",
    label: "SME Pallet & Fulfillment Bays",
    shortLabel: "SME Pallet Bays",
    description: "Commercial racking, loading bays & pallet jacks",
  },
  {
    id: "shoplot",
    label: "Shoplot & Retail Micro-Hubs",
    shortLabel: "Shoplot Micro-Hubs",
    description: "Ground-floor city backrooms for fast dispatch",
  },
  {
    id: "residential",
    label: "Spare Rooms & Personal Lockers",
    shortLabel: "Spare Rooms",
    description: "Neighborhood rooms for boxes, luggage & furniture",
  },
]

export const AMENITY_FILTERS = [
  "24/7 Smart Access",
  "Climate-Controlled",
  "Loading Bay",
  "Ground Floor",
  "Pallet Jack On-Site",
  "Lalamove Friendly",
  "24/7 CCTV",
  "Rack Shelving Included",
] as const

export interface EstimatorItem {
  id: string
  name: string
  subtitle: string
  sqFtPerUnit: number
  defaultCount: number
}

export const ESTIMATOR_ITEMS: EstimatorItem[] = [
  {
    id: "boxes",
    name: "Standard Moving / Archive Boxes",
    subtitle: "50cm × 40cm × 40cm (stackable up to 4 high)",
    sqFtPerUnit: 3,
    defaultCount: 10,
  },
  {
    id: "totes",
    name: "E-Commerce SKU Storage Totes",
    subtitle: "Heavy-duty 60L plastic bins for Shopee/TikTok stock",
    sqFtPerUnit: 5,
    defaultCount: 6,
  },
  {
    id: "pallets",
    name: "Standard ISO / Euro Pallets",
    subtitle: "120cm × 100cm footprint + aisle clearance",
    sqFtPerUnit: 22,
    defaultCount: 2,
  },
  {
    id: "racks",
    name: "Mobile Display / Event Booth Cases",
    subtitle: "Pop-up backdrops, folding tables & campaign stands",
    sqFtPerUnit: 15,
    defaultCount: 0,
  },
  {
    id: "furniture",
    name: "Bulky Furniture / Appliances",
    subtitle: "Desks, sofas, commercial chillers or office chairs",
    sqFtPerUnit: 25,
    defaultCount: 0,
  },
]

export const SIZE_TIERS = [
  {
    id: "locker",
    name: "Compact Locker / Closet",
    range: "25 – 60 sq.ft",
    recommendedSqFt: 50,
    capacity: "12–20 boxes or luggage",
    idealFor: "Students, travelers & home decluttering",
    estDailyMYR: "RM 8 – RM 14/day",
  },
  {
    id: "room",
    name: "Neighborhood Spare Room",
    range: "75 – 150 sq.ft",
    recommendedSqFt: 100,
    capacity: "35+ boxes or 1-bedroom furniture",
    idealFor: "Home renovations & micro-sellers",
    estDailyMYR: "RM 12 – RM 20/day",
  },
  {
    id: "shoplot",
    name: "Shoplot Fulfillment Backroom",
    range: "200 – 450 sq.ft",
    recommendedSqFt: 250,
    capacity: "6–10 pallets + packing table",
    idealFor: "Shopee, TikTok Shop & retail overflow",
    estDailyMYR: "RM 22 – RM 38/day",
  },
  {
    id: "warehouse",
    name: "Commercial SME Pallet Bay",
    range: "500 – 2,500+ sq.ft",
    recommendedSqFt: 600,
    capacity: "20–80 pallets with forklift access",
    idealFor: "3PL overflow, FMCG & seasonal campaigns",
    estDailyMYR: "RM 45 – RM 140/day",
  },
]

export const STORAGE_SPACES: StorageSpace[] = [
  {
    id: "bayan-lepas-ftz-sme-bay",
    title: "Climate-Controlled SME Warehouse Bay",
    subtitle: "Grade-A industrial bay 5 mins from Penang Bridge & FTZ Phase 3",
    category: "warehouse",
    categoryLabel: "SME Pallet Bay",
    location: "Bayan Lepas, Penang",
    region: "Bayan Lepas, Penang",
    address:
      "Halaman Kampung Jawa, Bayan Lepas Free Industrial Zone, 11900 Penang",
    pricePerDay: 28,
    pricePerSqFtPerDay: 0.08,
    minSqFt: 100,
    maxSqFt: 1500,
    availableSqFt: 1200,
    totalSqFt: 2000,
    defaultSqFt: 350,
    palletCapacity: 45,
    rating: 4.96,
    reviewCount: 84,
    instantBook: true,
    verified: true,
    zeroLockIn: true,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=900&q=80",
    ],
    mapCoords: {
      lat: 5.3185,
      lng: 100.287,
      latLabel: "5.3185° N",
      lngLabel: "100.2870° E",
    },
    specs: {
      ceilingHeight: "7.5m Clear Height",
      floorLevel: "Ground + Hydraulic Dock",
      loadingAccess: "20ft/40ft Container & Van",
      accessHours: "24/7 Smart PIN & QR",
      climateControl: "22°C – 25°C Dehumidified",
      security: "24/7 Guarded + AI CCTV",
    },
    amenities: [
      "24/7 Smart Access",
      "Climate-Controlled",
      "Loading Bay",
      "Ground Floor",
      "Pallet Jack On-Site",
      "Lalamove Friendly",
      "24/7 CCTV",
      "Rack Shelving Included",
    ],
    idealFor: [
      "E-Commerce Campaign Stock",
      "Electronics & Cosmetics",
      "Palletized B2B Inventory",
      "Last-Mile Penang Fulfillment",
    ],
    compatibleVehicles: [
      "Motorcycle Courier",
      "4x4 Pickup",
      "1.7m / 2.4m Van",
      "1-Ton & 3-Ton Lorry",
      "40ft Container Trailer",
    ],
    host: {
      name: "Apex Northern Logistics",
      role: "Verified Industrial Host",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseTime: "< 10 mins",
      joinedYear: "2023",
      verifiedHost: true,
      completedBookings: 312,
    },
    description:
      "Purpose-built microwarehousing bay inside a modern Bayan Lepas logistics facility. Designed for SMEs, Shopee/TikTok sellers, and regional distributors who need elastic space without signing a 3-year industrial tenancy. Features demarcated floor zones, complimentary hand pallet jacks, high-speed Wi-Fi for barcode scanning, and dedicated Lalamove / EasyParcel staging lanes.",
    accessInstructions:
      "Upon booking confirmation, your Packrat Smart QR & 6-digit PIN will unlock Roller Shutter Gate B3 automatically. Guardhouse registration is pre-cleared via your vehicle or Lalamove driver plate.",
    reviews: [
      {
        id: "r1",
        author: "Kelvin Tan",
        role: "Founder @ Northern Homeware",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Booked 400 sq.ft for our 11.11 campaign overflow. Being able to scale down after 18 days saved us thousands compared to renting a whole shoplot.",
        sqFtBooked: 400,
        durationDays: 18,
      },
      {
        id: "r2",
        author: "Nurul Aina",
        role: "Operations Lead @ GlowLab MY",
        rating: 5,
        date: "1 month ago",
        comment:
          "Temperature and humidity stays super consistent—crucial for our skincare cartons. Lalamove drivers can back right up to the loading bay.",
        sqFtBooked: 250,
        durationDays: 45,
      },
    ],
  },
  {
    id: "george-town-shoplot-hub",
    title: "George Town Heritage Shoplot Micro-Hub",
    subtitle:
      "Ground-floor commercial backroom off Beach Street with wide back-lane loading",
    category: "shoplot",
    categoryLabel: "Shoplot Micro-Hub",
    location: "George Town, Penang",
    region: "George Town, Penang",
    address: "Lebuh Pantai (Beach St), George Town, 10300 Penang",
    pricePerDay: 22,
    pricePerSqFtPerDay: 0.088,
    minSqFt: 50,
    maxSqFt: 600,
    availableSqFt: 450,
    totalSqFt: 800,
    defaultSqFt: 250,
    palletCapacity: 12,
    rating: 4.91,
    reviewCount: 63,
    instantBook: true,
    verified: true,
    zeroLockIn: true,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    ],
    mapCoords: {
      lat: 5.4145,
      lng: 100.3385,
      latLabel: "5.4145° N",
      lngLabel: "100.3385° E",
    },
    specs: {
      ceilingHeight: "4.2m High Ceiling",
      floorLevel: "Ground Floor (Step-Free)",
      loadingAccess: "Private Back-Lane Van Bay",
      accessHours: "24/7 Smart Lock",
      climateControl: "Air-Conditioned + Dry",
      security: "Smart Access + 8ch CCTV",
    },
    amenities: [
      "24/7 Smart Access",
      "Climate-Controlled",
      "Ground Floor",
      "Lalamove Friendly",
      "24/7 CCTV",
      "Rack Shelving Included",
    ],
    idealFor: [
      "F&B Dry Packaging Stock",
      "Boutique Retail Inventory",
      "Pop-Up Event Gear",
      "Same-Day Island Dispatch",
    ],
    compatibleVehicles: [
      "Motorcycle Courier",
      "4x4 Pickup",
      "1.7m / 2.4m Van",
      "1-Ton Box Lorry",
    ],
    host: {
      name: "Straits Commercial Collective",
      role: "Shoplot Space Partner",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      responseTime: "< 15 mins",
      joinedYear: "2024",
      verifiedHost: true,
      completedBookings: 189,
    },
    description:
      "Renovated, damp-proofed ground-floor commercial backroom in the heart of George Town. Heavy-duty boltless steel racks are pre-installed so you can organize cartons immediately. Ideal for retail brands, cafes needing dry packaging overflow, and e-commerce sellers dispatching across Penang Island.",
    accessInstructions:
      "Enter via Gat Lebuh Pantai service lane. Key in your 6-digit Packrat PIN on the Igloohome smart padlock and interior keypad.",
    reviews: [
      {
        id: "r3",
        author: "Marcus Lim",
        role: "Co-Founder @ BrewCraft Coffee",
        rating: 5,
        date: "6 days ago",
        comment:
          "Super convenient for storing our takeaway cups and coffee bean sacks near our Chulia Street outlet. Zero dampness and 24/7 access works flawlessly.",
        sqFtBooked: 150,
        durationDays: 30,
      },
    ],
  },
  {
    id: "jelutong-sme-hub",
    title: "Jelutong Expressway Commercial Shoplot Hub",
    subtitle:
      "Central island ground-floor fulfillment backroom 2 mins from Tun Dr Lim Chong Eu Highway",
    category: "shoplot",
    categoryLabel: "Shoplot Micro-Hub",
    location: "Jelutong, Penang",
    region: "George Town, Penang",
    address: "Jalan Jelutong, 11600 Jelutong, Penang",
    pricePerDay: 20,
    pricePerSqFtPerDay: 0.08,
    minSqFt: 80,
    maxSqFt: 550,
    availableSqFt: 400,
    totalSqFt: 650,
    defaultSqFt: 250,
    palletCapacity: 10,
    rating: 4.93,
    reviewCount: 47,
    instantBook: true,
    verified: true,
    zeroLockIn: true,
    images: [
      "https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
    ],
    mapCoords: {
      lat: 5.3895,
      lng: 100.3145,
      latLabel: "5.3895° N",
      lngLabel: "100.3145° E",
    },
    specs: {
      ceilingHeight: "4.0m Commercial",
      floorLevel: "Ground Floor Roller Shutter",
      loadingAccess: "Direct Roadside Loading Bay",
      accessHours: "24/7 Smart PIN",
      climateControl: "Dehumidified + Ventilated",
      security: "24/7 CCTV + Smart Alarm",
    },
    amenities: [
      "24/7 Smart Access",
      "Loading Bay",
      "Ground Floor",
      "Pallet Jack On-Site",
      "Lalamove Friendly",
      "24/7 CCTV",
      "Rack Shelving Included",
    ],
    idealFor: [
      "Shopee & Lazada Parcel Staging",
      "Central Island Distribution",
      "Retail Promotion Stock",
    ],
    compatibleVehicles: [
      "Motorcycle Courier",
      "4x4 Pickup",
      "1.7m / 2.4m Van",
      "1-Ton Lorry",
    ],
    host: {
      name: "Island Grid Spaces",
      role: "Verified Commercial Host",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      responseTime: "< 10 mins",
      joinedYear: "2024",
      verifiedHost: true,
      completedBookings: 142,
    },
    description:
      "Strategically positioned midway between George Town and Penang Bridge along the Jelutong corridor. Features wide roller-shutter access, complimentary hand pallet jack, and pre-installed heavy-duty racking.",
    accessInstructions:
      "Unlock the front roller shutter keypad using your 6-digit Packrat PIN.",
    reviews: [],
  },
  {
    id: "butterworth-pallet-unit",
    title: "Butterworth Deep-Water Hub Pallet Bay",
    subtitle:
      "High-clearance mainland warehouse next to North-South Expressway & Perai Industrial Estate",
    category: "warehouse",
    categoryLabel: "SME Pallet Bay",
    location: "Butterworth, Penang",
    region: "Butterworth & Bukit Mertajam",
    address: "Jalan Perusahaan, Perai Industrial Estate, 13600 Butterworth, Penang",
    pricePerDay: 18,
    pricePerSqFtPerDay: 0.06,
    minSqFt: 150,
    maxSqFt: 3000,
    availableSqFt: 2400,
    totalSqFt: 5000,
    defaultSqFt: 300,
    palletCapacity: 90,
    rating: 4.89,
    reviewCount: 51,
    instantBook: true,
    verified: true,
    zeroLockIn: true,
    images: [
      "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
    ],
    mapCoords: {
      lat: 5.368,
      lng: 100.402,
      latLabel: "5.3680° N",
      lngLabel: "100.4020° E",
    },
    specs: {
      ceilingHeight: "9.0m Industrial Clear",
      floorLevel: "Raised Dock + Ramp",
      loadingAccess: "3-Ton Lorry & 40ft Trailer",
      accessHours: "24/7 Automated Gate",
      climateControl: "Industrial HVLS Ventilated",
      security: "Perimeter Guard + Flood-Free",
    },
    amenities: [
      "24/7 Smart Access",
      "Loading Bay",
      "Ground Floor",
      "Pallet Jack On-Site",
      "Lalamove Friendly",
      "24/7 CCTV",
    ],
    idealFor: [
      "Bulk Pallet Storage",
      "Mainland Distribution",
      "Construction & Hardware",
      "Cross-State Freight Staging",
    ],
    compatibleVehicles: [
      "4x4 Pickup",
      "1.7m / 2.4m Van",
      "1-Ton & 3-Ton Lorry",
      "10-Ton & 40ft Trailer",
    ],
    host: {
      name: "Seberang Freight & Storage",
      role: "Verified Warehouse Partner",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      responseTime: "< 20 mins",
      joinedYear: "2023",
      verifiedHost: true,
      completedBookings: 240,
    },
    description:
      "Cost-effective bulk pallet and crate storage right off the North-South Highway (PLUS) in Perai/Butterworth. Features 3-tier heavy-duty pallet racking, on-site forklift assistance upon request, and wide turning radius for lorries.",
    accessInstructions:
      "Scan your Packrat Digital Pass at Gate 1 boom barrier. Proceed to Bay C loading dock.",
    reviews: [
      {
        id: "r4",
        author: "Chong Wei Ming",
        role: "Director @ WM Hardware Supplies",
        rating: 4.9,
        date: "3 weeks ago",
        comment:
          "Best per-sq.ft daily rate in Penang. Stored 16 pallets here while waiting for our new factory rack installation.",
        sqFtBooked: 500,
        durationDays: 21,
      },
    ],
  },
  {
    id: "tanjung-tokong-spare-room",
    title: "Tanjung Tokong Ground-Level Spare Room",
    subtitle:
      "Clean, air-conditioned private room for personal boxes, luggage & home furniture",
    category: "residential",
    categoryLabel: "Verified Spare Room",
    location: "Tanjung Tokong, Penang",
    region: "George Town, Penang",
    address: "Jalan Seri Tanjung Pinang, Tanjung Tokong, 10470 Penang",
    pricePerDay: 12,
    pricePerSqFtPerDay: 0.12,
    minSqFt: 30,
    maxSqFt: 150,
    availableSqFt: 120,
    totalSqFt: 150,
    defaultSqFt: 100,
    rating: 4.98,
    reviewCount: 42,
    instantBook: true,
    verified: true,
    zeroLockIn: true,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=900&q=80",
    ],
    mapCoords: {
      lat: 5.4535,
      lng: 100.3065,
      latLabel: "5.4535° N",
      lngLabel: "100.3065° E",
    },
    specs: {
      ceilingHeight: "3.0m Residential",
      floorLevel: "Ground Floor Courtyard",
      loadingAccess: "Direct Car Porch Drop-Off",
      accessHours: "7:00 AM – 11:00 PM Daily",
      climateControl: "Dehumidifier + AC",
      security: "Gated Precinct + Smart Lock",
    },
    amenities: [
      "Climate-Controlled",
      "Ground Floor",
      "Lalamove Friendly",
      "24/7 CCTV",
      "Rack Shelving Included",
    ],
    idealFor: [
      "Home Renovation Furniture",
      "Student Semester Luggage",
      "Archive Documents & Books",
      "Personal Collectibles",
    ],
    compatibleVehicles: [
      "Sedan / SUV",
      "Motorcycle Courier",
      "4x4 Pickup",
      "1.7m Lalamove Van",
    ],
    host: {
      name: "grace_tan",
      role: "Superhost • Residential",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      responseTime: "< 5 mins",
      joinedYear: "2024",
      verifiedHost: true,
      completedBookings: 78,
    },
    description:
      "Spotless, private ground-floor utility suite with independent side entrance in Seri Tanjung Pinang. No stairs or lifts needed—back your car or Lalamove van right into the porch and unload in minutes. Equipped with a commercial dehumidifier running 24/7.",
    accessInstructions:
      "Use the side garden gate smart keypad with your temporary Packrat PIN. Trolley provided inside the room.",
    reviews: [
      {
        id: "r5",
        author: "Sarah Jenkins",
        role: "Remote Designer",
        rating: 5,
        date: "1 week ago",
        comment:
          "Stored 18 boxes and my standing desk for 25 days while traveling. Grace's space is cleaner than a hotel room!",
        sqFtBooked: 80,
        durationDays: 25,
      },
    ],
  },
  {
    id: "bukit-mertajam-locker",
    title: "Bukit Mertajam Ground-Floor Smart Locker & Box Unit",
    subtitle: "Secure self-access box & small-business storage near Icon City BM",
    category: "residential",
    categoryLabel: "Smart Box Unit",
    location: "Bukit Mertajam, Penang",
    region: "Butterworth & Bukit Mertajam",
    address: "Jalan Song Ban Kheng, 14000 Bukit Mertajam, Penang",
    pricePerDay: 14,
    pricePerSqFtPerDay: 0.1,
    minSqFt: 40,
    maxSqFt: 250,
    availableSqFt: 200,
    totalSqFt: 300,
    defaultSqFt: 120,
    rating: 4.87,
    reviewCount: 29,
    instantBook: true,
    verified: true,
    zeroLockIn: true,
    images: [
      "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    ],
    mapCoords: {
      lat: 5.3522,
      lng: 100.4468,
      latLabel: "5.3522° N",
      lngLabel: "100.4468° E",
    },
    specs: {
      ceilingHeight: "3.4m Clear",
      floorLevel: "Ground Floor",
      loadingAccess: "Front Curbside Loading",
      accessHours: "24/7 Smart PIN",
      climateControl: "Ventilated + Dry",
      security: "24/7 CCTV + Alarm",
    },
    amenities: [
      "24/7 Smart Access",
      "Ground Floor",
      "Lalamove Friendly",
      "24/7 CCTV",
      "Rack Shelving Included",
    ],
    idealFor: [
      "Online Seller Cartons",
      "Seasonal Festive Decor",
      "Business Accounting Archives",
      "Home Moving Overflow",
    ],
    compatibleVehicles: [
      "Sedan / SUV",
      "Motorcycle Courier",
      "4x4 Pickup",
      "1.7m Lalamove Van",
    ],
    host: {
      name: "BM Storage Box Co.",
      role: "Verified Space Host",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      responseTime: "< 15 mins",
      joinedYear: "2024",
      verifiedHost: true,
      completedBookings: 94,
    },
    description:
      "Accessible 24/7 ground-floor storage bays in central Bukit Mertajam. Equipped with 4-tier heavy-duty racking and hand trolleys for effortless box stacking.",
    accessInstructions:
      "Park directly in the yellow Packrat bay in front of unit #18. Enter your 6-digit PIN at the main glass door.",
    reviews: [],
  },
  {
    id: "kl-pj-commercial-bay",
    title: "PJ Section 13 E-Commerce Micro-Fulfillment Hub",
    subtitle:
      "Central Klang Valley shoplot-warehouse hybrid with packing station & Lalamove bay",
    category: "shoplot",
    categoryLabel: "Shoplot Micro-Hub",
    location: "Petaling Jaya, Selangor",
    region: "Kuala Lumpur & PJ",
    address: "Jalan Kemajuan, Seksyen 13, 46200 Petaling Jaya, Selangor",
    pricePerDay: 32,
    pricePerSqFtPerDay: 0.09,
    minSqFt: 100,
    maxSqFt: 1000,
    availableSqFt: 750,
    totalSqFt: 1200,
    defaultSqFt: 350,
    palletCapacity: 25,
    rating: 4.95,
    reviewCount: 112,
    instantBook: true,
    verified: true,
    zeroLockIn: true,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=900&q=80",
    ],
    mapCoords: {
      lat: 3.1129,
      lng: 101.6398,
      latLabel: "3.1129° N",
      lngLabel: "101.6398° E",
    },
    specs: {
      ceilingHeight: "5.0m Commercial",
      floorLevel: "Ground Floor Drive-In",
      loadingAccess: "Dedicated 2-Bay Van & Lorry Zone",
      accessHours: "24/7 Smart Access",
      climateControl: "Full AC (23°C)",
      security: "Biometric + 24/7 CCTV",
    },
    amenities: [
      "24/7 Smart Access",
      "Climate-Controlled",
      "Loading Bay",
      "Ground Floor",
      "Pallet Jack On-Site",
      "Lalamove Friendly",
      "24/7 CCTV",
      "Rack Shelving Included",
    ],
    idealFor: [
      "Klang Valley Same-Day Delivery",
      "TikTok Live Studio Overflow",
      "D2C Apparel & Footwear",
      "Corporate Event Kits",
    ],
    compatibleVehicles: [
      "Motorcycle Courier",
      "4x4 Pickup",
      "1.7m / 2.4m Van",
      "1-Ton & 3-Ton Lorry",
    ],
    host: {
      name: "Klang Valley SpaceGrid",
      role: "Verified Commercial Host",
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
      responseTime: "< 5 mins",
      joinedYear: "2023",
      verifiedHost: true,
      completedBookings: 428,
    },
    description:
      "Located right in PJ Section 13 with instant access to Federal Highway, Sprint, and LDP. Built for fast-growing D2C brands that need central Klang Valley inventory positioning without locking into a RM 8,000/month shoplot lease.",
    accessInstructions:
      "Drive into Block B ground-floor loading apron. Use your Packrat QR pass at the smart turnstile or roller shutter.",
    reviews: [
      {
        id: "r6",
        author: "Hafiz Rahman",
        role: "Ops Manager @ KicksVault MY",
        rating: 5,
        date: "4 days ago",
        comment:
          "Game changer for our Raya pop-up stock. Having pallet jacks and a packing bench right by the loading bay saved our team hours every day.",
        sqFtBooked: 450,
        durationDays: 35,
      },
    ],
  },
  {
    id: "shah-alam-fulfillment-bay",
    title: "Shah Alam Hicom Grade-A Pallet & Racking Bay",
    subtitle:
      "High-volume pallet storage with dock levelers & optional pick-and-pack staging",
    category: "warehouse",
    categoryLabel: "SME Pallet Bay",
    location: "Shah Alam, Selangor",
    region: "Shah Alam, Selangor",
    address: "Persiaran Jubli Perak, Seksyen 22, 40300 Shah Alam, Selangor",
    pricePerDay: 35,
    pricePerSqFtPerDay: 0.07,
    minSqFt: 200,
    maxSqFt: 4000,
    availableSqFt: 3200,
    totalSqFt: 6000,
    defaultSqFt: 500,
    palletCapacity: 120,
    rating: 4.94,
    reviewCount: 77,
    instantBook: true,
    verified: true,
    zeroLockIn: true,
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=900&q=80",
    ],
    mapCoords: {
      lat: 3.0548,
      lng: 101.5492,
      latLabel: "3.0548° N",
      lngLabel: "101.5492° E",
    },
    specs: {
      ceilingHeight: "10.5m Super High",
      floorLevel: "Hydraulic Loading Dock",
      loadingAccess: "6 Dock Bays (Up to 40ft)",
      accessHours: "24/7 Guarded Access",
      climateControl: "Insulated Roof + HVLS",
      security: "ISO Certified + Fire Sprinklers",
    },
    amenities: [
      "24/7 Smart Access",
      "Loading Bay",
      "Ground Floor",
      "Pallet Jack On-Site",
      "Lalamove Friendly",
      "24/7 CCTV",
      "Rack Shelving Included",
    ],
    idealFor: [
      "FMCG & Retail Pallets",
      "Import Container De-vanning",
      "Shopee Mall / Lazada Stock",
      "Exhibition & Roadshow Crates",
    ],
    compatibleVehicles: [
      "1.7m / 2.4m Van",
      "1-Ton & 3-Ton Lorry",
      "10-Ton Lorry",
      "40ft Container Trailer",
    ],
    host: {
      name: "Central Nexus Warehousing",
      role: "Enterprise Industrial Host",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
      responseTime: "< 10 mins",
      joinedYear: "2023",
      verifiedHost: true,
      completedBookings: 510,
    },
    description:
      "Enterprise-grade warehouse bay sliced into flexible daily square footage for SMEs. Located at the intersection of ELITE and KESAS highways for effortless Port Klang and Klang Valley transit.",
    accessInstructions:
      "Present your Packrat vehicle QR pass at Guardhouse A. Proceed to Loading Dock 4.",
    reviews: [],
  },
  {
    id: "jb-cross-border-hub",
    title: "Johor Bahru Tebrau Cross-Border Logistics Bay",
    subtitle:
      "Strategic Southern hub 12 mins from CIQ Woodland Causeway for MY-SG stock",
    category: "shoplot",
    categoryLabel: "Shoplot Micro-Hub",
    location: "Johor Bahru, Johor",
    region: "Johor Bahru, Johor",
    address:
      "Jalan Austin Perdana, Taman Mount Austin, 81100 Johor Bahru, Johor",
    pricePerDay: 24,
    pricePerSqFtPerDay: 0.08,
    minSqFt: 100,
    maxSqFt: 900,
    availableSqFt: 650,
    totalSqFt: 1000,
    defaultSqFt: 300,
    palletCapacity: 22,
    rating: 4.92,
    reviewCount: 48,
    instantBook: true,
    verified: true,
    zeroLockIn: true,
    images: [
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&w=900&q=80",
    ],
    mapCoords: {
      lat: 1.5521,
      lng: 103.7815,
      latLabel: "1.5521° N",
      lngLabel: "103.7815° E",
    },
    specs: {
      ceilingHeight: "4.8m High Ceiling",
      floorLevel: "Ground Floor Roller Shutter",
      loadingAccess: "Wide Front & Back Lane",
      accessHours: "24/7 Smart PIN",
      climateControl: "Climate-Controlled (24°C)",
      security: "24/7 Patrol + Smart CCTV",
    },
    amenities: [
      "24/7 Smart Access",
      "Climate-Controlled",
      "Loading Bay",
      "Ground Floor",
      "Pallet Jack On-Site",
      "Lalamove Friendly",
      "24/7 CCTV",
    ],
    idealFor: [
      "MY-SG Cross-Border Sellers",
      "Mount Austin Retail Overflow",
      "Wholesale Cartons & Pallets",
    ],
    compatibleVehicles: [
      "Motorcycle Courier",
      "4x4 Pickup",
      "1.7m / 2.4m Van",
      "1-Ton & 3-Ton Lorry",
    ],
    host: {
      name: "Southern Corridor Hubs",
      role: "Verified Commercial Host",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      responseTime: "< 10 mins",
      joinedYear: "2024",
      verifiedHost: true,
      completedBookings: 164,
    },
    description:
      "High-security commercial storage hub in Mount Austin, JB. Ideal for Singapore & Malaysian merchants staging cross-border inventory or managing seasonal demand spikes without overhead.",
    accessInstructions:
      "Unlock Roller Shutter #12 using your Packrat app pass or 6-digit keypad PIN.",
    reviews: [],
  },
]

export const INITIAL_RENTER_BOOKINGS: RenterBooking[] = [
  {
    id: "PKR-88412",
    spaceId: "bayan-lepas-ftz-sme-bay",
    spaceTitle: "Climate-Controlled SME Warehouse Bay",
    spaceCategory: "SME Pallet Bay",
    location: "Bayan Lepas, Penang",
    address:
      "Halaman Kampung Jawa, Bayan Lepas Free Industrial Zone, 11900 Penang",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    startDate: "2026-10-28",
    endDate: "2026-11-11",
    durationDays: 14,
    daysElapsed: 7,
    sqFtBooked: 350,
    pricePerDay: 28,
    logisticsCost: 45,
    totalPrice: 437,
    status: "active",
    accessPin: "482-910",
    bayAssignment: "Zone B • Bay #04 (Ground Dock)",
    moveInMethod: "lalamove",
    lalamoveVehicle: "2.4m High-Roof Van",
    inventoryType: "SME E-Commerce Stock (12 Pallets + 30 Totes)",
    billingMode: "daily-auto",
    createdAt: "2026-10-27",
  },
  {
    id: "PKR-87904",
    spaceId: "george-town-shoplot-hub",
    spaceTitle: "George Town Heritage Shoplot Micro-Hub",
    spaceCategory: "Shoplot Micro-Hub",
    location: "George Town, Penang",
    address: "Lebuh Pantai (Beach St), George Town, 10300 Penang",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80",
    startDate: "2026-11-10",
    endDate: "2026-11-20",
    durationDays: 10,
    daysElapsed: 0,
    sqFtBooked: 150,
    pricePerDay: 16,
    logisticsCost: 0,
    totalPrice: 160,
    status: "upcoming",
    accessPin: "719-304",
    bayAssignment: "Ground Backroom • Rack Zone A2",
    moveInMethod: "self",
    inventoryType: "Pop-Up Event Booth & Retail Cartons",
    billingMode: "upfront",
    createdAt: "2026-11-02",
  },
  {
    id: "PKR-84109",
    spaceId: "tanjung-tokong-spare-room",
    spaceTitle: "Tanjung Tokong Ground-Level Spare Room",
    spaceCategory: "Verified Spare Room",
    location: "Tanjung Tokong, Penang",
    address: "Jalan Seri Tanjung Pinang, Tanjung Tokong, 10470 Penang",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    startDate: "2026-09-12",
    endDate: "2026-09-26",
    durationDays: 14,
    daysElapsed: 14,
    sqFtBooked: 100,
    pricePerDay: 12,
    logisticsCost: 32,
    totalPrice: 200,
    status: "completed",
    accessPin: "Expired",
    bayAssignment: "Suite G-02",
    moveInMethod: "lalamove",
    lalamoveVehicle: "4x4 Pickup",
    inventoryType: "Personal Boxes & Home Renovation Overflow",
    billingMode: "upfront",
    createdAt: "2026-09-10",
  },
]

const BOOKINGS_STORAGE_KEY = "packrat-renter-bookings-v1"

export function getStoredBookings(): RenterBooking[] {
  if (typeof window === "undefined") return INITIAL_RENTER_BOOKINGS
  try {
    const raw = window.localStorage.getItem(BOOKINGS_STORAGE_KEY)
    if (!raw) return INITIAL_RENTER_BOOKINGS
    const parsed = JSON.parse(raw) as RenterBooking[]
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : INITIAL_RENTER_BOOKINGS
  } catch {
    return INITIAL_RENTER_BOOKINGS
  }
}

export function saveStoredBookings(bookings: RenterBooking[]): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings))
  } catch {
    // ignore storage errors
  }
}

export function addRenterBooking(booking: RenterBooking): RenterBooking[] {
  const current = getStoredBookings()
  const updated = [booking, ...current]
  saveStoredBookings(updated)
  return updated
}

export function calculateDailyRateForSqFt(
  space: StorageSpace,
  sqFt: number
): number {
  const ratio = sqFt / space.defaultSqFt
  const raw = Math.round(space.pricePerDay * ratio)
  return Math.max(8, raw)
}

export function getSpaceById(id: string): StorageSpace | undefined {
  return STORAGE_SPACES.find((s) => s.id === id)
}
