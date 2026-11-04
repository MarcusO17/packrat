"use client"

import * as React from "react"
import Link from "next/link"
import {
  Box,
  ChevronRight,
  KeyRound,
  MapPin,
  Maximize2,
  ShieldCheck,
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

const renterJourneySteps = [
  {
    step: "01",
    title: "Estimate Your Sq.Ft",
    description:
      "Count your cartons, Shopee/TikTok totes, or standard pallets to get an exact floor footprint recommendation.",
    icon: Box,
    href: "/explore?estimator=open",
    cta: "Try Space Estimator",
  },
  {
    step: "02",
    title: "Book for Days, Not Leases",
    description:
      "Pick a verified spare room, shoplot backroom, or warehouse pallet bay across Penang, KL & JB with 0 lock-in.",
    icon: Maximize2,
    href: "/explore",
    cta: "Browse Hubs",
  },
  {
    step: "03",
    title: "Self Drop-Off or Lalamove",
    description:
      "Drive straight up to the loading bay or dispatch a partner Lalamove van/lorry during checkout.",
    icon: Truck,
    href: "/checkout?spaceId=bayan-lepas-ftz-sme-bay",
    cta: "Preview Checkout",
  },
  {
    step: "04",
    title: "24/7 Smart PIN & Scaling",
    description:
      "Unlock gates with your digital QR pass, scale sq.ft up or down anytime, or move out early with RM 0 penalty.",
    icon: KeyRound,
    href: "/dashboard",
    cta: "View Renter Dashboard",
  },
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
      className="bg-background border-b border-zinc-200/80 py-16 sm:py-24 dark:border-zinc-800"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Part 1: 4-Step Renter Journey Ribbon */}
        <div className="mb-18">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="block text-xs font-semibold tracking-wide text-lime-700 dark:text-lime-400">
                • Seamless Renter Journey
              </span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
                From overflow to stored in under 3 minutes
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-9 rounded-full px-4 text-xs font-semibold"
            >
              <Link href="/dashboard">
                <span>Preview Active Renter Dashboard</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {renterJourneySteps.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.step}
                  href={item.href}
                  className="group flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-5 transition-all hover:border-lime-500/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="bg-primary/20 text-lime-800 dark:text-lime-300 flex size-10 items-center justify-center rounded-2xl">
                        <Icon className="size-5" />
                      </span>
                      <span className="font-mono text-xs font-bold text-zinc-400">
                        STEP {item.step}
                      </span>
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-zinc-950 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {item.description}
                    </p>
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-lime-700 group-hover:underline dark:text-lime-400">
                    <span>{item.cta}</span>
                    <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              )
            })}
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
                    : "border border-zinc-200/80 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
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
              className="group flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/70"
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

                  <div className="mt-3 flex items-center gap-3 border-y border-zinc-100 py-2.5 text-[11px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
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

