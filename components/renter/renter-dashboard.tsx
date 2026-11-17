"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  CalendarClock,
  Check,
  ChevronRight,
  Copy,
  Download,
  FileText,
  LogOut,
  MapPin,
  Plus,
  QrCode,
  Receipt,
  RefreshCw,
  Share2,
  Warehouse,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  INITIAL_RENTER_BOOKINGS,
  getStoredBookings,
  saveStoredBookings,
  type RenterBooking,
} from "@/lib/spaces-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

function downloadTextDocument(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function RenterDashboard() {
  const [bookings, setBookings] = React.useState<RenterBooking[]>(
    INITIAL_RENTER_BOOKINGS
  )

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setBookings(getStoredBookings()))
    return () => cancelAnimationFrame(frame)
  }, [])
  const [activeTab, setActiveTab] = React.useState<"active" | "past">("active")
  const [scalingBookingId, setScalingBookingId] = React.useState<string | null>(
    null
  )
  const [tempSqFt, setTempSqFt] = React.useState<number>(350)
  const [passModalBookingId, setPassModalBookingId] = React.useState<
    string | null
  >(null)
  const [copiedPinId, setCopiedPinId] = React.useState<string | null>(null)
  const [driverPassGeneratedId, setDriverPassGeneratedId] = React.useState<
    string | null
  >(null)
  const [detailsBookingId, setDetailsBookingId] = React.useState<string | null>(
    null
  )
  const [detailsView, setDetailsView] = React.useState<
    "order" | "receipt" | "contract"
  >("order")
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const activeBookings = bookings.filter(
    (b) => b.status === "active" || b.status === "upcoming"
  )
  const completedBookings = bookings.filter((b) => b.status === "completed")
  const detailsBooking =
    bookings.find((b) => b.id === detailsBookingId) ?? null

  const totalDailyBurn = activeBookings.reduce(
    (sum, b) => sum + b.pricePerDay,
    0
  )

  const openDetails = (
    bookingId: string,
    view: "order" | "receipt" | "contract" = "order"
  ) => {
    setDetailsBookingId(bookingId)
    setDetailsView(view)
  }

  const handleScaleSqFt = (bookingId: string, newSqFt: number) => {
    const updated = bookings.map((b) => {
      if (b.id !== bookingId) return b
      const ratio = newSqFt / b.sqFtBooked
      const newDaily = Math.max(8, Math.round(b.pricePerDay * ratio))
      const remainingDays = Math.max(1, b.durationDays - b.daysElapsed)
      const newTotal =
        b.daysElapsed * b.pricePerDay +
        remainingDays * newDaily +
        b.logisticsCost
      return {
        ...b,
        sqFtBooked: newSqFt,
        pricePerDay: newDaily,
        totalPrice: newTotal,
      }
    })
    setBookings(updated)
    saveStoredBookings(updated)
    setScalingBookingId(null)
    showToast(`Updated booking #${bookingId} to ${newSqFt} sq.ft.`)
  }

  const handleExtendDays = (bookingId: string, extraDays: number) => {
    const updated = bookings.map((b) => {
      if (b.id !== bookingId) return b
      const nextDuration = Math.max(b.daysElapsed + 1, b.durationDays + extraDays)
      const end = new Date(b.startDate)
      end.setDate(end.getDate() + nextDuration)
      return {
        ...b,
        durationDays: nextDuration,
        endDate: end.toISOString().split("T")[0],
        totalPrice: nextDuration * b.pricePerDay + b.logisticsCost,
      }
    })
    setBookings(updated)
    saveStoredBookings(updated)
    showToast(`Extended booking #${bookingId} by +${extraDays} days.`)
  }

  const handleCompleteMoveOut = (bookingId: string) => {
    const updated = bookings.map((b) =>
      b.id === bookingId
        ? { ...b, status: "completed" as const, accessPin: "Expired" }
        : b
    )
    setBookings(updated)
    saveStoredBookings(updated)
    setScalingBookingId(null)
    if (passModalBookingId === bookingId) setPassModalBookingId(null)
    showToast(
      `Ended booking #${bookingId}. Any unused days will be refunded.`
    )
  }

  const handleDownloadReceipt = (booking: RenterBooking) => {
    const storageSubtotal = Math.max(
      0,
      booking.totalPrice - booking.logisticsCost
    )
    const content = [
      `PACKRAT STORAGE RECEIPT`,
      `Invoice: INV-${booking.id}`,
      `Booking Ref: #${booking.id}`,
      `Issued: ${booking.createdAt}`,
      `----------------------------------------`,
      `Space: ${booking.spaceTitle}`,
      `Address: ${booking.address}`,
      `Bay: ${booking.bayAssignment}`,
      `Dates: ${booking.startDate} -> ${booking.endDate} (${booking.durationDays} days)`,
      `Footprint: ${booking.sqFtBooked} sq.ft`,
      `----------------------------------------`,
      `Storage (${booking.sqFtBooked} sq.ft @ RM ${booking.pricePerDay}/day): RM ${storageSubtotal}`,
      `Logistics / Move-in Pickup: RM ${booking.logisticsCost}`,
      `Security Deposit: RM 0`,
      `TOTAL: RM ${booking.totalPrice}`,
      `Billing Mode: ${booking.billingMode === "daily-auto" ? "Daily auto-bill" : "Paid upfront"}`,
    ].join("\n")

    downloadTextDocument(`packrat-receipt-INV-${booking.id}.txt`, content)
    showToast(`Downloaded receipt INV-${booking.id}.`)
  }

  const handleDownloadContract = (booking: RenterBooking) => {
    const content = [
      `PACKRAT FLEXIBLE STORAGE AGREEMENT`,
      `Agreement ID: AGR-${booking.id}`,
      `Booking Ref: #${booking.id}`,
      `Signed Date: ${booking.createdAt}`,
      `----------------------------------------`,
      `1. PARTIES`,
      `Renter: Verified Packrat Account`,
      `Host Space: ${booking.spaceTitle} (${booking.spaceCategory})`,
      ``,
      `2. SPACE & BAY ALLOCATION`,
      `Location: ${booking.address}`,
      `Allocated Bay: ${booking.bayAssignment}`,
      `Allocated Size: ${booking.sqFtBooked} sq.ft`,
      `Term: ${booking.startDate} to ${booking.endDate} (${booking.durationDays} days)`,
      ``,
      `3. RATE & PRO-RATED ADJUSTMENTS`,
      `Daily Rate: RM ${booking.pricePerDay} / day (RM 0 security deposit).`,
      `Allocated square footage and stay duration may be adjusted anytime with pro-rated daily billing.`,
      ``,
      `4. ZERO LOCK-IN & REFUND POLICY`,
      `0-day lock-in. Renter may end the booking early on any day with 100% of unused days refunded automatically.`,
      `----------------------------------------`,
      `Digitally accepted via Packrat Checkout on ${booking.createdAt}.`,
    ].join("\n")

    downloadTextDocument(`packrat-contract-AGR-${booking.id}.txt`, content)
    showToast(`Downloaded contract AGR-${booking.id}.`)
  }

  return (
    <div className="bg-background flex-1 pb-20">
      {/* Header */}
      <div className="border-b border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
                My Bookings
              </h1>
              <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
                Manage your active and upcoming storage stays.
              </p>
            </div>

            <div className="order-3 flex w-full items-center justify-between gap-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/80 px-3.5 py-2 sm:order-2 sm:ml-auto sm:w-auto sm:justify-start dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <CalendarClock className="size-4 shrink-0 text-lime-600 dark:text-lime-400" />
                <p className="text-[10px] font-medium text-zinc-500 uppercase sm:hidden dark:text-zinc-400">
                  Current Daily Rate
                </p>
              </div>
              <div className="text-right sm:text-left">
                <p className="hidden text-[10px] font-medium text-zinc-500 uppercase sm:block dark:text-zinc-400">
                  Current Daily Rate
                </p>
                <p className="font-mono text-sm font-bold text-zinc-950 dark:text-white">
                  RM {totalDailyBurn} / day
                  <span className="ml-1.5 font-sans text-[11px] font-normal text-zinc-500 dark:text-zinc-400">
                    • {activeBookings.length}{" "}
                    {activeBookings.length === 1 ? "booking" : "bookings"}
                  </span>
                </p>
              </div>
            </div>

            <Button
              size="sm"
              asChild
              className="order-2 h-9 shrink-0 gap-1.5 rounded-full px-4 text-xs font-semibold sm:order-3 sm:h-10 sm:px-5"
            >
              <Link href="/explore">
                <Plus className="size-3.5" />
                <span>Book a Space</span>
              </Link>
            </Button>
          </div>

          {/* 2-Tab Switcher */}
          <div className="mt-5 grid w-full grid-cols-2 gap-1.5 rounded-full bg-zinc-100 p-1 sm:mt-6 sm:inline-flex sm:w-auto sm:gap-2 sm:bg-transparent sm:p-0 dark:bg-zinc-800/80 sm:dark:bg-transparent">
            <button
              type="button"
              onClick={() => setActiveTab("active")}
              className={cn(
                "rounded-full px-3 py-2 text-center text-xs font-semibold whitespace-nowrap transition-all sm:px-4",
                activeTab === "active"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-950 sm:bg-zinc-100 sm:hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:text-white sm:dark:bg-zinc-800/80"
              )}
            >
              Active &amp; Upcoming ({activeBookings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("past")}
              className={cn(
                "rounded-full px-3 py-2 text-center text-xs font-semibold whitespace-nowrap transition-all sm:px-4",
                activeTab === "past"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-950 sm:bg-zinc-100 sm:hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:text-white sm:dark:bg-zinc-800/80"
              )}
            >
              Past ({completedBookings.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto mt-7 max-w-5xl px-4 sm:px-6 lg:px-8">
        {toastMessage && (
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-lime-500/40 bg-lime-50 px-4 py-3 text-xs font-semibold text-lime-950 shadow-2xs dark:bg-lime-950/50 dark:text-lime-200">
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-[11px] underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Active & Upcoming Tab */}
        {activeTab === "active" && (
          <div className="flex flex-col gap-4">
            {activeBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <Warehouse className="size-10 text-lime-600 dark:text-lime-400" />
                <h2 className="mt-3 text-base font-bold text-zinc-950 dark:text-white">
                  No active bookings yet
                </h2>
                <p className="mt-1 max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
                  Book verified warehouse bays, shoplots, or spare rooms by the
                  day with zero lease lock-in.
                </p>
                <Button
                  asChild
                  className="mt-4 rounded-full px-5 text-xs font-semibold"
                >
                  <Link href="/explore">Explore Spaces</Link>
                </Button>
              </div>
            ) : (
              activeBookings.map((booking) => {
                const isScaling = scalingBookingId === booking.id
                const isPassOpen = passModalBookingId === booking.id
                const progressPct = Math.min(
                  100,
                  Math.round((booking.daysElapsed / booking.durationDays) * 100)
                )

                return (
                  <div
                    key={booking.id}
                    className="overflow-hidden rounded-3xl border border-zinc-200/90 bg-white p-4 shadow-2xs sm:p-5 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    {/* Top Info Row */}
                    <div className="flex flex-col gap-3.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      {/* Left: Thumbnail + Space Details */}
                      <div className="grid min-w-0 flex-1 grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-x-3.5 gap-y-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-x-4 sm:gap-y-0">
                        <div className="size-18 overflow-hidden rounded-2xl bg-zinc-100 sm:row-span-2 sm:h-28 sm:w-40 dark:bg-zinc-800">
                          <img
                            src={booking.image}
                            alt={booking.spaceTitle}
                            className="size-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
                            <Badge
                              className={cn(
                                "rounded-full border-0 px-2.5 py-0.5 text-[10px] font-bold",
                                booking.status === "active"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-zinc-900 text-white dark:bg-zinc-700"
                              )}
                            >
                              {booking.status === "active"
                                ? "Active"
                                : "Upcoming"}
                            </Badge>
                            <span className="font-semibold text-lime-700 dark:text-lime-400">
                              {booking.spaceCategory}
                            </span>
                            <span className="hidden text-zinc-300 sm:inline dark:text-zinc-700">
                              •
                            </span>
                            <span className="hidden font-mono text-zinc-400 sm:inline">
                              #{booking.id}
                            </span>
                          </div>

                          <Link
                            href={`/spaces/${booking.spaceId}`}
                            className="mt-1 inline-flex max-w-full items-center gap-1 text-sm font-bold text-zinc-950 hover:underline sm:mt-1.5 sm:text-base dark:text-white"
                          >
                            <span className="truncate">
                              {booking.spaceTitle}
                            </span>
                            <ArrowUpRight className="size-3.5 shrink-0 text-zinc-400" />
                          </Link>

                          <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                            <MapPin className="size-3 shrink-0" />
                            <span className="truncate">{booking.location}</span>
                          </p>
                        </div>

                        <div className="col-span-2 sm:col-span-1 sm:col-start-2 sm:mt-2.5">
                          <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                            <span>
                              {booking.startDate} → {booking.endDate}
                            </span>
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">
                              {booking.status === "active"
                                ? `Day ${booking.daysElapsed} of ${booking.durationDays}`
                                : `${booking.durationDays} days`}
                            </span>
                          </div>
                          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <div
                              className="bg-primary h-full rounded-full transition-all"
                              style={{
                                width: `${booking.status === "active" ? Math.max(8, progressPct) : 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Pricing & Footprint */}
                      <div className="flex items-baseline justify-between border-t border-zinc-100 pt-3 sm:shrink-0 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 sm:text-right dark:border-zinc-800/80">
                        <p className="font-mono text-lg font-bold text-zinc-950 sm:text-xl dark:text-white">
                          RM {booking.pricePerDay}
                          <span className="font-sans text-xs font-normal text-zinc-500">
                            {" "}
                            / day
                          </span>
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                          {booking.sqFtBooked} sq.ft • RM{" "}
                          {booking.totalPrice.toLocaleString()} total
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action Footer Bar */}
                    <div className="mt-3.5 grid grid-cols-3 gap-2 border-t border-zinc-100 pt-3.5 sm:mt-4 sm:flex sm:items-center sm:justify-between dark:border-zinc-800/80">
                      <div className="contents sm:flex sm:items-center sm:gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openDetails(booking.id, "order")}
                          className="h-8 gap-1.5 rounded-full px-2.5 text-xs font-semibold sm:px-3.5"
                        >
                          <Receipt className="size-3.5 shrink-0" />
                          <span className="sm:hidden">Details</span>
                          <span className="hidden sm:inline">
                            Order &amp; Receipt
                          </span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (isScaling) {
                              setScalingBookingId(null)
                            } else {
                              setScalingBookingId(booking.id)
                              setTempSqFt(booking.sqFtBooked)
                            }
                          }}
                          className="h-8 gap-1.5 rounded-full px-2.5 text-xs font-semibold sm:px-3.5"
                        >
                          <RefreshCw className="size-3 shrink-0" />
                          <span>Adjust</span>
                        </Button>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant={isPassOpen ? "secondary" : "default"}
                        onClick={() =>
                          setPassModalBookingId(isPassOpen ? null : booking.id)
                        }
                        className="h-8 gap-1.5 rounded-full px-2.5 text-xs font-semibold sm:px-4"
                      >
                        <QrCode className="size-3.5 shrink-0" />
                        <span>{isPassOpen ? "Hide QR" : "QR Pass"}</span>
                      </Button>
                    </div>

                    {/* Expandable QR Pass & Lalamove Driver Share Drawer */}
                    {isPassOpen && (
                      <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-white sm:p-5">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                          <div className="flex items-center gap-3.5 sm:gap-4">
                            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 text-zinc-950 sm:size-20 sm:p-2">
                              <QrCode className="size-12 sm:size-16" />
                            </div>
                            <div className="min-w-0">
                              <Badge className="bg-primary text-primary-foreground rounded-full border-0 text-[10px] font-bold">
                                24/7 Smart Access Pass
                              </Badge>
                              <h4 className="mt-1.5 truncate text-sm font-bold text-white">
                                {booking.bayAssignment}
                              </h4>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-300">
                                <span>
                                  PIN:{" "}
                                  <span className="font-mono font-bold text-lime-400">
                                    {booking.accessPin}
                                  </span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard?.writeText(
                                      booking.accessPin
                                    )
                                    setCopiedPinId(booking.id)
                                    setTimeout(
                                      () => setCopiedPinId(null),
                                      2000
                                    )
                                  }}
                                  className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-lime-300 transition-colors hover:bg-white/15"
                                >
                                  {copiedPinId === booking.id ? (
                                    <>
                                      <Check className="size-3" />
                                      <span>Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="size-3" />
                                      <span>Copy PIN</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              setDriverPassGeneratedId(booking.id)
                              showToast(
                                `Generated 4-hour Lalamove driver pass (PIN: 992-104) for #${booking.id}.`
                              )
                            }}
                            className="w-full shrink-0 gap-1.5 rounded-full px-4 text-xs font-semibold sm:w-auto"
                          >
                            <Share2 className="size-3.5" />
                            <span>
                              {driverPassGeneratedId === booking.id
                                ? "Driver Pass Active (992-104)"
                                : "Share Lalamove Driver Pass"}
                            </span>
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Inline Adjust Panel */}
                    {isScaling && (
                      <div className="mt-4 rounded-2xl border border-lime-500/35 bg-lime-50/40 p-4 dark:border-lime-500/25 dark:bg-lime-950/15">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          {/* Allocated Sq.Ft Slider */}
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-zinc-950 dark:text-white">
                                Space size
                              </span>
                              <span className="font-mono text-sm font-bold text-lime-700 dark:text-lime-400">
                                {tempSqFt} sq.ft
                              </span>
                            </div>
                            <Slider
                              value={[tempSqFt]}
                              min={50}
                              max={1200}
                              step={25}
                              onValueChange={(val) =>
                                setTempSqFt(val[0] ?? booking.sqFtBooked)
                              }
                              className="my-3.5"
                            />
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                Current: {booking.sqFtBooked} sq.ft
                              </span>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  handleScaleSqFt(booking.id, tempSqFt)
                                }
                                className="h-8 rounded-full px-4 text-xs font-semibold"
                              >
                                Save {tempSqFt} sq.ft
                              </Button>
                            </div>
                          </div>

                          {/* Quick Duration Controls */}
                          <div className="flex flex-col justify-between border-t border-lime-500/20 pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-5">
                            <div>
                              <span className="text-xs font-bold text-zinc-950 dark:text-white">
                                Stay duration
                              </span>
                              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                Extend your booking or end early with no exit
                                penalty.
                              </p>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleExtendDays(booking.id, 7)}
                                className="h-8 rounded-full text-xs font-semibold"
                              >
                                +7 days
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleExtendDays(booking.id, 14)}
                                className="h-8 rounded-full text-xs font-semibold"
                              >
                                +14 days
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleCompleteMoveOut(booking.id)
                                }
                                className="h-8 gap-1.5 rounded-full border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400"
                              >
                                <LogOut className="size-3.5" />
                                <span>End booking</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Past Tab */}
        {activeTab === "past" && (
          <div className="flex flex-col gap-3">
            {completedBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <Warehouse className="size-10 text-lime-600 dark:text-lime-400" />
                <h2 className="mt-3 text-base font-bold text-zinc-950 dark:text-white">
                  No past bookings
                </h2>
                <p className="mt-1 max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
                  Completed storage stays will show up here for easy rebooking.
                </p>
              </div>
            ) : (
              completedBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col justify-between gap-4 rounded-3xl border border-zinc-200/80 bg-white p-4 sm:flex-row sm:items-center sm:p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={booking.image}
                      alt={booking.spaceTitle}
                      className="size-16 shrink-0 rounded-2xl object-cover opacity-85"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                        <span className="font-mono">#{booking.id}</span>
                        <span>•</span>
                        <span>{booking.location}</span>
                      </div>
                      <h3 className="mt-0.5 truncate text-sm font-bold text-zinc-950 dark:text-white">
                        {booking.spaceTitle}
                      </h3>
                      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        {booking.sqFtBooked} sq.ft • {booking.startDate} →{" "}
                        {booking.endDate} • RM {booking.totalPrice}
                      </p>
                    </div>
                  </div>

                  <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openDetails(booking.id, "order")}
                      className="h-8 gap-1.5 rounded-full px-3 text-xs font-semibold sm:px-3.5"
                    >
                      <Receipt className="size-3.5 shrink-0" />
                      <span className="sm:hidden">Details</span>
                      <span className="hidden sm:inline">
                        Order &amp; Receipt
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-8 shrink-0 rounded-full px-3 text-xs font-semibold sm:px-3.5"
                    >
                      <Link
                        href={`/spaces/${booking.spaceId}?sqft=${booking.sqFtBooked}`}
                      >
                        <span>Book again</span>
                        <ChevronRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Order Details, Receipt & Contract Sheet */}
      <Sheet
        open={Boolean(detailsBooking)}
        onOpenChange={(open) => {
          if (!open) setDetailsBookingId(null)
        }}
      >
        <SheetContent
          side="right"
          className="w-full gap-0 overflow-y-auto sm:max-w-lg"
        >
          {detailsBooking && (
            <>
              <SheetHeader className="border-b border-zinc-200/80 pb-4 text-left dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      "rounded-full border-0 px-2.5 py-0.5 text-[10px] font-bold uppercase",
                      detailsBooking.status === "active"
                        ? "bg-primary text-primary-foreground"
                        : detailsBooking.status === "upcoming"
                          ? "bg-zinc-900 text-white dark:bg-zinc-700"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    )}
                  >
                    {detailsBooking.status}
                  </Badge>
                  <span className="font-mono text-xs text-zinc-400">
                    Booked {detailsBooking.createdAt}
                  </span>
                </div>
                <SheetTitle className="mt-1 text-lg font-bold">
                  Booking #{detailsBooking.id}
                </SheetTitle>
                <SheetDescription className="text-xs">
                  {detailsBooking.spaceTitle} • {detailsBooking.location}
                </SheetDescription>

                {/* 3-Pill View Switcher */}
                <div className="mt-3 grid grid-cols-3 gap-1 rounded-2xl border border-zinc-200/80 bg-zinc-100/80 p-1 dark:border-zinc-800 dark:bg-zinc-900">
                  {[
                    {
                      id: "order",
                      label: "Order Details",
                      mobileLabel: "Details",
                      icon: FileText,
                    },
                    {
                      id: "receipt",
                      label: "Receipt",
                      mobileLabel: "Receipt",
                      icon: Receipt,
                    },
                    {
                      id: "contract",
                      label: "Contract",
                      mobileLabel: "Contract",
                      icon: FileText,
                    },
                  ].map((item) => {
                    const Icon = item.icon
                    const active = detailsView === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setDetailsView(
                            item.id as "order" | "receipt" | "contract"
                          )
                        }
                        className={cn(
                          "flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all",
                          active
                            ? "bg-white text-zinc-950 shadow-2xs dark:bg-zinc-800 dark:text-white"
                            : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                        )}
                      >
                        <Icon className="size-3.5 shrink-0" />
                        <span className="sm:hidden">{item.mobileLabel}</span>
                        <span className="hidden sm:inline">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-5 p-4 sm:p-5">
                {detailsView === "order" && (
                  <div className="flex flex-col gap-4">
                    <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                      <p className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                        Storage Location
                      </p>
                      <Link
                        href={`/spaces/${detailsBooking.spaceId}`}
                        className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-zinc-950 hover:underline dark:text-white"
                      >
                        <span>{detailsBooking.spaceTitle}</span>
                        <ArrowUpRight className="size-3.5 text-zinc-400" />
                      </Link>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {detailsBooking.address}
                      </p>
                    </div>

                    <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200/80 bg-white text-xs dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-zinc-500 dark:text-zinc-400">
                          Booking Ref
                        </span>
                        <span className="font-mono font-bold text-zinc-950 dark:text-white">
                          #{detailsBooking.id}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-zinc-500 dark:text-zinc-400">
                          Bay Assignment
                        </span>
                        <span className="font-semibold text-zinc-950 dark:text-white">
                          {detailsBooking.bayAssignment}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-zinc-500 dark:text-zinc-400">
                          Access PIN
                        </span>
                        <span className="font-mono font-bold text-lime-700 dark:text-lime-400">
                          {detailsBooking.accessPin}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-zinc-500 dark:text-zinc-400">
                          Dates
                        </span>
                        <span className="font-medium text-zinc-950 dark:text-white">
                          {detailsBooking.startDate} → {detailsBooking.endDate}{" "}
                          ({detailsBooking.durationDays} days)
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-zinc-500 dark:text-zinc-400">
                          Footprint
                        </span>
                        <span className="font-mono font-semibold text-zinc-950 dark:text-white">
                          {detailsBooking.sqFtBooked} sq.ft
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 px-4 py-3">
                        <span className="shrink-0 text-zinc-500 dark:text-zinc-400">
                          Inventory
                        </span>
                        <span className="text-right font-medium text-zinc-950 dark:text-white">
                          {detailsBooking.inventoryType}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-zinc-500 dark:text-zinc-400">
                          Move-In Method
                        </span>
                        <span className="font-medium text-zinc-950 dark:text-white">
                          {detailsBooking.moveInMethod === "lalamove"
                            ? `Lalamove (${detailsBooking.lalamoveVehicle ?? "Van"})`
                            : "Self drop-off"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {detailsView === "receipt" && (
                  <div className="flex flex-col gap-4">
                    <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                            Official Receipt
                          </p>
                          <p className="mt-0.5 font-mono text-sm font-bold text-zinc-950 dark:text-white">
                            INV-{detailsBooking.id}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="rounded-full text-[10px] font-semibold"
                        >
                          {detailsBooking.billingMode === "daily-auto"
                            ? "Daily auto-bill"
                            : "Paid upfront"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Issued {detailsBooking.createdAt} •{" "}
                        {detailsBooking.spaceTitle}
                      </p>
                    </div>

                    <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200/80 bg-white text-xs dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
                      <div className="flex items-start justify-between gap-4 px-4 py-3">
                        <div>
                          <p className="font-semibold text-zinc-950 dark:text-white">
                            Storage allocation
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            {detailsBooking.sqFtBooked} sq.ft × RM{" "}
                            {detailsBooking.pricePerDay}/day ×{" "}
                            {detailsBooking.durationDays} days
                          </p>
                        </div>
                        <span className="font-mono font-bold text-zinc-950 dark:text-white">
                          RM{" "}
                          {Math.max(
                            0,
                            detailsBooking.totalPrice -
                              detailsBooking.logisticsCost
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-zinc-500 dark:text-zinc-400">
                          Logistics / move-in pickup
                        </span>
                        <span className="font-mono font-semibold text-zinc-950 dark:text-white">
                          RM {detailsBooking.logisticsCost}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-zinc-500 dark:text-zinc-400">
                          Security deposit
                        </span>
                        <span className="font-mono font-semibold text-lime-700 dark:text-lime-400">
                          RM 0
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-zinc-50/80 px-4 py-3.5 dark:bg-zinc-900/70">
                        <span className="text-sm font-bold text-zinc-950 dark:text-white">
                          Total
                        </span>
                        <span className="font-mono text-base font-bold text-zinc-950 dark:text-white">
                          RM {detailsBooking.totalPrice}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => handleDownloadReceipt(detailsBooking)}
                      className="h-10 w-full gap-2 rounded-full text-xs font-semibold"
                    >
                      <Download className="size-4" />
                      <span>Download / Print Receipt</span>
                    </Button>
                  </div>
                )}

                {detailsView === "contract" && (
                  <div className="flex flex-col gap-4">
                    <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                      <p className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                        Storage Agreement
                      </p>
                      <p className="mt-0.5 font-mono text-sm font-bold text-zinc-950 dark:text-white">
                        AGR-{detailsBooking.id}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Digitally accepted on {detailsBooking.createdAt}
                      </p>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-zinc-200/80 bg-white p-4 text-xs leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                      <div>
                        <p className="font-bold text-zinc-950 dark:text-white">
                          1. Parties
                        </p>
                        <p className="mt-0.5">
                          Between Renter (Verified Packrat Account) and Host
                          Space Partner ({detailsBooking.spaceTitle}).
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-zinc-950 dark:text-white">
                          2. Space &amp; Bay Allocation
                        </p>
                        <p className="mt-0.5">
                          {detailsBooking.sqFtBooked} sq.ft at{" "}
                          {detailsBooking.bayAssignment},{" "}
                          {detailsBooking.address} ({detailsBooking.startDate}{" "}
                          to {detailsBooking.endDate}).
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-zinc-950 dark:text-white">
                          3. Daily Rate &amp; Pro-Rated Adjustments
                        </p>
                        <p className="mt-0.5">
                          RM {detailsBooking.pricePerDay} per day with RM 0
                          security deposit. Space size and duration can be
                          adjusted anytime on a pro-rated daily basis.
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-zinc-950 dark:text-white">
                          4. Zero Lock-In &amp; Early Move-Out Policy
                        </p>
                        <p className="mt-0.5">
                          0-day minimum lock-in. Ending a booking early triggers
                          a 100% refund of unused days.
                        </p>
                      </div>
                      <div className="border-t border-zinc-100 pt-3 text-[11px] text-zinc-400 dark:border-zinc-800">
                        Digital signature timestamp: {detailsBooking.createdAt}{" "}
                        • Ref #{detailsBooking.id}
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => handleDownloadContract(detailsBooking)}
                      className="h-10 w-full gap-2 rounded-full text-xs font-semibold"
                    >
                      <Download className="size-4" />
                      <span>Download Contract</span>
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
