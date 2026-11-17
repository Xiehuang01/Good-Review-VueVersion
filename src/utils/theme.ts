/**
 * Theme colours: presets + algorithmic shade scales.
 *
 * Every Tailwind `brand-*` / `ember-*` (alias `accent-*`) / `sage-*` class reads a CSS
 * variable holding an "R G B" triplet (see tailwind.config.js), so writing new values to
 * <html style> re-themes the whole app live.
 *
 * The chosen theme is stored in localStorage together with the *computed* variables, so the
 * tiny inline script in index.html can apply them before first paint without shipping this
 * module (no flash of the default theme).
 */

export const THEME_STORAGE_KEY = 'goodreview-theme'
export const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const
export type Shade = (typeof SHADES)[number]
export type Scale = Record<Shade, string> // hex values

/* ------------------------------------------------------------------ colour math (OKLCH) */

type RGB = [number, number, number]

export function hexToRgb(hex: string): RGB {
  let h = hex.replace('#', '').trim()
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h.slice(0, 6), 16)
  if (!Number.isFinite(n)) return [0, 0, 0]
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function rgbToHex([r, g, b]: RGB): string {
  return '#' + [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('').toUpperCase()
}

const toLin = (c: number) => {
  c /= 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}
const fromLin = (c: number) => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)

function rgbToOklch(rgb: RGB): [number, number, number] {
  const [r, g, b] = rgb.map(toLin)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return [L, Math.hypot(A, B), ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360]
}

/** OKLCH → linear sRGB (unclamped, so callers can test gamut). */
function oklchToLinear(L: number, C: number, H: number): RGB {
  const a = C * Math.cos((H * Math.PI) / 180)
  const b = C * Math.sin((H * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

/** OKLCH → sRGB hex, reducing chroma until the colour fits the sRGB gamut. */
function oklchToHex(L: number, C: number, H: number): string {
  let c = C
  for (let i = 0; i < 24; i++) {
    const lin = oklchToLinear(L, c, H)
    if (lin.every((v) => v >= -0.0005 && v <= 1.0005)) return rgbToHex(lin.map(fromLin) as RGB)
    c *= 0.9
  }
  return rgbToHex(oklchToLinear(L, 0, H).map(fromLin) as RGB)
}

function luminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map(toLin)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export function contrastRatio(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

/* ------------------------------------------------------------------ scale generation */

// where each lighter shade sits between the 500 lightness and near-white
const LIGHT_MIX: Partial<Record<Shade, number>> = { 50: 0.93, 100: 0.84, 200: 0.66, 300: 0.45, 400: 0.22 }
// darker shades step down from 500 by a fraction of the remaining range
const DARK_MIX: Partial<Record<Shade, number>> = { 600: 0.2, 700: 0.42, 800: 0.62, 900: 0.82 }
// keep chroma highest around 400–600, soften the pastel and very dark ends
const CHROMA: Record<Shade, number> = { 50: 0.22, 100: 0.38, 200: 0.62, 300: 0.82, 400: 0.95, 500: 1, 600: 0.95, 700: 0.86, 800: 0.76, 900: 0.66 }

/**
 * Build a 50–900 scale from one colour. The picked colour's hue & chroma drive the scale;
 * its lightness is clamped into a usable 500 range, then 500/600 are darkened if needed so
 * white button text stays readable (≥3:1 on 500 for bold UI text, ≥4.5:1 on 600).
 */
export function generateScale(baseHex: string): Scale {
  const [L0, C0, H] = rgbToOklch(hexToRgb(baseHex))
  let L500 = Math.min(0.66, Math.max(0.4, L0))
  const make = (L500v: number): Scale => {
    const top = 0.985
    const bottom = Math.max(0.16, L500v - 0.36)
    const out = {} as Scale
    for (const s of SHADES) {
      const L = s < 500 ? L500v + (top - L500v) * LIGHT_MIX[s]! : s === 500 ? L500v : L500v - (L500v - bottom) * DARK_MIX[s]!
      out[s] = oklchToHex(L, C0 * CHROMA[s], H)
    }
    return out
  }
  let scale = make(L500)
  for (let i = 0; i < 40; i++) {
    if (contrastRatio(scale[500], '#FFFFFF') >= 3 && contrastRatio(scale[600], '#FFFFFF') >= 4.5) break
    L500 -= 0.01
    scale = make(L500)
  }
  return scale
}

/* ------------------------------------------------------------------ presets */

export interface ThemePreset {
  id: string
  name: { cn: string; en: string }
  primary: string // swatch / picker value (≈ 500)
  accent: string
  /** Hand-tuned scales (only the original default ships exact values). */
  brandScale?: Scale
  accentScale?: Scale
}

const HARBOR: Scale = {
  50: '#EEF4F7', 100: '#DAE7EE', 200: '#B3CEDD', 300: '#83AFC7', 400: '#4C88AA',
  500: '#2A6B90', 600: '#1E5677', 700: '#184562', 800: '#14384F', 900: '#0F2A3B',
}
const EMBER: Scale = {
  50: '#FDF3EE', 100: '#FBE3D7', 200: '#F6C4AB', 300: '#EFA17D', 400: '#E6825A',
  500: '#D7673E', 600: '#B7522F', 700: '#924128', 800: '#6E3221', 900: '#4E2418',
}
export const SAGE: Scale = {
  50: '#F0F6F2', 100: '#DDEBE2', 200: '#BAD7C5', 300: '#8FBDA1', 400: '#62A07B',
  500: '#3F845C', 600: '#306A49', 700: '#27543B', 800: '#1F4230', 900: '#183326',
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'harbor', name: { cn: '港湾蓝 · 余烬橙', en: 'Harbor & Ember' }, primary: '#2A6B90', accent: '#D7673E', brandScale: HARBOR, accentScale: EMBER },
  { id: 'mint', name: { cn: '薄荷绿 · 奶油黄', en: 'Mint & Butter' }, primary: '#4E9A7A', accent: '#D9A441' },
  { id: 'ink', name: { cn: '墨黑 · 琥珀', en: 'Ink & Amber' }, primary: '#34404D', accent: '#D08A1E' },
  { id: 'pine', name: { cn: '松绿 · 铜', en: 'Pine & Copper' }, primary: '#2F6E62', accent: '#BF7340' },
  { id: 'tea', name: { cn: '红茶 · 樱粉', en: 'Black Tea & Sakura' }, primary: '#8E4A3C', accent: '#D9708A' },
  { id: 'mist', name: { cn: '雾紫 · 杏', en: 'Mist & Apricot' }, primary: '#6A6386', accent: '#E0904F' },
]

export const DEFAULT_THEME_ID = 'harbor'

export interface ThemeChoice {
  preset: string // preset id or 'custom'
  primary: string
  accent: string
}

export interface ResolvedTheme extends ThemeChoice {
  brand: Scale
  accentScale: Scale
}

export function resolveTheme(choice: ThemeChoice): ResolvedTheme {
  const p = THEME_PRESETS.find((t) => t.id === choice.preset)
  if (p) {
    return {
      preset: p.id,
      primary: p.primary,
      accent: p.accent,
      brand: p.brandScale ?? generateScale(p.primary),
      accentScale: p.accentScale ?? generateScale(p.accent),
    }
  }
  return { ...choice, preset: 'custom', brand: generateScale(choice.primary), accentScale: generateScale(choice.accent) }
}

const triplet = (hex: string) => hexToRgb(hex).join(' ')

/** CSS custom properties for a theme ("R G B" triplets for Tailwind's alpha syntax). */
export function themeVars(t: ResolvedTheme): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const s of SHADES) {
    vars[`--brand-${s}`] = triplet(t.brand[s])
    vars[`--accent-${s}`] = triplet(t.accentScale[s])
  }
  return vars
}

export function applyThemeVars(vars: Record<string, string>) {
  if (typeof document === 'undefined') return
  const st = document.documentElement.style
  for (const [k, v] of Object.entries(vars)) st.setProperty(k, v)
}
