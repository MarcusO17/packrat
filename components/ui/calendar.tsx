"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function isSameDay(a?: Date, b?: Date) {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date) => void
  className?: string
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  const today = React.useMemo(() => new Date(), [])
  const [viewDate, setViewDate] = React.useState<Date>(
    selected ?? new Date(today.getFullYear(), today.getMonth(), 1)
  )

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const cells: { date: Date; currentMonth: boolean }[] = []

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      currentMonth: false,
    })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      date: new Date(year, month, d),
      currentMonth: true,
    })
  }

  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({
      date: new Date(year, month + 1, d),
      currentMonth: false,
    })
  }

  return (
    <div className={cn("p-3 select-none", className)}>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={prevMonth}
          className="size-7 rounded-lg bg-transparent p-0 opacity-70 hover:opacity-100"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div className="text-sm font-semibold text-zinc-900 dark:text-white">
          {MONTH_NAMES[month]} {year}
        </div>
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={nextMonth}
          className="size-7 rounded-lg bg-transparent p-0 opacity-70 hover:opacity-100"
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* Days of week */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="text-muted-foreground flex size-8 items-center justify-center text-[11px] font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-y-0.5 text-center text-sm">
        {cells.map(({ date, currentMonth }, idx) => {
          const isSelected = isSameDay(date, selected)
          const isToday = isSameDay(date, today)

          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onSelect?.(date)
                if (!currentMonth) {
                  setViewDate(new Date(date.getFullYear(), date.getMonth(), 1))
                }
              }}
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-lg text-xs font-normal transition-colors outline-none",
                !currentMonth && "text-muted-foreground/40",
                currentMonth &&
                  !isSelected &&
                  "text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800",
                isToday &&
                  !isSelected &&
                  "border-primary/40 text-primary border font-semibold",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-2xs"
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

