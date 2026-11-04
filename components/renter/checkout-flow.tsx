"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  KeyRound,
  Lock,
  MapPin,
  Maximize2,
  Package,
  QrCode,
  ShieldCheck,
  Smartphone,
  Truck,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  STORAGE_SPACES,
  addRenterBooking,
  calculateDailyRateForSqFt,
  getSpaceById,
  type RenterBooking,
} from "@/lib/spaces-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const INVENTORY_TYPES = [
  {
    id: "sme-stock",
    title: "SME E-Commerce Stock",
    subtitle: "Shopee, TikTok Shop, Lazada cartons & SKU totes",
  },
  {
    id: "pallets",
    title: "Palletized Commercial Goods",
    subtitle: "Standard ISO/Euro pallets, B2B wholesale & FMCG",
  },
  {
    id: "personal",
    title: "Personal Boxes & Furniture",
    subtitle: "Home renovation, moving cartons & seasonal luggage",
  },
  {
    id: "events",
    title: "Event & Roadshow Kits",
    subtitle: "Pop-up booths, POS displays & marketing collateral",
  },
]

const LALAMOVE_VEHICLES = [
  {
    id: "pickup",
    name: "4x4 Pickup Truck",
    capacity: "Up to 450kg • ~18 boxes",
    price: 32,
  },
  {
    id: "van",
    name: "2.4m High-Roof Van",
    capacity: "Up to 800kg • 2 pallets / 35 boxes",
    price: 48,
  },
  {
    id: "lorry-1t",
    name: "1-Ton Box Lorry (with Tailgate)",
    capacity: "Up to 1,000kg • 5 pallets",
    price: 85,
  },
  {
    id: "lorry-3t",
    name: "3-Ton Commercial Lorry",
    capacity: "Up to 3,000kg • 10 pallets",
    price: 145,
  },
]

const FPX_BANKS = [
  "Maybank2u / MAE",
  "CIMB Clicks / BizChannel",
  "Public Bank PBe",
  "RHB Now / Reflex",
  "Hong Leong Connect",
  "Bank Islam",
]

export function CheckoutFlow() {
  const searchParams = useSearchParams()

  const spaceId = searchParams.get("spaceId") || STORAGE_SPACES[0].id
  const space = getSpaceById(spaceId) || STORAGE_SPACES[0]

  const initialSqFt =
    Number(searchParams.get("sqft")) || space.defaultSqFt
  const initialDays = Number(searchParams.get("days")) || 14
  const initialStartDate =
    searchParams.get("startDate") || "2026-11-05"

  const [sqFt, setSqFt] = React.useState<number>(initialSqFt)
  const [durationDays, setDurationDays] = React.useState<number>(initialDays)
  const [startDate] = React.useState<string>(initialStartDate)

  // Step 1: Renter & Inventory Info
  const [renterName, setRenterName] = React.useState("Daniel Lim")
  const [companyName, setCompanyName] = React.useState(
    "Straits Goods Enterprise"
  )
  const [phone, setPhone] = React.useState("+60 12-489 2011")
  const [inventoryType, setInventoryType] = React.useState("sme-stock")
  const [specialNotes, setSpecialNotes] = React.useState("")
  const [safetyConfirmed, setSafetyConfirmed] = React.useState(true)

  // Step 2: Move-In Logistics
  const [moveInMethod, setMoveInMethod] = React.useState<"self" | "lalamove">(
    "lalamove"
  )
  const [arrivalSlot, setArrivalSlot] = React.useState("10:00 AM – 1:00 PM")
  const [vehiclePlate, setVehiclePlate] = React.useState("PNG 8842")
  const [selectedLalamoveId, setSelectedLalamoveId] = React.useState("van")
  const [pickupAddress, setPickupAddress] = React.useState(
    "18, Lebuh Pantai, George Town, 10300 Penang"
  )

  // Step 3: Billing & Payment Method
  const [billingMode, setBillingMode] = React.useState<
    "upfront" | "daily-auto"
  >("upfront")
  const [paymentMethod, setPaymentMethod] = React.useState<
    "fpx" | "duitnow" | "card"
  >("fpx")
  const [selectedBank, setSelectedBank] = React.useState(FPX_BANKS[0])
  const [selectedWallet, setSelectedWallet] = React.useState("DuitNow QR")

  // Confirmation State
  const [confirmedBooking, setConfirmedBooking] =
    React.useState<RenterBooking | null>(null)

  const dailyRate = calculateDailyRateForSqFt(space, sqFt)
  const discountRate =
    durationDays >= 90 ? 0.12 : durationDays >= 30 ? 0.05 : 0
  const grossSpaceTotal = dailyRate * durationDays
  const discountAmount = Math.round(grossSpaceTotal * discountRate)
  const netSpaceTotal = grossSpaceTotal - discountAmount

  const selectedLalamove =
    LALAMOVE_VEHICLES.find((v) => v.id === selectedLalamoveId) ||
    LALAMOVE_VEHICLES[1]
  const logisticsCost =
    moveInMethod === "lalamove" ? selectedLalamove.price : 0

  const totalPayable = netSpaceTotal + logisticsCost
  const dueToday =
    billingMode === "daily-auto" && durationDays > 7
      ? dailyRate * 7 + logisticsCost
      : totalPayable

  const endDateStr = React.useMemo(() => {
    const d = new Date(startDate)
    d.setDate(d.getDate() + durationDays)
    return d.toISOString().split("T")[0]
  }, [startDate, durationDays])

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault()
    const randomPin = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(
      100 + Math.random() * 900
    )}`
    const bookingId = `PKR-${Math.floor(10000 + Math.random() * 90000)}`
    const invTitle =
      INVENTORY_TYPES.find((i) => i.id === inventoryType)?.title ||
      "SME Inventory"

    const newBooking: RenterBooking = {
      id: bookingId,
      spaceId: space.id,
      spaceTitle: space.title,
      spaceCategory: space.categoryLabel,
      location: space.location,
      address: space.address,
      image: space.images[0],
      startDate,
      endDate: endDateStr,
      durationDays,
      daysElapsed: 1,
      sqFtBooked: sqFt,
      pricePerDay: dailyRate,
      logisticsCost,
      totalPrice: totalPayable,
      status: "active",
      accessPin: randomPin,
      bayAssignment:
        space.category === "warehouse"
          ? "Zone A • Bay #08 (Hydraulic Dock)"
          : "Ground Unit • Rack Zone B1",
      moveInMethod,
      lalamoveVehicle:
        moveInMethod === "lalamove" ? selectedLalamove.name : undefined,
      inventoryType: invTitle,
      billingMode,
      createdAt: new Date().toISOString().split("T")[0],
    }

    addRenterBooking(newBooking)
    setConfirmedBooking(newBooking)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Confirmed Digital Access Pass Screen
  if (confirmedBooking) {
    return (
      <div className="bg-background flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-xl sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
            {/* Top Success Badge */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary text-primary-foreground flex size-14 items-center justify-center rounded-full shadow-md">
                <Check className="size-7 stroke-[2.5]" />
              </div>
              <Badge className="mt-4 rounded-full bg-lime-500/15 px-3 py-1 text-xs font-bold text-lime-800 dark:text-lime-300">
                Booking Reference #{confirmedBooking.id}
              </Badge>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
                Your Storage Space is Ready!
              </h1>
              <p className="mt-1.5 max-w-md text-xs text-zinc-500 dark:text-zinc-400">
                Your 24/7 Smart Access Pass has been activated for{" "}
                <strong className="text-zinc-900 dark:text-white">
                  {confirmedBooking.sqFtBooked} sq.ft
                </strong>{" "}
                at {confirmedBooking.spaceTitle}.
              </p>
            </div>

            {/* Digital Smart Access Pass Card */}
            <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-4 text-white shadow-lg sm:mt-8 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-lg">
                    <KeyRound className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs font-bold tracking-wide text-lime-400 uppercase">
                      Packrat 24/7 Digital Access Pass
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      {confirmedBooking.bayAssignment}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-500/20 px-3 py-1 text-[11px] font-bold text-lime-300">
                  <span className="size-2 rounded-full bg-lime-400" />
                  Active Pass
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-center sm:gap-6">
                {/* Simulated QR Code Block */}
                <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 text-zinc-950 sm:col-span-4">
                  <QrCode className="size-24 stroke-[1.5]" />
                  <span className="mt-2 font-mono text-[10px] font-bold tracking-widest uppercase">
                    {confirmedBooking.id}
                  </span>
                </div>

                {/* Access Details & Gate PIN */}
                <div className="space-y-3 sm:col-span-8">
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="rounded-2xl bg-white/5 p-3">
                      <span className="text-[10px] tracking-wider text-zinc-400 uppercase">
                        Smart Gate PIN
                      </span>
                      <p className="mt-1 font-mono text-xl font-bold tracking-wider text-lime-400 sm:text-2xl">
                        {confirmedBooking.accessPin}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-3">
                      <span className="text-[10px] tracking-wider text-zinc-400 uppercase">
                        Allocated Space
                      </span>
                      <p className="mt-1 font-mono text-xl font-bold text-white sm:text-2xl">
                        {confirmedBooking.sqFtBooked}{" "}
                        <span className="text-xs font-normal text-zinc-400">
                          sq.ft
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-2xl bg-white/5 p-3 text-xs">
                    <div className="flex flex-col justify-between gap-0.5 text-zinc-300 sm:flex-row sm:items-center">
                      <span className="text-zinc-400">Move-In Window:</span>
                      <span className="font-semibold text-white">
                        {confirmedBooking.startDate} ({arrivalSlot})
                      </span>
                    </div>
                    <div className="flex flex-col justify-between gap-0.5 text-zinc-300 sm:flex-row sm:items-center">
                      <span className="text-zinc-400">Logistics Method:</span>
                      <span className="font-semibold text-lime-400">
                        {confirmedBooking.moveInMethod === "lalamove"
                          ? `Lalamove ${confirmedBooking.lalamoveVehicle}`
                          : `Self Drop-Off (Plate: ${vehiclePlate})`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary & Next Actions */}
            <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <Button
                variant="outline"
                asChild
                className="h-10 w-full rounded-full px-5 text-xs font-semibold sm:w-auto"
              >
                <Link href="/explore">Browse More Spaces</Link>
              </Button>

              <Button
                asChild
                className="h-10 w-full gap-1.5 rounded-full px-6 text-xs font-bold sm:w-auto"
              >
                <Link href="/dashboard">
                  <span>Manage in My Renter Dashboard</span>
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background flex-1 pb-28 lg:pb-20">
      {/* Top Progress Header */}
      <div className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href={`/spaces/${space.id}?sqft=${sqFt}`}
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              aria-label="Back to space details"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-zinc-950 sm:text-lg dark:text-white">
                Complete Your Storage Booking
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Instant Smart Access • Zero Lease Lock-In • Up to RM 50,000
                Coverage
              </p>
            </div>
          </div>

          {/* Step Pills (Scrollable on Mobile, Inline on Desktop) */}
          <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px] font-semibold [-ms-overflow-style:none] [scrollbar-width:none] md:w-auto md:gap-2 md:pb-0 md:text-xs [&::-webkit-scrollbar]:hidden">
            <span className="bg-primary text-primary-foreground shrink-0 rounded-full px-2.5 py-1 md:px-3">
              1. Inventory
            </span>
            <ChevronRight className="size-3.5 shrink-0 text-zinc-400" />
            <span className="bg-primary text-primary-foreground shrink-0 rounded-full px-2.5 py-1 md:px-3">
              2. Move-In Logistics
            </span>
            <ChevronRight className="size-3.5 shrink-0 text-zinc-400" />
            <span className="bg-primary text-primary-foreground shrink-0 rounded-full px-2.5 py-1 md:px-3">
              3. Payment (MYR)
            </span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleConfirmBooking}
        className="mx-auto mt-6 max-w-6xl px-4 sm:mt-8 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12">
          {/* Left Column: 3-Step Checkout Sections */}
          <div className="flex flex-col gap-5 sm:gap-6 lg:col-span-7">
            {/* Section 1: Renter & Inventory Details */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-4 shadow-2xs sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2.5">
                <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  1
                </span>
                <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                  Renter Details & What You&apos;re Storing
                </h2>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Full Name / PIC
                  </label>
                  <Input
                    required
                    value={renterName}
                    onChange={(e) => setRenterName(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Company / Brand (Optional for SST Invoice)
                  </label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    WhatsApp / Mobile Number (For Digital Gate PIN & SMS Alerts)
                  </label>
                  <Input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Inventory Category Picker */}
              <div className="mt-5">
                <label className="mb-2 block text-xs font-semibold text-zinc-900 dark:text-white">
                  Select Primary Inventory Type
                </label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {INVENTORY_TYPES.map((item) => {
                    const isSelected = inventoryType === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setInventoryType(item.id)}
                        className={cn(
                          "flex flex-col items-start rounded-2xl border p-3 text-left transition-all",
                          isSelected
                            ? "border-primary bg-lime-50/60 ring-1 ring-lime-500/40 dark:bg-lime-950/25"
                            : "border-zinc-200/80 hover:border-zinc-300 dark:border-zinc-800"
                        )}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="text-xs font-bold text-zinc-950 dark:text-white">
                            {item.title}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="size-4 text-lime-600 dark:text-lime-400" />
                          )}
                        </div>
                        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                          {item.subtitle}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Handling or Racking Notes for Host (Optional)
                </label>
                <Input
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g., Requesting hand pallet jack on arrival, 12 shrink-wrapped pallets..."
                  className="rounded-xl text-xs"
                />
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-2xl bg-zinc-50 p-3 text-xs text-zinc-600 dark:bg-zinc-950 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={safetyConfirmed}
                  onChange={(e) => setSafetyConfirmed(e.target.checked)}
                  required
                  className="mt-0.5 size-4 rounded accent-lime-600"
                />
                <span>
                  I confirm my stored goods do not contain hazardous,
                  flammable, illegal, or perishable wet food items, and qualify
                  for Packrat&apos;s RM 50,000 Protection Guarantee.
                </span>
              </label>
            </div>

            {/* Section 2: Move-In & Last-Mile Logistics (Self Drop-Off vs Lalamove) */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-4 shadow-2xs sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    2
                  </span>
                  <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                    Move-In & Last-Mile Logistics
                  </h2>
                </div>
                <Badge
                  variant="secondary"
                  className="rounded-full text-[10px] font-semibold"
                >
                  Lalamove Partner Integrated
                </Badge>
              </div>

              {/* Toggle Self Drop-Off vs Lalamove */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setMoveInMethod("self")}
                  className={cn(
                    "flex flex-col justify-between rounded-2xl border p-4 text-left transition-all",
                    moveInMethod === "self"
                      ? "border-primary bg-lime-50/60 ring-1 ring-lime-500/40 dark:bg-lime-950/25"
                      : "border-zinc-200/80 hover:border-zinc-300 dark:border-zinc-800"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-950 dark:text-white">
                      <Package className="size-4 text-lime-600 dark:text-lime-400" />
                      Self Drop-Off
                    </span>
                    <span className="text-xs font-bold text-lime-700 dark:text-lime-400">
                      RM 0
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                    Deliver items with your own vehicle or fleet directly to the
                    loading bay.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMoveInMethod("lalamove")}
                  className={cn(
                    "flex flex-col justify-between rounded-2xl border p-4 text-left transition-all",
                    moveInMethod === "lalamove"
                      ? "border-primary bg-lime-50/60 ring-1 ring-lime-500/40 dark:bg-lime-950/25"
                      : "border-zinc-200/80 hover:border-zinc-300 dark:border-zinc-800"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-950 dark:text-white">
                      <Truck className="size-4 text-lime-600 dark:text-lime-400" />
                      Lalamove Pickup
                    </span>
                    <span className="rounded-full bg-zinc-950 px-2 py-0.5 text-[10px] font-bold text-lime-400 dark:bg-white dark:text-zinc-950">
                      From RM 32
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                    Dispatch a verified Lalamove van or lorry from your shop or
                    home straight to the hub.
                  </p>
                </button>
              </div>

              {moveInMethod === "self" ? (
                <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Vehicle Plate Number (For Guardhouse / Gate Clearance)
                    </label>
                    <Input
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      placeholder="e.g. PNG 8842"
                      className="rounded-xl text-xs uppercase"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Estimated Move-In Window
                    </label>
                    <Input
                      value={arrivalSlot}
                      onChange={(e) => setArrivalSlot(e.target.value)}
                      className="rounded-xl text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Pickup Address (Your Store, Office, or Home)
                    </label>
                    <Input
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-zinc-900 dark:text-white">
                      Select Lalamove Vehicle Size
                    </label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {LALAMOVE_VEHICLES.map((v) => {
                        const isSelected = selectedLalamoveId === v.id
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedLalamoveId(v.id)}
                            className={cn(
                              "flex items-center justify-between rounded-2xl border p-3 text-left transition-all",
                              isSelected
                                ? "border-primary bg-lime-50/50 dark:bg-lime-950/20"
                                : "border-zinc-200/80 hover:border-zinc-300 dark:border-zinc-800"
                            )}
                          >
                            <div>
                              <p className="text-xs font-bold text-zinc-950 dark:text-white">
                                {v.name}
                              </p>
                              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                                {v.capacity}
                              </p>
                            </div>
                            <span className="font-mono text-xs font-bold text-lime-700 dark:text-lime-400">
                              +RM {v.price}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Malaysian Payment Method (FPX / DuitNow QR / Card) */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-4 shadow-2xs sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2.5">
                <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  3
                </span>
                <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                  Billing Cadence & Payment Method (MYR)
                </h2>
              </div>

              {/* Billing Mode Switcher */}
              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setBillingMode("upfront")}
                  className={cn(
                    "rounded-2xl border p-3 text-left transition-all",
                    billingMode === "upfront"
                      ? "border-primary bg-lime-50/60 dark:bg-lime-950/20"
                      : "border-zinc-200/80 dark:border-zinc-800"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-950 dark:text-white">
                      Pay Full Duration ({durationDays} Days)
                    </span>
                    {billingMode === "upfront" && (
                      <CheckCircle2 className="size-4 text-lime-600 dark:text-lime-400" />
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    Unused days are 100% refunded if you move out early.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setBillingMode("daily-auto")}
                  className={cn(
                    "rounded-2xl border p-3 text-left transition-all",
                    billingMode === "daily-auto"
                      ? "border-primary bg-lime-50/60 dark:bg-lime-950/20"
                      : "border-zinc-200/80 dark:border-zinc-800"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-950 dark:text-white">
                      Pay-As-You-Store (Weekly Rolling)
                    </span>
                    {billingMode === "daily-auto" && (
                      <CheckCircle2 className="size-4 text-lime-600 dark:text-lime-400" />
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    Pay first 7 days today, then auto-bill daily until check-out.
                  </p>
                </button>
              </div>

              {/* Payment Method Tabs */}
              <div className="mt-5 grid grid-cols-3 gap-1.5 rounded-2xl bg-zinc-100 p-1 sm:gap-2 dark:bg-zinc-950">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("fpx")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-[11px] font-semibold transition-all sm:flex-row sm:gap-1.5 sm:py-2.5 sm:text-xs",
                    paymentMethod === "fpx"
                      ? "bg-white text-zinc-950 shadow-2xs dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                  )}
                >
                  <Building2 className="size-3.5 text-lime-600 dark:text-lime-400" />
                  <span>FPX Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("duitnow")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-[11px] font-semibold transition-all sm:flex-row sm:gap-1.5 sm:py-2.5 sm:text-xs",
                    paymentMethod === "duitnow"
                      ? "bg-white text-zinc-950 shadow-2xs dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                  )}
                >
                  <Smartphone className="size-3.5 text-lime-600 dark:text-lime-400" />
                  <span>DuitNow / eWallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-[11px] font-semibold transition-all sm:flex-row sm:gap-1.5 sm:py-2.5 sm:text-xs",
                    paymentMethod === "card"
                      ? "bg-white text-zinc-950 shadow-2xs dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                  )}
                >
                  <CreditCard className="size-3.5 text-lime-600 dark:text-lime-400" />
                  <span>Credit / Debit</span>
                </button>
              </div>

              {/* Payment Method Details */}
              <div className="mt-4">
                {paymentMethod === "fpx" && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {FPX_BANKS.map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={cn(
                          "flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-colors",
                          selectedBank === bank
                            ? "border-primary bg-lime-50/70 font-bold text-zinc-950 dark:bg-lime-950/30 dark:text-white"
                            : "border-zinc-200/80 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300"
                        )}
                      >
                        <span className="truncate">{bank}</span>
                        {selectedBank === bank && (
                          <Check className="size-3.5 shrink-0 text-lime-600 dark:text-lime-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {paymentMethod === "duitnow" && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      "DuitNow QR",
                      "GrabPay MY",
                      "Touch 'n Go eWallet",
                      "Boost Business",
                    ].map((wallet) => (
                      <button
                        key={wallet}
                        type="button"
                        onClick={() => setSelectedWallet(wallet)}
                        className={cn(
                          "flex flex-col items-start justify-between rounded-xl border p-3 text-left text-xs font-medium transition-colors",
                          selectedWallet === wallet
                            ? "border-primary bg-lime-50/70 font-bold text-zinc-950 dark:bg-lime-950/30 dark:text-white"
                            : "border-zinc-200/80 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
                        )}
                      >
                        <span>{wallet}</span>
                        <span className="mt-1 text-[10px] text-lime-600 dark:text-lime-400">
                          Instant 0% Fee
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Input
                        placeholder="Card Number •••• •••• •••• 4242"
                        defaultValue="4532 •••• •••• 8891"
                        className="rounded-xl font-mono text-xs"
                      />
                    </div>
                    <Input
                      placeholder="MM / YY"
                      defaultValue="08 / 29"
                      className="rounded-xl font-mono text-xs"
                    />
                    <Input
                      placeholder="CVC"
                      defaultValue="842"
                      className="rounded-xl font-mono text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Summary & Confirm Button */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:border-zinc-800 dark:bg-zinc-900">
              {/* Space Mini Header */}
              <div className="flex items-center gap-3.5 border-b border-zinc-100 pb-4 dark:border-zinc-800">
                <img
                  src={space.images[0]}
                  alt={space.title}
                  className="size-18 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <Badge className="bg-primary text-primary-foreground rounded-full border-0 px-2.5 py-0 text-[10px] font-bold">
                    {space.categoryLabel}
                  </Badge>
                  <h3 className="mt-1 truncate text-sm font-bold text-zinc-950 dark:text-white">
                    {space.title}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <MapPin className="size-3 text-lime-600 dark:text-lime-400" />
                    <span className="truncate">{space.location}</span>
                  </p>
                </div>
              </div>

              {/* Quick Footprint & Duration Adjusters */}
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-zinc-400 uppercase">
                    <Maximize2 className="size-3 text-lime-600 dark:text-lime-400" />
                    Space Footprint
                  </span>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-zinc-950 dark:text-white">
                      {sqFt} sq.ft
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setSqFt((s) => Math.max(space.minSqFt, s - 50))
                        }
                        className="flex size-5 items-center justify-center rounded bg-zinc-200/80 text-xs font-bold dark:bg-zinc-800"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSqFt((s) =>
                            Math.min(space.availableSqFt, s + 50)
                          )
                        }
                        className="flex size-5 items-center justify-center rounded bg-zinc-200/80 text-xs font-bold dark:bg-zinc-800"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-zinc-400 uppercase">
                    <Calendar className="size-3 text-lime-600 dark:text-lime-400" />
                    Duration
                  </span>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-zinc-950 dark:text-white">
                      {durationDays} Days
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setDurationDays((d) => Math.max(1, d - 1))
                        }
                        className="flex size-5 items-center justify-center rounded bg-zinc-200/80 text-xs font-bold dark:bg-zinc-800"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setDurationDays((d) => d + 1)}
                        className="flex size-5 items-center justify-center rounded bg-zinc-200/80 text-xs font-bold dark:bg-zinc-800"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itemized MYR Cost Breakdown */}
              <div className="mt-5 space-y-2.5 border-t border-zinc-100 pt-4 text-xs dark:border-zinc-800">
                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>
                    Storage ({sqFt} sq.ft × RM {dailyRate}/day × {durationDays}d)
                  </span>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-white">
                    RM {grossSpaceTotal.toLocaleString()}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-lime-700 dark:text-lime-400">
                    <span>Multi-day flexible savings</span>
                    <span className="font-mono font-bold">
                      -RM {discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>
                    Move-In Logistics (
                    {moveInMethod === "lalamove"
                      ? selectedLalamove.name
                      : "Self Drop-Off"}
                    )
                  </span>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-white">
                    {logisticsCost === 0 ? "RM 0" : `RM ${logisticsCost}`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Packrat Inventory Shield (RM 50k)</span>
                  <span className="font-semibold text-lime-700 dark:text-lime-400">
                    Included
                  </span>
                </div>

                <div className="flex items-baseline justify-between border-t border-zinc-200/80 pt-3 dark:border-zinc-800">
                  <div>
                    <span className="text-sm font-bold text-zinc-950 dark:text-white">
                      Total Payable Today
                    </span>
                    <p className="text-[10px] text-zinc-400">
                      {billingMode === "daily-auto" && durationDays > 7
                        ? `First 7 days + logistics (Total booking: RM ${totalPayable})`
                        : `Full ${durationDays}-day flexible booking`}
                    </p>
                  </div>
                  <span className="font-mono text-2xl font-bold text-zinc-950 dark:text-white">
                    RM {dueToday.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit / Pay CTA */}
              <Button
                type="submit"
                className="mt-5 h-11 w-full gap-2 rounded-full text-sm font-bold shadow-sm"
              >
                <Lock className="size-4" />
                <span>
                  Confirm & Pay RM {dueToday.toLocaleString()} via{" "}
                  {paymentMethod === "fpx"
                    ? "FPX"
                    : paymentMethod === "duitnow"
                      ? "DuitNow"
                      : "Card"}
                </span>
              </Button>

              {/* Trust Guarantee Box */}
              <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-lime-50/60 p-3 text-[11px] text-zinc-600 dark:bg-lime-950/20 dark:text-zinc-300">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-lime-600 dark:text-lime-400" />
                <span>
                  <strong className="text-zinc-900 dark:text-white">
                    Zero Lock-In Guarantee:
                  </strong>{" "}
                  Check out early any day and get 100% of unused days refunded
                  automatically to your bank account.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Mobile Bottom Checkout Bar */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200/90 bg-white/95 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden dark:border-zinc-800 dark:bg-zinc-900/95">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-base font-bold text-zinc-950 dark:text-white">
                  RM {dueToday.toLocaleString()}
                </span>
                <span className="text-[11px] text-zinc-500">due today</span>
              </div>
              <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                {sqFt} sq.ft • {durationDays}d •{" "}
                {paymentMethod === "fpx"
                  ? "FPX"
                  : paymentMethod === "duitnow"
                    ? "DuitNow"
                    : "Card"}
              </p>
            </div>

            <Button
              type="submit"
              className="h-10 shrink-0 gap-1.5 rounded-full px-5 text-xs font-bold shadow-xs"
            >
              <Lock className="size-3.5" />
              <span>Confirm & Pay</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

