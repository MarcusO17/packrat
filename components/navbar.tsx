"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, KeyRound, Menu } from "lucide-react"

import logoPackrat from "@/app/assets/logo-packrat.png"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Explore Spaces", href: "/explore" },
  { title: "Space Estimator", href: "/explore?estimator=open" },
  { title: "My Bookings", href: "/dashboard" },
]

function DesktopNavLinks() {
  const pathname = usePathname()

  return (
    <nav className="hidden h-full items-center gap-8 md:flex">
      {navLinks.map((link) => {
        const baseHref = link.href.split("?")[0]
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : link.href.includes("estimator")
              ? false
              : pathname.startsWith(baseHref)
        return (
          <Link
            key={link.title}
            href={link.href}
            className={cn(
              "relative flex h-full items-center text-sm font-medium transition-colors",
              isActive
                ? "text-zinc-950 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            )}
          >
            {link.title}
            {isActive && (
              <span className="bg-primary absolute inset-x-0 bottom-0 h-0.5 rounded-full" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

function MobileNavLinks({ onSelect }: { onSelect: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {navLinks.map((link) => {
        const baseHref = link.href.split("?")[0]
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : link.href.includes("estimator")
              ? false
              : pathname.startsWith(baseHref)
        return (
          <Link
            key={link.title}
            href={link.href}
            onClick={onSelect}
            className={cn(
              "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/15 text-zinc-950 font-semibold dark:text-lime-400"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            )}
          >
            {link.title}
          </Link>
        )
      })}
    </>
  )
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b border-zinc-200/70 backdrop-blur-md dark:border-zinc-800">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-zinc-950 transition-opacity hover:opacity-90 dark:text-white"
        >
          <Image
            src={logoPackrat}
            alt="Packrat logo"
            width={34}
            height={34}
            priority
            className="size-8 object-contain sm:size-8.5"
          />
          <span className="text-base font-bold tracking-tight sm:text-lg">
            Packrat
          </span>
        </Link>

        {/* Center: Navigation Links wrapped in Suspense for Cache Components */}
        <React.Suspense
          fallback={
            <nav className="hidden h-full items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="relative flex h-full items-center text-sm font-medium text-zinc-500 transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          }
        >
          <DesktopNavLinks />
        </React.Suspense>

        {/* Right: Theme Toggle, Renter Actions & Mobile Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <ThemeToggle />

          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden h-9 gap-1.5 rounded-full border-zinc-200 px-4 text-xs font-semibold text-zinc-800 shadow-none hover:bg-zinc-100 sm:inline-flex dark:border-zinc-800 dark:text-zinc-200"
          >
            <Link href="/dashboard">
              <KeyRound className="size-3.5 text-lime-600 dark:text-lime-400" />
              <span>Renter Portal</span>
            </Link>
          </Button>

          <Button
            size="sm"
            asChild
            className="h-8 gap-1 rounded-full px-3.5 text-xs font-semibold shadow-none sm:h-9 sm:px-5"
          >
            <Link href="/explore">
              <span>Book Space</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </Button>

          {/* Mobile Drawer Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[82vw] max-w-xs p-5">
              <SheetHeader className="p-0 text-left">
                <SheetTitle className="flex items-center gap-2">
                  <Image
                    src={logoPackrat}
                    alt="Packrat logo"
                    width={28}
                    height={28}
                    className="size-7 object-contain"
                  />
                  <span className="font-bold tracking-tight">Packrat</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1.5">
                <React.Suspense fallback={null}>
                  <MobileNavLinks onSelect={() => setMobileMenuOpen(false)} />
                </React.Suspense>
                <div className="mt-4 flex flex-col gap-2.5 border-t border-zinc-200/80 pt-4 dark:border-zinc-800">
                  <Button
                    variant="outline"
                    asChild
                    className="h-10 w-full gap-1.5 rounded-full text-xs font-semibold"
                  >
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <KeyRound className="size-3.5 text-lime-600 dark:text-lime-400" />
                      <span>Renter Portal & Digital Passes</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="h-10 w-full gap-1 rounded-full text-xs font-bold"
                  >
                    <Link
                      href="/explore"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>Explore & Book Space</span>
                      <ChevronRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
