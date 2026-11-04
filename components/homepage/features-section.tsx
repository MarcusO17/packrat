"use client"

import * as React from "react"
import Link from "next/link"
import {
  ChevronRight,
  MapPin,
  CalendarClock,
  Warehouse,
  Package,
  Coins,
  ArrowUpRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function FeaturesSection() {
  const [audience, setAudience] = React.useState<"renters" | "hosts">("renters")
  const [inViewCards, setInViewCards] = React.useState<Record<string, boolean>>(
    {}
  )
  const cardRefs = React.useRef<Record<string, HTMLDivElement | null>>({})

  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)")
    let observer: IntersectionObserver | null = null

    const setup = () => {
      observer?.disconnect()
      if (!mql.matches) {
        setInViewCards({})
        return
      }

      observer = new IntersectionObserver(
        (entries) => {
          setInViewCards((prev) => {
            const next = { ...prev }
            entries.forEach((entry) => {
              const id = entry.target.getAttribute("data-feature-card")
              if (id) next[id] = entry.isIntersecting
            })
            return next
          })
        },
        { threshold: 0.45, rootMargin: "-10% 0px -12% 0px" }
      )

      Object.values(cardRefs.current).forEach((el) => {
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

  return (
    <section
      id="about"
      className="bg-background py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-stretch">
          {/* Left Column: Two-Sided Market Editorial & Switcher */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div className="flex flex-col items-start">
              <span className="block text-xs font-semibold tracking-wide text-lime-700 dark:text-lime-400">
                • Why Packrat
              </span>

              {/* Renter / Host Interactive Pill Switcher */}
              <div className="mt-4 inline-flex w-full items-center gap-1 rounded-full border border-zinc-200/80 bg-zinc-100/80 p-1 sm:w-auto dark:border-zinc-800 dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={() => setAudience("renters")}
                  className={cn(
                    "inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all sm:flex-initial sm:px-3.5",
                    audience === "renters"
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                  )}
                >
                  <Package className="size-3.5 shrink-0" />
                  <span>For Renters & SMEs</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAudience("hosts")}
                  className={cn(
                    "inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all sm:flex-initial sm:px-3.5",
                    audience === "hosts"
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                  )}
                >
                  <Warehouse className="size-3.5 shrink-0" />
                  <span>For Space Hosts</span>
                </button>
              </div>

              <h2 className="mt-5 text-2xl leading-[1.18] font-semibold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
                {audience === "renters"
                  ? "On-demand microwarehousing built for scale, not leases"
                  : "Turn your idle floor space into recurring daily revenue"}
              </h2>
            </div>

            <div className="mt-6 lg:mt-0">
              <p className="max-w-md text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {audience === "renters"
                  ? "Skip multi-year commercial contracts and hefty deposits. Book exact square footage across neighborhood rooms, shoplots, and warehouse bays—for a few days or a few months."
                  : "Whether you have an empty warehouse bay in Bayan Lepas, a heritage shoplot backroom in George Town, or a spare room at home, list your square footage and get paid by verified renters."}
              </p>

              {/* Dual CTA Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <Button
                  asChild
                  className="h-10 flex-1 gap-1.5 rounded-full px-5 text-xs font-semibold sm:flex-initial sm:px-6"
                >
                  <Link href={audience === "renters" ? "/explore" : "/explore"}>
                    <span>
                      {audience === "renters"
                        ? "Find Storage Near You"
                        : "Start Hosting Space"}
                    </span>
                    <ChevronRight className="size-3.5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setAudience(audience === "renters" ? "hosts" : "renters")
                  }
                  className="h-10 flex-1 gap-1.5 rounded-full border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 sm:flex-initial sm:px-5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  <span>
                    {audience === "renters"
                      ? "List Your Space"
                      : "Explore Storage"}
                  </span>
                  <ArrowUpRight className="size-3.5 text-zinc-400" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Bento Feature Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {/* Top-Left Card: Pay-Per-Day / Zero Lease Lock-In */}
            <div
              data-feature-card="feat-1"
              ref={(el) => {
                cardRefs.current["feat-1"] = el
              }}
              className={cn(
                "group flex flex-col justify-between rounded-3xl border border-zinc-200/70 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/60",
                inViewCards["feat-1"]
                  ? "-translate-y-1 shadow-md"
                  : "shadow-2xs"
              )}
            >
              {/* Interactive-style Day / Sq.ft Pill Preview */}
              <div
                className={cn(
                  "mb-8 flex items-center justify-between rounded-full border border-zinc-200/80 bg-zinc-50 px-4 py-2.5 shadow-2xs transition-all duration-500 group-hover:-translate-y-0.5 group-hover:border-lime-500/40 group-hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950",
                  inViewCards["feat-1"] &&
                    "-translate-y-0.5 border-lime-500/40 shadow-sm"
                )}
              >
                <div className="flex items-center gap-2">
                  <CalendarClock className="size-4 text-lime-600 dark:text-lime-400" />
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    150 sq.ft • 14 Days
                  </span>
                </div>
                <span className="bg-primary text-primary-foreground rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                  0 Lock-in
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
                  Pay-Per-Day, Zero Lock-In
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Scale your storage footprint up for peak campaign stock or
                  down when inventory clears—only pay for the days and sq.ft you
                  use.
                </p>
              </div>
            </div>

            {/* Top-Right Card: Two-Sided Space Marketplace (Spare Rooms to Warehouse Bays) */}
            <div
              data-feature-card="feat-2"
              ref={(el) => {
                cardRefs.current["feat-2"] = el
              }}
              className={cn(
                "group flex flex-col justify-between rounded-3xl border border-zinc-200/70 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/60",
                inViewCards["feat-2"]
                  ? "-translate-y-1 shadow-md"
                  : "shadow-2xs"
              )}
            >
              <div className="mb-8 flex items-center justify-between">
                <div
                  className={cn(
                    "bg-primary text-primary-foreground flex size-11 items-center justify-center rounded-2xl shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3",
                    inViewCards["feat-2"] && "scale-110 -rotate-3"
                  )}
                >
                  {audience === "renters" ? (
                    <Warehouse className="size-5" />
                  ) : (
                    <Coins className="size-5" />
                  )}
                </div>
                <span className="rounded-full border border-zinc-200/80 bg-zinc-50 px-2.5 py-1 text-[10px] font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                  50 – 5,000+ sq.ft
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
                  {audience === "renters"
                    ? "Spare Rooms to Pallet Bays"
                    : "Monetize Every Idle Sq.Ft"}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {audience === "renters"
                    ? "Bridge neighborhood home storage for boxes and commercial warehouse bays for SME pallets on one unified platform."
                    : "Set your own daily or monthly sq.ft rates, approve bookings on your schedule, and turn empty corners into passive income."}
                </p>
              </div>
            </div>

            {/* Bottom Wide Card: Hyper-Local Neighborhood Hubs Across Malaysia */}
            <div
              data-feature-card="feat-3"
              ref={(el) => {
                cardRefs.current["feat-3"] = el
              }}
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-md sm:col-span-2 dark:border-zinc-800/80 dark:bg-zinc-900/60",
                inViewCards["feat-3"]
                  ? "-translate-y-1 shadow-md"
                  : "shadow-2xs"
              )}
            >
              {/* Subtle Dotted Map Pattern Background */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-45 dark:opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #a1a1aa 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              />

              <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                {/* Left Content + Floating Daily Rate Pill */}
                <div className="flex flex-col justify-between space-y-8 sm:max-w-[56%]">
                  {/* Primary Rate Marker & Dashed Trajectory */}
                  <div className="relative flex items-center pt-2 pl-4">
                    <span
                      className={cn(
                        "bg-primary text-primary-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold shadow-sm transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-105",
                        inViewCards["feat-3"] && "-translate-y-0.5 scale-105"
                      )}
                    >
                      <span className="size-1.5 rounded-full bg-[#1a2e05]" />
                      RM 18 / day
                    </span>
                    <svg
                      className="ml-2 h-8 w-28 text-lime-600/70 dark:text-lime-400/60"
                      viewBox="0 0 120 32"
                      fill="none"
                    >
                      <path
                        d="M2 24C35 28 75 24 116 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
                      Hyper-Local Hubs Across Penang & Malaysia
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                      Position your inventory closer to buyers in George Town,
                      Bayan Lepas, Seberang Perai, KL, and JB for faster
                      last-mile dispatch and self-pickup.
                    </p>
                  </div>
                </div>

                {/* Right Stacked Hub Preview Card */}
                <Link
                  href="/spaces/george-town-shoplot-hub"
                  className={cn(
                    "relative self-center transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.03] sm:self-end",
                    inViewCards["feat-3"] && "-translate-y-1 scale-[1.03]"
                  )}
                >
                  {/* Back Tilted Card */}
                  <div
                    className={cn(
                      "absolute -top-2 -left-4 h-36 w-44 rounded-2xl border border-zinc-200/70 bg-zinc-50/90 p-1.5 shadow-sm transition-transform duration-500 group-hover:-translate-x-1.5 group-hover:-rotate-10 dark:border-zinc-700 dark:bg-zinc-800/80",
                      inViewCards["feat-3"]
                        ? "-translate-x-1.5 -rotate-10"
                        : "-rotate-6"
                    )}
                  >
                    <div className="bg-primary/20 size-full rounded-xl" />
                  </div>

                  {/* Front Storage Hub Mini Card */}
                  <div className="relative w-52 rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="relative h-24 w-full overflow-hidden rounded-xl bg-zinc-100">
                      <img
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80"
                        alt="George Town Shoplot Micro-Hub"
                        className={cn(
                          "size-full object-cover transition-transform duration-700 group-hover:scale-105",
                          inViewCards["feat-3"] && "scale-105"
                        )}
                      />
                      <span className="bg-primary text-primary-foreground absolute top-1.5 right-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold">
                        250 sq.ft
                      </span>
                    </div>
                    <div className="mt-2 px-1">
                      <p className="truncate text-[11px] font-bold text-zinc-900 dark:text-white">
                        George Town Micro-Hub
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[10px] text-zinc-400">
                        <MapPin className="size-2.5 shrink-0 text-lime-600 dark:text-lime-400" />
                        <span className="truncate">
                          George Town, Penang
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
