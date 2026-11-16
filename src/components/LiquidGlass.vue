<template>
  <component
    :is="tag"
    ref="rootEl"
    :class="['liquid-glass', svgMode ? 'liquid-glass--svg' : 'liquid-glass--fallback']"
    :style="rootStyle"
  >
    <!-- Per-instance SVG filter (Chromium only): refraction + specular rim -->
    <svg
      v-if="svgMode && maps"
      class="liquid-glass__defs"
      width="0"
      height="0"
      aria-hidden="true"
      color-interpolation-filters="sRGB"
    >
      <defs>
        <filter :id="filterId" x="0%" y="0%" width="100%" height="100%">
          <feGaussianBlur in="SourceGraphic" :stdDeviation="svgBlur" result="blurred_source" />
          <feImage :href="maps.displacement" x="0" y="0" :width="maps.width" :height="maps.height" result="disp_map" />
          <feDisplacementMap
            in="blurred_source"
            in2="disp_map"
            :scale="maps.scale"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feColorMatrix in="displaced" type="saturate" :values="specularSaturation" result="displaced_sat" />
          <feImage :href="maps.specular" x="0" y="0" :width="maps.width" :height="maps.height" result="spec_layer" />
          <feComposite in="displaced_sat" in2="spec_layer" operator="in" result="spec_masked" />
          <feComponentTransfer in="spec_layer" result="spec_faded">
            <feFuncA type="linear" :slope="specularOpacity" />
          </feComponentTransfer>
          <feBlend in="spec_masked" in2="displaced" mode="normal" result="with_sat" />
          <feBlend in="spec_faded" in2="with_sat" mode="normal" />
        </filter>
      </defs>
    </svg>

    <!-- Backdrop layer: SVG refraction in Chromium, blur+saturate elsewhere -->
    <span class="liquid-glass__backdrop" aria-hidden="true" />
    <!-- Tint + inner glow + rim highlight -->
    <span class="liquid-glass__tint" aria-hidden="true" />

    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from 'vue'
import { buildGlassMaps, glassBlurPx, supportsSvgBackdrop, type GlassFilterMaps, type SurfaceKind } from '../utils/liquidGlass'

const props = withDefaults(
  defineProps<{
    /** Element/component to render as the glass root. */
    tag?: string
    /** Corner radius in px. Use 'pill' for fully rounded ends (height / 2). */
    radius?: number | 'pill'
    /** Glass thickness — bigger = stronger edge refraction. */
    thickness?: number
    /** Width of the curved bezel (refracting edge zone) in px. */
    bezel?: number
    /** Index of refraction. */
    ior?: number
    /** Multiplier applied to the displacement strength. */
    scaleRatio?: number
    /**
     * Blur multiplier. The actual blur follows the global settings slider
     * (glassBlurPx, 4–40px): SVG stdDeviation = glassBlurPx × 0.1 × blur,
     * fallback CSS blur = glassBlurPx × 0.8 × blur.
     */
    blur?: number
    /** Opacity of the specular rim highlight (0-1). */
    specularOpacity?: number
    /** Saturation boost of the backdrop seen through the rim. */
    specularSaturation?: number
    /** Surface curvature profile. */
    surface?: SurfaceKind
    /** Tint colour laid over the glass (any CSS colour). */
    tint?: string
    /** Force the fallback rendering (for testing). */
    forceFallback?: boolean
  }>(),
  {
    tag: 'div',
    radius: 'pill',
    thickness: 80,
    bezel: 28,
    ior: 3,
    scaleRatio: 1,
    blur: 1,
    specularOpacity: 0.5,
    specularSaturation: 4,
    surface: 'convex_squircle',
    tint: 'rgba(255, 255, 255, 0.12)',
    forceFallback: false,
  },
)

const rootEl = ref<HTMLElement | { $el: HTMLElement } | null>(null)
const size = ref({ w: 0, h: 0 })
const maps = shallowRef<GlassFilterMaps | null>(null)
const svgMode = ref(false)
const filterId = `liquid-glass-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

const svgBlur = computed(() => +(glassBlurPx.value * 0.1 * props.blur).toFixed(2))

const radiusPx = computed(() =>
  props.radius === 'pill' ? Math.max(1, Math.floor(size.value.h / 2)) : props.radius,
)

const rootStyle = computed(() => ({
  borderRadius: props.radius === 'pill' ? '9999px' : `${props.radius}px`,
  '--lg-filter': `url(#${filterId})`,
  '--lg-tint': props.tint,
  '--lg-fallback-blur': `${(glassBlurPx.value * 0.8 * props.blur).toFixed(1)}px`,
}))

function el(): HTMLElement | null {
  const r = rootEl.value as any
  return r ? (r.$el ?? r) : null
}

let raf = 0
function rebuild() {
  if (!svgMode.value) return
  const { w, h } = size.value
  maps.value = buildGlassMaps({
    width: w,
    height: h,
    radius: radiusPx.value,
    thickness: props.thickness,
    bezel: props.bezel,
    ior: props.ior,
    scaleRatio: props.scaleRatio,
    surface: props.surface,
  })
}
function scheduleRebuild() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(rebuild)
}

let ro: ResizeObserver | null = null
onMounted(() => {
  svgMode.value = !props.forceFallback && supportsSvgBackdrop()
  const node = el()
  if (!node) return
  const measure = () => {
    const w = node.offsetWidth
    const h = node.offsetHeight
    if (w !== size.value.w || h !== size.value.h) size.value = { w, h }
  }
  measure()
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(measure)
    ro.observe(node)
  }
})

watch(
  () => [size.value, svgMode.value, props.radius, props.thickness, props.bezel, props.ior, props.scaleRatio, props.surface],
  scheduleRebuild,
)

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
})
</script>
