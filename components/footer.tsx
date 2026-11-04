import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Globe, Mail, MapPin, ShieldCheck } from "lucide-react"

import logoPackrat from "@/app/assets/logo-packrat.png"

const footerSections = [
  {
    title: "For Renters & SMEs",
    links: [
      { label: "Explore Storage", href: "#properties" },
      { label: "SME Pallet & Fulfillment Bays", href: "#properties" },
      { label: "Climate-Controlled Units", href: "#properties" },
      { label: "Personal & Box Storage", href: "#properties" },
      { label: "Pay-Per-Day Pricing", href: "#about" },
    ],
  },
  {
    title: "For Space Hosts",
    links: [
      { label: "List Your Space", href: "#join" },
      { label: "Warehouse & Industrial Partners", href: "#join" },
      { label: "Shoplot & Retail Backrooms", href: "#join" },
      { label: "Residential Spare Rooms", href: "#join" },
      { label: "Host Protection & Coverage", href: "#about" },
    ],
  },
  {
    title: "Top Hubs in Malaysia",
    links: [
      { label: "George Town, Penang", href: "#properties" },
      { label: "Bayan Lepas & Seberang Perai", href: "#properties" },
      { label: "Kuala Lumpur & PJ", href: "#properties" },
      { label: "Shah Alam, Selangor", href: "#properties" },
      { label: "Johor Bahru, Johor", href: "#properties" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Why Packrat", href: "#about" },
      { label: "Trust & 24/7 Security", href: "#about" },
      { label: "Help Center & FAQs", href: "#contact" },
      { label: "Contact Support", href: "#contact" },
    ],
  },
]

export function Footer() {
  return (
    <footer
      id="contact"
      className="bg-background border-t border-zinc-200/80 dark:border-zinc-800"
    >
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 sm:pt-20 lg:px-8">
        {/* Top Social Proof Headline & Logo Wall */}
        <div className="mx-auto mb-16 flex max-w-4xl flex-col items-center border-b border-zinc-200/80 pb-16 text-center sm:mb-20 sm:pb-20 dark:border-zinc-800">
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

        {/* Main Footer Navigation Grid */}
        <div className="grid grid-cols-2 gap-8 pb-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand Column (Spans 2 columns on large screens) */}
          <div className="col-span-2 flex flex-col justify-between pr-4">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-zinc-950 transition-opacity hover:opacity-90 dark:text-white"
              >
                <Image
                  src={logoPackrat}
                  alt="Packrat logo"
                  width={34}
                  height={34}
                  className="size-8.5 object-contain"
                />
                <span className="text-lg font-bold tracking-tight">
                  Packrat
                </span>
              </Link>

              <p className="mt-3.5 max-w-xs text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                On-demand microwarehousing and peer-to-peer storage across
                Malaysia. Book verified spare rooms, shoplots, and pallet bays
                for days, not leases.
              </p>
            </div>

            {/* Contact & Operational Badges */}
            <div className="mt-6 flex flex-col gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <div className="inline-flex items-center gap-2">
                <MapPin className="size-3.5 text-lime-600 dark:text-lime-400" />
                <span>George Town, Penang, Malaysia</span>
              </div>
              <a
                href="mailto:hello@packrat.my"
                className="inline-flex items-center gap-2 transition-colors hover:text-zinc-900 dark:hover:text-white"
              >
                <Mail className="size-3.5 text-lime-600 dark:text-lime-400" />
                <span>hello@packrat.my</span>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col">
              <h3 className="text-xs font-semibold tracking-wider text-zinc-950 uppercase dark:text-white">
                {section.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-lime-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Copyright, Trust Pill & Locale */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-200/80 pt-6 text-xs text-zinc-500 sm:flex-row dark:border-zinc-800 dark:text-zinc-400">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-start">
            <p>© {new Date().getFullYear()} Packrat. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link
                href="#privacy"
                className="transition-colors hover:text-zinc-900 dark:hover:text-white"
              >
                Privacy
              </Link>
              <Link
                href="#terms"
                className="transition-colors hover:text-zinc-900 dark:hover:text-white"
              >
                Terms
              </Link>
              <Link
                href="#security"
                className="transition-colors hover:text-zinc-900 dark:hover:text-white"
              >
                Host Guarantee
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white px-3 py-1 text-[11px] font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <ShieldCheck className="size-3.5 text-lime-600 dark:text-lime-400" />
              <span>Verified Hubs</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white px-3 py-1 text-[11px] font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <Globe className="size-3.5 text-zinc-400" />
              <span>MY • RM (MYR)</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
