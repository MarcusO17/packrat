"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Check,
  QrCode,
  Sparkles,
  Truck,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { type SpaceCategory } from "@/lib/spaces-data"

const universalStorageRows = [
  ["Luggage", "Moving Boxes", "Furniture", "Baby Gear"],
  ["Pop-Up Booths", "SME Pallets", "Inventory", "Collectibles"],
  ["Retail Stock", "Packaging", "Archives", "Equipment"],
]

interface RenterPersonaCard {
  id: string
  pillLabel: string
  cardTitle: string
  fitHint: string
  category: SpaceCategory
  href: string
  image: string
}

const RENTER_PERSONAS: RenterPersonaCard[] = [
  {
    id: "tiktok-shopee",
    pillLabel: "TikTok & Shopee sellers",
    cardTitle: "TikTok Shop &\nShopee sellers",
    fitHint: "50–350 sq.ft • Fast-pick racks",
    category: "shoplot",
    href: "/explore?category=shoplot",
    image:
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "growing-smes",
    pillLabel: "Growing SMEs",
    cardTitle: "Growing SMEs\n& distributors",
    fitHint: "200–1,500 sq.ft • Pallet bays",
    category: "warehouse",
    href: "/explore?category=warehouse",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "home-movers",
    pillLabel: "Home movers & renovators",
    cardTitle: "Home movers &\nrenovators",
    fitHint: "50–150 sq.ft • Ground-floor rooms",
    category: "residential",
    href: "/explore?category=residential",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "popup-brands",
    pillLabel: "Pop-up & bazaar brands",
    cardTitle: "Pop-up &\nbazaar brands",
    fitHint: "40–200 sq.ft • Booth & event gear",
    category: "shoplot",
    href: "/explore?category=shoplot",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "cafes-fnb",
    pillLabel: "Cafes & F&B outlets",
    cardTitle: "Cafes &\nF&B outlets",
    fitHint: "60–250 sq.ft • Dry cup & packaging",
    category: "shoplot",
    href: "/explore?category=shoplot",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "students",
    pillLabel: "University students",
    cardTitle: "Students on\nsemester break",
    fitHint: "25–60 sq.ft • Luggage & boxes",
    category: "residential",
    href: "/explore?category=residential",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "creators-studios",
    pillLabel: "Creators & live studios",
    cardTitle: "Creators &\nlive studios",
    fitHint: "50–200 sq.ft • Samples & lighting",
    category: "shoplot",
    href: "/explore?category=shoplot",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "campaign-overflow",
    pillLabel: "11.11 & Raya overflow",
    cardTitle: "11.11 & Raya\ncampaigns",
    fitHint: "300–2,500 sq.ft • Zero lock-in",
    category: "warehouse",
    href: "/explore?category=warehouse",
    image:
      "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=700&q=80",
  },
]

export function RenterShowcaseSection() {
  const [activeOptionId, setActiveOptionId] = React.useState<string | null>(
    null
  )
  const [inViewBento, setInViewBento] = React.useState<Record<string, boolean>>(
    {}
  )
  const [inViewPersonas, setInViewPersonas] = React.useState<
    Record<string, boolean>
  >({})

  const bentoRefs = React.useRef<Record<string, HTMLAnchorElement | null>>({})
  const cardRefs = React.useRef<Record<string, HTMLAnchorElement | null>>({})
  const stripContainerRef = React.useRef<HTMLDivElement | null>(null)
  const [stripInVerticalView, setStripInVerticalView] = React.useState(false)

  // Observe the 3 tall Bento cards to trigger hover animations on scroll (Phone / Mobile only)
  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)")
    let observer: IntersectionObserver | null = null

    const setup = () => {
      if (observer) {
        observer.disconnect()
        observer = null
      }
      if (!mql.matches) {
        setInViewBento({})
        return
      }

      observer = new IntersectionObserver(
        (entries) => {
          setInViewBento((prev) => {
            const next = { ...prev }
            entries.forEach((entry) => {
              const id = entry.target.getAttribute("data-bento-id")
              if (id) next[id] = entry.isIntersecting
            })
            return next
          })
        },
        {
          threshold: 0.45,
          rootMargin: "-10% 0px -12% 0px",
        }
      )

      Object.values(bentoRefs.current).forEach((el) => {
        if (el) observer?.observe(el)
      })
    }

    setup()
    mql.addEventListener("change", setup)

    return () => {
      mql.removeEventListener("change", setup)
      observer?.disconnect()
    }
  }, [])

  // Observe vertical visibility of the persona strip + horizontal scroll position of each persona card (Phone / Mobile only)
  React.useEffect(() => {
    const stripEl = stripContainerRef.current
    if (!stripEl) return

    const mql = window.matchMedia("(max-width: 767px)")
    let verticalObserver: IntersectionObserver | null = null
    let cardObserver: IntersectionObserver | null = null

    const setup = () => {
      verticalObserver?.disconnect()
      cardObserver?.disconnect()

      if (!mql.matches) {
        setStripInVerticalView(false)
        setInViewPersonas({})
        return
      }

      verticalObserver = new IntersectionObserver(
        ([entry]) => {
          setStripInVerticalView(Boolean(entry?.isIntersecting))
        },
        { threshold: 0.3, rootMargin: "-5% 0px -5% 0px" }
      )
      verticalObserver.observe(stripEl)

      cardObserver = new IntersectionObserver(
        (entries) => {
          setInViewPersonas((prev) => {
            const next = { ...prev }
            entries.forEach((entry) => {
              const id = entry.target.getAttribute("data-persona-id")
              if (id) {
                next[id] = entry.isIntersecting
              }
            })
            return next
          })

          // Sync the active pill highlight with whichever card is centered while swiping on mobile
          const mostVisible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
          const visibleId = mostVisible?.target.getAttribute("data-persona-id")
          if (visibleId) {
            setActiveOptionId(visibleId)
          }
        },
        {
          root: stripEl,
          threshold: [0.6, 0.85],
          rootMargin: "0px -18% 0px -18%",
        }
      )

      Object.values(cardRefs.current).forEach((el) => {
        if (el) cardObserver?.observe(el)
      })
    }

    setup()
    mql.addEventListener("change", setup)

    return () => {
      mql.removeEventListener("change", setup)
      verticalObserver?.disconnect()
      cardObserver?.disconnect()
    }
  }, [])

  const handleSelectOption = (optionId: string) => {
    setActiveOptionId((prev) => (prev === optionId ? null : optionId))
    const cardEl = cardRefs.current[optionId]
    const stripEl = stripContainerRef.current
    if (cardEl && stripEl) {
      const targetLeft =
        cardEl.offsetLeft -
        stripEl.clientWidth / 2 +
        cardEl.clientWidth / 2
      stripEl.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: "smooth",
      })
    }
  }

  const card1Active = Boolean(inViewBento["bento-1"])
  const card2Active = Boolean(inViewBento["bento-2"])
  const card3Active = Boolean(inViewBento["bento-3"])

  return (
    <section
      id="properties"
      className="bg-background border-b border-zinc-200/80 py-16 sm:py-24 dark:border-white/10"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Part 1: "The way storage should've been done in the first place" 3-Card Bento */}
        <div>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mt-2 text-3xl leading-[1.12] font-semibold tracking-tight text-zinc-950 sm:mt-3 sm:text-5xl sm:leading-[1.08] md:text-[54px] dark:text-white">
              The way storage{" "}
              <span className="font-[family-name:var(--font-editorial)] text-[1.08em] font-normal italic text-lime-600 dark:text-primary">
                should&apos;ve
              </span>{" "}
              <br className="hidden sm:inline" />
              been done in the first place
            </h2>
          </div>

          {/* 3 Tall Complementary-Palette Visual Cards Grid (Palette 5: Soft Lime, Ocean & Peach) */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-12 sm:gap-6 md:grid-cols-3">
            {/* CARD 1: Soft Lime to Deep Forest — "Days, never leases." */}
            <Link
              href="/explore"
              data-bento-id="bento-1"
              ref={(el) => {
                bentoRefs.current["bento-1"] = el
              }}
              className={cn(
                "group relative flex h-[420px] flex-col justify-between overflow-hidden rounded-[28px] ring-1 ring-inset ring-black/6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:h-[450px] dark:ring-white/10",
                card1Active ? "-translate-y-1 shadow-xl" : "shadow-md"
              )}
              style={{
                background:
                  "radial-gradient(circle at 20% 16%, #d9f99d 0%, transparent 52%), linear-gradient(165deg, #bef264 0%, #65a30d 52%, #1a2e05 100%)",
              }}
            >
              {/* Top Visual Area */}
              <div className="relative h-[265px] w-full sm:h-[285px]">
                {/* Single Clean Accent Badge on Left */}
                <div
                  className={cn(
                    "absolute top-10 left-4 z-10 flex size-10 items-center justify-center rounded-full bg-zinc-950 text-lime-400 shadow-lg ring-1 ring-white/15 transition-transform duration-500 group-hover:scale-110 sm:top-12 sm:left-6",
                    card1Active && "scale-110 rotate-6"
                  )}
                >
                  <Sparkles className="size-4" />
                </div>

                {/* Elevated Dark Pricing Card */}
                <div
                  className={cn(
                    "absolute top-6 right-4 w-[80%] rounded-2xl bg-zinc-900/95 p-4 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/12 backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1.5 sm:top-7 sm:right-5 sm:w-[78%] sm:p-5",
                    card1Active && "-translate-y-1.5"
                  )}
                >
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
                  <div className="mt-3.5 space-y-2 border-t border-white/10 pt-3 text-xs text-zinc-200 sm:mt-4 sm:pt-3.5">
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
                  <div className="mt-3.5 inline-flex items-center gap-2 rounded-full bg-white/10 py-1 pr-3.5 pl-1 text-[11px] font-semibold text-white ring-1 ring-white/15 sm:mt-4">
                    <span
                      className={cn(
                        "bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full transition-transform duration-500 group-hover:translate-x-0.5",
                        card1Active && "translate-x-0.5"
                      )}
                    >
                      <ArrowRight className="size-3" />
                    </span>
                    <span>Book by the day</span>
                  </div>
                </div>
              </div>

              {/* Bottom Mission Copy */}
              <div className="relative z-10 px-5 pt-2 pb-6 text-white sm:px-7 sm:pb-7">
                <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                  Days, never leases.
                </h3>
                <p className="mt-1.5 text-sm leading-snug text-lime-100/90">
                  Whether you&apos;re between apartments, renovating your home,
                  or staging campaign stock, only pay for the exact days you
                  need.
                </p>
              </div>
            </Link>

            {/* CARD 2: Deep Ocean Azure — "From 5 boxes to 50 pallets." */}
            <Link
              href="/explore?estimator=open"
              data-bento-id="bento-2"
              ref={(el) => {
                bentoRefs.current["bento-2"] = el
              }}
              className={cn(
                "group relative flex h-[420px] flex-col justify-between overflow-hidden rounded-[28px] ring-1 ring-inset ring-black/6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:h-[450px] dark:ring-white/10",
                card2Active ? "-translate-y-1 shadow-xl" : "shadow-md"
              )}
              style={{
                background:
                  "radial-gradient(circle at 80% 20%, #38bdf8 0%, transparent 50%), linear-gradient(165deg, #082f49 0%, #0369a1 55%, #0c4a6e 100%)",
              }}
            >
              {/* Top Visual Area: 3 Rows of Soft Pills + Pure Center Squircle Icon */}
              <div className="relative flex h-[265px] w-full flex-col items-center justify-center gap-3 pt-4 sm:h-[285px]">
                {universalStorageRows.map((row, rowIdx) => (
                  <div
                    key={rowIdx}
                    className={cn(
                      "flex items-center gap-2.5 transition-transform duration-700 ease-out",
                      rowIdx % 2 === 0
                        ? cn(
                            "group-hover:translate-x-2",
                            card2Active ? "translate-x-2" : "-translate-x-3"
                          )
                        : cn(
                            "group-hover:-translate-x-2",
                            card2Active ? "-translate-x-2" : "translate-x-3"
                          )
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
                <div
                  className={cn(
                    "absolute top-1/2 left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center drop-shadow-[0_24px_40px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-108",
                    card2Active && "scale-108 -translate-y-[53%]"
                  )}
                >
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
              <div className="relative z-10 px-5 pt-2 pb-6 text-white sm:px-7 sm:pb-7">
                <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
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
              data-bento-id="bento-3"
              ref={(el) => {
                bentoRefs.current["bento-3"] = el
              }}
              className={cn(
                "group relative flex h-[420px] flex-col justify-between overflow-hidden rounded-[28px] ring-1 ring-inset ring-black/6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:h-[450px] dark:ring-white/10",
                card3Active ? "-translate-y-1 shadow-xl" : "shadow-md"
              )}
              style={{
                background:
                  "radial-gradient(circle at 20% 18%, #ffedd5 0%, transparent 50%), linear-gradient(155deg, #fdba74 0%, #fb923c 50%, #f43f5e 100%)",
              }}
            >
              {/* Top Visual Area: 3 Clean Iconic Fanned Cards */}
              <div className="relative flex h-[265px] w-full items-center justify-center pt-6 sm:h-[285px]">
                {/* Back-Left Tilted Card: Simple 1-Tap Pickup Icon Card */}
                <div
                  className={cn(
                    "absolute top-11 left-4 z-10 flex h-38 w-30 flex-col justify-between rounded-2xl bg-zinc-950 p-3 text-white shadow-xl ring-1 ring-white/15 transition-transform duration-500 group-hover:-translate-x-2.5 group-hover:-rotate-15 sm:top-12 sm:left-8 sm:h-40 sm:w-32 sm:p-3.5",
                    card3Active
                      ? "-translate-x-2.5 -rotate-15"
                      : "-rotate-12"
                  )}
                >
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
                <div
                  className={cn(
                    "absolute top-7 left-1/2 z-20 flex h-40 w-33 -translate-x-1/2 -rotate-3 flex-col justify-between rounded-2xl bg-[#bef264] p-3 text-[#1a2e05] shadow-xl ring-1 ring-black/10 transition-transform duration-500 group-hover:-translate-y-2 sm:top-8 sm:h-42 sm:w-34 sm:p-3.5",
                    card3Active && "-translate-y-2"
                  )}
                >
                  <p className="text-xs font-bold leading-snug">
                    24/7 Smart Entry
                  </p>
                  <div className="flex items-center justify-between rounded-xl bg-zinc-950 p-2 text-white sm:p-2.5">
                    <span className="font-mono text-xs font-bold text-lime-400">
                      482-910
                    </span>
                    <QrCode className="size-5 text-white" />
                  </div>
                </div>

                {/* Front-Right Featured Photo Card (Pure Image + Distance Badge) */}
                <div
                  className={cn(
                    "absolute top-10 right-4 z-30 h-40 w-34 overflow-hidden rounded-2xl bg-white p-1.5 shadow-2xl ring-1 ring-black/8 transition-transform duration-500 group-hover:translate-x-2 group-hover:rotate-9 sm:top-11 sm:right-7 sm:h-42 sm:w-38",
                    card3Active ? "translate-x-2 rotate-9" : "rotate-6"
                  )}
                >
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
              <div className="relative z-10 px-5 pt-2 pb-6 text-white sm:px-7 sm:pb-7">
                <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                  Your storage, right next door.
                </h3>
                <p className="mt-1.5 text-sm leading-snug text-orange-50/90">
                  We turn idle neighborhood rooms and shoplots into verified
                  local hubs, drop off 24/7 or book a pickup in one tap.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Middle Section: Trust & Brand Social Proof Wall (in between Part 1 & Part 2) */}
        <div className="mx-auto my-14 flex max-w-4xl flex-col items-center border-y border-zinc-200/80 py-12 text-center sm:my-24 sm:py-20 dark:border-zinc-800">
          <h2 className="max-w-3xl text-xl leading-[1.35] font-light tracking-tight text-zinc-950 sm:text-4xl sm:leading-[1.3] dark:text-white">
            <strong className="font-bold">1,200+</strong> space hosts and{" "}
            <strong className="font-bold">20,000+</strong> renters &amp; SMEs
            <br className="hidden sm:inline" /> unlock flexible daily storage
            with Packrat
          </h2>

          {/* Row 1: 5 Monochrome Malaysian SME & Homegrown Brand Logos */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-5 text-zinc-900 sm:mt-12 sm:gap-x-14 sm:gap-y-6 dark:text-zinc-200">
            {/* Shopee */}
            <div className="flex items-center gap-1.5 opacity-85 transition-opacity hover:opacity-100">
              <svg
                className="size-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 7h14l-1.2 13a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7Z" />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" />
                <path
                  d="M14.2 11.2c-.4-.5-1.1-.8-2-.8-1.2 0-2 .6-2 1.4 0 .9.9 1.2 2.1 1.5 1.3.3 2.1.7 2.1 1.7 0 1-.9 1.6-2.3 1.6-1 0-1.9-.4-2.3-1"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-lg font-bold tracking-tight">Shopee</span>
            </div>

            {/* Lalamove */}
            <div className="flex items-center gap-2 opacity-85 transition-opacity hover:opacity-100">
              <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 5.5 15.5 11 21 7.5l-4.5 6.8L20 19l-7.5-3.2L6 19.5l3.2-6.2L4 5.5Z" />
              </svg>
              <span className="text-base font-black tracking-[0.12em] uppercase">
                LALAMOVE
              </span>
            </div>

            {/* EasyParcel (Penang-founded SME Logistics) */}
            <div className="flex items-center gap-2 opacity-85 transition-opacity hover:opacity-100">
              <svg
                className="size-5.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
              </svg>
              <span className="text-lg font-bold tracking-tight">
                Easy<span className="font-normal">Parcel</span>
              </span>
            </div>

            {/* MONTiGO */}
            <div className="flex items-center gap-1.5 opacity-85 transition-opacity hover:opacity-100">
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M8 3h8l1 4H7l1-4Z" />
                <path d="M7 7h10l-1.2 13a2 2 0 0 1-2 1.8h-3.6a2 2 0 0 1-2-1.8L7 7Z" />
              </svg>
              <span className="text-base font-extrabold tracking-[0.16em] uppercase">
                MONTiGO
              </span>
            </div>

            {/* Christy Ng */}
            <div className="flex items-center gap-2 opacity-85 transition-opacity hover:opacity-100">
              <span className="font-[family-name:var(--font-editorial)] text-2xl tracking-wider uppercase">
                Christy Ng
              </span>
            </div>
          </div>

          {/* Row 2: 4 Monochrome Malaysian SME & Heritage Brand Logos */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-5 text-zinc-900 sm:mt-7 sm:gap-x-14 sm:gap-y-6 dark:text-zinc-200">
            {/* ZUS Coffee */}
            <div className="flex items-center gap-2 opacity-85 transition-opacity hover:opacity-100">
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
              </svg>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black tracking-wider uppercase">
                  ZUS
                </span>
                <span className="text-xs font-semibold tracking-widest uppercase opacity-75">
                  COFFEE
                </span>
              </div>
            </div>

            {/* dUCk */}
            <div className="flex items-center opacity-85 transition-opacity hover:opacity-100">
              <span className="text-xl font-extrabold tracking-tight">
                dUCk
              </span>
            </div>

            {/* Ghee Hiang (Penang Heritage Brand) */}
            <div className="flex items-center gap-2 opacity-85 transition-opacity hover:opacity-100">
              <svg
                className="size-5.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <polygon points="12 2 19 5 22 12 19 19 12 22 5 19 2 12 5 5 12 2" />
                <circle cx="12" cy="12" r="4.5" />
              </svg>
              <div className="flex flex-col items-start leading-none">
                <span className="text-sm font-bold tracking-wider uppercase">
                  Ghee Hiang
                </span>
                <span className="text-[8px] font-semibold tracking-widest uppercase opacity-70">
                  PENANG • EST. 1856
                </span>
              </div>
            </div>

            {/* Exabytes (Penang-founded Enterprise/SME) */}
            <div className="flex items-center gap-1.5 opacity-85 transition-opacity hover:opacity-100">
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="16" r="2.5" />
                <path d="M5.5 12.5a9.2 9.2 0 0 1 13 0l-1.9 1.9a6.5 6.5 0 0 0-9.2 0l-1.9-1.9z" />
              </svg>
              <span className="text-base font-bold tracking-tight lowercase">
                exabytes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Renter Personas Portrait Strip */}
      <div>
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-[28px] leading-[1.14] font-semibold tracking-tight text-zinc-950 sm:text-5xl sm:leading-[1.12] dark:text-white">
            Built for every stage of{" "}
            <span className="font-[family-name:var(--font-editorial)] text-[1.08em] font-normal italic text-lime-600 dark:text-primary">
              growth
            </span>{" "}
            &amp; life
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-zinc-600 sm:mt-3 sm:text-lg dark:text-zinc-400">
            Whether you&apos;re dispatching daily TikTok Shop orders, scaling
            11.11 pallets, or renovating your home, book only the space and days
            you need.
          </p>
        </div>

        {/* Horizontal Renter Persona Cards Strip */}
        <div
          ref={stripContainerRef}
          className="mt-7 w-full snap-x snap-mandatory overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-10 sm:snap-none [&::-webkit-scrollbar]:hidden"
        >
          <div className="mx-auto flex w-max items-center gap-4 px-6 sm:gap-5 sm:px-8">
            {RENTER_PERSONAS.map((persona) => {
              const isSelected = activeOptionId === persona.id
              const isScrollActive =
                stripInVerticalView && Boolean(inViewPersonas[persona.id])
              return (
                <Link
                  key={persona.id}
                  href={persona.href}
                  data-persona-id={persona.id}
                  ref={(el) => {
                    cardRefs.current[persona.id] = el
                  }}
                  className={cn(
                    "group relative h-[320px] w-[260px] shrink-0 snap-center overflow-hidden rounded-[24px] bg-zinc-200 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:h-[335px] sm:w-[235px] dark:bg-zinc-800",
                    isSelected
                      ? "ring-primary ring-offset-background -translate-y-1 shadow-xl ring-2 ring-offset-2"
                      : isScrollActive
                        ? "-translate-y-1 shadow-lg ring-1 ring-inset ring-black/10 dark:ring-white/15"
                        : "shadow-xs ring-1 ring-inset ring-black/6 dark:ring-white/10"
                  )}
                >
                  <img
                    src={persona.image}
                    alt={persona.pillLabel}
                    className={cn(
                      "size-full object-cover transition-transform duration-700 group-hover:scale-105",
                      (isScrollActive || isSelected) && "scale-105"
                    )}
                  />

                  {/* Top & Bottom Readability Scrims */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/65 via-black/25 to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

                  {/* Top-Left Persona Title */}
                  <div className="absolute top-5 right-4 left-5">
                    <h3 className="text-[19px] leading-[1.15] font-bold tracking-tight whitespace-pre-line text-white drop-shadow-xs">
                      {persona.cardTitle}
                    </h3>
                  </div>

                  {/* Bottom-Left Fit Hint (Full width, never truncated) */}
                  <div className="absolute right-4 bottom-4 left-5 flex items-center justify-between gap-2 text-xs font-medium text-white/95">
                    <span className="whitespace-nowrap">{persona.fitHint}</span>
                    <ArrowRight
                      className={cn(
                        "size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:opacity-100",
                        isScrollActive || isSelected
                          ? "translate-x-0.5 opacity-100"
                          : "opacity-75"
                      )}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Bottom Centered Renter Persona Pills (Wrapped Cloud on Mobile & Desktop) */}
        <div className="mx-auto mt-6 flex max-w-5xl flex-wrap items-center justify-center gap-2 px-4 sm:mt-9 sm:gap-2.5 sm:px-6">
          {RENTER_PERSONAS.map((persona) => {
            const isSelected = activeOptionId === persona.id
            return (
              <button
                key={persona.id}
                type="button"
                onClick={() => handleSelectOption(persona.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all sm:px-4",
                  isSelected
                    ? "border-zinc-900 bg-zinc-900 text-white shadow-2xs dark:border-white dark:bg-white dark:text-zinc-950"
                    : "border-zinc-200/80 bg-zinc-50/70 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-white/20 dark:hover:text-white"
                )}
              >
                {persona.pillLabel}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
