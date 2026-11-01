import * as React from "react"
import { Search, ShieldCheck, ChevronRight, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"

export function FeaturesSection() {
  return (
    <section
      id="about"
      className="bg-white py-16 sm:py-24 dark:bg-zinc-950"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-stretch">
          {/* Left Column: Editorial Value Proposition */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <span className="text-primary text-xs font-semibold tracking-wide">
                • Reason to choose us
              </span>
              <h2 className="mt-3 text-3xl leading-[1.18] font-semibold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
                Discover the value behind smart property investments
              </h2>
            </div>

            <div className="mt-10 lg:mt-0">
              <p className="max-w-md text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                We handle the heavy lifting by conducting in-depth research,
                analyzing the numbers, and finding high-performing properties
                for you.
              </p>
              <Button className="mt-6 h-10 gap-1.5 rounded-full px-6 text-xs font-semibold">
                <span>Find the best for you</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Right Column: Bento Feature Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {/* Top-Left Card: Smart Suggestions */}
            <div className="flex flex-col justify-between rounded-3xl border border-zinc-100 bg-zinc-50/80 p-6 dark:border-zinc-800/80 dark:bg-zinc-900/60">
              {/* Mock AI Search Pill */}
              <div className="mb-8 flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-4 py-2.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
                <Search className="text-primary size-3.5" />
                <span className="text-xs text-zinc-400">
                  Search with &quot;AI&quot;
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
                  Smart Suggestions
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  AI scans listings to find your best-fit property.
                </p>
              </div>
            </div>

            {/* Top-Right Card: 99% Trusted Investor */}
            <div className="flex flex-col justify-between rounded-3xl border border-zinc-100 bg-zinc-50/80 p-6 dark:border-zinc-800/80 dark:bg-zinc-900/60">
              <div className="bg-primary text-primary-foreground mb-8 flex size-11 items-center justify-center rounded-2xl shadow-sm">
                <ShieldCheck className="size-5" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
                  99% Trusted Investor
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Users trust our picks and return for more deals.
                </p>
              </div>
            </div>

            {/* Bottom Wide Card: Invest Where it Matters */}
            <div className="relative overflow-hidden rounded-3xl border border-zinc-100 bg-zinc-50/80 p-6 sm:col-span-2 dark:border-zinc-800/80 dark:bg-zinc-900/60">
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
                {/* Left Content + Floating Price Pill */}
                <div className="flex flex-col justify-between space-y-8 sm:max-w-[55%]">
                  {/* Primary Price Marker & Dashed Trajectory */}
                  <div className="relative flex items-center pt-2 pl-6">
                    <span className="bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm">
                      <span className="size-1.5 rounded-full bg-white" />
                      $ 147
                    </span>
                    <svg
                      className="text-primary/60 ml-2 h-8 w-28"
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
                      Invest Where it Matters
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                      We pinpoint high-demand, high-growth areas backed by
                      market data.
                    </p>
                  </div>
                </div>

                {/* Right Stacked Property Preview Card */}
                <div className="relative self-center sm:self-end">
                  {/* Back Tilted Card */}
                  <div className="absolute -top-2 -left-4 h-36 w-44 -rotate-6 rounded-2xl border border-zinc-200/70 bg-white/80 p-1.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/80">
                    <div className="bg-primary/15 size-full rounded-xl" />
                  </div>

                  {/* Front Property Mini Card */}
                  <div className="relative w-48 rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="h-24 w-full overflow-hidden rounded-xl bg-zinc-100">
                      <img
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"
                        alt="Modern Architectural Marvel"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="mt-2 px-1">
                      <p className="truncate text-[11px] font-bold text-zinc-900 dark:text-white">
                        Modern Architectural Mar...
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[10px] text-zinc-400">
                        <MapPin className="text-primary size-2.5" />
                        <span>Kuala Lumpur, Malaysia</span>
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
