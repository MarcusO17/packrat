"use client"

import * as React from "react"
import Link from "next/link"
import { Compass, Minus, Plus, Warehouse } from "lucide-react"

import { cn } from "@/lib/utils"

const TILE_SIZE = 256

export function latLngToWorldPixel(lat: number, lng: number, zoom: number) {
  const scale = TILE_SIZE * Math.pow(2, zoom)
  const x = ((lng + 180) / 360) * scale
  const clampedLat = Math.max(-85.0511, Math.min(85.0511, lat))
  const sinLat = Math.sin((clampedLat * Math.PI) / 180)
  const y =
    (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale
  return { x, y }
}

export function worldPixelToLatLng(x: number, y: number, zoom: number) {
  const scale = TILE_SIZE * Math.pow(2, zoom)
  const lng = (x / scale) * 360 - 180
  const n = Math.PI - (2 * Math.PI * y) / scale
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
  return { lat, lng }
}

export interface CoordMapMarker {
  id: string
  lat: number
  lng: number
  priceLabel?: string
  title: string
  subtitle?: string
  image?: string
  href?: string
  badge?: string
}

interface CoordMapProps {
  centerLat: number
  centerLng: number
  zoom: number
  markers: CoordMapMarker[]
  activeMarkerId?: string
  onSelectMarker?: (id: string) => void
  markerStyle?: "price-pill" | "photo-pin"
  interactive?: boolean
  showControls?: boolean
  className?: string
  children?: React.ReactNode
}

export function CoordMap({
  centerLat,
  centerLng,
  zoom: initialZoom,
  markers,
  activeMarkerId,
  onSelectMarker,
  markerStyle = "price-pill",
  interactive = true,
  showControls = true,
  className,
  children,
}: CoordMapProps) {
  const [view, setView] = React.useState({
    lat: centerLat,
    lng: centerLng,
    zoom: initialZoom,
  })
  const [prevTarget, setPrevTarget] = React.useState({
    lat: centerLat,
    lng: centerLng,
    zoom: initialZoom,
  })

  if (
    prevTarget.lat !== centerLat ||
    prevTarget.lng !== centerLng ||
    prevTarget.zoom !== initialZoom
  ) {
    setPrevTarget({ lat: centerLat, lng: centerLng, zoom: initialZoom })
    setView({ lat: centerLat, lng: centerLng, zoom: initialZoom })
  }

  const dragRef = React.useRef<{
    isDragging: boolean
    startX: number
    startY: number
    startWorldX: number
    startWorldY: number
    moved: boolean
  }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    startWorldX: 0,
    startWorldY: 0,
    moved: false,
  })

  const centerWorld = React.useMemo(
    () => latLngToWorldPixel(view.lat, view.lng, view.zoom),
    [view.lat, view.lng, view.zoom]
  )

  const centerTileX = Math.floor(centerWorld.x / TILE_SIZE)
  const centerTileY = Math.floor(centerWorld.y / TILE_SIZE)
  const maxTile = Math.pow(2, view.zoom)

  const tiles = React.useMemo(() => {
    const list: {
      key: string
      url: string
      left: number
      top: number
    }[] = []

    for (let dx = -3; dx <= 3; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        const tx = centerTileX + dx
        const ty = centerTileY + dy
        if (ty < 0 || ty >= maxTile) continue
        const wrappedTx = ((tx % maxTile) + maxTile) % maxTile
        const left = Math.round(tx * TILE_SIZE - centerWorld.x)
        const top = Math.round(ty * TILE_SIZE - centerWorld.y)
        list.push({
          key: `${view.zoom}-${tx}-${ty}`,
          url: `https://tile.openstreetmap.org/${view.zoom}/${wrappedTx}/${ty}.png`,
          left,
          top,
        })
      }
    }
    return list
  }, [centerTileX, centerTileY, centerWorld.x, centerWorld.y, maxTile, view.zoom])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return
    if ((e.target as HTMLElement).closest("[data-map-interactive='true']")) {
      return
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startWorldX: centerWorld.x,
      startWorldY: centerWorld.y,
      moved: false,
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDragging) return
    const deltaX = e.clientX - dragRef.current.startX
    const deltaY = e.clientY - dragRef.current.startY
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      dragRef.current.moved = true
    }
    const nextWorldX = dragRef.current.startWorldX - deltaX
    const nextWorldY = dragRef.current.startWorldY - deltaY
    const nextLatLng = worldPixelToLatLng(nextWorldX, nextWorldY, view.zoom)
    setView((prev) => ({
      ...prev,
      lat: nextLatLng.lat,
      lng: nextLatLng.lng,
    }))
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDragging) return
    dragRef.current.isDragging = false
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  const handleZoom = (delta: number) => {
    setView((prev) => ({
      ...prev,
      zoom: Math.max(6, Math.min(17, prev.zoom + delta)),
    }))
  }

  const handleResetView = () => {
    setView({
      lat: centerLat,
      lng: centerLng,
      zoom: initialZoom,
    })
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={cn(
        "relative size-full overflow-hidden bg-zinc-200 select-none dark:bg-zinc-900",
        interactive && "cursor-grab active:cursor-grabbing",
        className
      )}
    >
      {/* Web Mercator Tile Layer Anchored at Viewport Center (50%, 50%) */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-0">
        {tiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.url}
            alt=""
            draggable={false}
            style={{
              left: `${tile.left}px`,
              top: `${tile.top}px`,
              width: `${TILE_SIZE}px`,
              height: `${TILE_SIZE}px`,
            }}
            className="absolute max-w-none opacity-80 grayscale contrast-95 filter dark:invert dark:hue-rotate-180 dark:opacity-45"
          />
        ))}
      </div>

      {/* Coordinate-Projected Markers Layer Anchored at Viewport Center (50%, 50%) */}
      <div className=" absolute top-1/2 left-1/2 z-20 size-0">
        {markers.map((marker) => {
          const pt = latLngToWorldPixel(marker.lat, marker.lng, view.zoom)
          const left = Math.round(pt.x - centerWorld.x)
          const top = Math.round(pt.y - centerWorld.y)
          const isSelected = activeMarkerId === marker.id

          if (markerStyle === "photo-pin") {
            const content = (
              <>
                <div
                  className={cn(
                    "relative size-11 overflow-hidden rounded-full border-2 bg-zinc-100 shadow-md transition-transform duration-200 group-hover:scale-110",
                    isSelected
                      ? "border-primary ring-primary/40 scale-110 ring-4"
                      : "border-white dark:border-zinc-800"
                  )}
                >
                  {marker.image && (
                    <img
                      src={marker.image}
                      alt={marker.title}
                      className="size-full object-cover"
                    />
                  )}
                </div>
                <span className="pointer-events-none absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-white shadow-xs dark:bg-zinc-800" />
                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900/90 px-2.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                  {marker.title}
                </div>
              </>
            )

            return marker.href ? (
              <Link
                key={marker.id}
                href={marker.href}
                data-map-interactive="true"
                style={{ left: `${left}px`, top: `${top}px` }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              >
                {content}
              </Link>
            ) : (
              <button
                key={marker.id}
                type="button"
                data-map-interactive="true"
                onClick={() => onSelectMarker?.(marker.id)}
                style={{ left: `${left}px`, top: `${top}px` }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              >
                {content}
              </button>
            )
          }

          // Default: "price-pill" marker positioned at exact (lat, lng)
          return (
            <button
              key={marker.id}
              type="button"
              data-map-interactive="true"
              onClick={() => {
                onSelectMarker?.(marker.id)
                setView((prev) => ({
                  ...prev,
                  lat: marker.lat,
                  lng: marker.lng,
                }))
              }}
              style={{ left: `${left}px`, top: `${top}px` }}
              className={cn(
                "group absolute -translate-x-1/2 -translate-y-full transition-all duration-200",
                isSelected ? "z-30 scale-110" : "z-20 hover:z-30 hover:scale-105"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold whitespace-nowrap shadow-md transition-colors",
                  isSelected
                    ? "border-zinc-950 bg-primary text-primary-foreground ring-4 ring-lime-400/40"
                    : "border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-950 hover:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                )}
              >
                <Warehouse className="size-3 shrink-0" />
                <span>{marker.priceLabel || marker.title}</span>
              </div>
              <span
                className={cn(
                  "mx-auto block size-2 -translate-y-1 rotate-45",
                  isSelected ? "bg-primary" : "bg-white dark:bg-zinc-900"
                )}
              />
            </button>
          )
        })}
      </div>

      {/* Zoom & Recenter Controls */}
      {showControls && (
        <div
          data-map-interactive="true"
          className="absolute top-14 right-3 z-30 flex flex-col gap-1.5"
        >
          <button
            type="button"
            onClick={() => handleZoom(1)}
            aria-label="Zoom in"
            className="flex size-8 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/95 text-zinc-800 shadow-sm backdrop-blur-xs transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/95 dark:text-zinc-200"
          >
            <Plus className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(-1)}
            aria-label="Zoom out"
            className="flex size-8 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/95 text-zinc-800 shadow-sm backdrop-blur-xs transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/95 dark:text-zinc-200"
          >
            <Minus className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            title="Recenter map"
            aria-label="Recenter map"
            className="flex size-8 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/95 text-zinc-800 shadow-sm backdrop-blur-xs transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/95 dark:text-zinc-200"
          >
            <Compass className="size-4" />
          </button>
        </div>
      )}

      {/* Subtle Attribution Pill */}
      <a
        href="https://www.openstreetmap.org"
        target="_blank"
        rel="noopener noreferrer"
        data-map-interactive="true"
        className="absolute right-3 bottom-2 z-20 rounded bg-white/80 px-2 py-0.5 text-[10px] text-zinc-500 backdrop-blur-xs hover:text-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400"
      >
        © OpenStreetMap • {view.lat.toFixed(4)}°N, {view.lng.toFixed(4)}°E
      </a>

      {children}
    </div>
  )
}
