import * as React from "react"
import type { Metadata } from "next"

import { RenterDashboard } from "@/components/renter/renter-dashboard"

export const metadata: Metadata = {
  title: "My Bookings | Packrat",
  description:
    "View and manage your active, upcoming, and past storage bookings.",
}

export default function DashboardPage() {
  return <RenterDashboard />
}

