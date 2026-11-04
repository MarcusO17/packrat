"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  Box,
  Check,
  ChevronRight,
  Columns2,
  Filter,
  Heart,
  LayoutGrid,
  Map as MapIcon,
  MapPin,
  Maximize2,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
  Warehouse,
  X,
  Zap,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  AMENITY_FILTERS,
  REGIONS,
  SPACE_CATEGORIES,
  STORAGE_SPACES,
  calculateDailyRateForSqFt,
  type SpaceCategory,
  type StorageSpace,
} from "@/lib/spaces-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SpaceEstimatorSheet } from "@/components/renter/space-estimator-modal"

export function ExploreSpaces() {
  const searchParams = useSearchParams()

  const initialRegion = searchParams.get("location") || "All Locations"
  const initialCategory =
    (searchParams.get("category") as "all" | SpaceCategory) || "all"
  const initialSqFt = Number(searchParams.get("sqft")) || 0
  const initialEstimatorOpen = searchParams.get("estimator") === "open"

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedRegion, setSelectedRegion] = React.useState<string>(
    REGIONS.includes(initialRegion as (typeof REGIONS)[number])
      ? initialRegion
      : "All Locations"
  )
  const [selectedCategory, setSelectedCategory] = React.useState<
    "all" | SpaceCategory
  >(initialCategory)
  const [requiredSqFt, setRequiredSqFt] = React.useState<number>(initialSqFt)
  const [maxDailyBudget, setMaxDailyBudget] = React.useState<number>(80)
  const [instantBookOnly, setInstantBookOnly] = React.useState<boolean>(false)
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>([])
  const [sortBy, setSortBy] = React.useState<
    "recommended" | "price-asc" | "sqft-desc" | "rating"
  >("recommended")
  const [viewMode, setViewMode] = React.useState<"split" | "grid" | "map">(
    "split"
  )
  const [savedIds, setSavedIds] = React.useState<string[]>([
    "bayan-lepas-ftz-sme-bay",
  ])
  const [activeSpaceId, setActiveSpaceId] = React.useState<string>(
    STORAGE_SPACES[0].id
  )
  const [estimatorOpen, setEstimatorOpen] =
    React.useState<boolean>(initialEstimatorOpen)

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    )
  }

  const toggleSaved = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedRegion("All Locations")
    setSelectedCategory("all")
    setRequiredSqFt(0)
    setMaxDailyBudget(80)
    setInstantBookOnly(false)
    setSelectedAmenities([])
    setSortBy("recommended")
  }

  const filteredSpaces = React.useMemo(() => {
    return STORAGE_SPACES.filter((space) => {
      if (
        selectedRegion !== "All Locations" &&
        space.region !== selectedRegion
      ) {
        return false
      }
      if (selectedCategory !== "all" && space.category !== selectedCategory) {
        return false
      }
      if (requiredSqFt > 0 && space.availableSqFt < requiredSqFt) {
        return false
      }
      const effectiveDailyPrice =
        requiredSqFt > 0
          ? calculateDailyRateForSqFt(
              space,
              Math.max(space.minSqFt, requiredSqFt)
            )
          : space.pricePerDay
      if (effectiveDailyPrice > maxDailyBudget) {
        return false
      }
      if (instantBookOnly && !space.instantBook) {
        return false
      }
      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every((am) =>
          space.amenities.includes(am)
        )
        if (!hasAll) return false
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase()
        const matchTitle = space.title.toLowerCase().includes(q)
        const matchLoc = space.location.toLowerCase().includes(q)
        const matchSub = space.subtitle.toLowerCase().includes(q)
        const matchIdeal = space.idealFor.some((tag) =>
          tag.toLowerCase().includes(q)
        )
        if (!matchTitle && !matchLoc && !matchSub && !matchIdeal) return false
      }
      return true
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.pricePerDay - b.pricePerDay
      if (sortBy === "sqft-desc") return b.availableSqFt - a.availableSqFt
      if (sortBy === "rating") return b.rating - a.rating
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    })
  }, [
    selectedRegion,
    selectedCategory,
    requiredSqFt,
    maxDailyBudget,
    instantBookOnly,
    selectedAmenities,
    searchQuery,
    sortBy,
  ])

  const activeSpace: StorageSpace =
    filteredSpaces.find((s) => s.id === activeSpaceId) ||
    filteredSpaces[0] ||
    STORAGE_SPACES[0]

  const activeFilterCount =
    (selectedRegion !== "All Locations" ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0) +
    (requiredSqFt > 0 ? 1 : 0) +
    (maxDailyBudget < 80 ? 1 : 0) +
    (instantBookOnly ? 1 : 0) +
    selectedAmenities.length

  return (
    <div className="bg-background flex flex-1 flex-col">
      {/* Top Sticky Filter & Search Control Bar */}
      <div className="bg-background/95 sticky top-18 z-30 border-b border-zinc-200/80 backdrop-blur-md dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Primary Row: Search Input, Region, Space Estimator Trigger & View Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search & Region Group */}
            <div className="flex flex-1 flex-wrap items-center gap-2.5">
              <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Penang, PJ, pallet bay, shoplot..."
                  className="h-9 rounded-full border-zinc-200/90 bg-white pr-8 pl-9 text-xs shadow-2xs dark:border-zinc-800 dark:bg-zinc-900"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                    aria-label="Clear search"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Region Select */}
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger
                  size="sm"
                  className="h-9 rounded-full border-zinc-200/90 bg-white px-3.5 text-xs font-semibold shadow-2xs dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <MapPin className="size-3.5 text-lime-600 dark:text-lime-400" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {REGIONS.map((region) => (
                    <SelectItem
                      key={region}
                      value={region}
                      className="text-xs font-medium"
                    >
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sq.Ft Filter Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold transition-colors",
                      requiredSqFt > 0
                        ? "border-lime-500/50 bg-lime-50/80 text-lime-900 dark:border-lime-500/40 dark:bg-lime-950/30 dark:text-lime-300"
                        : "border-zinc-200/90 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                    )}
                  >
                    <Maximize2 className="size-3.5 text-lime-600 dark:text-lime-400" />
                    <span>
                      {requiredSqFt > 0
                        ? `Min ${requiredSqFt} sq.ft`
                        : "Space Size (sq.ft)"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-72 rounded-3xl border-zinc-200/80 p-4 shadow-xl dark:border-zinc-800"
                >
                  <div className="flex flex-col gap-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                        Minimum Space Needed
                      </span>
                      <span className="font-mono text-xs font-bold text-lime-700 dark:text-lime-400">
                        {requiredSqFt === 0
                          ? "Any size"
                          : `${requiredSqFt} sq.ft`}
                      </span>
                    </div>
                    <Slider
                      value={[requiredSqFt]}
                      min={0}
                      max={1500}
                      step={50}
                      onValueChange={(val) => setRequiredSqFt(val[0] ?? 0)}
                    />
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>Any</span>
                      <span>300 sq.ft</span>
                      <span>800 sq.ft</span>
                      <span>1,500+ sq.ft</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Daily Rate Filter Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold transition-colors",
                      maxDailyBudget < 80
                        ? "border-lime-500/50 bg-lime-50/80 text-lime-900 dark:border-lime-500/40 dark:bg-lime-950/30 dark:text-lime-300"
                        : "border-zinc-200/90 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                    )}
                  >
                    <SlidersHorizontal className="size-3.5 text-lime-600 dark:text-lime-400" />
                    <span>
                      {maxDailyBudget < 80
                        ? `Up to RM ${maxDailyBudget}/day`
                        : "Daily Budget"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-72 rounded-3xl border-zinc-200/80 p-4 shadow-xl dark:border-zinc-800"
                >
                  <div className="flex flex-col gap-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                        Max Daily Rate
                      </span>
                      <span className="font-mono text-xs font-bold text-lime-700 dark:text-lime-400">
                        RM {maxDailyBudget} / day
                      </span>
                    </div>
                    <Slider
                      value={[maxDailyBudget]}
                      min={12}
                      max={80}
                      step={2}
                      onValueChange={(val) => setMaxDailyBudget(val[0] ?? 80)}
                    />
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>RM 12/day</span>
                      <span>RM 40/day</span>
                      <span>RM 80+/day</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Box & Pallet Space Estimator Sheet Trigger */}
              <SpaceEstimatorSheet
                open={estimatorOpen}
                onOpenChange={setEstimatorOpen}
                onApply={(sqFt, suggestedCat) => {
                  setRequiredSqFt(sqFt)
                  if (suggestedCat && suggestedCat !== "all") {
                    setSelectedCategory(suggestedCat)
                  }
                }}
              />
            </div>

            {/* Right Controls: Sort + View Mode Switcher */}
            <div className="flex items-center gap-2">
              <Select
                value={sortBy}
                onValueChange={(val) =>
                  setSortBy(
                    val as
                      | "recommended"
                      | "price-asc"
                      | "sqft-desc"
                      | "rating"
                  )
                }
              >
                <SelectTrigger
                  size="sm"
                  className="hidden h-9 rounded-full border-zinc-200/90 bg-white px-3 text-xs font-medium lg:flex dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="recommended" className="text-xs">
                    Sort: Recommended
                  </SelectItem>
                  <SelectItem value="price-asc" className="text-xs">
                    Daily Rate: Low to High
                  </SelectItem>
                  <SelectItem value="sqft-desc" className="text-xs">
                    Available Sq.Ft: High to Low
                  </SelectItem>
                  <SelectItem value="rating" className="text-xs">
                    Highest Rated Hubs
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Pill Switcher */}
              <div className="inline-flex items-center rounded-full border border-zinc-200/80 bg-zinc-100/80 p-0.5 dark:border-zinc-800 dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={() => setViewMode("split")}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-all",
                    viewMode === "split"
                      ? "bg-white text-zinc-950 shadow-2xs dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                  )}
                  title="Split View (Listings + Map)"
                >
                  <Columns2 className="size-3.5" />
                  <span className="hidden sm:inline">Split</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-all",
                    viewMode === "grid"
                      ? "bg-white text-zinc-950 shadow-2xs dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                  )}
                  title="Grid View"
                >
                  <LayoutGrid className="size-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("map")}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-all",
                    viewMode === "map"
                      ? "bg-white text-zinc-950 shadow-2xs dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                  )}
                  title="Full Map View"
                >
                  <MapIcon className="size-3.5" />
                  <span className="hidden sm:inline">Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Row: Category Tabs + Amenity Filter Pills */}
          <div className="mt-3 flex items-center justify-between gap-3 overflow-x-auto pb-1 no-scrollbar">
            {/* Category Switcher */}
            <div className="flex shrink-0 items-center gap-1.5">
              {SPACE_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-950 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                    )}
                  >
                    {cat.shortLabel}
                  </button>
                )
              })}
            </div>

            <div className="h-4 w-px shrink-0 bg-zinc-200 dark:bg-zinc-800" />

            {/* Instant Book + Amenity Quick Pills */}
            <div className="flex flex-1 items-center gap-1.5">
              <button
                type="button"
                onClick={() => setInstantBookOnly((prev) => !prev)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition-colors",
                  instantBookOnly
                    ? "border-lime-600 bg-lime-500/15 text-lime-800 dark:border-lime-400 dark:text-lime-300"
                    : "border-zinc-200/80 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                )}
              >
                <Zap className="size-3 text-lime-600 dark:text-lime-400" />
                <span>Instant Book</span>
              </button>

              {AMENITY_FILTERS.slice(0, 5).map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity)
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition-colors",
                      isSelected
                        ? "border-lime-600 bg-lime-500/15 text-lime-800 dark:border-lime-400 dark:text-lime-300"
                        : "border-zinc-200/80 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                    )}
                  >
                    {isSelected && <Check className="size-3" />}
                    <span>{amenity}</span>
                  </button>
                )
              })}

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset ({activeFilterCount})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Split View / Grid View / Map View */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div
          className={cn(
            "grid w-full gap-6",
            viewMode === "split"
              ? "grid-cols-1 lg:grid-cols-12"
              : "grid-cols-1"
          )}
        >
          {/* Left / Main Listings Column */}
          {viewMode !== "map" && (
            <div
              className={cn(
                "flex flex-col gap-5",
                viewMode === "split" ? "lg:col-span-7" : "w-full"
              )}
            >
              {/* Results Count & Active Estimator Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
                    {filteredSpaces.length} verified storage{" "}
                    {filteredSpaces.length === 1 ? "hub" : "hubs"} available
                  </h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Pay-per-day rates in MYR • Zero lease lock-in • Up to RM
                    50,000 inventory protection
                  </p>
                </div>

                {requiredSqFt > 0 && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-lime-500/40 bg-lime-50/70 px-3 py-1 text-xs font-semibold text-lime-900 dark:border-lime-500/30 dark:bg-lime-950/30 dark:text-lime-300">
                    <Sparkles className="size-3.5 text-lime-600 dark:text-lime-400" />
                    <span>Showing rates for {requiredSqFt} sq.ft</span>
                    <button
                      type="button"
                      onClick={() => setRequiredSqFt(0)}
                      className="ml-1 rounded-full p-0.5 hover:bg-lime-200/60 dark:hover:bg-lime-900"
                      aria-label="Clear sq.ft filter"
                    >
                      <X className="size-3" />
                    </button>
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
                    No storage hubs match those exact filters
                  </h2>
                  <p className="mt-1 max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
                    Try adjusting your square footage requirement, daily budget,
                    or switching to &ldquo;All Locations&rdquo;.
                  </p>
                  <Button
                    onClick={resetFilters}
                    className="mt-5 rounded-full px-5 text-xs font-semibold"
                  >
                    Reset All Filters
                  </Button>
                </div>
              ) : (
                /* Cards Grid */
                <div
                  className={cn(
                    "grid gap-5",
                    viewMode === "split"
                      ? "grid-cols-1 sm:grid-cols-2"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  )}
                >
                  {filteredSpaces.map((space) => {
                    const isSelected = activeSpace.id === space.id
                    const isSaved = savedIds.includes(space.id)
                    const targetSqFt =
                      requiredSqFt > 0
                        ? Math.max(space.minSqFt, requiredSqFt)
                        : space.defaultSqFt
                    const displayDailyPrice =
                      requiredSqFt > 0
                        ? calculateDailyRateForSqFt(space, targetSqFt)
                        : space.pricePerDay

                    return (
                      <div
                        key={space.id}
                        onMouseEnter={() => setActiveSpaceId(space.id)}
                        onClick={() => setActiveSpaceId(space.id)}
                        className={cn(
                          "group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-white p-3 transition-all duration-200 dark:bg-zinc-900",
                          isSelected
                            ? "border-primary ring-primary/30 shadow-[0_14px_40px_rgba(132,204,22,0.12)] ring-2"
                            : "border-zinc-200/80 shadow-2xs hover:border-zinc-300 hover:shadow-md dark:border-zinc-800"
                        )}
                      >
                        <div>
                          {/* Image Container */}
                          <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                            <img
                              src={space.images[0]}
                              alt={space.title}
                              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* Top Left Category Pill */}
                            <span className="absolute top-2.5 left-2.5 rounded-full bg-zinc-950/75 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-xs">
                              {space.categoryLabel}
                            </span>

                            {/* Top Right Save Button + Instant Book */}
                            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                              {space.instantBook && (
                                <Badge className="bg-primary text-primary-foreground rounded-full border-0 px-2.5 py-0.5 text-[10px] font-bold shadow-xs">
                                  Instant Book
                                </Badge>
                              )}
                              <button
                                type="button"
                                onClick={(e) => toggleSaved(space.id, e)}
                                aria-label="Save space"
                                className="flex size-7 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-xs backdrop-blur-xs transition-transform hover:scale-105 dark:bg-zinc-900/90 dark:text-zinc-200"
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

                            {/* Bottom Sq.Ft Availability Bar */}
                            <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between rounded-xl bg-black/60 px-2.5 py-1.5 text-[10px] font-medium text-white backdrop-blur-xs">
                              <span className="inline-flex items-center gap-1">
                                <Maximize2 className="size-3 text-lime-400" />
                                {space.minSqFt} – {space.availableSqFt} sq.ft
                                available
                              </span>
                              {space.palletCapacity && (
                                <span className="text-lime-300">
                                  Up to {space.palletCapacity} pallets
                                </span>
                              )}
                            </div>
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
                                <span className="text-[11px] font-normal text-zinc-400">
                                  ({space.reviewCount})
                                </span>
                              </span>
                            </div>

                            <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                              <MapPin className="size-3.5 shrink-0 text-lime-600 dark:text-lime-400" />
                              <span className="truncate">{space.location}</span>
                            </p>

                            {/* Key Specs Row */}
                            <div className="mt-2.5 flex flex-wrap items-center gap-2 border-y border-zinc-100 py-2 text-[11px] text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-400">
                              <span className="inline-flex items-center gap-1">
                                <Truck className="size-3 text-zinc-400" />
                                {space.specs.loadingAccess.split(" ")[0]}{" "}
                                {space.specs.loadingAccess.split(" ")[1]}
                              </span>
                              <span>•</span>
                              <span className="inline-flex items-center gap-1">
                                <ShieldCheck className="size-3 text-zinc-400" />
                                {space.specs.accessHours}
                              </span>
                            </div>

                            {/* Ideal For Tags */}
                            <div className="mt-2.5 flex flex-wrap gap-1">
                              {space.idealFor.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Price & CTA Footer */}
                        <div className="mt-3.5 flex items-center justify-between px-1 pt-1">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-base font-bold text-zinc-950 dark:text-white">
                                RM {displayDailyPrice}
                              </span>
                              <span className="text-xs text-zinc-500">
                                / day
                              </span>
                              <span className="text-[10px] font-semibold text-lime-700 dark:text-lime-400">
                                (0 Lock-in)
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400">
                              For {targetSqFt} sq.ft • RM{" "}
                              {space.pricePerSqFtPerDay.toFixed(2)}/sq.ft
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
          )}

          {/* Right / Sticky Interactive Map Column */}
          {viewMode !== "grid" && (
            <div
              className={cn(
                viewMode === "split"
                  ? "lg:col-span-5"
                  : "h-[680px] w-full"
              )}
            >
              <div className="sticky top-42 h-[580px] w-full overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-100 shadow-sm lg:h-[calc(100vh-12rem)] dark:border-zinc-800 dark:bg-zinc-900">
                {/* OpenStreetMap Base Layer */}
                <iframe
                  title="Packrat Malaysia Storage Hub Map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=100.25%2C5.30%2C100.46%2C5.46&layer=mapnik"
                  className="pointer-events-none absolute inset-0 size-full border-0 opacity-80 grayscale contrast-95 filter dark:invert dark:hue-rotate-180 dark:opacity-45"
                  loading="lazy"
                />

                {/* Top Map Overlay Header */}
                <div className="absolute inset-x-3 top-3 z-20 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/95 px-3 py-1.5 text-xs font-semibold text-zinc-900 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95 dark:text-white">
                    <span className="bg-primary size-2 rounded-full" />
                    <span>
                      {selectedRegion === "All Locations"
                        ? "Penang & Malaysia Hubs"
                        : selectedRegion}
                    </span>
                  </div>

                  <span className="rounded-full bg-zinc-950/80 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-xs">
                    Click a pin to preview
                  </span>
                </div>

                {/* Interactive Price Pins on Map */}
                {filteredSpaces.map((space) => {
                  const isSelected = activeSpace.id === space.id
                  const displayPrice =
                    requiredSqFt > 0
                      ? calculateDailyRateForSqFt(
                          space,
                          Math.max(space.minSqFt, requiredSqFt)
                        )
                      : space.pricePerDay

                  return (
                    <button
                      key={space.id}
                      type="button"
                      onClick={() => setActiveSpaceId(space.id)}
                      style={{
                        top: space.mapCoords.top,
                        left: space.mapCoords.left,
                      }}
                      className={cn(
                        "group absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-200",
                        isSelected ? "z-30 scale-110" : "hover:scale-105"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold shadow-md transition-colors",
                          isSelected
                            ? "border-zinc-950 bg-primary text-primary-foreground ring-4 ring-lime-400/40"
                            : "border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-950 hover:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                        )}
                      >
                        <Warehouse className="size-3" />
                        <span>RM {displayPrice}/d</span>
                      </div>
                      <span
                        className={cn(
                          "mx-auto block size-2 -translate-y-1 rotate-45",
                          isSelected
                            ? "bg-primary"
                            : "bg-white dark:bg-zinc-900"
                        )}
                      />
                    </button>
                  )
                })}

                {/* Bottom Active Hub Floating Preview Card */}
                {activeSpace && (
                  <div className="absolute inset-x-3 bottom-3 z-30">
                    <div className="flex flex-col gap-3 rounded-3xl border border-zinc-200/90 bg-white/95 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-md sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-900/95">
                      <img
                        src={activeSpace.images[0]}
                        alt={activeSpace.title}
                        className="h-24 w-full shrink-0 rounded-2xl object-cover sm:w-28"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <Badge className="bg-primary text-primary-foreground rounded-full border-0 px-2 py-0 text-[10px] font-bold">
                            {activeSpace.categoryLabel}
                          </Badge>
                          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                            {activeSpace.mapCoords.lat},{" "}
                            {activeSpace.mapCoords.lng}
                          </span>
                        </div>
                        <h3 className="mt-1 truncate text-sm font-bold text-zinc-950 dark:text-white">
                          {activeSpace.title}
                        </h3>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {activeSpace.address}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-zinc-950 dark:text-white">
                              RM {activeSpace.pricePerDay} / day
                            </span>
                            <span className="text-[11px] font-medium text-lime-700 dark:text-lime-400">
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
