import * as React from "react"

const stats = [
  {
    value: "$1B+",
    label: "TOTAL\nINVESTED",
  },
  {
    value: "20K+",
    label: "HAPPY\nCUSTOMERS",
  },
  {
    value: "150K+",
    label: "PROPERTY\nLISTED",
  },
  {
    value: "8-12%",
    label: "AVERAGE\nRETURN VALUE",
  },
]

export function StatsBar() {
  return (
    <section className="border-b border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.value}
              className="flex items-center justify-center gap-3 sm:justify-start"
            >
              <span className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
                {stat.value}
              </span>
              <span className="text-[10px] leading-tight font-semibold tracking-wider whitespace-pre-line text-zinc-400 uppercase dark:text-zinc-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

