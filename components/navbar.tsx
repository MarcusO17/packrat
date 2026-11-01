"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, ChevronRight, Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Properties", href: "#properties" },
  { title: "About", href: "#about" },
  { title: "Contact", href: "#contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/70 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-zinc-950 transition-opacity hover:opacity-90 dark:text-white"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
            <Building2 className="size-4.5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Packrat</span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden h-full items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname === link.href
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
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-zinc-950 dark:bg-white" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right: Auth Actions & Mobile Trigger */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden h-9 rounded-full border-zinc-200 px-5 text-xs font-semibold text-zinc-800 shadow-none hover:bg-zinc-100 sm:inline-flex dark:border-zinc-800 dark:text-zinc-200"
          >
            <Link href="#login">Login</Link>
          </Button>

          <Button
            size="sm"
            asChild
            className="hidden h-9 gap-1 rounded-full bg-zinc-950 px-5 text-xs font-semibold text-white shadow-none hover:bg-zinc-800 sm:inline-flex dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            <Link href="#join">
              <span>Join Now</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </Button>

          {/* Mobile Drawer Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                    <Building2 className="size-4" />
                  </div>
                  <span className="font-bold tracking-tight">Packrat</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1 px-2">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname === link.href
                  return (
                    <Link
                      key={link.title}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-white"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                      )}
                    >
                      {link.title}
                    </Link>
                  )
                })}
                <div className="mt-4 flex flex-col gap-2 pt-2">
                  <Button
                    variant="outline"
                    asChild
                    className="h-9 w-full rounded-full"
                  >
                    <Link
                      href="#login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="h-9 w-full gap-1 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950"
                  >
                    <Link
                      href="#join"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>Join Now</span>
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
