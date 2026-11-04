"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Box,
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Heart,
  Layers,
  Lock,
  MapPin,
  MessageSquare,
  Ruler,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Thermometer,
  Truck,
  Warehouse,
  Zap,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  STORAGE_SPACES,
  calculateDailyRateForSqFt,
  type StorageSpace,
} from "@/lib/spaces-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SpaceEstimatorContent } from "@/components/renter/space-estimator-modal"

const DURATION_PRESETS = [
  { days: 7, label: "7 Days", discount: 0 },
  { days: 14, label: "14 Days", discount: 0 },
  { days: 30, label: "30 Days", discount: 0.05, badge: "-5%" },
  { days: 90, label: "90 Days", discount: 0.12, badge: "-12%" },
]

export function SpaceDetail({ space }: { space: StorageSpace }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const querySqFt = Number(searchParams.get("sqft"))
  const initialSqFt =
    querySqFt && querySqFt >= space.minSqFt && querySqFt <= space.availableSqFt
      ? querySqFt
      : space.defaultSqFt

  const [activeImageIdx, setActiveImageIdx] = React.useState(0)
  const [saved, setSaved] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [allocatedSqFt, setAllocatedSqFt] = React.useState<number>(initialSqFt)
  const [durationDays, setDurationDays] = React.useState<number>(14)
  const [moveInDate, setMoveInDate] = React.useState<Date>(
    () => new Date(2026, 10, 5)
  )
  const [dateOpen, setDateOpen] = React.useState(false)
  const [showEstimator, setShowEstimator] = React.useState(false)
  const [hostMsgSent, setHostMsgSent] = React.useState(false)
  const [hostQuestion, setHostQuestion] = React.useState("")

  const dailyRate = calculateDailyRateForSqFt(space, allocatedSqFt)
  const discountRate =
    durationDays >= 90 ? 0.12 : durationDays >= 30 ? 0.05 : 0
  const grossSubtotal = dailyRate * durationDays
  const discountAmount = Math.round(grossSubtotal * discountRate)
  const totalMYR = grossSubtotal - discountAmount

  const moveOutDate = React.useMemo(() => {
    const d = new Date(moveInDate)
    d.setDate(d.getDate() + durationDays)
    return d
  }, [moveInDate, durationDays])

  const approxPallets = Math.max(1, Math.floor(allocatedSqFt / 22))
  const approxBoxes = Math.max(8, Math.floor(allocatedSqFt / 3))

  const handleProceedToCheckout = () => {
    const isoStart = moveInDate.toISOString().split("T")[0]
    router.push(
      `/checkout?spaceId=${space.id}&sqft=${allocatedSqFt}&days=${durationDays}&startDate=${isoStart}`
    )
  }

  const otherSpaces = STORAGE_SPACES.filter((s) => s.id !== space.id).slice(
    0,
    3
  )

  return (
    <div className="bg-background flex-1 pb-20">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="border-b border-zinc-200/80 bg-white/60 backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 font-semibold text-zinc-800 transition-colors hover:text-lime-700 dark:text-zinc-200 dark:hover:text-lime-400"
            >
              <ArrowLeft className="size-3.5" />
              <span>Explore Spaces</span>
            </Link>
            <ChevronRight className="size-3.5 opacity-50" />
            <Link
              href={`/explore?location=${encodeURIComponent(space.region)}`}
              className="hidden hover:underline sm:inline"
            >
              {space.region}
            </Link>
            <ChevronRight className="hidden size-3.5 opacity-50 sm:inline" />
            <span className="max-w-[200px] truncate text-zinc-900 font-medium sm:max-w-xs dark:text-white">
              {space.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="h-8 rounded-full px-3 text-xs"
            >
              <Share2 className="size-3.5" />
              <span>{copied ? "Link Copied" : "Share"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSaved((s) => !s)}
              className="h-8 rounded-full px-3 text-xs"
            >
              <Heart
                className={cn(
                  "size-3.5",
                  saved && "fill-rose-500 text-rose-500"
                )}
              />
              <span>{saved ? "Saved" : "Save"}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Bento Image Gallery */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          {/* Primary Active Photo */}
          <div className="relative h-72 overflow-hidden rounded-3xl bg-zinc-100 sm:h-96 md:col-span-8 dark:bg-zinc-900">
            <img
              src={space.images[activeImageIdx] || space.images[0]}
              alt={space.title}
              className="size-full object-cover"
            />
            <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2">
              <Badge className="bg-primary text-primary-foreground rounded-full border-0 px-3 py-1 text-xs font-bold shadow-sm">
                <Zap className="size-3" />
                Instant Book
              </Badge>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                <ShieldCheck className="size-3.5 text-lime-400" />
                Verified Packrat Hub
              </span>
            </div>
            <div className="absolute right-3.5 bottom-3.5 rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white backdrop-blur-xs">
              Photo {activeImageIdx + 1} of {space.images.length}
            </div>
          </div>

          {/* Side Thumbnail Stack */}
          <div className="grid grid-cols-4 gap-2.5 md:col-span-4 md:grid-cols-2">
            {space.images.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={cn(
                  "relative h-20 overflow-hidden rounded-2xl bg-zinc-100 transition-all md:h-[186px] dark:bg-zinc-900",
                  activeImageIdx === idx
                    ? "ring-primary ring-2 ring-offset-2 dark:ring-offset-zinc-950"
                    : "opacity-80 hover:opacity-100"
                )}
              >
                <img
                  src={imgUrl}
                  alt={`${space.title} view ${idx + 1}`}
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Main Two-Column Content + Sticky Booking Calculator */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: Details, Specs, Space Estimator, Host & Reviews */}
          <div className="flex flex-col gap-8 lg:col-span-7">
            {/* Title & Location Header */}
            <div className="border-b border-zinc-200/80 pb-6 dark:border-zinc-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-lime-500/15 px-3 py-1 text-xs font-bold text-lime-800 dark:text-lime-300">
                  {space.categoryLabel}
                </span>
                <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
                  0 Days Lease Lock-In
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  {space.rating} ({space.reviewCount} verified reviews)
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
                {space.title}
              </h1>
              <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                {space.subtitle}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1.5 font-medium text-zinc-800 dark:text-zinc-200">
                  <MapPin className="size-4 text-lime-600 dark:text-lime-400" />
                  {space.address}
                </span>
              </div>
            </div>

            {/* Technical Storage Specs Grid */}
            <div>
              <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                Technical Hub Specifications
              </h2>
              <div className="mt-3.5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <Ruler className="size-4 text-lime-600 dark:text-lime-400" />
                  <p className="mt-2 text-[11px] text-zinc-400">
                    Clearance Height
                  </p>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">
                    {space.specs.ceilingHeight}
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200/80 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <Layers className="size-4 text-lime-600 dark:text-lime-400" />
                  <p className="mt-2 text-[11px] text-zinc-400">
                    Floor & Dock Level
                  </p>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">
                    {space.specs.floorLevel}
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200/80 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <Truck className="size-4 text-lime-600 dark:text-lime-400" />
                  <p className="mt-2 text-[11px] text-zinc-400">
                    Loading Bay Access
                  </p>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">
                    {space.specs.loadingAccess}
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200/80 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <Clock className="size-4 text-lime-600 dark:text-lime-400" />
                  <p className="mt-2 text-[11px] text-zinc-400">
                    Renter Access Hours
                  </p>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">
                    {space.specs.accessHours}
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200/80 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <Thermometer className="size-4 text-lime-600 dark:text-lime-400" />
                  <p className="mt-2 text-[11px] text-zinc-400">
                    Environment Control
                  </p>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">
                    {space.specs.climateControl}
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200/80 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <Lock className="size-4 text-lime-600 dark:text-lime-400" />
                  <p className="mt-2 text-[11px] text-zinc-400">
                    Security & CCTV
                  </p>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">
                    {space.specs.security}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Inline Space Estimator Callout */}
            <div className="rounded-3xl border border-lime-500/35 bg-lime-50/40 p-5 dark:border-lime-500/25 dark:bg-lime-950/15">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-2xl shadow-xs">
                    <Box className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                      Not sure how much sq.ft to book at this hub?
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Count your boxes, Shopee/TikTok totes, or pallets to
                      auto-calculate your footprint.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant={showEstimator ? "secondary" : "default"}
                  size="sm"
                  onClick={() => setShowEstimator((prev) => !prev)}
                  className="rounded-full px-4 text-xs font-semibold"
                >
                  {showEstimator ? "Hide Estimator" : "Open Space Estimator"}
                </Button>
              </div>

              {showEstimator && (
                <div className="mt-5 border-t border-lime-500/20 pt-5">
                  <SpaceEstimatorContent
                    ctaLabel="Sync to Booking Calculator"
                    onApply={(sqFt) => {
                      const clamped = Math.min(
                        space.availableSqFt,
                        Math.max(space.minSqFt, sqFt)
                      )
                      setAllocatedSqFt(clamped)
                      setShowEstimator(false)
                    }}
                  />
                </div>
              )}
            </div>

            {/* About Space & Access Protocol */}
            <div className="space-y-4 border-b border-zinc-200/80 pb-6 dark:border-zinc-800">
              <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                About This Storage Space
              </h2>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                {space.description}
              </p>

              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white">
                  <Sparkles className="size-3.5 text-lime-600 dark:text-lime-400" />
                  <span>Digital Move-In & Access Protocol</span>
                </p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {space.accessInstructions}
                </p>
              </div>
            </div>

            {/* Amenities & Lalamove Vehicle Compatibility */}
            <div className="grid grid-cols-1 gap-6 border-b border-zinc-200/80 pb-6 sm:grid-cols-2 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  Included Hub Amenities
                </h3>
                <ul className="mt-3 space-y-2">
                  {space.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-lime-600 dark:text-lime-400" />
                      <span>{amenity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  Lalamove & Lorry Compatibility
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Direct loading access verified for these vehicle types:
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {space.compatibleVehicles.map((v) => (
                    <span
                      key={v}
                      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white px-3 py-1 text-xs font-medium text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                    >
                      <Truck className="size-3 text-lime-600 dark:text-lime-400" />
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Verified Space Host Card */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3.5">
                  <img
                    src={space.host.avatar}
                    alt={space.host.name}
                    className="size-13 rounded-full object-cover ring-2 ring-lime-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                        Hosted by {space.host.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="rounded-full text-[10px]"
                      >
                        {space.host.role}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {space.host.completedBookings} completed bookings • Avg.
                      response {space.host.responseTime} • Hosting since{" "}
                      {space.host.joinedYear}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Question to Host */}
              <div className="mt-4 flex flex-col gap-2 border-t border-zinc-100 pt-4 sm:flex-row dark:border-zinc-800">
                <input
                  type="text"
                  value={hostQuestion}
                  onChange={(e) => setHostQuestion(e.target.value)}
                  placeholder="Ask host about forklift hours, racking height, or container unloading..."
                  className="h-9 flex-1 rounded-full border border-zinc-200 bg-zinc-50 px-4 text-xs outline-none focus:border-lime-500 dark:border-zinc-800 dark:bg-zinc-950"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!hostQuestion.trim()) return
                    setHostMsgSent(true)
                    setHostQuestion("")
                  }}
                  className="h-9 rounded-full px-4 text-xs font-semibold"
                >
                  <MessageSquare className="size-3.5" />
                  <span>{hostMsgSent ? "Message Sent!" : "Ask Host"}</span>
                </Button>
              </div>
            </div>

            {/* Verified Renter Reviews */}
            {space.reviews.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                  What Renters & SMEs Stored Here
                </h2>
                <div className="mt-3.5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {space.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-zinc-900 dark:text-white">
                            <Star className="size-3.5 fill-amber-400 text-amber-400" />
                            {rev.rating}.0
                          </span>
                          <span className="rounded-full bg-lime-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-lime-800 dark:text-lime-300">
                            {rev.sqFtBooked} sq.ft • {rev.durationDays} days
                          </span>
                        </div>
                        <p className="mt-2.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                      </div>
                      <div className="mt-3 border-t border-zinc-100 pt-2.5 dark:border-zinc-800">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white">
                          {rev.author}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {rev.role} • {rev.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Interactive Daily Rate & Space Calculator */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:border-zinc-800 dark:bg-zinc-900">
              {/* Top Price Banner */}
              <div className="flex items-baseline justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                      RM {dailyRate}
                    </span>
                    <span className="text-xs text-zinc-500">/ day</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-zinc-400">
                    For {allocatedSqFt} sq.ft allocated • RM{" "}
                    {space.pricePerSqFtPerDay.toFixed(2)}/sq.ft/day
                  </p>
                </div>

                <Badge className="bg-primary text-primary-foreground rounded-full border-0 px-3 py-1 text-xs font-bold">
                  0 Lock-in
                </Badge>
              </div>

              {/* 1. Space Footprint Allocation Slider */}
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-900 dark:text-white">
                    1. Select Space Footprint
                  </label>
                  <span className="font-mono text-sm font-bold text-lime-700 dark:text-lime-400">
                    {allocatedSqFt} sq.ft
                  </span>
                </div>

                <Slider
                  value={[allocatedSqFt]}
                  min={space.minSqFt}
                  max={space.availableSqFt}
                  step={10}
                  onValueChange={(val) =>
                    setAllocatedSqFt(val[0] ?? space.defaultSqFt)
                  }
                  className="my-3.5"
                />

                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Min: {space.minSqFt} sq.ft</span>
                  <span>Available: {space.availableSqFt} sq.ft</span>
                </div>

                {/* Live Capacity Equivalence Pill */}
                <div className="mt-2.5 flex items-center justify-between rounded-2xl bg-zinc-50 px-3.5 py-2 text-[11px] text-zinc-600 dark:bg-zinc-950 dark:text-zinc-300">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Warehouse className="size-3.5 text-lime-600 dark:text-lime-400" />
                    Fits ~{approxPallets} standard pallets
                  </span>
                  <span>or ~{approxBoxes} cartons</span>
                </div>
              </div>

              {/* 2. Move-In Date & Flexible Duration */}
              <div className="mt-5">
                <label className="text-xs font-bold text-zinc-900 dark:text-white">
                  2. Move-In Date & Duration (Days)
                </label>

                <div className="mt-2 grid grid-cols-2 gap-2.5">
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex flex-col items-start rounded-2xl border border-zinc-200/90 bg-zinc-50/60 p-2.5 text-left transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950"
                      >
                        <span className="text-[10px] font-medium text-zinc-400 uppercase">
                          Move-In Date
                        </span>
                        <span className="mt-0.5 flex w-full items-center justify-between text-xs font-bold text-zinc-900 dark:text-white">
                          <span>
                            {moveInDate.toLocaleDateString("en-MY", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <CalendarIcon className="size-3.5 text-lime-600 dark:text-lime-400" />
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-auto rounded-3xl p-2"
                    >
                      <Calendar
                        selected={moveInDate}
                        onSelect={(d) => {
                          setMoveInDate(d)
                          setDateOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>

                  <div className="flex flex-col items-start rounded-2xl border border-zinc-200/90 bg-zinc-50/60 p-2.5 dark:border-zinc-800 dark:bg-zinc-950">
                    <span className="text-[10px] font-medium text-zinc-400 uppercase">
                      Est. Check-Out
                    </span>
                    <span className="mt-0.5 text-xs font-bold text-zinc-900 dark:text-white">
                      {moveOutDate.toLocaleDateString("en-MY", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Quick Duration Pills */}
                <div className="mt-3 grid grid-cols-4 gap-1.5">
                  {DURATION_PRESETS.map((preset) => {
                    const isSelected = durationDays === preset.days
                    return (
                      <button
                        key={preset.days}
                        type="button"
                        onClick={() => setDurationDays(preset.days)}
                        className={cn(
                          "relative flex flex-col items-center justify-center rounded-xl border py-2 text-xs font-semibold transition-all",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                            : "border-zinc-200/80 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                        )}
                      >
                        <span>{preset.label}</span>
                        {preset.badge && (
                          <span
                            className={cn(
                              "text-[9px] font-bold",
                              isSelected
                                ? "text-primary-foreground/90"
                                : "text-lime-600 dark:text-lime-400"
                            )}
                          >
                            {preset.badge}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Custom Days Slider */}
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-[11px] font-medium whitespace-nowrap text-zinc-500">
                    Custom days:
                  </span>
                  <Slider
                    value={[durationDays]}
                    min={1}
                    max={120}
                    step={1}
                    onValueChange={(val) => setDurationDays(val[0] ?? 14)}
                    className="flex-1"
                  />
                  <span className="w-16 text-right font-mono text-xs font-bold text-zinc-900 dark:text-white">
                    {durationDays} {durationDays === 1 ? "day" : "days"}
                  </span>
                </div>
              </div>

              {/* 3. Transparent Price Breakdown */}
              <div className="mt-5 space-y-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 text-xs dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>
                    RM {dailyRate}/day × {durationDays}{" "}
                    {durationDays === 1 ? "day" : "days"} ({allocatedSqFt}{" "}
                    sq.ft)
                  </span>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-white">
                    RM {grossSubtotal.toLocaleString()}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-lime-700 dark:text-lime-400">
                    <span>
                      Multi-day flexible discount (
                      {Math.round(discountRate * 100)}% off)
                    </span>
                    <span className="font-mono font-bold">
                      -RM {discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Packrat Shield (Up to RM 50k Coverage)</span>
                  <span className="font-semibold text-lime-700 dark:text-lime-400">
                    Included
                  </span>
                </div>

                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Security Deposit & Lease Lock-In</span>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-white">
                    RM 0
                  </span>
                </div>

                <div className="flex items-baseline justify-between border-t border-zinc-200/80 pt-2.5 dark:border-zinc-800">
                  <div>
                    <span className="text-sm font-bold text-zinc-950 dark:text-white">
                      Total (MYR)
                    </span>
                    <p className="text-[10px] text-zinc-400">
                      Extend or move out early anytime with RM 0 penalty
                    </p>
                  </div>
                  <span className="font-mono text-xl font-bold text-zinc-950 dark:text-white">
                    RM {totalMYR.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Primary CTA Button */}
              <Button
                type="button"
                onClick={handleProceedToCheckout}
                className="mt-5 h-11 w-full gap-2 rounded-full text-sm font-bold shadow-sm"
              >
                <span>Continue to Book Space</span>
                <ChevronRight className="size-4" />
              </Button>

              <div className="mt-3.5 flex items-center justify-center gap-4 text-[11px] text-zinc-500 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1">
                  <Check className="size-3.5 text-lime-600 dark:text-lime-400" />
                  Instant Smart PIN
                </span>
                <span className="inline-flex items-center gap-1">
                  <Check className="size-3.5 text-lime-600 dark:text-lime-400" />
                  Lalamove Pickup Option
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Storage Hubs Section */}
        <div className="mt-16 border-t border-zinc-200/80 pt-12 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                Other Verified Hubs Nearby
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Compare alternative square footage and daily rates
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-full text-xs"
            >
              <Link href="/explore">View All Hubs</Link>
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {otherSpaces.map((other) => (
              <Link
                key={other.id}
                href={`/spaces/${other.id}`}
                className="group rounded-3xl border border-zinc-200/80 bg-white p-3 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative h-40 overflow-hidden rounded-2xl bg-zinc-100">
                  <img
                    src={other.images[0]}
                    alt={other.title}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="bg-primary text-primary-foreground absolute top-2.5 right-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                    RM {other.pricePerDay}/day
                  </span>
                </div>
                <div className="mt-3 px-1">
                  <h3 className="truncate text-sm font-bold text-zinc-950 dark:text-white">
                    {other.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {other.location} • {other.availableSqFt} sq.ft open
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

