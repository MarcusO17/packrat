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
  const cardRefs = React.useRef<Record<string, HTMLAnchorElement | null>>({})

  const handleSelectOption = (optionId: string) => {
    setActiveOptionId((prev) => (prev === optionId ? null : optionId))
    const cardEl = cardRefs.current[optionId]
    if (cardEl) {
      cardEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      })
    }
  }

  return (
    <section
      id="properties"
      className="bg-background border-b border-zinc-200/80 py-16 sm:py-24 dark:border-white/10"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Part 1: "The way storage should've been done in the first place" 3-Card Bento */}
        <div>
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
                  or staging campaign stock, only pay for the exact days you
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
                  local hubs, drop off 24/7 or book a pickup in one tap.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Middle Section: Trust & Brand Social Proof Wall (in between Part 1 & Part 2) */}
        <div className="mx-auto my-20 flex max-w-4xl flex-col items-center border-y border-zinc-200/80 py-16 text-center sm:my-24 sm:py-20 dark:border-zinc-800">
          <h2 className="max-w-3xl text-2xl leading-[1.3] font-light tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
            <strong className="font-bold">1,200+</strong> space hosts and{" "}
            <strong className="font-bold">20,000+</strong> renters &amp; SMEs
            <br className="hidden sm:inline" /> unlock flexible daily storage
            with Packrat
          </h2>

          {/* Row 1: 5 Monochrome Malaysian SME & Homegrown Brand Logos */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-zinc-900 sm:mt-12 sm:gap-x-14 dark:text-zinc-200">
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
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-zinc-900 sm:gap-x-14 dark:text-zinc-200">
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
          <h2 className="text-3xl leading-[1.12] font-semibold tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
            Built for every stage of{" "}
            <span className="font-[family-name:var(--font-editorial)] text-[1.08em] font-normal italic text-lime-600 dark:text-primary">
              growth
            </span>{" "}
            &amp; life
          </h2>
          <p className="mt-3 text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
            Whether you&apos;re dispatching daily TikTok Shop orders, scaling
            11.11 pallets, or renovating your home, book only the space and days
            you need.
          </p>
        </div>

        {/* Horizontal Renter Persona Cards Strip */}
        <div className="mt-10 w-full overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex w-max items-center gap-4 px-4 sm:gap-5 sm:px-8">
            {RENTER_PERSONAS.map((persona) => {
              const isSelected = activeOptionId === persona.id
              return (
                <Link
                  key={persona.id}
                  href={persona.href}
                  ref={(el) => {
                    cardRefs.current[persona.id] = el
                  }}
                  className={cn(
                    "group relative h-[300px] w-[195px] shrink-0 overflow-hidden rounded-[22px] bg-zinc-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:h-[330px] sm:w-[215px] dark:bg-zinc-800",
                    isSelected
                      ? "ring-primary ring-offset-background -translate-y-1 shadow-xl ring-2 ring-offset-2"
                      : "shadow-xs ring-1 ring-inset ring-black/6 dark:ring-white/10"
                  )}
                >
                  <img
                    src={persona.image}
                    alt={persona.pillLabel}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Top & Bottom Readability Scrims */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />

                  {/* Top-Left Persona Title */}
                  <div className="absolute top-5 right-4 left-5">
                    <h3 className="text-lg leading-[1.15] font-bold tracking-tight whitespace-pre-line text-white drop-shadow-xs sm:text-[19px]">
                      {persona.cardTitle}
                    </h3>
                  </div>

                  {/* Bottom-Left Fit Hint */}
                  <div className="absolute right-4 bottom-4 left-5 flex items-center justify-between text-[11px] font-medium text-white/90">
                    <span className="truncate">{persona.fitHint}</span>
                    <ArrowRight className="size-3.5 shrink-0 opacity-75 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Bottom Centered Renter Persona Pills */}
        <div className="mx-auto mt-9 flex max-w-5xl flex-wrap items-center justify-center gap-2.5 px-4 sm:px-6">
          {RENTER_PERSONAS.map((persona) => {
            const isSelected = activeOptionId === persona.id
            return (
              <button
                key={persona.id}
                type="button"
                onClick={() => handleSelectOption(persona.id)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
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
