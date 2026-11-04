import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Globe, Mail, MapPin, ShieldCheck } from "lucide-react"

import logoPackrat from "@/app/assets/logo-packrat.png"

const footerSections = [
  {
    title: "For Renters & SMEs",
    links: [
      { label: "Explore Storage", href: "/explore" },
      { label: "SME Pallet & Fulfillment Bays", href: "/explore?category=warehouse" },
      { label: "Shoplot Micro-Hubs", href: "/explore?category=shoplot" },
      { label: "Personal & Box Storage", href: "/explore?category=residential" },
      { label: "Box & Pallet Space Estimator", href: "/explore?estimator=open" },
    ],
  },
  {
    title: "Renter Portal",
    links: [
      { label: "My Active Bookings", href: "/dashboard" },
      { label: "24/7 Digital Access Passes", href: "/dashboard" },
      { label: "Lalamove Pickup Checkout", href: "/checkout" },
      { label: "Zero Lock-In Guarantee", href: "/#about" },
      { label: "RM 50k Inventory Shield", href: "/#about" },
    ],
  },
  {
    title: "Top Hubs in Malaysia",
    links: [
      { label: "George Town, Penang", href: "/explore?location=George+Town%2C+Penang" },
      { label: "Bayan Lepas & FTZ", href: "/explore?location=Bayan+Lepas%2C+Penang" },
      { label: "Butterworth & BM", href: "/explore?location=Butterworth+%26+Bukit+Mertajam" },
      { label: "Kuala Lumpur & PJ", href: "/explore?location=Kuala+Lumpur+%26+PJ" },
      { label: "Johor Bahru, Johor", href: "/explore?location=Johor+Bahru%2C+Johor" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Why Packrat", href: "/#about" },
      { label: "Trust & 24/7 Security", href: "/#about" },
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
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-16 lg:px-8">
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
            <p>© 2026 Packrat. All rights reserved.</p>
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
