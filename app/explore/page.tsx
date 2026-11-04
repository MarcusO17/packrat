import * as React from "react"
import type { Metadata } from "next"

import { ExploreSpaces } from "@/components/renter/explore-spaces"

export const metadata: Metadata = {
  title: "Explore Storage Hubs | Packrat Malaysia",
  description:
    "Browse verified SME warehouse pallet bays, shoplot micro-hubs, and neighborhood spare rooms across Penang, KL, and Johor Bahru.",
}

export default function ExplorePage() {
  return (
    <React.Suspense
      fallback={
        <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-4">
          <p className="text-sm text-zinc-500">
            Loading verified storage hubs...
          </p>
        </div>
      }
    >
      <ExploreSpaces />
    </React.Suspense>
  )
}

