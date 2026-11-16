/**
 * Liquid Glass helpers.
 *
 * Ported (and lightly adapted) from archisvaze/liquid-glass (MIT License,
 * Copyright (c) 2026 Archis Vaze) — https://github.com/archisvaze/liquid-glass
 *
 * How it works:
 *  1. A 1-D refraction profile is computed with Snell's law for a glass "bezel"
 *     whose surface follows a height function (convex squircle by default).
 *  2. That profile is painted into a 2-D displacement map (R = x offset,
 *     G = y offset, 128 = no offset) shaped like a rounded rectangle.
 *  3. A specular map paints a bright rim whose intensity depends on the angle
 *     between the edge normal and a fixed light direction.
 *  4. Both maps are fed to an SVG <filter> (feDisplacementMap + feImage) which is
 *     applied to the backdrop with `backdrop-filter: url(#id)` — Chromium only.
 */

import { ref } from 'vue'

export type SurfaceKind = 'convex_squircle' | 'convex_circle' | 'concave' | 'lip'

export const SURFACE_FNS: Record<SurfaceKind, (x: number) => number> = {
  convex_squircle: (x) => Math.pow(1 - Math.pow(1 - x, 4), 0.25),
  convex_circle: (x) => Math.sqrt(1 - (1 - x) * (1 - x)),
  concave: (x) => 1 - Math.sqrt(1 - (1 - x) * (1 - x)),
  lip: (x) => {
    const convex = Math.pow(1 - Math.pow(1 - Math.min(x * 2, 1), 4), 0.25)
    const concave = 1 - Math.sqrt(1 - (1 - x) * (1 - x)) + 0.1
    const t = 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3
    return convex * (1 - t) + concave * t
  },
}

/** True when the browser can render SVG filters inside backdrop-filter (Chromium family). */
export function supportsSvgBackdrop(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  const uad = (navigator as any).userAgentData
  const chromium =
    (uad && Array.isArray(uad.brands) && uad.brands.some((b: any) => /Chromium/.test(b.brand))) ||
    /\bChrome\//.test(navigator.userAgent)
  const cssOk =
    typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('backdrop-filter', 'url(#a)')
  return !!chromium && cssOk
}

export function calculateRefractionProfile(
  glassThickness: number,
  bezelWidth: number,
  heightFn: (x: number) => number,
  ior: number,
  samples = 128,
): Float64Array {
  const eta = 1 / ior
  const refract = (nx: number, ny: number): [number, number] | null => {
    const dot = ny
    const k = 1 - eta * eta * (1 - dot * dot)
    if (k < 0) return null
    const sq = Math.sqrt(k)
    return [-(eta * dot + sq) * nx, eta - (eta * dot + sq) * ny]
  }
  const profile = new Float64Array(samples)
  for (let i = 0; i < samples; i++) {
    const x = i / samples
    const y = heightFn(x)
    const dx = x < 1 ? 0.0001 : -0.0001
    const deriv = (heightFn(x + dx) - y) / dx
    const mag = Math.sqrt(deriv * deriv + 1)
    const ref = refract(-deriv / mag, -1 / mag)
    profile[i] = ref ? ref[0] * ((y * bezelWidth + glassThickness) / ref[1]) : 0
  }
  return profile
}

function newCanvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  return { c, ctx, img: ctx.createImageData(w, h) }
}

export function generateDisplacementMap(
  w: number,
  h: number,
  radius: number,
  bezelWidth: number,
  profile: Float64Array,
  maxDisp: number,
): string {
  const { c, ctx, img } = newCanvas(w, h)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    d[i] = 128
    d[i + 1] = 128
    d[i + 2] = 0
    d[i + 3] = 255
  }
  const r = radius
  const rSq = r * r
  const r1Sq = (r + 1) ** 2
  const rBSq = Math.max(r - bezelWidth, 0) ** 2
  const wB = w - r * 2
  const hB = h - r * 2
  const S = profile.length
  for (let y1 = 0; y1 < h; y1++) {
    for (let x1 = 0; x1 < w; x1++) {
      const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0
      const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0
      const dSq = x * x + y * y
      if (dSq > r1Sq || dSq < rBSq) continue
      const dist = Math.sqrt(dSq)
      const fromSide = r - dist
      const op = dSq < rSq ? 1 : 1 - (dist - r) / (Math.sqrt(r1Sq) - r)
      if (op <= 0 || dist === 0) continue
      const cos = x / dist
      const sin = y / dist
      const bi = Math.min(((fromSide / bezelWidth) * S) | 0, S - 1)
      const disp = profile[bi] || 0
      const dX = (-cos * disp) / maxDisp
      const dY = (-sin * disp) / maxDisp
      const idx = (y1 * w + x1) * 4
      d[idx] = (128 + dX * 127 * op + 0.5) | 0
      d[idx + 1] = (128 + dY * 127 * op + 0.5) | 0
    }
  }
  ctx.putImageData(img, 0, 0)
  return c.toDataURL()
}

export function generateSpecularMap(w: number, h: number, radius: number, bezelWidth: number, angle = Math.PI / 3): string {
  const { c, ctx, img } = newCanvas(w, h)
  const d = img.data
  const r = radius
  const rSq = r * r
  const r1Sq = (r + 1) ** 2
  const rBSq = Math.max(r - bezelWidth, 0) ** 2
  const wB = w - r * 2
  const hB = h - r * 2
  const sv = [Math.cos(angle), Math.sin(angle)]
  for (let y1 = 0; y1 < h; y1++) {
    for (let x1 = 0; x1 < w; x1++) {
      const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0
      const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0
      const dSq = x * x + y * y
      if (dSq > r1Sq || dSq < rBSq) continue
      const dist = Math.sqrt(dSq)
      const fromSide = r - dist
      const op = dSq < rSq ? 1 : 1 - (dist - r) / (Math.sqrt(r1Sq) - r)
      if (op <= 0 || dist === 0) continue
      const cos = x / dist
      const sin = -y / dist
      const dot = Math.abs(cos * sv[0] + sin * sv[1])
      const edge = Math.sqrt(Math.max(0, 1 - (1 - fromSide) ** 2))
      const coeff = dot * edge
      const col = (255 * coeff) | 0
      const idx = (y1 * w + x1) * 4
      d[idx] = col
      d[idx + 1] = col
      d[idx + 2] = col
      d[idx + 3] = (col * coeff * op) | 0
    }
  }
  ctx.putImageData(img, 0, 0)
  return c.toDataURL()
}

export interface GlassFilterOptions {
  width: number
  height: number
  radius: number
  thickness: number
  bezel: number
  ior: number
  scaleRatio: number
  surface: SurfaceKind
}

export interface GlassFilterMaps {
  width: number
  height: number
  displacement: string
  specular: string
  scale: number
}

const cache = new Map<string, GlassFilterMaps>()

/** Build (and memoise) the displacement + specular maps for one glass size. */
export function buildGlassMaps(o: GlassFilterOptions): GlassFilterMaps | null {
  const w = Math.round(o.width)
  const h = Math.round(o.height)
  if (w < 2 || h < 2) return null
  const radius = Math.max(1, Math.floor(Math.min(o.radius, w / 2, h / 2)))
  const bezel = Math.max(1, Math.min(o.bezel, radius - 1, Math.min(w, h) / 2 - 1))
  const key = [w, h, radius, bezel, o.thickness, o.ior, o.scaleRatio, o.surface].join('|')
  const hit = cache.get(key)
  if (hit) return hit
  const profile = calculateRefractionProfile(o.thickness, bezel, SURFACE_FNS[o.surface], o.ior, 128)
  let maxDisp = 0
  for (const v of profile) maxDisp = Math.max(maxDisp, Math.abs(v))
  maxDisp = maxDisp || 1
  const maps: GlassFilterMaps = {
    width: w,
    height: h,
    displacement: generateDisplacementMap(w, h, radius, bezel, profile, maxDisp),
    specular: generateSpecularMap(w, h, radius, bezel * 2.5),
    scale: maxDisp * o.scaleRatio,
  }
  if (cache.size > 24) cache.clear()
  cache.set(key, maps)
  return maps
}

/* ------------------------------------------------------------------
 * Global blur setting shared by every <LiquidGlass>.
 * App.vue keeps this in sync with the settings "毛玻璃模糊强度" slider
 * (same value it writes to the --glass-blur CSS variable, 4–40px).
 * ------------------------------------------------------------------ */
export const glassBlurPx = ref(22)

export function setGlassBlur(px: number) {
  if (Number.isFinite(px)) glassBlurPx.value = px
}
