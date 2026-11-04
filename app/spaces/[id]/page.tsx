import * as React from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { STORAGE_SPACES, getSpaceById } from "@/lib/spaces-data"
import { SpaceDetail } from "@/components/renter/space-detail"

export function generateStaticParams() {
  return STORAGE_SPACES.map((space) => ({
    id: space.id,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  "use cache"
  const { id } = await params
  const space = getSpaceById(id)
  if (!space) {
    return { title: "Space Not Found | Packrat" }
  }
  return {
    title: `${space.title} (${space.location}) | Packrat`,
    description: space.subtitle,
  }
}

async function SpaceDetailLoader({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const space = getSpaceById(id)

  if (!space) {
    notFound()
  }

  return <SpaceDetail space={space} />
}

export default function SpaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <React.Suspense
      fallback={
        <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4">
          <p className="text-sm text-zinc-500">Loading storage hub details...</p>
        </div>
      }
    >
      <SpaceDetailLoader params={params} />
    </React.Suspense>
  )
}
