import * as React from "react"
import type { Metadata } from "next"

import { RenterDashboard } from "@/components/renter/renter-dashboard"

export const metadata: Metadata = {
  title: "My Storage Dashboard & Digital Passes | Packrat",
  description:
    "Manage your active Packrat storage bookings, 24/7 digital access passes, Lalamove driver PINs, and elastic sq.ft allocations.",
}

export default function DashboardPage() {
  return <RenterDashboard />
}

