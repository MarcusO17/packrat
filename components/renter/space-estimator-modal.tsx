"use client"

import * as React from "react"
import {
  Box,
  Calculator,
  Check,
  Layers,
  Minus,
  Package,
  Plus,
  Sparkles,
  Warehouse,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  ESTIMATOR_ITEMS,
  SIZE_TIERS,
  type SpaceCategory,
} from "@/lib/spaces-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface SpaceEstimatorContentProps {
  onApply?: (sqFt: number, suggestedCategory?: "all" | SpaceCategory) => void
  initialSqFt?: number
  ctaLabel?: string
}

export function SpaceEstimatorContent({
  onApply,
  ctaLabel = "Apply Recommended Space",
}: SpaceEstimatorContentProps) {
  const [mode, setMode] = React.useState<"items" | "tiers">("items")
  const [counts, setCounts] = React.useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    for (const item of ESTIMATOR_ITEMS) {
      initial[item.id] = item.defaultCount
    }
    return initial
  })
  const [selectedTierId, setSelectedTierId] = React.useState<string>("shoplot")

  const updateCount = (id: string, delta: number) => {
    setCounts((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta),
    }))
  }

  const calculatedSqFt = React.useMemo(() => {
    if (mode === "tiers") {
      const tier = SIZE_TIERS.find((t) => t.id === selectedTierId)
      return tier ? tier.recommendedSqFt : 200
    }
    const raw = ESTIMATOR_ITEMS.reduce((acc, item) => {
      return acc + (counts[item.id] ?? 0) * item.sqFtPerUnit
    }, 0)
    // Add 15% aisle & handling buffer, rounded to nearest 10 sq.ft
    const withBuffer = Math.ceil((raw * 1.15) / 10) * 10
    return Math.max(30, withBuffer)
  }, [mode, counts, selectedTierId])

  const suggestedCategory: "all" | SpaceCategory = React.useMemo(() => {
    if (calculatedSqFt >= 400 || (counts.pallets ?? 0) >= 6) return "warehouse"
    if (calculatedSqFt >= 150 || (counts.pallets ?? 0) >= 1) return "shoplot"
    return "residential"
  }, [calculatedSqFt, counts.pallets])

  const suggestedCategoryLabel =
    suggestedCategory === "warehouse"
      ? "SME Pallet & Fulfillment Bay"
      : suggestedCategory === "shoplot"
        ? "Shoplot Micro-Hub"
        : "Verified Spare Room / Locker"

  const estDailyCost = Math.max(10, Math.round(calculatedSqFt * 0.085))

  return (
    <div className="flex flex-col gap-5">
      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-zinc-200/80 bg-zinc-100/80 p-1 dark:border-zinc-800 dark:bg-zinc-900">
        <button
          type="button"
          onClick={() => setMode("items")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all",
            mode === "items"
              ? "bg-white text-zinc-950 shadow-2xs dark:bg-zinc-800 dark:text-white"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          )}
        >
          <Package className="size-3.5 text-lime-600 dark:text-lime-400" />
          <span>Count Boxes & Pallets</span>
        </button>
        <button
          type="button"
          onClick={() => setMode("tiers")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all",
            mode === "tiers"
              ? "bg-white text-zinc-950 shadow-2xs dark:bg-zinc-800 dark:text-white"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          )}
        >
          <Layers className="size-3.5 text-lime-600 dark:text-lime-400" />
          <span>Quick Space Presets</span>
        </button>
      </div>

      {mode === "items" ? (
        <div className="flex flex-col gap-2.5">
          {ESTIMATOR_ITEMS.map((item) => {
            const count = counts[item.id] ?? 0
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-2xl border p-3 transition-colors",
                  count > 0
                    ? "border-lime-500/40 bg-lime-50/40 dark:border-lime-500/30 dark:bg-lime-950/15"
                    : "border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900/60"
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs font-semibold text-zinc-900 dark:text-white">
                      {item.name}
                    </p>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      ~{item.sqFtPerUnit} sq.ft/unit
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                    {item.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateCount(item.id, -1)}
                    disabled={count === 0}
                    className="flex size-7 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                    aria-label={`Decrease ${item.name}`}
                  >
                    <Minus className="size-3" />
                  </button>
                  <span className="w-7 text-center font-mono text-xs font-bold text-zinc-950 dark:text-white">
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCount(item.id, 1)}
                    className="flex size-7 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                    aria-label={`Increase ${item.name}`}
                  >
                    <Plus className="size-3" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5">
          {SIZE_TIERS.map((tier) => {
            const isSelected = selectedTierId === tier.id
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedTierId(tier.id)}
                className={cn(
                  "flex items-start justify-between gap-3 rounded-2xl border p-3.5 text-left transition-all",
                  isSelected
                    ? "border-primary bg-lime-50/50 ring-1 ring-lime-500/40 dark:bg-lime-950/20"
                    : "border-zinc-200/80 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60"
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-950 dark:text-white">
                      {tier.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="rounded-full px-2 py-0 text-[10px]"
                    >
                      {tier.range}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
                    Fits: {tier.capacity}
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-400">
                    {tier.idealFor}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <span className="text-xs font-bold text-lime-700 dark:text-lime-400">
                    {tier.estDailyMYR}
                  </span>
                  {isSelected && (
                    <span className="bg-primary text-primary-foreground mt-2 flex size-5 items-center justify-center rounded-full">
                      <Check className="size-3" />
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Recommended Output Summary Card */}
      <div className="rounded-3xl border border-zinc-200/90 bg-zinc-950 p-5 text-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-lime-400 uppercase">
            <Sparkles className="size-3.5" />
            Recommended Footprint
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-zinc-300">
            Includes 15% aisle buffer
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold tracking-tight text-white">
                {calculatedSqFt}
              </span>
              <span className="text-sm font-medium text-zinc-400">sq.ft</span>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-300">
              <Warehouse className="size-3.5 text-lime-400" />
              <span>Best match: {suggestedCategoryLabel}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-zinc-400">Est. Daily Rate</span>
            <p className="text-lg font-bold text-lime-400">
              ~RM {estDailyCost} / day
            </p>
            <span className="text-[10px] text-zinc-400">0 Lock-in Lease</span>
          </div>
        </div>

        {onApply && (
          <Button
            type="button"
            onClick={() => onApply(calculatedSqFt, suggestedCategory)}
            className="mt-4 h-10 w-full rounded-full text-xs font-semibold"
          >
            <Calculator className="size-3.5" />
            <span>
              {ctaLabel} ({calculatedSqFt} sq.ft)
            </span>
          </Button>
        )}
      </div>
    </div>
  )
}

interface SpaceEstimatorSheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onApply: (sqFt: number, suggestedCategory?: "all" | SpaceCategory) => void
  trigger?: React.ReactNode
}

export function SpaceEstimatorSheet({
  open,
  onOpenChange,
  onApply,
  trigger,
}: SpaceEstimatorSheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 rounded-full border-lime-500/40 bg-lime-50/60 px-3.5 text-xs font-semibold text-lime-900 hover:bg-lime-100/70 dark:border-lime-500/30 dark:bg-lime-950/30 dark:text-lime-300"
          >
            <Box className="size-3.5 text-lime-600 dark:text-lime-400" />
            <span>Box & Pallet Estimator</span>
          </Button>
        </SheetTrigger>
      )}
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-md"
      >
        <SheetHeader className="pb-2 text-left">
          <SheetTitle className="flex items-center gap-2 text-base font-bold">
            <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-xl">
              <Calculator className="size-4" />
            </span>
            <span>Box & Pallet Space Estimator</span>
          </SheetTitle>
          <SheetDescription className="text-xs">
            Count your cartons, Shopee/TikTok totes, or standard pallets to
            calculate the exact square footage you need.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-6">
          <SpaceEstimatorContent
            ctaLabel="Filter Spaces by Size"
            onApply={(sqFt, category) => {
              onApply(sqFt, category)
              handleOpenChange(false)
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

