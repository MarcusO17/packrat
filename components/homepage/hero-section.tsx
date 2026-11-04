"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Play,
  Search,
  MapPin,
  Maximize2,
  Truck,
  ShieldCheck,
  ChevronDown,
  Calendar as CalendarIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CoordMap, type CoordMapMarker } from "@/components/renter/coord-map"

const rotatingPhrases = [
  {
    text: "overflow.",
    className:
      "font-[family-name:var(--font-mono)] font-bold tracking-tighter text-lime-600 dark:text-primary",
  },
  {
    text: "everyone.",
    className:
      "font-[family-name:var(--font-editorial)] italic font-normal tracking-normal text-lime-600 dark:text-primary text-[1.15em]",
  },
  {
    text: "growth.",
    className:
      "font-[family-name:var(--font-display)] font-bold uppercase tracking-wider text-lime-600 dark:text-primary",
  },
  {
    text: "days, not leases.",
    className:
      "font-[family-name:var(--font-editorial)] italic font-normal text-lime-600 dark:text-primary text-[1.1em]",
  },
]

const suggestedLocations = [
  {
    name: "All Locations",
    subtitle: "Find available storage around you",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=120&q=80",
  },
  {
    name: "George Town, Penang",
    subtitle: "Heritage shoplots, retail & city micro-hubs",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=120&q=80",
  },
  {
    name: "Bayan Lepas, Penang",
    subtitle: "FTZ industrial pallet & e-commerce fulfillment bays",
    image:
      "https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&w=120&q=80",
  },
  {
    name: "Butterworth & Bukit Mertajam",
    subtitle: "Mainland Penang logistics & high-ceiling warehouses",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=120&q=80",
  },
  {
    name: "Kuala Lumpur & PJ",
    subtitle: "Central Klang Valley commercial & SME bays",
    image:
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=120&q=80",
  },
  {
    name: "Johor Bahru, Johor",
    subtitle: "Cross-border logistics & Southern storage",
    image:
      "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=120&q=80",
  },
]

// Real GPS coordinates on Penang Island & Mainland Seberang Perai
const heroCoordMarkers: CoordMapMarker[] = [
  {
    id: "bayan-lepas-ftz-sme-bay",
    lat: 5.3185,
    lng: 100.287,
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=160&q=80",
    title: "Bayan Lepas FTZ Bay • RM 28/day",
    href: "/spaces/bayan-lepas-ftz-sme-bay",
  },
  {
    id: "george-town-shoplot-hub",
    lat: 5.4145,
    lng: 100.3385,
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=160&q=80",
    title: "George Town Shoplot • RM 22/day",
    href: "/spaces/george-town-shoplot-hub",
  },
  {
    id: "tanjung-tokong-spare-room",
    lat: 5.4535,
    lng: 100.3065,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=160&q=80",
    title: "Tanjung Tokong Room • RM 12/day",
    href: "/spaces/tanjung-tokong-spare-room",
  },
  {
    id: "jelutong-sme-hub",
    lat: 5.3895,
    lng: 100.3145,
    image:
      "https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&w=160&q=80",
    title: "Jelutong SME Hub • RM 20/day",
    href: "/spaces/jelutong-sme-hub",
  },
  {
    id: "butterworth-pallet-unit",
    lat: 5.368,
    lng: 100.402,
    image:
      "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=160&q=80",
    title: "Butterworth Pallet Unit • RM 18/day",
    href: "/spaces/butterworth-pallet-unit",
  },
  {
    id: "bukit-mertajam-locker",
    lat: 5.3522,
    lng: 100.4468,
    image:
      "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=160&q=80",
    title: "Bukit Mertajam Locker • RM 14/day",
    href: "/spaces/bukit-mertajam-locker",
  },
]

function formatShortDate(date?: Date) {
  if (!date) return "MM/DD"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

export function HeroSection() {
  const router = useRouter()
  const [location, setLocation] = React.useState("All Locations")
  const [locationOpen, setLocationOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    undefined
  )
  const [dateOpen, setDateOpen] = React.useState(false)
  const [budgetRange, setBudgetRange] = React.useState<number[]>([500, 1200])
  const [budgetOpen, setBudgetOpen] = React.useState(false)
  const [wordIndex, setWordIndex] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % rotatingPhrases.length)
        setIsVisible(true)
      }, 220)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const currentPhrase = rotatingPhrases[wordIndex]

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location && location !== "All Locations") {
      params.set("location", location)
    }
    const qs = params.toString()
    router.push(`/explore${qs ? `?${qs}` : ""}`)
  }

  return (
    <section className="bg-background relative overflow-hidden border-b border-zinc-200/80 dark:border-zinc-800">
      {/* Top Heading & Search Bar */}
      <div className="relative z-30 mx-auto flex max-w-5xl flex-col items-center px-4 pt-12 pb-6 text-center sm:px-6 lg:pt-16">
        {/* Top Pill Badge */}
        <Link
          href="#properties"
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <span className="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full">
            <Play className="size-2 fill-current" />
          </span>
          <span>What is Packrat?</span>
        </Link>

        {/* Main Headline with Dynamic Font-Swapping Word */}
        <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl sm:leading-[1.18] dark:text-white">
          <span>Storage, redefined for </span>
          <span
            className={cn(
              "inline-block transition-all duration-200 ease-out",
              isVisible
                ? "translate-y-0 opacity-100 blur-none"
                : "translate-y-2 opacity-0 blur-[2px]",
              currentPhrase.className
            )}
          >
            {currentPhrase.text}
          </span>
        </h1>

        {/* Search Filter Pill Bar */}
        <div className="mt-8 flex w-full max-w-2xl flex-col items-stretch gap-2 rounded-3xl border border-zinc-200/90 bg-white p-2 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center sm:rounded-full sm:py-2 sm:pr-2 sm:pl-6 dark:border-zinc-800 dark:bg-zinc-900">
          {/* Location Popover with Suggested Destination Banner */}
          <Popover open={locationOpen} onOpenChange={setLocationOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex flex-1 flex-col items-start text-left outline-none"
              >
                <span className="px-1 text-[11px] font-medium text-zinc-400">
                  Location
                </span>
                <span className="flex h-7 w-full items-center justify-between px-1 text-xs font-semibold text-zinc-900 dark:text-white">
                  <span className="truncate">{location}</span>
                  <ChevronDown className="size-4 shrink-0 opacity-50" />
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={14}
              className="w-80 rounded-3xl border-zinc-200/80 bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="mb-3 px-1 text-xs font-medium text-zinc-400">
                Suggested destination
              </p>
              <div className="flex flex-col gap-1">
                {suggestedLocations.map((loc) => (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => {
                      setLocation(loc.name)
                      setLocationOpen(false)
                    }}
                    className="hover:bg-zinc-100/80 dark:hover:bg-zinc-800 flex items-center gap-3 rounded-2xl p-2 text-left transition-colors"
                  >
                    <img
                      src={loc.image}
                      alt={loc.name}
                      className="size-10 shrink-0 rounded-full object-cover ring-1 ring-black/5"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                        {loc.name}
                      </p>
                      <p className="truncate text-xs text-zinc-400">
                        {loc.subtitle}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="hidden h-8 w-px bg-zinc-200 sm:block dark:bg-zinc-800" />

          {/* Middle Column: Date with Date Picker Popover */}
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex flex-1 flex-col items-start text-left outline-none sm:pl-2"
              >
                <span className="px-1 text-[11px] font-medium text-zinc-400">
                  Date
                </span>
                <span className="flex h-7 w-full items-center justify-between px-1 text-xs font-semibold text-zinc-900 dark:text-white">
                  <span className="truncate">
                    {formatShortDate(selectedDate)}
                  </span>
                  <CalendarIcon className="size-3.5 shrink-0 opacity-50" />
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              sideOffset={14}
              className="w-auto rounded-3xl border-zinc-200/80 bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:border-zinc-800 dark:bg-zinc-900"
            >
              <Calendar
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date)
                  setDateOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>

          <div className="hidden h-8 w-px bg-zinc-200 sm:block dark:bg-zinc-800" />

          {/* Budget Column with Dual-Thumb Range Slider Popover */}
          <Popover open={budgetOpen} onOpenChange={setBudgetOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex flex-1 flex-col items-start text-left outline-none sm:pl-2"
              >
                <span className="px-1 text-[11px] font-medium text-zinc-400">
                  Budget
                </span>
                <span className="flex h-7 w-full items-center justify-between px-1 text-xs font-semibold text-zinc-900 dark:text-white">
                  <span className="truncate">
                    RM {budgetRange[0].toLocaleString()} - RM{" "}
                    {budgetRange[1].toLocaleString()}
                  </span>
                  <ChevronDown className="size-4 shrink-0 opacity-50" />
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={14}
              className="w-72 rounded-3xl border-zinc-200/80 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Price Range
                  </span>
                  <span className="text-xs font-bold text-lime-700 dark:text-lime-400">
                    RM {budgetRange[0].toLocaleString()} – RM{" "}
                    {budgetRange[1].toLocaleString()}
                  </span>
                </div>

                <Slider
                  value={budgetRange}
                  min={50}
                  max={5000}
                  step={50}
                  onValueChange={setBudgetRange}
                  className="py-2"
                />

                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>RM 50</span>
                  <span>RM 2,500</span>
                  <span>RM 5,000+</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Search Button */}
          <Button
            type="button"
            onClick={handleSearch}
            size="icon"
            aria-label="Search storage spaces"
            className="size-10 shrink-0 self-end rounded-full sm:self-center"
          >
            <Search className="size-4" />
          </Button>
        </div>
      </div>

      {/* Coordinate-Projected OpenStreetMap Canvas Area */}
      <div className="relative -mt-20 h-[550px] w-full pt-16 sm:-mt-24 sm:h-[590px] sm:pt-20">
        <CoordMap
          centerLat={5.388}
          centerLng={100.36}
          zoom={12}
          markers={heroCoordMarkers}
          markerStyle="photo-pin"
          showControls={false}
          className="absolute inset-0 size-full"
        >
          {/* Soft Top & Side Radial/Linear Fade Overlays matching #f9fafb / #0c0d0e */}
          <div className="from-background via-background/80 pointer-events-none absolute inset-x-0 top-0 z-20 h-48 bg-gradient-to-b to-transparent sm:h-56" />
          <div className="from-background/90 pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t to-transparent" />
          <div className="from-background/80 pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r to-transparent" />
          <div className="from-background/80 pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l to-transparent" />

          {/* Center Featured Storage Hub Card Overlay */}
          <div
            data-map-interactive="true"
            className="absolute top-1/2 left-1/2 z-30 w-[300px] -translate-x-1/2 -translate-y-[44%] sm:w-[320px]"
          >
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:border-zinc-800 dark:bg-zinc-900">
              {/* Storage Hub Image */}
              <Link
                href="/spaces/bayan-lepas-ftz-sme-bay"
                className="relative block h-40 w-full overflow-hidden rounded-2xl bg-zinc-100"
              >
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80"
                  alt="Climate-Controlled SME Warehouse Bay"
                  className="size-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 absolute top-2.5 right-2.5 rounded-full border-0 px-2.5 py-0.5 text-[11px] font-semibold shadow-xs">
                  Instant Book
                </Badge>

                {/* Carousel Dots */}
                <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/35 px-2 py-1 backdrop-blur-xs">
                  <span className="bg-primary h-1 w-3 rounded-full" />
                  <span className="size-1 rounded-full bg-white/60" />
                  <span className="size-1 rounded-full bg-white/60" />
                  <span className="size-1 rounded-full bg-white/60" />
                </div>
              </Link>

              {/* Card Details */}
              <div className="mt-3 px-1">
                <Link
                  href="/spaces/bayan-lepas-ftz-sme-bay"
                  className="text-sm font-bold text-zinc-950 hover:underline dark:text-white"
                >
                  Climate-Controlled SME Bay
                </Link>
                <p className="mt-1 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5 text-lime-600 dark:text-lime-400" />
                    <span>Bayan Lepas, Penang</span>
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400">
                    5.3185°N, 100.2870°E
                  </span>
                </p>

                {/* Storage Specs Row */}
                <div className="mt-2.5 flex items-center gap-3 border-b border-zinc-100 pb-3 text-[11px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <Maximize2 className="size-3 text-zinc-400" />
                    350 sq.ft
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Truck className="size-3 text-zinc-400" />
                    Loading Bay
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="size-3 text-zinc-400" />
                    24/7 Access
                  </span>
                </div>

                {/* Price & CTA Row */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-zinc-950 dark:text-white">
                      RM 28 / day
                    </span>
                    <span className="text-[11px] font-semibold text-lime-700 dark:text-lime-400">
                      (0 Lock-in)
                    </span>
                  </div>
                  <Button
                    size="sm"
                    asChild
                    className="h-7 rounded-full px-3 text-[11px] font-semibold"
                  >
                    <Link href="/spaces/bayan-lepas-ftz-sme-bay">
                      Book Space
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Map Cluster Pin Indicator ("20") below card */}
            <Link
              href="/explore"
              className="mt-3 flex flex-col items-center transition-transform hover:scale-105"
            >
              <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-lg dark:border-zinc-800">
                20
              </div>
              <div className="bg-primary/60 h-2 w-0.5" />
            </Link>
          </div>
        </CoordMap>
      </div>
    </section>
  )
}
