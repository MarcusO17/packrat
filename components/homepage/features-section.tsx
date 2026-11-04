"use client"

import * as React from "react"
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
              <div className="mt-4 inline-flex items-center gap-1 rounded-full border border-zinc-200/80 bg-zinc-100/80 p-1 dark:border-zinc-800 dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={() => setAudience("renters")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                    audience === "renters"
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                  )}
                >
                  <Package className="size-3.5" />
                  <span>For Renters & SMEs</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAudience("hosts")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                    audience === "hosts"
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                  )}
                >
                  <Warehouse className="size-3.5" />
                  <span>For Space Hosts</span>
                </button>
              </div>

              <h2 className="mt-5 text-3xl leading-[1.18] font-semibold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
                {audience === "renters"
                  ? "On-demand microwarehousing built for scale, not leases"
                  : "Turn your idle floor space into recurring daily revenue"}
              </h2>
            </div>

            <div className="mt-10 lg:mt-0">
              <p className="max-w-md text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {audience === "renters"
                  ? "Skip multi-year commercial contracts and hefty deposits. Book exact square footage across neighborhood rooms, shoplots, and warehouse bays—for a few days or a few months."
                  : "Whether you have an empty warehouse bay in Bayan Lepas, a heritage shoplot backroom in George Town, or a spare room at home, list your square footage and get paid by verified renters."}
              </p>

              {/* Dual CTA Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button className="h-10 gap-1.5 rounded-full px-6 text-xs font-semibold">
                  <span>
                    {audience === "renters"
                      ? "Find Storage Near You"
                      : "Start Hosting Space"}
                  </span>
                  <ChevronRight className="size-3.5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setAudience(audience === "renters" ? "hosts" : "renters")
                  }
                  className="h-10 gap-1.5 rounded-full border-zinc-200 bg-white px-5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
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
            <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/70 bg-white p-6 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
              {/* Interactive-style Day / Sq.ft Pill Preview */}
              <div className="mb-8 flex items-center justify-between rounded-full border border-zinc-200/80 bg-zinc-50 px-4 py-2.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
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
            <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/70 bg-white p-6 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
              <div className="mb-8 flex items-center justify-between">
                <div className="bg-primary text-primary-foreground flex size-11 items-center justify-center rounded-2xl shadow-sm">
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
            <div className="relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white p-6 shadow-2xs sm:col-span-2 dark:border-zinc-800/80 dark:bg-zinc-900/60">
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
                    <span className="bg-primary text-primary-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold shadow-sm">
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
                <div className="relative self-center sm:self-end">
                  {/* Back Tilted Card */}
                  <div className="absolute -top-2 -left-4 h-36 w-44 -rotate-6 rounded-2xl border border-zinc-200/70 bg-zinc-50/90 p-1.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/80">
                    <div className="bg-primary/20 size-full rounded-xl" />
                  </div>

                  {/* Front Storage Hub Mini Card */}
                  <div className="relative w-52 rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="relative h-24 w-full overflow-hidden rounded-xl bg-zinc-100">
                      <img
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80"
                        alt="George Town Shoplot Micro-Hub"
                        className="size-full object-cover"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
