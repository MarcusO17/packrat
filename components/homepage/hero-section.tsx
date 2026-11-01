"use client"

import * as React from "react"
import {
  Play,
  Search,
  MapPin,
  Maximize2,
  BedDouble,
  Bath,
  TrendingUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const floatingMarkers = [
  {
    id: 1,
    top: "38%",
    left: "14%",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=160&q=80",
    label: "Suburban Villa",
  },
  {
    id: 2,
    top: "32%",
    left: "29%",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=160&q=80",
    label: "Modern Townhouse",
  },
  {
    id: 3,
    top: "68%",
    left: "21%",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=160&q=80",
    label: "Glass Residence",
  },
  {
    id: 4,
    top: "58%",
    left: "32%",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=160&q=80",
    label: "Lakefront Loft",
  },
  {
    id: 5,
    top: "36%",
    left: "82%",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=160&q=80",
    label: "Hillside Estate",
  },
  {
    id: 6,
    top: "66%",
    left: "81%",
    image:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=160&q=80",
    label: "Penthouse Suite",
  },
]

export function HeroSection() {
  const [location, setLocation] = React.useState("all")
  const [propertyType, setPropertyType] = React.useState("all")
  const [budget, setBudget] = React.useState("500-1200")

  return (
    <section className="relative overflow-hidden border-b border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* Top Heading & Search Bar */}
      <div className="relative z-20 mx-auto flex max-w-5xl flex-col items-center px-4 pt-12 pb-6 text-center sm:px-6 lg:pt-16">
        {/* Top Pill Badge */}
        <button
          type="button"
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <span className="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full">
            <Play className="size-2 fill-current" />
          </span>
          <span>What is Packrat?</span>
        </button>

        {/* Main Headline with Inline Pill Graphic */}
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl sm:leading-[1.15] dark:text-white">
          Easily Invest in Real Estate
          <br />
          <span className="inline-flex flex-wrap items-center justify-center gap-2.5">
            <span>to Grow</span>
            <span className="border-primary/40 relative inline-flex h-9 w-16 items-center justify-center overflow-hidden rounded-full border bg-zinc-900 shadow-inner sm:h-11 sm:w-20">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=240&q=80"
                alt="Property growth"
                className="size-full object-cover opacity-75"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                <TrendingUp className="text-primary size-4 sm:size-5" />
              </span>
            </span>
            <span>Your Future</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-500 sm:text-base dark:text-zinc-400">
          Take control of your financial future by diversifying your portfolio
          with secure and high-yield real estate properties.
        </p>

        {/* Search Filter Pill Bar */}
        <div className="mt-8 flex w-full max-w-2xl flex-col items-stretch gap-2 rounded-3xl border border-zinc-200/90 bg-white p-2 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center sm:rounded-full sm:py-2 sm:pr-2 sm:pl-6 dark:border-zinc-800 dark:bg-zinc-900">
          {/* Location Select */}
          <div className="flex flex-1 flex-col items-start text-left">
            <span className="px-1 text-[11px] font-medium text-zinc-400">
              Location
            </span>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger
                size="sm"
                className="h-7 w-full border-0 bg-transparent px-1 py-0 text-xs font-semibold text-zinc-900 shadow-none focus-visible:ring-0 dark:text-white"
              >
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="kl">Kuala Lumpur</SelectItem>
                <SelectItem value="selangor">Petaling Jaya, Selangor</SelectItem>
                <SelectItem value="penang">George Town, Penang</SelectItem>
                <SelectItem value="jb">Johor Bahru, Johor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden h-8 w-px bg-zinc-200 sm:block dark:bg-zinc-800" />

          {/* Property Type Select */}
          <div className="flex flex-1 flex-col items-start text-left sm:pl-2">
            <span className="px-1 text-[11px] font-medium text-zinc-400">
              Property Type
            </span>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger
                size="sm"
                className="h-7 w-full border-0 bg-transparent px-1 py-0 text-xs font-semibold text-zinc-900 shadow-none focus-visible:ring-0 dark:text-white"
              >
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="bungalow">Bungalow</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden h-8 w-px bg-zinc-200 sm:block dark:bg-zinc-800" />

          {/* Budget Select */}
          <div className="flex flex-1 flex-col items-start text-left sm:pl-2">
            <span className="px-1 text-[11px] font-medium text-zinc-400">
              Budget
            </span>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger
                size="sm"
                className="h-7 w-full border-0 bg-transparent px-1 py-0 text-xs font-semibold text-zinc-900 shadow-none focus-visible:ring-0 dark:text-white"
              >
                <SelectValue placeholder="$500 - $1200" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="500-1200">$500 - $1200</SelectItem>
                <SelectItem value="1200-5000">$1,200 - $5,000</SelectItem>
                <SelectItem value="5000+">$5,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button
            size="icon"
            aria-label="Search properties"
            className="size-10 shrink-0 self-end rounded-full sm:self-center"
          >
            <Search className="size-4" />
          </Button>
        </div>
      </div>

      {/* Interactive OpenStreetMap Canvas Area */}
      <div className="relative h-[470px] w-full sm:h-[510px]">
        {/* OpenStreetMap iframe centered on Kuala Lumpur / Klang Valley, Malaysia */}
        <iframe
          title="OpenStreetMap Malaysia Real Estate Explorer"
          src="https://www.openstreetmap.org/export/embed.html?bbox=101.58%2C3.08%2C101.78%2C3.20&layer=mapnik"
          className="pointer-events-none size-full border-0 opacity-75 grayscale contrast-95 filter dark:invert dark:hue-rotate-180 dark:opacity-40"
          loading="lazy"
        />

        {/* Soft Top & Side Radial/Linear Fade Overlays so map blends seamlessly */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white via-white/75 to-transparent dark:from-zinc-950 dark:via-zinc-950/75" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/90 to-transparent dark:from-zinc-950/90" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white/80 to-transparent dark:from-zinc-950/80" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white/80 to-transparent dark:from-zinc-950/80" />

        {/* Subtle Attribution Pill */}
        <a
          href="https://www.openstreetmap.org"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-3 bottom-2 z-20 rounded bg-white/80 px-2 py-0.5 text-[10px] text-zinc-500 backdrop-blur-xs hover:text-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400"
        >
          © OpenStreetMap
        </a>

        {/* Circular Property Thumbnail Markers on Map */}
        {floatingMarkers.map((marker) => (
          <div
            key={marker.id}
            style={{ top: marker.top, left: marker.left }}
            className="group absolute z-20 hidden -translate-x-1/2 -translate-y-1/2 cursor-pointer md:block"
          >
            <div className="relative size-11 overflow-hidden rounded-full border-2 border-white bg-zinc-100 shadow-md transition-transform duration-200 group-hover:scale-110 dark:border-zinc-800">
              <img
                src={marker.image}
                alt={marker.label}
                className="size-full object-cover"
              />
            </div>
            <span className="pointer-events-none absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-white shadow-xs dark:bg-zinc-800" />
          </div>
        ))}

        {/* Center Featured Property Card Overlay */}
        <div className="absolute top-1/2 left-1/2 z-30 w-[300px] -translate-x-1/2 -translate-y-[54%] sm:w-[320px]">
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:border-zinc-800 dark:bg-zinc-900">
            {/* Property Image */}
            <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-zinc-100">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=700&q=80"
                alt="Luxury Oceanfront Bungalow"
                className="size-full object-cover"
              />
              <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 absolute top-2.5 right-2.5 rounded-full border-0 px-2.5 py-0.5 text-[11px] font-semibold shadow-xs">
                New
              </Badge>

              {/* Carousel Dots */}
              <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/35 px-2 py-1 backdrop-blur-xs">
                <span className="bg-primary h-1 w-3 rounded-full" />
                <span className="size-1 rounded-full bg-white/60" />
                <span className="size-1 rounded-full bg-white/60" />
                <span className="size-1 rounded-full bg-white/60" />
              </div>
            </div>

            {/* Card Details */}
            <div className="mt-3 px-1">
              <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                Luxury Oceanfront Bungalow
              </h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                <MapPin className="text-primary size-3.5" />
                <span>Kuala Lumpur, Malaysia</span>
              </p>

              {/* Specs Row */}
              <div className="mt-2.5 flex items-center gap-3 border-b border-zinc-100 pb-3 text-[11px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1">
                  <Maximize2 className="size-3 text-zinc-400" />
                  1,500 sq.ft
                </span>
                <span className="inline-flex items-center gap-1">
                  <BedDouble className="size-3 text-zinc-400" />3 bed
                </span>
                <span className="inline-flex items-center gap-1">
                  <Bath className="size-3 text-zinc-400" />2 bath
                </span>
              </div>

              {/* Price & CTA Row */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-zinc-950 dark:text-white">
                    $520,000
                  </span>
                  <span className="text-primary text-[11px] font-semibold">
                    (10.8%)
                  </span>
                </div>
                <Button
                  size="sm"
                  className="h-7 rounded-full px-3 text-[11px] font-semibold"
                >
                  Invest Now
                </Button>
              </div>
            </div>
          </div>

          {/* Map Cluster Pin Indicator ("20") below card */}
          <div className="mt-3 flex flex-col items-center">
            <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-lg dark:border-zinc-800">
              20
            </div>
            <div className="bg-primary/50 h-2 w-0.5" />
          </div>
        </div>
      </div>
    </section>
  )
}
