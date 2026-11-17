import { computed, ref } from 'vue'
import {
  DEFAULT_THEME_ID,
  THEME_PRESETS,
  THEME_STORAGE_KEY,
  applyThemeVars,
  resolveTheme,
  themeVars,
  type ResolvedTheme,
  type ThemeChoice,
} from '../utils/theme'

/** Persisted shape. `vars` lets index.html apply the theme before first paint. */
interface StoredTheme extends ThemeChoice {
  vars: Record<string, string>
}

function readStored(): ThemeChoice {
  const fallback = THEME_PRESETS.find((p) => p.id === DEFAULT_THEME_ID)!
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    if (raw) {
      const s = JSON.parse(raw) as Partial<StoredTheme>
      const hex = /^#[0-9a-f]{6}$/i
      if (s && typeof s.preset === 'string' && hex.test(s.primary ?? '') && hex.test(s.accent ?? '')) {
        return { preset: s.preset, primary: s.primary!, accent: s.accent! }
      }
    }
  } catch {
    /* ignore */
  }
  return { preset: fallback.id, primary: fallback.primary, accent: fallback.accent }
}

// module-level singleton: the theme is global
const theme = ref<ResolvedTheme>(resolveTheme(readStored()))

function commit(choice: ThemeChoice) {
  const resolved = resolveTheme(choice)
  theme.value = resolved
  const vars = themeVars(resolved)
  applyThemeVars(vars)
  try {
    const stored: StoredTheme = { preset: resolved.preset, primary: resolved.primary, accent: resolved.accent, vars }
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(stored))
  } catch {
    /* storage full / disabled: theme still applies for this session */
  }
}

export function useTheme() {
  const isCustom = computed(() => theme.value.preset === 'custom')

  const selectPreset = (id: string) => {
    const p = THEME_PRESETS.find((t) => t.id === id)
    if (p) commit({ preset: p.id, primary: p.primary, accent: p.accent })
  }

  /** Switch to custom, starting from the current colours. */
  const enterCustom = () => {
    if (!isCustom.value) commit({ preset: 'custom', primary: theme.value.primary, accent: theme.value.accent })
  }

  let raf = 0
  let pending: ThemeChoice | null = null
  const setCustomColor = (which: 'primary' | 'accent', hex: string) => {
    // build on a not-yet-committed change too, so two quick edits don't overwrite each other
    const base = pending ?? theme.value
    pending = { preset: 'custom', primary: base.primary, accent: base.accent, [which]: hex }
    // colour inputs fire `input` continuously while dragging; coalesce to one update per frame
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      if (pending) commit(pending)
      pending = null
    })
  }

  /** Re-apply on startup (the pre-paint script may be missing in dev tooling, or stale). */
  const initTheme = () => applyThemeVars(themeVars(theme.value))

  return { theme, isCustom, presets: THEME_PRESETS, selectPreset, enterCustom, setCustomColor, initTheme }
}
