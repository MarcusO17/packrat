import * as React from "react"
import type { Metadata } from "next"

import { CheckoutFlow } from "@/components/renter/checkout-flow"

export const metadata: Metadata = {
  title: "Book Storage Space | Packrat Checkout",
  description:
    "Complete your flexible pay-per-day storage booking with optional Lalamove pickup and FPX / DuitNow payment.",
}

export default function CheckoutPage() {
  return (
    <React.Suspense
      fallback={
        <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4">
          <p className="text-sm text-zinc-500">Preparing checkout...</p>
        </div>
      }
    >
      <CheckoutFlow />
    </React.Suspense>
  )
}

