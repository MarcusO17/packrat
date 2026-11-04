"use client"

import * as React from "react"
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Calculator,
  Check,
  CornerDownLeft,
  Home,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Store,
  Warehouse,
  Zap,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  AMENITY_FILTERS,
  REGIONS,
  SPACE_CATEGORIES,
  type SpaceCategory,
} from "@/lib/spaces-data"
import {
  CATEGORY_NOUNS,
  DEFAULT_FILTERS,
  MIN_BUDGET,
  NO_BUDGET_LIMIT,
  SORT_OPTIONS,
  countExtraFilters,
  filterSpaces,
  parseStorageQuery,
  shortRegion,
  type SearchFilters,
} from "@/lib/search-filters"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type Step = 0 | 1 | 2 | 3

const EXAMPLE_PROMPTS = [
  "20 boxes near PJ",
  "5 pallets in Bayan Lepas with loading bay",
  "Climate-controlled room in George Town",
  "Shoplot in JB I can book today",
]

const CATEGORY_ICONS: Record<"all" | SpaceCategory, React.ElementType> = {
  all: Sparkles,
  warehouse: Warehouse,
  shoplot: Store,
  residential: Home,
}

const SIZE_PRESETS = [
  { sqft: 0, label: "Any size", hint: "Show everything" },
  { sqft: 30, label: "A few boxes", hint: "≈ 10 cartons · 30 sq.ft" },
  { sqft: 100, label: "A room's worth", hint: "Furniture & boxes · 100 sq.ft" },
  { sqft: 250, label: "Small stock room", hint: "E-com SKUs · 250 sq.ft" },
  { sqft: 600, label: "Pallet operation", hint: "≈ 25 pallets · 600 sq.ft" },
]

interface SmartSearchProps {
  filters: SearchFilters
  onChange: (patch: Partial<SearchFilters>) => void
  onReplace: (next: SearchFilters) => void
  resultCount: number
  onOpenEstimator: () => void
}

export function SmartSearch({
  filters,
  onChange,
  onReplace,
  resultCount,
  onOpenEstimator,
}: SmartSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState<Step>(0)
  const [draft, setDraft] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const parsed = React.useMemo(() => parseStorageQuery(draft), [draft])

  const openAt = (s: Step) => {
    setStep(s)
    setOpen(true)
  }

  const applyDraft = (text = draft) => {
    if (!text.trim()) {
      setStep(1)
      return
    }
    const result = text === draft ? parsed : parseStorageQuery(text)
    onReplace({
      ...DEFAULT_FILTERS,
      sortBy: filters.sortBy,
      ...result.patch,
      query: result.residual,
    })
    setDraft(text)
    setOpen(false)
  }

  const countWith = (patch: Partial<SearchFilters>) =>
    filterSpaces({ ...filters, ...patch }).length

  const segments: { step: Step; label: string; value: string; active: boolean }[] =
    [
      {
        step: 1,
        label: "Where",
        value: shortRegion(filters.region),
        active: filters.region !== "All Locations",
      },
      {
        step: 2,
        label: "What",
        value:
          filters.category === "all"
            ? "Any space"
            : CATEGORY_NOUNS[filters.category].one.replace(/^./, (c) =>
                c.toUpperCase()
              ),
        active: filters.category !== "all",
      },
      {
        step: 3,
        label: "Size",
        value: filters.sqft > 0 ? `${filters.sqft} sq.ft` : "Any size",
        active: filters.sqft > 0,
      },
    ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          className={cn(
            "flex h-14 w-full min-w-0 items-center gap-1 rounded-full border bg-white p-1.5 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.12)] transition-shadow dark:bg-zinc-900",
            open
              ? "border-zinc-300 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.25)] dark:border-zinc-700"
              : "border-zinc-200/90 dark:border-zinc-800"
          )}
        >
          {/* Mobile summary trigger (segments are shown on md+) */}
          <button
            type="button"
            onClick={() => openAt(0)}
            className="flex h-full min-w-0 flex-1 items-center rounded-full px-4 text-left transition-colors hover:bg-zinc-50 md:hidden dark:hover:bg-zinc-800/60"
          >
            <span className="block truncate text-xs font-semibold text-zinc-950 dark:text-white">
              {segments.map((s) => s.value).join(" · ")}
            </span>
          </button>

          {/* Desktop segments */}
          <div className="hidden min-w-0 flex-1 items-center self-stretch md:flex">
            {segments.map((seg, i) => (
              <React.Fragment key={seg.step}>
                {i > 0 && <span className="h-6 w-px shrink-0 bg-zinc-200 dark:bg-zinc-800" />}
                <button
                  type="button"
                  onClick={() => openAt(seg.step)}
                  className={cn(
                    "flex h-full min-w-0 flex-1 flex-col justify-center rounded-full px-5 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60",
                    open && step === seg.step && "bg-zinc-100 dark:bg-zinc-800"
                  )}
                >
                  <span className="block text-[10px] font-semibold tracking-wide text-zinc-400 uppercase">
                    {seg.label}
                  </span>
                  <span
                    className={cn(
                      "block truncate text-xs font-semibold",
                      seg.active
                        ? "text-zinc-950 dark:text-white"
                        : "text-zinc-500 dark:text-zinc-400"
                    )}
                  >
                    {seg.value}
                  </span>
                </button>
              </React.Fragment>
            ))}
          </div>

          <button
            type="button"
            onClick={() => openAt(open ? step : 0)}
            className="bg-primary text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95"
            aria-label="Search"
          >
            <Search className="size-4" />
          </button>
        </div>
      </PopoverAnchor>

      <PopoverContent
        align="start"
        sideOffset={10}
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          if (step === 0) inputRef.current?.focus()
        }}
        className="w-[calc(100vw-2rem)] max-w-[34rem] overflow-hidden rounded-3xl border-zinc-200/80 p-0 shadow-2xl dark:border-zinc-800"
      >
        {step === 0 ? (
          <div className="flex flex-col">
            <div className="p-5 pb-4">
              <p className="text-sm font-bold text-zinc-950 dark:text-white">
                What do you need to store?
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Say it like you would to a friend. We&apos;ll work out the
                location, space type and size.
              </p>

              <form
                className="mt-4 flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 focus-within:border-lime-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-lime-500/15 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-within:bg-zinc-900"
                onSubmit={(e) => {
                  e.preventDefault()
                  applyDraft()
                }}
              >
                <Search className="size-4 shrink-0 text-zinc-400" />
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="e.g. 10 pallets in Shah Alam under RM40"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
                />
                {draft && (
                  <kbd className="hidden items-center gap-1 rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 sm:inline-flex dark:border-zinc-700 dark:bg-zinc-800">
                    <CornerDownLeft className="size-3" /> Enter
                  </kbd>
                )}
              </form>

              {/* Live understanding */}
              <div className="mt-3 min-h-7">
                {draft.trim() ? (
                  parsed.understood.length > 0 || parsed.residual ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-medium text-zinc-400">
                        Looking for
                      </span>
                      {parsed.understood.map((chip) => (
                        <span
                          key={chip}
                          className="inline-flex items-center gap-1 rounded-full bg-lime-500/15 px-2 py-0.5 text-[11px] font-semibold text-lime-800 dark:text-lime-300"
                        >
                          <Check className="size-3" />
                          {chip}
                        </span>
                      ))}
                      {parsed.residual && (
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                          “{parsed.residual}”
                        </span>
                      )}
                    </div>
                  ) : null
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {EXAMPLE_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => applyDraft(prompt)}
                        className="rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-600 transition-colors hover:border-lime-500 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-white"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-zinc-100 bg-zinc-50/70 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900/60">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              >
                Not sure? Answer 3 quick questions
                <ArrowRight className="size-3.5" />
              </button>
              <Button
                size="sm"
                className="h-8 rounded-full px-4 text-xs font-semibold"
                onClick={() => applyDraft()}
                disabled={!draft.trim()}
              >
                Search
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Progress */}
            <div className="flex items-center justify-between gap-3 px-5 pt-5">
              <div>
                <p className="text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
                  Step {step} of 3
                </p>
                <p className="text-sm font-bold text-zinc-950 dark:text-white">
                  {step === 1 && "Where should it be?"}
                  {step === 2 && "What kind of space suits you?"}
                  {step === 3 && "How much do you need to store?"}
                </p>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStep(s as Step)}
                    aria-label={`Go to step ${s}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      s === step
                        ? "bg-primary w-6"
                        : s < step
                          ? "w-3 bg-lime-500/60"
                          : "w-3 bg-zinc-200 dark:bg-zinc-800"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-5 pt-4">
              {step === 1 && (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {REGIONS.map((region) => {
                    const count = countWith({ region })
                    const selected = filters.region === region
                    return (
                      <OptionCard
                        key={region}
                        selected={selected}
                        disabled={count === 0 && !selected}
                        icon={region === "All Locations" ? Sparkles : MapPin}
                        title={
                          region === "All Locations" ? "Anywhere" : region
                        }
                        meta={`${count} ${count === 1 ? "space" : "spaces"}`}
                        onClick={() => {
                          onChange({ region })
                          setStep(2)
                        }}
                      />
                    )
                  })}
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 gap-2">
                  {SPACE_CATEGORIES.map((cat) => {
                    const count = countWith({ category: cat.id })
                    const selected = filters.category === cat.id
                    return (
                      <OptionCard
                        key={cat.id}
                        selected={selected}
                        disabled={count === 0 && !selected}
                        icon={CATEGORY_ICONS[cat.id]}
                        title={cat.id === "all" ? "Show me everything" : cat.label}
                        description={cat.description}
                        meta={`${count}`}
                        onClick={() => {
                          onChange({ category: cat.id })
                          setStep(3)
                        }}
                      />
                    )
                  })}
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {SIZE_PRESETS.map((preset) => (
                      <OptionCard
                        key={preset.sqft}
                        selected={filters.sqft === preset.sqft}
                        icon={preset.sqft === 0 ? Sparkles : Box}
                        title={preset.label}
                        description={preset.hint}
                        onClick={() => onChange({ sqft: preset.sqft })}
                      />
                    ))}
                    <OptionCard
                      icon={Calculator}
                      title="Help me calculate"
                      description="Count boxes & pallets"
                      onClick={() => {
                        setOpen(false)
                        onOpenEstimator()
                      }}
                    />
                  </div>

                  <div className="rounded-2xl border border-zinc-200/80 p-3.5 dark:border-zinc-800">
                    <div className="mb-3 flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        Fine-tune
                      </span>
                      <span className="font-mono font-bold text-lime-700 dark:text-lime-400">
                        {filters.sqft === 0 ? "Any size" : `${filters.sqft} sq.ft`}
                      </span>
                    </div>
                    <Slider
                      value={[filters.sqft]}
                      min={0}
                      max={1500}
                      step={10}
                      onValueChange={(val) => onChange({ sqft: val[0] ?? 0 })}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-zinc-100 bg-zinc-50/70 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900/60">
              <button
                type="button"
                onClick={() => setStep((step - 1) as Step)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              >
                <ArrowLeft className="size-3.5" />
                {step === 1 ? "Describe instead" : "Back"}
              </button>
              <div className="flex items-center gap-2">
                {step < 3 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 rounded-full px-3 text-xs font-semibold"
                    onClick={() => setStep((step + 1) as Step)}
                  >
                    Skip
                  </Button>
                )}
                <Button
                  size="sm"
                  className="h-8 rounded-full px-4 text-xs font-semibold"
                  onClick={() => setOpen(false)}
                >
                  Show {resultCount} {resultCount === 1 ? "space" : "spaces"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

function OptionCard({
  icon: Icon,
  title,
  description,
  meta,
  selected,
  disabled,
  onClick,
}: {
  icon: React.ElementType
  title: string
  description?: string
  meta?: string
  selected?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex items-center gap-3 rounded-2xl border p-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-40",
        selected
          ? "border-lime-500 bg-lime-50/70 ring-2 ring-lime-500/20 dark:bg-lime-950/30"
          : "border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors",
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-zinc-100 text-zinc-500 group-hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400"
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-semibold text-zinc-950 dark:text-white">
          {title}
        </span>
        {description && (
          <span className="block truncate text-[11px] text-zinc-500 dark:text-zinc-400">
            {description}
          </span>
        )}
      </span>
      {meta && (
        <span className="shrink-0 text-[11px] font-medium text-zinc-400">
          {meta}
        </span>
      )}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*                         Secondary refinements sheet                        */
/* -------------------------------------------------------------------------- */

interface FiltersSheetProps {
  filters: SearchFilters
  onChange: (patch: Partial<SearchFilters>) => void
  resultCount: number
}

export function FiltersSheet({
  filters,
  onChange,
  resultCount,
}: FiltersSheetProps) {
  const extraCount = countExtraFilters(filters)

  const toggleAmenity = (amenity: string) =>
    onChange({
      amenities: filters.amenities.includes(amenity)
        ? filters.amenities.filter((a) => a !== amenity)
        : [...filters.amenities, amenity],
    })

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className={cn(
            "relative inline-flex h-14 shrink-0 items-center gap-2 rounded-full border bg-white px-4 sm:px-5 text-xs font-semibold shadow-[0_4px_20px_-6px_rgba(0,0,0,0.12)] transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800",
            extraCount > 0
              ? "border-zinc-950 text-zinc-950 dark:border-white dark:text-white"
              : "border-zinc-200/90 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
          )}
          aria-label="More filters"
        >
          <SlidersHorizontal className="size-4" />
          <span className="hidden sm:inline">Filters</span>
          {extraCount > 0 && (
            <span className="bg-primary text-primary-foreground flex size-4.5 items-center justify-center rounded-full text-[10px] font-bold">
              {extraCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full gap-0 sm:max-w-sm">
        <SheetHeader className="border-b border-zinc-100 pb-4 text-left dark:border-zinc-800">
          <SheetTitle className="text-base font-bold">Refine results</SheetTitle>
          <SheetDescription className="text-xs">
            Optional extras. Most people never need these.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-7 overflow-y-auto p-4">
          <section>
            <h3 className="mb-2.5 text-xs font-bold text-zinc-950 dark:text-white">
              Sort by
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChange({ sortBy: opt.id })}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-left text-xs font-medium transition-colors",
                    filters.sortBy === opt.id
                      ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                      : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-400"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-950 dark:text-white">
                Daily budget
              </h3>
              <span className="font-mono text-xs font-bold text-lime-700 dark:text-lime-400">
                {filters.maxBudget >= NO_BUDGET_LIMIT
                  ? "Any price"
                  : `Up to RM ${filters.maxBudget}`}
              </span>
            </div>
            <Slider
              value={[filters.maxBudget]}
              min={MIN_BUDGET}
              max={NO_BUDGET_LIMIT}
              step={2}
              onValueChange={(val) =>
                onChange({ maxBudget: val[0] ?? NO_BUDGET_LIMIT })
              }
            />
            <div className="mt-2 flex justify-between text-[10px] text-zinc-400">
              <span>RM {MIN_BUDGET}</span>
              <span>RM {NO_BUDGET_LIMIT}+</span>
            </div>
          </section>

          <section>
            <button
              type="button"
              onClick={() => onChange({ instantBook: !filters.instantBook })}
              className="flex w-full items-center justify-between gap-3 text-left"
              role="switch"
              aria-checked={filters.instantBook}
            >
              <span className="flex items-start gap-2.5">
                <Zap className="mt-0.5 size-4 text-lime-600 dark:text-lime-400" />
                <span>
                  <span className="block text-xs font-bold text-zinc-950 dark:text-white">
                    Instant book only
                  </span>
                  <span className="block text-[11px] text-zinc-500 dark:text-zinc-400">
                    Skip host approval, move in today
                  </span>
                </span>
              </span>
              <span
                className={cn(
                  "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                  filters.instantBook
                    ? "bg-primary"
                    : "bg-zinc-200 dark:bg-zinc-700"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 size-4 rounded-full bg-white shadow transition-all",
                    filters.instantBook ? "left-4.5" : "left-0.5"
                  )}
                />
              </span>
            </button>
          </section>

          <section>
            <h3 className="mb-2.5 text-xs font-bold text-zinc-950 dark:text-white">
              Must have
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {AMENITY_FILTERS.map((amenity) => {
                const selected = filters.amenities.includes(amenity)
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors",
                      selected
                        ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                        : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-400"
                    )}
                  >
                    {selected && <Check className="size-3" />}
                    {amenity}
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        <SheetFooter className="flex-row items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            disabled={extraCount === 0}
            onClick={() =>
              onChange({
                sortBy: DEFAULT_FILTERS.sortBy,
                maxBudget: DEFAULT_FILTERS.maxBudget,
                instantBook: false,
                amenities: [],
              })
            }
            className="text-xs font-semibold text-zinc-600 underline-offset-4 hover:underline disabled:opacity-40 dark:text-zinc-400"
          >
            Clear
          </button>
          <SheetClose asChild>
            <Button className="h-9 rounded-full px-5 text-xs font-semibold">
              Show {resultCount} {resultCount === 1 ? "space" : "spaces"}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
