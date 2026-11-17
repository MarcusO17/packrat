"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ChevronRight,
  Filter,
  Heart,
  List,
  Map as MapIcon,
  MapPin,
  RotateCcw,
  Star,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  REGIONS,
  REGION_VIEWPORTS,
  STORAGE_SPACES,
  type SpaceCategory,
  type StorageSpace,
} from "@/lib/spaces-data"
import {
  CATEGORY_NOUNS,
  DEFAULT_FILTERS,
  NO_BUDGET_LIMIT,
  SORT_OPTIONS,
  describeResults,
  filterSpaces,
  isDefaultFilters,
  priceForSize,
  shortRegion,
  type SearchFilters,
} from "@/lib/search-filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SpaceEstimatorSheet } from "@/components/renter/space-estimator-modal"
import { CoordMap } from "@/components/renter/coord-map"
import { FiltersSheet, SmartSearch } from "@/components/renter/smart-search"

export function ExploreSpaces() {
  const searchParams = useSearchParams()

  const [filters, setFilters] = React.useState<SearchFilters>(() => {
    const location = searchParams.get("location") || ""
    return {
      ...DEFAULT_FILTERS,
      region: REGIONS.includes(location as (typeof REGIONS)[number])
        ? location
        : DEFAULT_FILTERS.region,
      category:
        (searchParams.get("category") as "all" | SpaceCategory) || "all",
      sqft: Number(searchParams.get("sqft")) || 0,
    }
  })
  const requiredSqFt = filters.sqft

  const [savedIds, setSavedIds] = React.useState<string[]>([
    "bayan-lepas-ftz-sme-bay",
  ])
  const [activeSpaceId, setActiveSpaceId] = React.useState<string>(
    STORAGE_SPACES[0].id
  )
  const [estimatorOpen, setEstimatorOpen] = React.useState<boolean>(
    searchParams.get("estimator") === "open"
  )
  const [mobileView, setMobileView] = React.useState<"list" | "map">("list")
  const [inViewSpaceIds, setInViewSpaceIds] = React.useState<
    Record<string, boolean>
  >({})
  const spaceCardRefs = React.useRef<Record<string, HTMLDivElement | null>>({})

  // Map camera state driven by region selection or active listing selection
  const [mapCenter, setMapCenter] = React.useState<{
    lat: number
    lng: number
    zoom: number
  }>(
    () =>
      REGION_VIEWPORTS[filters.region] || REGION_VIEWPORTS["All Locations"]
  )

  const replaceFilters = (next: SearchFilters) => {
    if (next.region !== filters.region) {
      setMapCenter(
        REGION_VIEWPORTS[next.region] || REGION_VIEWPORTS["All Locations"]
      )
    }
    setFilters(next)
  }

  const updateFilters = (patch: Partial<SearchFilters>) =>
    replaceFilters({ ...filters, ...patch })

  const resetFilters = () => replaceFilters(DEFAULT_FILTERS)

  const toggleSaved = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const filteredSpaces = React.useMemo(() => filterSpaces(filters), [filters])

  const activeSpace: StorageSpace =
    filteredSpaces.find((s) => s.id === activeSpaceId) ||
    filteredSpaces[0] ||
    STORAGE_SPACES[0]

  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)")
    let observer: IntersectionObserver | null = null

    const setup = () => {
      observer?.disconnect()
      if (!mql.matches || mobileView === "map") {
        setInViewSpaceIds({})
        return
      }

      observer = new IntersectionObserver(
        (entries) => {
          setInViewSpaceIds((prev) => {
            const next = { ...prev }
            entries.forEach((entry) => {
              const id = entry.target.getAttribute("data-space-card-id")
              if (id) next[id] = entry.isIntersecting
            })
            return next
          })
        },
        { threshold: 0.55, rootMargin: "-12% 0px -15% 0px" }
      )

      Object.values(spaceCardRefs.current).forEach((el) => {
        if (el) observer?.observe(el)
      })
    }

    setup()
    mql.addEventListener("change", setup)

    return () => {
      mql.removeEventListener("change", setup)
      observer?.disconnect()
    }
  }, [filteredSpaces, mobileView])

  const selectAndFocusSpace = (space: StorageSpace) => {
    setActiveSpaceId(space.id)
    setMapCenter((prev) => ({
      lat: space.mapCoords.lat,
      lng: space.mapCoords.lng,
      zoom: Math.max(prev.zoom, 13),
    }))
  }

  const mapMarkers = React.useMemo(
    () =>
      filteredSpaces.map((space) => ({
        id: space.id,
        lat: space.mapCoords.lat,
        lng: space.mapCoords.lng,
        priceLabel: `RM ${priceForSize(space, requiredSqFt)}/d`,
        title: space.title,
        subtitle: space.location,
        image: space.images[0],
      })),
    [filteredSpaces, requiredSqFt]
  )

  // Removable chips that explain exactly what is being shown
  const activeChips: { key: string; label: string; clear: () => void }[] = [
    filters.query && {
      key: "query",
      label: `“${filters.query}”`,
      clear: () => updateFilters({ query: "" }),
    },
    filters.region !== "All Locations" && {
      key: "region",
      label: shortRegion(filters.region),
      clear: () => updateFilters({ region: "All Locations" }),
    },
    filters.category !== "all" && {
      key: "category",
      label: CATEGORY_NOUNS[filters.category].many.replace(/^./, (c) =>
        c.toUpperCase()
      ),
      clear: () => updateFilters({ category: "all" }),
    },
    filters.sqft > 0 && {
      key: "sqft",
      label: `Fits ${filters.sqft} sq.ft`,
      clear: () => updateFilters({ sqft: 0 }),
    },
    filters.maxBudget < NO_BUDGET_LIMIT && {
      key: "budget",
      label: `≤ RM ${filters.maxBudget}/day`,
      clear: () => updateFilters({ maxBudget: NO_BUDGET_LIMIT }),
    },
    filters.instantBook && {
      key: "instant",
      label: "Instant book",
      clear: () => updateFilters({ instantBook: false }),
    },
    ...filters.amenities.map((amenity) => ({
      key: `amenity-${amenity}`,
      label: amenity,
      clear: () =>
        updateFilters({
          amenities: filters.amenities.filter((a) => a !== amenity),
        }),
    })),
    filters.sortBy !== "recommended" && {
      key: "sort",
      label: SORT_OPTIONS.find((o) => o.id === filters.sortBy)?.label ?? "",
      clear: () => updateFilters({ sortBy: "recommended" }),
    },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[]

  return (
    <div className="bg-background relative flex flex-1 flex-col pb-16 lg:pb-0">
      {/* Top Sticky Smart Search Bar */}
      <div className="bg-background/90 sticky top-16 z-30 border-b border-zinc-200/70 backdrop-blur-md sm:top-18 dark:border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5 sm:px-6">
          <SmartSearch
            filters={filters}
            onChange={updateFilters}
            onReplace={replaceFilters}
            resultCount={filteredSpaces.length}
            onOpenEstimator={() => setEstimatorOpen(true)}
          />
          <FiltersSheet
            filters={filters}
            onChange={updateFilters}
            resultCount={filteredSpaces.length}
          />
          <SpaceEstimatorSheet
            open={estimatorOpen}
            onOpenChange={setEstimatorOpen}
            trigger={null}
            onApply={(sqft, suggestedCat) =>
              updateFilters({
                sqft,
                ...(suggestedCat && suggestedCat !== "all"
                  ? { category: suggestedCat }
                  : {}),
              })
            }
          />
        </div>
      </div>

      {/* Main Content Area: Split View (Listings + Map) */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left / Main Listings Column */}
            <div
              className={cn(
                "flex flex-col gap-5 lg:col-span-7",
                mobileView === "map" && "hidden lg:flex"
              )}
            >
              {/* Results summary */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
                      {describeResults(filters, filteredSpaces.length)}
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {requiredSqFt > 0
                        ? `Daily rates shown for ${requiredSqFt} sq.ft`
                        : "Pay-per-day rates in MYR"}{" "}
                      • No lease lock-in
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMobileView("map")}
                    className="h-8 shrink-0 gap-1.5 rounded-full px-3 text-xs font-semibold lg:hidden"
                  >
                    <MapIcon className="size-3.5" />
                    <span>Map</span>
                  </Button>
                </div>

                {activeChips.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {activeChips.map((chip) => (
                      <span
                        key={chip.key}
                        className="inline-flex items-center gap-1 rounded-full bg-zinc-100 py-1 pr-1 pl-2.5 text-[11px] font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                      >
                        {chip.label}
                        <button
                          type="button"
                          onClick={chip.clear}
                          className="rounded-full p-0.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                          aria-label={`Remove ${chip.label}`}
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                    {!isDefaultFilters(filters) && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center gap-1 px-1.5 text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      >
                        <RotateCcw className="size-3" />
                        Clear all
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Empty State */}
              {filteredSpaces.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div className="bg-primary/15 text-lime-700 dark:text-lime-400 flex size-12 items-center justify-center rounded-2xl">
                    <Filter className="size-6" />
                  </div>
                  <h2 className="mt-4 text-base font-bold text-zinc-950 dark:text-white">
                    Nothing matches that yet
                  </h2>
                  <p className="mt-1 max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
                    Try removing a filter above, or describe what you need differently.
                  </p>
                  <Button
                    onClick={resetFilters}
                    className="mt-5 rounded-full px-5 text-xs font-semibold"
                  >
                    Start over
                  </Button>
                </div>
              ) : (
                /* Cards Grid */
                <div
                  className={cn(
                    "grid grid-cols-1 gap-5 sm:grid-cols-2"
                  )}
                >
                  {filteredSpaces.map((space) => {
                    const isSelected = activeSpace.id === space.id
                    const isSaved = savedIds.includes(space.id)
                    const isInView = Boolean(inViewSpaceIds[space.id])
                    const targetSqFt =
                      requiredSqFt > 0
                        ? Math.max(space.minSqFt, requiredSqFt)
                        : space.defaultSqFt
                    const displayDailyPrice = priceForSize(space, requiredSqFt)

                    return (
                      <div
                        key={space.id}
                        data-space-card-id={space.id}
                        ref={(el) => {
                          spaceCardRefs.current[space.id] = el
                        }}
                        onClick={() => selectAndFocusSpace(space)}
                        className={cn(
                          "group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border bg-white p-3 transition-all duration-300 dark:bg-zinc-900",
                          isSelected
                            ? "border-primary ring-primary/30 shadow-[0_14px_40px_rgba(61,52,139,0.2)] ring-2"
                            : isInView
                              ? "-translate-y-0.5 border-zinc-300 shadow-md dark:border-zinc-700"
                              : "border-zinc-200/80 shadow-2xs hover:border-zinc-300 hover:shadow-md dark:border-zinc-800"
                        )}
                      >
                        <div>
                          {/* Image Container */}
                          <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                            <img
                              src={space.images[0]}
                              alt={space.title}
                              className={cn(
                                "size-full object-cover transition-transform duration-500 group-hover:scale-105",
                                isInView && "scale-105"
                              )}
                            />

                            {/* Top Left Category Pill */}
                            <span className="absolute top-2.5 left-2.5 rounded-full bg-zinc-950/75 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-xs">
                              {space.categoryLabel}
                            </span>

                            {/* Top Right Save Button */}
                            <button
                              type="button"
                              onClick={(e) => toggleSaved(space.id, e)}
                              aria-label="Save space"
                              className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-xs backdrop-blur-xs transition-transform hover:scale-105 dark:bg-zinc-900/90 dark:text-zinc-200"
                            >
                              <Heart
                                className={cn(
                                  "size-3.5",
                                  isSaved &&
                                    "fill-rose-500 text-rose-500"
                                )}
                              />
                            </button>
                          </div>

                          {/* Card Body */}
                          <div className="mt-3 px-1">
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/spaces/${space.id}${requiredSqFt > 0 ? `?sqft=${targetSqFt}` : ""}`}
                                className="line-clamp-1 text-sm font-bold text-zinc-950 hover:underline dark:text-white"
                              >
                                {space.title}
                              </Link>
                              <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                {space.rating}
                              </span>
                            </div>

                            <p className="mt-1 flex items-center gap-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
                              <MapPin className="size-3.5 shrink-0 text-lime-600 dark:text-lime-400" />
                              <span className="truncate">{space.location}</span>
                            </p>

                            <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
                              {space.minSqFt}–{space.availableSqFt} sq.ft
                              {space.palletCapacity
                                ? ` • ${space.palletCapacity} pallets`
                                : ""}
                            </p>
                          </div>
                        </div>

                        {/* Price & CTA Footer */}
                        <div className="mt-4 flex items-center justify-between px-1 pt-1">
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-base font-bold text-zinc-950 dark:text-white">
                                RM {displayDailyPrice}
                              </span>
                              <span className="text-xs text-zinc-500">
                                / day
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400">
                              {targetSqFt} sq.ft
                              {space.instantBook ? " • Instant Book" : ""}
                            </p>
                          </div>

                          <Button
                            size="sm"
                            asChild
                            className="h-8 gap-1 rounded-full px-3.5 text-xs font-semibold"
                          >
                            <Link
                              href={`/spaces/${space.id}${requiredSqFt > 0 ? `?sqft=${targetSqFt}` : ""}`}
                            >
                              <span>Book Space</span>
                              <ChevronRight className="size-3.5" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          {/* Right / Sticky Coordinate-Accurate Map Column */}
            <div
              className={cn(
                "lg:col-span-5",
                mobileView === "list" ? "hidden lg:block" : "block"
              )}
            >
              <div className="h-[calc(100dvh-9.5rem)] min-h-[440px] w-full overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-100 shadow-sm lg:sticky lg:top-42 lg:h-[calc(100vh-12rem)] dark:border-zinc-800 dark:bg-zinc-900">
                <CoordMap
                  centerLat={mapCenter.lat}
                  centerLng={mapCenter.lng}
                  zoom={mapCenter.zoom}
                  markers={mapMarkers}
                  activeMarkerId={activeSpace?.id}
                  onSelectMarker={(id) => {
                    const found = STORAGE_SPACES.find((s) => s.id === id)
                    if (found) selectAndFocusSpace(found)
                  }}
                >
                  {/* Top Map Corridor Switcher Overlay */}
                  <div
                    data-map-interactive="true"
                    className="absolute inset-x-2.5 top-2.5 z-30 flex items-center justify-between gap-2 sm:inset-x-3 sm:top-3"
                  >
                    <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-zinc-200/80 bg-white/95 p-1 shadow-sm backdrop-blur-md [-ms-overflow-style:none] [scrollbar-width:none] dark:border-zinc-800 dark:bg-zinc-900/95 [&::-webkit-scrollbar]:hidden">
                      {[
                        {
                          label: "Penang",
                          vp: { lat: 5.388, lng: 100.355, zoom: 12 },
                        },
                        {
                          label: "KL & PJ",
                          vp: { lat: 3.1129, lng: 101.6398, zoom: 13 },
                        },
                        {
                          label: "Shah Alam",
                          vp: { lat: 3.0548, lng: 101.5492, zoom: 13 },
                        },
                        {
                          label: "Johor Bahru",
                          vp: { lat: 1.5521, lng: 103.7815, zoom: 13 },
                        },
                      ].map((corridor) => (
                        <button
                          key={corridor.label}
                          type="button"
                          onClick={() => setMapCenter(corridor.vp)}
                          className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-zinc-700 transition-colors hover:bg-lime-500/20 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                        >
                          {corridor.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Active Hub Floating Preview Card */}
                  {activeSpace && (
                    <div
                      data-map-interactive="true"
                      className="absolute inset-x-2.5 bottom-14 z-30 sm:inset-x-3 lg:bottom-8"
                    >
                      <div className="flex items-center gap-3 rounded-3xl border border-zinc-200/90 bg-white/95 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-md sm:p-3.5 dark:border-zinc-800 dark:bg-zinc-900/95">
                        <img
                          src={activeSpace.images[0]}
                          alt={activeSpace.title}
                          className="size-18 shrink-0 rounded-2xl object-cover sm:h-24 sm:w-28"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <Badge className="bg-primary text-primary-foreground rounded-full border-0 px-2 py-0 text-[10px] font-bold">
                              {activeSpace.categoryLabel}
                            </Badge>
                          </div>
                          <h3 className="mt-1 truncate text-xs font-bold text-zinc-950 sm:text-sm dark:text-white">
                            {activeSpace.title}
                          </h3>
                          <p className="truncate text-[11px] text-zinc-500 sm:text-xs dark:text-zinc-400">
                            {activeSpace.address}
                          </p>
                          <div className="mt-1.5 flex items-center justify-between gap-2 sm:mt-2">
                            <div className="flex items-baseline gap-1">
                              <span className="text-xs font-bold text-zinc-950 sm:text-sm dark:text-white">
                                RM {activeSpace.pricePerDay}/d
                              </span>
                              <span className="hidden text-[11px] font-medium text-lime-700 sm:inline dark:text-lime-400">
                                • {activeSpace.availableSqFt} sq.ft open
                              </span>
                            </div>
                            <Button
                              size="sm"
                              asChild
                              className="h-7 rounded-full px-3 text-[11px] font-semibold"
                            >
                              <Link href={`/spaces/${activeSpace.id}`}>
                                Inspect Hub
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CoordMap>
              </div>
            </div>
        </div>
      </div>

      {/* Floating Mobile Map / List Toggle Pill */}
      <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 lg:hidden">
        <Button
          type="button"
          onClick={() =>
            setMobileView((prev) => (prev === "list" ? "map" : "list"))
          }
          className="h-10 gap-2 rounded-full px-5 text-xs font-semibold shadow-[0_12px_32px_rgba(0,0,0,0.28)] transition-transform active:scale-95"
        >
          {mobileView === "list" ? (
            <>
              <MapIcon className="size-4" />
              <span>Map ({filteredSpaces.length})</span>
            </>
          ) : (
            <>
              <List className="size-4" />
              <span>List ({filteredSpaces.length})</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
