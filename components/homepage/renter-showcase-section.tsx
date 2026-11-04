"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Check,
  ChevronRight,
  MapPin,
  Maximize2,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  SPACE_CATEGORIES,
  STORAGE_SPACES,
  type SpaceCategory,
} from "@/lib/spaces-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const universalStorageRows = [
  ["Luggage", "Moving Boxes", "Furniture", "Baby Gear"],
  ["Pop-Up Booths", "SME Pallets", "Inventory", "Collectibles"],
  ["Retail Stock", "Packaging", "Archives", "Equipment"],
]

export function RenterShowcaseSection() {
  const [selectedCategory, setSelectedCategory] = React.useState<
    "all" | SpaceCategory
  >("all")

  const displayedSpaces = React.useMemo(() => {
    const filtered =
      selectedCategory === "all"
        ? STORAGE_SPACES
        : STORAGE_SPACES.filter((s) => s.category === selectedCategory)
    return filtered.slice(0, 6)
  }, [selectedCategory])

  return (
    <section
      id="properties"
      className="bg-background border-b border-zinc-200/80 py-16 sm:py-24 dark:border-white/10"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Part 1: "The way storage should've been done in the first place" 3-Card Bento */}
        <div className="mb-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mt-3 text-4xl leading-[1.08] font-semibold tracking-tight text-zinc-950 sm:text-5xl md:text-[54px] dark:text-white">
              The way storage{" "}
              <span className="font-[family-name:var(--font-editorial)] text-[1.08em] font-normal italic text-lime-600 dark:text-primary">
                should&apos;ve
              </span>
              <br />
              been done in the first place
            </h2>
          </div>

          {/* 3 Tall Complementary-Palette Visual Cards Grid (Palette 5: Soft Lime, Ocean & Peach) */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* CARD 1: Soft Lime to Deep Forest — "Days, never leases." */}
            <Link
              href="/explore"
              className="group relative flex h-[450px] flex-col justify-between overflow-hidden rounded-[28px] shadow-md ring-1 ring-inset ring-black/6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:ring-white/10"
              style={{
                background:
                  "radial-gradient(circle at 20% 16%, #d9f99d 0%, transparent 52%), linear-gradient(165deg, #bef264 0%, #65a30d 52%, #1a2e05 100%)",
              }}
            >
              {/* Top Visual Area */}
              <div className="relative h-[285px] w-full">
                {/* Single Clean Accent Badge on Left */}
                <div className="absolute top-12 left-6 z-10 flex size-10 items-center justify-center rounded-full bg-zinc-950 text-lime-400 shadow-lg ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-110">
                  <Sparkles className="size-4" />
                </div>

                {/* Elevated Dark Pricing Card */}
                <div className="absolute top-7 right-5 w-[78%] rounded-2xl bg-zinc-900/95 p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/12 backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1">
                  <p className="text-xs font-medium text-zinc-400">
                    Pay-Per-Day Pass
                  </p>

                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold tracking-tight text-white">
                      RM 12
                    </span>
                    <span className="text-xs text-zinc-400">/ day</span>
                  </div>

                  {/* Clean 3-Point Value List */}
                  <div className="mt-4 space-y-2 border-t border-white/10 pt-3.5 text-xs text-zinc-200">
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-lime-400" />
                      <span>Zero lease lock-in</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-lime-400" />
                      <span>RM 0 security deposit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-lime-400" />
                      <span>Unused days refunded</span>
                    </div>
                  </div>

                  {/* Single Clean CTA Pill */}
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 py-1 pr-3.5 pl-1 text-[11px] font-semibold text-white ring-1 ring-white/15">
                    <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full">
                      <ArrowRight className="size-3" />
                    </span>
                    <span>Book by the day</span>
                  </div>
                </div>
              </div>

              {/* Bottom Mission Copy */}
              <div className="relative z-10 px-7 pt-2 pb-7 text-white">
                <h3 className="text-2xl font-bold tracking-tight">
                  Days, never leases.
                </h3>
                <p className="mt-1.5 text-sm leading-snug text-lime-100/90">
                  Whether you&apos;re between apartments, renovating your home,
                  or staging campaign stock—only pay for the exact days you
                  need.
                </p>
              </div>
            </Link>

            {/* CARD 2: Deep Ocean Azure — "From 5 boxes to 50 pallets." */}
            <Link
              href="/explore?estimator=open"
              className="group relative flex h-[450px] flex-col justify-between overflow-hidden rounded-[28px] shadow-md ring-1 ring-inset ring-black/6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:ring-white/10"
              style={{
                background:
                  "radial-gradient(circle at 80% 20%, #38bdf8 0%, transparent 50%), linear-gradient(165deg, #082f49 0%, #0369a1 55%, #0c4a6e 100%)",
              }}
            >
              {/* Top Visual Area: 3 Rows of Soft Pills + Pure Center Squircle Icon */}
              <div className="relative flex h-[285px] w-full flex-col items-center justify-center gap-3 pt-4">
                {universalStorageRows.map((row, rowIdx) => (
                  <div
                    key={rowIdx}
                    className={cn(
                      "flex items-center gap-2.5 transition-transform duration-500",
                      rowIdx % 2 === 0
                        ? "-translate-x-3 group-hover:translate-x-1"
                        : "translate-x-3 group-hover:-translate-x-1"
                    )}
                  >
                    {row.map((label) => (
                      <span
                        key={label}
                        className="rounded-2xl bg-white/12 px-4 py-2 text-xs font-medium whitespace-nowrap text-white/90 ring-1 ring-white/15 backdrop-blur-md"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                ))}

                {/* Center Floating Tactile Storage Box with Overhanging Lid & Handle Cutout */}
                <div className="absolute top-1/2 left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center drop-shadow-[0_24px_40px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105">
                  {/* Overhanging Box Lid */}
                  <div className="relative z-10 flex h-5 w-27 items-center justify-center rounded-t-lg rounded-b-[4px] bg-gradient-to-b from-zinc-700 to-zinc-800 shadow-[0_4px_8px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/20">
                    {/* Center Lime Packing Tape Strip */}
                    <div className="h-full w-5 bg-gradient-to-b from-[#d9f99d] via-[#bef264] to-[#84cc16] shadow-xs" />
                  </div>

                  {/* Box Body */}
                  <div className="relative -mt-px flex h-18 w-24 flex-col items-center justify-between rounded-b-xl bg-gradient-to-b from-zinc-800 to-zinc-950 px-2.5 pt-3.5 pb-2 ring-1 ring-inset ring-white/12">
                    {/* Tape Overlap Tab under Lid */}
                    <div className=" bg-[#84cc16]/90 absolute top-0 left-1/2 h-1.5 w-5 -translate-x-1/2 rounded-b-xs" />

                    {/* Die-Cut Box Handle Cutout Hole */}
                    <div className="mt-1 h-4 w-11 rounded-full bg-[#040507] shadow-[inset_0_3px_6px_rgba(0,0,0,0.95)] ring-1 ring-lime-400/50" />

                    {/* Bottom Corner Box Markings (Up Arrows + Mini Shipping Tag) */}
                    <div className="flex w-full items-center justify-between opacity-70">
                      <svg
                        viewBox="0 0 16 12"
                        className="h-2.5 w-3.5 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 9V2M4 2L1.5 4.5M4 2L6.5 4.5" />
                        <path d="M12 9V2M12 2L9.5 4.5M12 2L14.5 4.5" />
                        <path d="M1 11H15" />
                      </svg>
                      <div className="flex items-center gap-0.5 rounded-[2px] bg-lime-400/20 px-1 py-0.5 ring-1 ring-lime-400/40">
                        <span className="h-1.5 w-2.5 rounded-[1px] bg-lime-400" />
                        <span className="h-1.5 w-1 rounded-[1px] bg-lime-400/60" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Mission Copy */}
              <div className="relative z-10 px-7 pt-2 pb-7 text-white">
                <h3 className="text-2xl font-bold tracking-tight">
                  From 5 boxes to 50 pallets.
                </h3>
                <p className="mt-1.5 text-sm leading-snug text-sky-100/85">
                  One platform connecting spare rooms for personal belongings
                  and warehouse bays for growing businesses.
                </p>
              </div>
            </Link>

            {/* CARD 3: Warm Sunset Peach & Coral — "Your storage, right next door." */}
            <Link
              href="/dashboard"
              className="group relative flex h-[450px] flex-col justify-between overflow-hidden rounded-[28px] shadow-md ring-1 ring-inset ring-black/6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:ring-white/10"
              style={{
                background:
                  "radial-gradient(circle at 20% 18%, #ffedd5 0%, transparent 50%), linear-gradient(155deg, #fdba74 0%, #fb923c 50%, #f43f5e 100%)",
              }}
            >
              {/* Top Visual Area: 3 Clean Iconic Fanned Cards */}
              <div className="relative flex h-[285px] w-full items-center justify-center pt-6">
                {/* Back-Left Tilted Card: Simple 1-Tap Pickup Icon Card */}
                <div className="absolute top-12 left-8 z-10 flex h-40 w-32 -rotate-12 flex-col justify-between rounded-2xl bg-zinc-950 p-3.5 text-white shadow-xl ring-1 ring-white/15 transition-transform duration-300 group-hover:-translate-x-2 group-hover:-rotate-15">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-amber-300">
                    <Truck className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-snug">
                      1-Tap Pickup
                    </p>
                    <p className="mt-0.5 text-[10px] text-zinc-400">
                      Van or lorry
                    </p>
                  </div>
                </div>

                {/* Middle Tilted Card: Clean QR Pass Card */}
                <div className="absolute top-8 left-23 z-20 flex h-42 w-34 -rotate-3 flex-col justify-between rounded-2xl bg-[#bef264] p-3.5 text-[#1a2e05] shadow-xl ring-1 ring-black/10 transition-transform duration-300 group-hover:-translate-y-1.5">
                  <p className="text-xs font-bold leading-snug">
                    24/7 Smart Entry
                  </p>
                  <div className="flex items-center justify-between rounded-xl bg-zinc-950 p-2.5 text-white">
                    <span className="font-mono text-xs font-bold text-lime-400">
                      482-910
                    </span>
                    <QrCode className="size-5 text-white" />
                  </div>
                </div>

                {/* Front-Right Featured Photo Card (Pure Image + Distance Badge) */}
                <div className="absolute top-11 right-7 z-30 h-42 w-38 rotate-6 overflow-hidden rounded-2xl bg-white p-1.5 shadow-2xl ring-1 ring-black/8 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:rotate-8">
                  <div className="relative size-full overflow-hidden rounded-xl bg-zinc-900">
                    <img
                      src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80"
                      alt="Neighborhood Hub"
                      className="size-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className="bg-primary text-primary-foreground absolute top-2 right-2 rounded-full px-2 py-0.5 text-[9px] font-bold shadow-xs">
                      5 mins away
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Mission Copy */}
              <div className="relative z-10 px-7 pt-2 pb-7 text-white">
                <h3 className="text-2xl font-bold tracking-tight">
                  Your storage, right next door.
                </h3>
                <p className="mt-1.5 text-sm leading-snug text-orange-50/90">
                  We turn idle neighborhood rooms and shoplots into verified
                  local hubs—drop off 24/7 or book a pickup in one tap.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Part 2: Featured Verified Storage Hubs Grid */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="block text-xs font-semibold tracking-wide text-lime-700 dark:text-lime-400">
              • Verified Micro-Hubs
            </span>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
              Explore instant-book spaces near you
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {SPACE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "border border-zinc-200/80 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-white/20"
                )}
              >
                {cat.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Spaces Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedSpaces.map((space) => (
            <div
              key={space.id}
              className="group flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs transition-all hover:border-zinc-300 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/70 dark:hover:border-white/20"
            >
              <div>
                <Link
                  href={`/spaces/${space.id}`}
                  className="relative block h-48 w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800"
                >
                  <img
                    src={space.images[0]}
                    alt={space.title}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-zinc-950/75 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-xs">
                    {space.categoryLabel}
                  </span>
                  {space.instantBook && (
                    <Badge className="bg-primary text-primary-foreground absolute top-2.5 right-2.5 rounded-full border-0 px-2.5 py-0.5 text-[10px] font-bold">
                      <Zap className="size-3" />
                      Instant Book
                    </Badge>
                  )}
                </Link>

                <div className="mt-3.5 px-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/spaces/${space.id}`}
                      className="line-clamp-1 text-sm font-bold text-zinc-950 hover:underline dark:text-white"
                    >
                      {space.title}
                    </Link>
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      {space.rating}
                    </span>
                  </div>

                  <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <MapPin className="size-3.5 text-lime-600 dark:text-lime-400" />
                    <span>{space.location}</span>
                  </p>

                  <div className="mt-3 flex items-center gap-3 border-y border-zinc-100 py-2.5 text-[11px] text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                    <span className="inline-flex items-center gap-1">
                      <Maximize2 className="size-3 text-zinc-400" />
                      {space.minSqFt}–{space.availableSqFt} sq.ft
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Truck className="size-3 text-zinc-400" />
                      {space.specs.loadingAccess.split(" ")[0]}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="size-3 text-zinc-400" />
                      24/7 Access
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 flex items-center justify-between px-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-bold text-zinc-950 dark:text-white">
                    RM {space.pricePerDay} / day
                  </span>
                  <span className="text-[11px] font-semibold text-lime-700 dark:text-lime-400">
                    (0 Lock-in)
                  </span>
                </div>

                <Button
                  size="sm"
                  asChild
                  className="h-8 rounded-full px-4 text-xs font-semibold"
                >
                  <Link href={`/spaces/${space.id}`}>Book Space</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA to Full Explore Map & Grid */}
        <div className="mt-10 flex justify-center">
          <Button
            size="lg"
            asChild
            className="h-11 gap-2 rounded-full px-8 text-xs font-bold"
          >
            <Link href="/explore">
              <span>Explore All Verified Hubs on Split Map</span>
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
