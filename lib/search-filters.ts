import {
  AMENITY_FILTERS,
  ESTIMATOR_ITEMS,
  STORAGE_SPACES,
  calculateDailyRateForSqFt,
  type SpaceCategory,
  type StorageSpace,
} from "@/lib/spaces-data"

export type SortOption = "recommended" | "price-asc" | "sqft-desc" | "rating"

export interface SearchFilters {
  query: string
  region: string
  category: "all" | SpaceCategory
  sqft: number
  /** Max daily budget in MYR. `NO_BUDGET_LIMIT` means "any price". */
  maxBudget: number
  instantBook: boolean
  amenities: string[]
  sortBy: SortOption
}

export const NO_BUDGET_LIMIT = 80
export const MIN_BUDGET = 12

export const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  region: "All Locations",
  category: "all",
  sqft: 0,
  maxBudget: NO_BUDGET_LIMIT,
  instantBook: false,
  amenities: [],
  sortBy: "recommended",
}

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Lowest daily rate" },
  { id: "sqft-desc", label: "Most space available" },
  { id: "rating", label: "Highest rated" },
]

/** Effective daily price for a space given the requested size. */
export function priceForSize(space: StorageSpace, sqft: number) {
  return sqft > 0
    ? calculateDailyRateForSqFt(space, Math.max(space.minSqFt, sqft))
    : space.pricePerDay
}

export function filterSpaces(
  filters: SearchFilters,
  spaces: StorageSpace[] = STORAGE_SPACES
) {
  const q = filters.query.trim().toLowerCase()
  return spaces
    .filter((space) => {
      if (filters.region !== "All Locations" && space.region !== filters.region)
        return false
      if (filters.category !== "all" && space.category !== filters.category)
        return false
      if (filters.sqft > 0 && space.availableSqFt < filters.sqft) return false
      if (
        filters.maxBudget < NO_BUDGET_LIMIT &&
        priceForSize(space, filters.sqft) > filters.maxBudget
      )
        return false
      if (filters.instantBook && !space.instantBook) return false
      if (!filters.amenities.every((am) => space.amenities.includes(am)))
        return false
      if (q) {
        const haystack = [
          space.title,
          space.location,
          space.subtitle,
          space.region,
          ...space.idealFor,
        ]
          .join(" ")
          .toLowerCase()
        if (!q.split(/\s+/).every((word) => haystack.includes(word)))
          return false
      }
      return true
    })
    .sort((a, b) => {
      if (filters.sortBy === "price-asc")
        return priceForSize(a, filters.sqft) - priceForSize(b, filters.sqft)
      if (filters.sortBy === "sqft-desc") return b.availableSqFt - a.availableSqFt
      if (filters.sortBy === "rating") return b.rating - a.rating
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    })
}

/** Count of refinements beyond the main wizard (region / type / size). */
export function countExtraFilters(filters: SearchFilters) {
  return (
    (filters.maxBudget < NO_BUDGET_LIMIT ? 1 : 0) +
    (filters.instantBook ? 1 : 0) +
    (filters.sortBy !== "recommended" ? 1 : 0) +
    filters.amenities.length
  )
}

export function isDefaultFilters(filters: SearchFilters) {
  return (
    filters.query.trim() === "" &&
    filters.region === DEFAULT_FILTERS.region &&
    filters.category === "all" &&
    filters.sqft === 0 &&
    countExtraFilters(filters) === 0
  )
}

/* -------------------------------------------------------------------------- */
/*                         Human-readable descriptions                        */
/* -------------------------------------------------------------------------- */

export const CATEGORY_NOUNS: Record<
  "all" | SpaceCategory,
  { one: string; many: string }
> = {
  all: { one: "storage space", many: "storage spaces" },
  warehouse: { one: "pallet bay", many: "pallet bays" },
  shoplot: { one: "shoplot micro-hub", many: "shoplot micro-hubs" },
  residential: { one: "spare room", many: "spare rooms" },
}

export function shortRegion(region: string) {
  if (region === "All Locations") return "Anywhere"
  return region.split(",")[0].replace(" & Bukit Mertajam", " & BM")
}

/** e.g. "4 pallet bays in Shah Alam" */
export function describeResults(filters: SearchFilters, count: number) {
  const noun = CATEGORY_NOUNS[filters.category]
  const where =
    filters.region === "All Locations"
      ? "across Malaysia"
      : `in ${shortRegion(filters.region)}`
  return `${count} ${count === 1 ? noun.one : noun.many} ${where}`
}

/* -------------------------------------------------------------------------- */
/*                       Natural-language query parsing                       */
/* -------------------------------------------------------------------------- */

export interface ParsedQuery {
  patch: Partial<SearchFilters>
  /** Short chips describing what was understood. */
  understood: string[]
  /** Leftover words used as a free-text match. */
  residual: string
}

const REGION_RULES: [RegExp, string][] = [
  [/\b(george ?town|gtown)\b/i, "George Town, Penang"],
  [/\b(bayan lepas|bayan|ftz)\b/i, "Bayan Lepas, Penang"],
  [
    /\b(butterworth|bukit mertajam|bm|seberang( perai)?|prai|perai)\b/i,
    "Butterworth & Bukit Mertajam",
  ],
  [
    /\b(kuala lumpur|kl|petaling jaya|pj|klang valley)\b/i,
    "Kuala Lumpur & PJ",
  ],
  [/\b(shah alam|selangor)\b/i, "Shah Alam, Selangor"],
  [/\b(johor bahru|johor|jb)\b/i, "Johor Bahru, Johor"],
]

const CATEGORY_RULES: [RegExp, SpaceCategory][] = [
  [/\b(warehouse|pallet bays?|fulfil+ment|sme bay)\b/i, "warehouse"],
  [/\b(shop ?lots?|shops?|micro-?hubs?|backroom|retail)\b/i, "shoplot"],
  [
    /\b(spare rooms?|rooms?|home|household|personal|moving house)\b/i,
    "residential",
  ],
]

const AMENITY_RULES: [RegExp, (typeof AMENITY_FILTERS)[number]][] = [
  [
    /\b(climate[- ]?controlled|climate|air[- ]?con(ditioned)?|temperature|humidity)\b/i,
    "Climate-Controlled",
  ],
  [/\b(24\/7|24-7|anytime|any time|late night)\b/i, "24/7 Smart Access"],
  [/\b(loading bay|loading|lorry|truck|dock)\b/i, "Loading Bay"],
  [/\b(ground floor|no stairs)\b/i, "Ground Floor"],
  [/\b(pallet jack|forklift)\b/i, "Pallet Jack On-Site"],
  [/\b(lalamove|grab|courier)\b/i, "Lalamove Friendly"],
  [/\b(cctv|secure|security)\b/i, "24/7 CCTV"],
  [/\b(racks?|racking|shel(f|ves|ving))\b/i, "Rack Shelving Included"],
]

const SORT_RULES: [RegExp, SortOption, string][] = [
  [/\b(cheap(est)?|affordable|lowest price|budget)\b/i, "price-asc", "Cheapest first"],
  [/\b(biggest|largest|most space)\b/i, "sqft-desc", "Largest first"],
  [/\b(best|top[- ]rated|highest rated)\b/i, "rating", "Top rated first"],
]

const unitSqFt = (id: string, fallback: number) =>
  ESTIMATOR_ITEMS.find((item) => item.id === id)?.sqFtPerUnit ?? fallback

const ITEM_RULES: { re: RegExp; sqft: number; noun: string }[] = [
  { re: /(\d+)\s*(pallets?)\b/i, sqft: unitSqFt("pallets", 22), noun: "pallets" },
  {
    re: /(\d+)\s*(boxes|box|cartons?)\b/i,
    sqft: unitSqFt("boxes", 3),
    noun: "boxes",
  },
  { re: /(\d+)\s*(totes?|bins?)\b/i, sqft: unitSqFt("totes", 5), noun: "totes" },
  {
    re: /(\d+)\s*(furniture|sofas?|beds?|fridges?|appliances?|wardrobes?)\b/i,
    sqft: unitSqFt("furniture", 25),
    noun: "large items",
  },
]

const STOPWORDS = new Set(
  "a an the in at near around for my our of with need needs want looking i we to store storing storage space spaces some about approx and or rm sq ft per day daily please can could book booking rent get find show me just only that which is are something place somewhere".split(
    " "
  )
)

const roundUp = (n: number, step = 10) => Math.ceil(n / step) * step

export function parseStorageQuery(input: string): ParsedQuery {
  let rest = ` ${input} `
  const patch: Partial<SearchFilters> = {}
  const understood: string[] = []

  // Budget: "under RM40", "max 30", "rm25/day"
  const budget =
    rest.match(
      /\b(?:under|below|max(?:imum)?|less than|up to|within|budget(?: of)?)\s*(?:rm\s*)?(\d+)(?:\s*(?:\/|per)\s*day)?/i
    ) ?? rest.match(/\brm\s*(\d+)(?:\s*(?:\/|per)\s*day)?/i)
  if (budget) {
    const value = Math.min(
      NO_BUDGET_LIMIT,
      Math.max(MIN_BUDGET, Number(budget[1]))
    )
    patch.maxBudget = value
    understood.push(`Up to RM ${value}/day`)
    rest = rest.replace(budget[0], " ")
  }

  // Size: explicit sq.ft or item counts
  const explicit = rest.match(
    /(\d[\d,]*)\s*(?:sq\.?\s*f(?:ee)?t|sqft|sf|square\s*f(?:ee|oo)t|ft2)\b/i
  )
  if (explicit) {
    patch.sqft = Number(explicit[1].replace(/,/g, ""))
    understood.push(`${patch.sqft} sq.ft`)
    rest = rest.replace(explicit[0], " ")
  } else {
    let total = 0
    const parts: string[] = []
    for (const rule of ITEM_RULES) {
      const m = rest.match(rule.re)
      if (m) {
        total += Number(m[1]) * rule.sqft
        parts.push(`${m[1]} ${rule.noun}`)
        rest = rest.replace(m[0], " ")
      }
    }
    if (total > 0) {
      patch.sqft = roundUp(total)
      understood.push(`${parts.join(" + ")} ≈ ${patch.sqft} sq.ft`)
    }
  }

  for (const [re, region] of REGION_RULES) {
    const m = rest.match(re)
    if (m) {
      patch.region = region
      understood.push(shortRegion(region))
      rest = rest.replace(m[0], " ")
      break
    }
  }

  for (const [re, category] of CATEGORY_RULES) {
    const m = rest.match(re)
    if (m) {
      patch.category = category
      understood.push(CATEGORY_NOUNS[category].one.replace(/^./, (c) => c.toUpperCase()))
      rest = rest.replace(m[0], " ")
      break
    }
  }

  const amenities: string[] = []
  for (const [re, amenity] of AMENITY_RULES) {
    const m = rest.match(re)
    if (m) {
      amenities.push(amenity)
      understood.push(amenity)
      rest = rest.replace(m[0], " ")
    }
  }
  if (amenities.length) patch.amenities = amenities

  const instant = rest.match(/\b(instant(ly)?|today|asap|urgent(ly)?|right now)\b/i)
  if (instant) {
    patch.instantBook = true
    understood.push("Instant book")
    rest = rest.replace(instant[0], " ")
  }

  for (const [re, sort, label] of SORT_RULES) {
    const m = rest.match(re)
    if (m) {
      patch.sortBy = sort
      understood.push(label)
      rest = rest.replace(m[0], " ")
      break
    }
  }

  const residual = rest
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w) && !/^\d+$/.test(w))
    .join(" ")

  return { patch, understood, residual }
}
