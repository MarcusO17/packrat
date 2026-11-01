import * as React from "react"

import { HeroSection } from "@/components/homepage/hero-section"
import { StatsBar } from "@/components/homepage/stats-bar"
import { FeaturesSection } from "@/components/homepage/features-section"

export function HomepageBuilder() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
    </main>
  )
}

