"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowUpRight,
  Box,
  CalendarClock,
  Check,
  ChevronRight,
  Copy,
  KeyRound,
  LogOut,
  MapPin,
  Maximize2,
  Plus,
  QrCode,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkles,
  Truck,
  Warehouse,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  getStoredBookings,
  saveStoredBookings,
  type RenterBooking,
} from "@/lib/spaces-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { SpaceEstimatorContent } from "@/components/renter/space-estimator-modal"

export function RenterDashboard() {
  const router = useRouter()
  const [bookings, setBookings] = React.useState<RenterBooking[]>(() =>
    getStoredBookings()
  )
  const [activeTab, setActiveTab] = React.useState<
    "active" | "passes" | "estimator" | "past"
  >("active")

  // Interactive inline action states per booking
  const [scalingBookingId, setScalingBookingId] = React.useState<
    string | null
  >(null)
  const [tempSqFt, setTempSqFt] = React.useState<number>(350)
  const [passModalBookingId, setPassModalBookingId] = React.useState<
    string | null
  >(null)
  const [copiedPinId, setCopiedPinId] = React.useState<string | null>(null)
  const [driverPassGeneratedId, setDriverPassGeneratedId] = React.useState<
    string | null
  >(null)
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const activeBookings = bookings.filter(
    (b) => b.status === "active" || b.status === "upcoming"
  )
  const completedBookings = bookings.filter((b) => b.status === "completed")

  const totalActiveSqFt = activeBookings.reduce(
    (sum, b) => sum + b.sqFtBooked,
    0
  )
  const totalDailyBurn = activeBookings.reduce(
    (sum, b) => sum + b.pricePerDay,
    0
  )

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
    showToast(
      `Updated booking #${bookingId} footprint to ${newSqFt} sq.ft (0 lock-in adjustment).`
    )
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
    showToast(
      extraDays > 0
        ? `Extended booking #${bookingId} by +${extraDays} days.`
        : `Shortened booking #${bookingId} with RM 0 early move-out penalty.`
    )
  }

  const handleCompleteMoveOut = (bookingId: string) => {
    const updated = bookings.map((b) =>
      b.id === bookingId
        ? { ...b, status: "completed" as const, accessPin: "Expired" }
        : b
    )
    setBookings(updated)
    saveStoredBookings(updated)
    showToast(
      `Move-out scheduled for #${bookingId}. Unused days refunded to your account.`
    )
  }

  return (
    <div className="bg-background flex-1 pb-20">
      {/* Top Renter Dashboard Header */}
      <div className="border-b border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-500/15 px-3 py-0.5 text-[11px] font-bold text-lime-800 dark:text-lime-300">
                  <span className="size-1.5 rounded-full bg-lime-500" />
                  Verified SME Renter Account
                </span>
                <span className="text-xs text-zinc-400">
                  Straits Goods Enterprise
                </span>
              </div>
              <h1 className="mt-2 text-xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
                My Storage Footprint & Access Passes
              </h1>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Scale square footage up or down, share Lalamove driver passes,
                or check out early any day with 0 lock-in.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("estimator")}
                className="h-9 flex-1 rounded-full px-3.5 text-xs font-semibold sm:flex-initial sm:px-4"
              >
                <Box className="size-3.5 text-lime-600 dark:text-lime-400" />
                <span>Space Estimator</span>
              </Button>
              <Button
                size="sm"
                asChild
                className="h-9 flex-1 gap-1.5 rounded-full px-4 text-xs font-bold sm:flex-initial sm:px-5"
              >
                <Link href="/explore">
                  <Plus className="size-3.5" />
                  <span>Book Another Space</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* 4 Renter KPI Summary Cards */}
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-7 sm:gap-3.5 lg:grid-cols-4">
            <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  Active Space Booked
                </span>
                <Maximize2 className="size-4 shrink-0 text-lime-600 dark:text-lime-400" />
              </div>
              <p className="mt-1.5 font-mono text-xl font-bold text-zinc-950 sm:mt-2 sm:text-2xl dark:text-white">
                {totalActiveSqFt.toLocaleString()}{" "}
                <span className="text-xs font-normal text-zinc-500">sq.ft</span>
              </p>
              <p className="mt-1 text-[11px] text-lime-700 dark:text-lime-400">
                Across {activeBookings.length} verified{" "}
                {activeBookings.length === 1 ? "hub" : "hubs"}
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  Current Daily Rate
                </span>
                <CalendarClock className="size-4 shrink-0 text-lime-600 dark:text-lime-400" />
              </div>
              <p className="mt-1.5 font-mono text-xl font-bold text-zinc-950 sm:mt-2 sm:text-2xl dark:text-white">
                RM {totalDailyBurn}{" "}
                <span className="text-xs font-normal text-zinc-500">/ day</span>
              </p>
              <p className="mt-1 text-[11px] text-zinc-500">
                0 Days Lock-in • Pro-rated daily
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  24/7 Smart Gate Passes
                </span>
                <KeyRound className="size-4 shrink-0 text-lime-600 dark:text-lime-400" />
              </div>
              <p className="mt-1.5 font-mono text-xl font-bold text-zinc-950 sm:mt-2 sm:text-2xl dark:text-white">
                {activeBookings.length} Active
              </p>
              <p className="mt-1 text-[11px] text-lime-700 dark:text-lime-400">
                QR & Temporary Driver PIN ready
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  Packrat Shield Coverage
                </span>
                <ShieldCheck className="size-4 shrink-0 text-lime-600 dark:text-lime-400" />
              </div>
              <p className="mt-1.5 font-mono text-xl font-bold text-zinc-950 sm:mt-2 sm:text-2xl dark:text-white">
                RM 50,000
              </p>
              <p className="mt-1 text-[11px] text-zinc-500">
                24/7 CCTV & Fire Protected
              </p>
            </div>
          </div>

          {/* Dashboard Sub-Navigation Tabs */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-7 [&::-webkit-scrollbar]:hidden">
            {[
              {
                id: "active",
                label: `Active & Upcoming (${activeBookings.length})`,
              },
              {
                id: "passes",
                label: "24/7 Digital Access Passes",
              },
              {
                id: "estimator",
                label: "Box & Pallet Estimator",
              },
              {
                id: "past",
                label: `Past Bookings (${completedBookings.length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTab(
                    tab.id as "active" | "passes" | "estimator" | "past"
                  )
                }
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-950 dark:bg-zinc-800/80 dark:text-zinc-400 dark:hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tab Body */}
      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Live Toast Notification Banner */}
        {toastMessage && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-lime-500/50 bg-lime-50 px-4 py-3 text-xs font-semibold text-lime-950 shadow-sm dark:bg-lime-950/50 dark:text-lime-200">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-lime-600 dark:text-lime-400" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-[11px] underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: ACTIVE & UPCOMING SPACES */}
        {activeTab === "active" && (
          <div className="flex flex-col gap-6">
            {activeBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <Warehouse className="size-10 text-lime-600 dark:text-lime-400" />
                <h3 className="mt-3 text-base font-bold text-zinc-950 dark:text-white">
                  No active storage bookings yet
                </h3>
                <p className="mt-1 max-w-sm text-xs text-zinc-500">
                  Book verified warehouse pallet bays, shoplots, or spare rooms
                  by the day with zero lease lock-in.
                </p>
                <Button
                  asChild
                  className="mt-4 rounded-full px-5 text-xs font-bold"
                >
                  <Link href="/explore">Explore Storage Spaces</Link>
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
                    className="overflow-hidden rounded-3xl border border-zinc-200/90 bg-white p-5 shadow-2xs sm:p-6 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                      {/* Left Image & Status */}
                      <div className="relative h-48 overflow-hidden rounded-2xl bg-zinc-100 lg:col-span-4 lg:h-auto">
                        <img
                          src={booking.image}
                          alt={booking.spaceTitle}
                          className="size-full object-cover"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <Badge className="bg-primary text-primary-foreground rounded-full border-0 px-2.5 py-0.5 text-[10px] font-bold">
                            {booking.status === "active"
                              ? `Active • Day ${booking.daysElapsed} of ${booking.durationDays}`
                              : "Upcoming Move-In"}
                          </Badge>
                        </div>
                        <div className="absolute inset-x-3 bottom-3 rounded-xl bg-black/70 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-xs">
                          Ref #{booking.id} • {booking.bayAssignment}
                        </div>
                      </div>

                      {/* Middle Details & Utilization */}
                      <div className="flex flex-col justify-between lg:col-span-5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-lime-700 dark:text-lime-400">
                              {booking.spaceCategory}
                            </span>
                            <span className="text-zinc-300 dark:text-zinc-700">
                              •
                            </span>
                            <span className="text-[11px] text-zinc-500">
                              {booking.inventoryType}
                            </span>
                          </div>

                          <Link
                            href={`/spaces/${booking.spaceId}`}
                            className="mt-1 inline-flex items-center gap-1 text-lg font-bold text-zinc-950 hover:underline dark:text-white"
                          >
                            <span>{booking.spaceTitle}</span>
                            <ArrowUpRight className="size-4 text-zinc-400" />
                          </Link>

                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                            <MapPin className="size-3.5 shrink-0 text-lime-600 dark:text-lime-400" />
                            <span>{booking.address}</span>
                          </p>

                          {/* Key Booking Metrics Grid */}
                          <div className="mt-4 grid grid-cols-3 gap-2.5 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-950">
                            <div>
                              <span className="text-[10px] text-zinc-400 uppercase">
                                Footprint
                              </span>
                              <p className="font-mono text-sm font-bold text-zinc-950 dark:text-white">
                                {booking.sqFtBooked} sq.ft
                              </p>
                            </div>
                            <div>
                              <span className="text-[10px] text-zinc-400 uppercase">
                                Daily Rate
                              </span>
                              <p className="font-mono text-sm font-bold text-lime-700 dark:text-lime-400">
                                RM {booking.pricePerDay}/d
                              </p>
                            </div>
                            <div>
                              <span className="text-[10px] text-zinc-400 uppercase">
                                Total ({booking.durationDays}d)
                              </span>
                              <p className="font-mono text-sm font-bold text-zinc-950 dark:text-white">
                                RM {booking.totalPrice}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Duration Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-[11px] text-zinc-500">
                            <span>Move-in: {booking.startDate}</span>
                            <span>Est. check-out: {booking.endDate}</span>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <div
                              className="bg-primary h-full rounded-full transition-all"
                              style={{ width: `${Math.max(8, progressPct)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Smart Pass & Zero Lock-In Controls */}
                      <div className="flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-4 lg:col-span-3 dark:border-zinc-800 dark:bg-zinc-950">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                              24/7 Gate PIN
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setCopiedPinId(booking.id)
                                setTimeout(() => setCopiedPinId(null), 2000)
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-lime-700 hover:underline dark:text-lime-400"
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
                          <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-zinc-950 dark:text-white">
                            {booking.accessPin}
                          </p>
                          <p className="mt-0.5 text-[11px] text-zinc-500">
                            {booking.moveInMethod === "lalamove"
                              ? `Lalamove (${booking.lalamoveVehicle})`
                              : "Self Drop-Off Cleared"}
                          </p>
                        </div>

                        <div className="mt-4 flex flex-col gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() =>
                              setPassModalBookingId(
                                isPassOpen ? null : booking.id
                              )
                            }
                            className="h-8 w-full gap-1.5 rounded-full text-xs font-semibold"
                          >
                            <QrCode className="size-3.5" />
                            <span>
                              {isPassOpen ? "Hide QR Pass" : "Open Digital Pass"}
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
                            className="h-8 w-full gap-1.5 rounded-full text-xs font-semibold"
                          >
                            <RefreshCw className="size-3.5" />
                            <span>Scale Sq.Ft / Days</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Digital QR Pass & Lalamove Driver Share Drawer */}
                    {isPassOpen && (
                      <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-white sm:p-5">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                            <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-white p-2 text-zinc-950">
                              <QrCode className="size-16" />
                            </div>
                            <div>
                              <Badge className="bg-primary text-primary-foreground rounded-full border-0 text-[10px] font-bold">
                                24/7 Smart Shutter & Turnstile Pass
                              </Badge>
                              <h4 className="mt-1 text-sm font-bold text-white">
                                {booking.bayAssignment} • PIN:{" "}
                                <span className="font-mono text-lime-400">
                                  {booking.accessPin}
                                </span>
                              </h4>
                              <p className="mt-1 text-xs text-zinc-400">
                                Scan at loading dock reader or share a 4-hour
                                temporary drop-off pass with your Lalamove
                                driver.
                              </p>
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
                            className="w-full shrink-0 rounded-full px-4 text-xs font-bold sm:w-auto"
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

                    {/* Expandable Elastic Sq.Ft & Duration Scaling Panel */}
                    {isScaling && (
                      <div className="mt-5 rounded-2xl border border-lime-500/40 bg-lime-50/40 p-5 dark:border-lime-500/30 dark:bg-lime-950/15">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          {/* Scale Footprint Slider */}
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-zinc-950 dark:text-white">
                                Adjust Allocated Space (0 Lock-in)
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
                              <span className="text-[11px] text-zinc-500">
                                Current: {booking.sqFtBooked} sq.ft
                              </span>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  handleScaleSqFt(booking.id, tempSqFt)
                                }
                                className="h-8 rounded-full px-4 text-xs font-bold"
                              >
                                Apply {tempSqFt} sq.ft
                              </Button>
                            </div>
                          </div>

                          {/* Extend or Early Move-Out */}
                          <div className="flex flex-col justify-between border-t border-lime-500/20 pt-4 md:border-t-0 md:border-l md:pl-6 md:pt-0">
                            <div>
                              <span className="text-xs font-bold text-zinc-950 dark:text-white">
                                Flexible Daily Duration Controls
                              </span>
                              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                Extend your stay on the fly or check out early
                                with 100% unused day refund.
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
                                +7 Days
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleExtendDays(booking.id, 14)}
                                className="h-8 rounded-full text-xs font-semibold"
                              >
                                +14 Days
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleCompleteMoveOut(booking.id)
                                }
                                className="h-8 rounded-full border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400"
                              >
                                <LogOut className="size-3.5" />
                                <span>Early Move-Out (RM 0 Fee)</span>
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

        {/* TAB 2: 24/7 DIGITAL ACCESS PASSES */}
        {activeTab === "passes" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {activeBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <Badge className="bg-primary text-primary-foreground rounded-full border-0 text-[10px] font-bold">
                      24/7 Smart Access Pass
                    </Badge>
                    <h3 className="mt-1.5 text-base font-bold">
                      {booking.spaceTitle}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      {booking.bayAssignment}
                    </p>
                  </div>
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-white p-2 text-zinc-950">
                    <QrCode className="size-12" />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/5 p-3">
                    <span className="text-[10px] text-zinc-400 uppercase">
                      Master Keypad PIN
                    </span>
                    <p className="mt-1 font-mono text-xl font-bold text-lime-400">
                      {booking.accessPin}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3">
                    <span className="text-[10px] text-zinc-400 uppercase">
                      Valid Until
                    </span>
                    <p className="mt-1 font-mono text-sm font-bold text-white">
                      {booking.endDate}
                    </p>
                    <span className="text-[10px] text-zinc-400">
                      Auto-extends if needed
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Truck className="size-3.5 text-lime-400" />
                    Guardhouse Plate Pre-Cleared
                  </span>
                  <Link
                    href={`/spaces/${booking.spaceId}`}
                    className="font-semibold text-lime-400 hover:underline"
                  >
                    View Hub Directions →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: EMBEDDED BOX & PALLET SPACE ESTIMATOR */}
        {activeTab === "estimator" && (
          <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
              Plan Your Next Campaign or Overflow Footprint
            </h2>
            <p className="mt-1 mb-5 text-xs text-zinc-500 dark:text-zinc-400">
              Count your cartons, storage totes, or ISO pallets and jump
              straight to matching hubs.
            </p>
            <SpaceEstimatorContent
              ctaLabel="Find Matching Storage Hubs"
              onApply={(sqFt, category) => {
                router.push(
                  `/explore?sqft=${sqFt}${category && category !== "all" ? `&category=${category}` : ""}`
                )
              }}
            />
          </div>
        )}

        {/* TAB 4: PAST / COMPLETED BOOKINGS */}
        {activeTab === "past" && (
          <div className="flex flex-col gap-4">
            {completedBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col justify-between gap-4 rounded-3xl border border-zinc-200/80 bg-white p-5 sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={booking.image}
                    alt={booking.spaceTitle}
                    className="size-16 rounded-2xl object-cover opacity-80"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="rounded-full text-[10px]"
                      >
                        Completed • {booking.durationDays} Days
                      </Badge>
                      <span className="font-mono text-xs text-zinc-400">
                        #{booking.id}
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm font-bold text-zinc-950 dark:text-white">
                      {booking.spaceTitle}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {booking.sqFtBooked} sq.ft • {booking.startDate} to{" "}
                      {booking.endDate} • Total RM {booking.totalPrice}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="rounded-full text-xs font-semibold"
                >
                  <Link
                    href={`/spaces/${booking.spaceId}?sqft=${booking.sqFtBooked}`}
                  >
                    <span>Book Again</span>
                    <ChevronRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

