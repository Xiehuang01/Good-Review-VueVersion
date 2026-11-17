<template>
  <div 
    class="fixed inset-0 w-full h-[100dvh] font-sans text-slate-800 overflow-hidden"
    :class="hasPhotoBg ? 'bg-brand-900' : 'bg-paper-100'"
    :style="activeBackground ? { backgroundImage: `url(${activeBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', transition: 'background-image 0.6s ease' } : {}"
  >
    
    <!-- Custom Background Image Overlay (if image exists) -->
    <div v-if="hasPhotoBg" class="absolute inset-0 bg-gradient-to-b from-brand-900/35 via-brand-900/15 to-brand-900/35"></div>
    
    <!-- Animated Background (only show if no custom image) -->
    <!-- Warm paper base + a few soft harbor-blue / coral / sand light fields and a faint study grid,
         so the Liquid Glass surfaces have something to refract without getting loud -->
    <div v-if="!hasPhotoBg" class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[-20%] left-[-14%] w-[56vw] h-[56vw] bg-brand-300 rounded-full filter blur-3xl opacity-40 animate-blob"></div>
      <div class="absolute top-[-24%] right-[-10%] w-[40vw] h-[40vw] bg-ember-200 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
      <div class="absolute top-[-8%] left-[40%] w-[22vw] h-[22vw] bg-paper-300 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-1000"></div>
      <div class="absolute top-[40%] left-[28%] w-[44vw] h-[44vw] bg-brand-200 rounded-full filter blur-3xl opacity-35 animate-blob animation-delay-3000"></div>
      <div class="absolute bottom-[-14%] right-[-10%] w-[48vw] h-[48vw] bg-ember-100 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute inset-0 bg-study-grid"></div>
    </div>

    <!-- Scrollable Container -->
    <div 
      class="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden pb-safe scroll-smooth"
      @click="showSettingsDropdown = false"
    >
      <!-- Glass Navigation -->
      <!-- Liquid Glass Navigation (see components/LiquidGlass.vue) -->
      <LiquidGlass
        v-if="!isQuizRoute"
        tag="nav"
        radius="pill"
        :thickness="80"
        :bezel="28"
        :blur="hasPhotoBg ? 0.8 : 0.3"
        :tint="hasPhotoBg ? 'rgba(255, 255, 255, 0.10)' : 'rgba(255, 255, 255, 0.16)'"
        class="sticky top-4 z-50 mx-4 sm:mx-8 mt-4 mb-4 transition-all"
        :class="{ 'nav--cc-open': showSettingsDropdown }"
      >
        <div class="px-4 sm:px-7">
          <div class="flex justify-between items-center h-14 sm:h-16">
            
            <!-- Logo Area -->
            <router-link 
              to="/"
              class="flex items-center cursor-pointer group select-none flex-shrink-0"
            >
              <img
                :src="logoSrc"
                :srcset="`${logoSrc} 2x, ${logoSrc3x} 3x`"
                alt="Good Review"
                width="40"
                height="40"
                decoding="async"
                draggable="false"
                class="w-9 h-9 sm:w-10 sm:h-10 mr-2 sm:mr-3 shrink-0 drop-shadow-[0_2px_4px_rgb(var(--brand-900)/0.18)] group-hover:scale-110 transition-transform duration-300"
              />
              <span :class="[
                'font-black text-lg sm:text-xl tracking-tight group-hover:text-brand-700 transition-colors',
                hasPhotoBg ? 'text-white drop-shadow-lg' : 'text-slate-800/90'
              ]">
                <span class="hidden sm:inline">Good Review</span>
                <span class="sm:hidden">GR</span>
              </span>
            </router-link>
            
            <!-- Nav Items -->
            <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <router-link 
                to="/"
                :class="[
                  'px-2 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5',
                  $route.name === 'Home' 
                    ? (hasPhotoBg ? 'bg-white/80 text-slate-800 shadow-sm ring-1 ring-white/60' : 'bg-white/75 text-brand-700 shadow-sm ring-1 ring-white/80')
                    : (hasPhotoBg ? 'text-white/90 hover:text-white hover:bg-white/20 drop-shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-white/30')
                ]"
              >
                <Layout :size="16" :stroke-width="2.5" />
                <span class="hidden md:inline">{{ t('app.nav.guide') }}</span>
              </router-link>
              <router-link 
                to="/import"
                :class="[
                  'px-2 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5',
                  $route.name === 'Import' 
                    ? (hasPhotoBg ? 'bg-white/80 text-slate-800 shadow-sm ring-1 ring-white/60' : 'bg-white/75 text-brand-700 shadow-sm ring-1 ring-white/80')
                    : (hasPhotoBg ? 'text-white/90 hover:text-white hover:bg-white/20 drop-shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-white/30')
                ]"
              >
                <Import :size="16" :stroke-width="2.5" />
                <span class="hidden md:inline">{{ t('app.nav.import') }}</span>
              </router-link>
              <router-link 
                to="/dashboard"
                :class="[
                  'px-2 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 relative',
                  $route.name === 'Dashboard' 
                    ? (hasPhotoBg ? 'bg-white/80 text-slate-800 shadow-sm ring-1 ring-white/60' : 'bg-white/75 text-brand-700 shadow-sm ring-1 ring-white/80')
                    : (hasPhotoBg ? 'text-white/90 hover:text-white hover:bg-white/20 drop-shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-white/30')
                ]"
              >
                <BookMarked :size="16" :stroke-width="2.5" />
                <span class="hidden md:inline">{{ t('app.nav.banks') }}</span>
                <span v-if="bankStore.banks.value.length > 0" class="absolute -top-1 -right-1 flex h-2 w-2 sm:h-auto sm:w-auto">
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-ember-500 sm:bg-ember-500 sm:text-white sm:px-1.5 sm:py-0.5 sm:text-[10px] sm:h-auto sm:w-auto justify-center items-center">
                    <span class="hidden sm:inline">{{ bankStore.banks.value.length }}</span>
                  </span>
                </span>
              </router-link>

              <div :class="[
                'w-px h-4 sm:h-5 mx-0.5 sm:mx-1',
                hasPhotoBg ? 'bg-white/30' : 'bg-slate-300/50'
              ]" />

              <button
                @click="toggleLanguage"
                :class="[
                  'p-1.5 sm:p-2 rounded-xl hover:text-brand-600 transition-all',
                  hasPhotoBg ? 'hover:bg-white/20 text-white/90 drop-shadow' : 'hover:bg-white/40 text-slate-500'
                ]"
              >
                <Languages :size="18" :stroke-width="2.5" />
              </button>

              <!-- GitHub Button -->
              <button
                @click="showGithubModal = true"
                :class="[
                  'p-1.5 sm:p-2 rounded-xl transition-all',
                  hasPhotoBg ? 'hover:bg-white/20 text-white/90 hover:text-white drop-shadow' : 'hover:bg-white/40 text-slate-500 hover:text-slate-800'
                ]"
                title="GitHub Repository"
              >
                <Github :size="18" :stroke-width="2.5" />
              </button>

              <!-- Settings Button
                   (no `relative` here on purpose: the dropdown is positioned against the
                    sticky <nav> itself, so `top-full mt-3` = 12px below the nav's bottom edge,
                    same as the module gaps, and its right edge lines up with the nav) -->
              <div>
                <button
                  @click.stop="showSettingsDropdown = !showSettingsDropdown"
                  :class="[
                    'p-1.5 sm:p-2 rounded-xl transition-all',
                    hasPhotoBg ? 'hover:bg-white/20 text-white/90 hover:text-white drop-shadow' : 'hover:bg-white/40 text-slate-500 hover:text-slate-800'
                  ]"
                  :title="t('app.settings.title')"
                >
                  <Settings :size="18" :stroke-width="2.5" />
                </button>

                <!-- Settings Dropdown — macOS Tahoe "Control Center" style.
                     No container panel: a transparent layout wrapper, every module is its own LiquidGlass. -->
                <div
                  v-if="showSettingsDropdown"
                  class="settings-dropdown cc-layout absolute left-0 right-0 sm:left-auto top-full mt-2 sm:w-[348px] animate-glass-in z-[60]"
                  @click.stop
                >
                  <div class="grid grid-cols-4 gap-2.5 text-white select-none">

                    <!-- Left column: pill toggles -->
                    <div class="col-span-2 row-span-3 flex flex-col gap-2.5">
                      <!-- Language -->
                      <LiquidGlass tag="button" radius="pill" v-bind="ccGlass" class="cc-glass cc-toggle"
                        :aria-pressed="language === 'cn'" @click="toggleLanguage">
                        <span :class="['cc-icon-circle', language === 'cn' ? 'is-on' : '']"><Languages :size="17" :stroke-width="2.4" /></span>
                        <span class="min-w-0 text-left">
                          <span class="cc-title">{{ t('app.settings.language') }}</span>
                          <span class="cc-sub">{{ language === 'cn' ? '简体中文' : 'English' }}</span>
                        </span>
                      </LiquidGlass>
                      <!-- 小巧思 -->
                      <LiquidGlass tag="button" radius="pill" v-bind="ccGlass" class="cc-glass cc-toggle"
                        :disabled="!hasPhotoBg" :aria-pressed="smartBlurEnabled" :title="t('app.settings.smartBlurDesc')"
                        @click="smartBlurEnabled = !smartBlurEnabled; handleSmartBlurToggle()">
                        <span :class="['cc-icon-circle', smartBlurEnabled ? 'is-on' : '']"><Sparkles :size="17" :stroke-width="2.4" /></span>
                        <span class="min-w-0 text-left">
                          <span class="cc-title">{{ t('app.settings.smartBlur') }}</span>
                          <span class="cc-sub">{{ smartBlurEnabled ? t('app.settings.on') : t('app.settings.off') }}</span>
                        </span>
                      </LiquidGlass>
                      <!-- Upload custom background -->
                      <LiquidGlass tag="label" radius="pill" v-bind="ccGlass" class="cc-glass cc-toggle cursor-pointer" :title="t('app.settings.uploadImageDesc')">
                        <input ref="fileInput" type="file" accept="image/*" @change="handleImageUpload" class="sr-only" />
                        <span :class="['cc-icon-circle', backgroundImage ? 'is-on' : '']"><ImageIcon :size="17" :stroke-width="2.4" /></span>
                        <span class="min-w-0 text-left">
                          <span class="cc-title">{{ t('app.settings.uploadShort') }}</span>
                          <span class="cc-sub">{{ backgroundImage ? t('app.settings.customImage') : t('app.settings.uploadImageDesc') }}</span>
                        </span>
                      </LiquidGlass>
                    </div>

                    <!-- Right: wallpaper tile (like the Now Playing module) -->
                    <LiquidGlass :radius="30" v-bind="ccGlass" class="cc-glass col-span-2 row-span-2 p-3 flex flex-col justify-between">
                      <div class="flex items-start gap-2">
                        <div
                          class="w-11 h-11 rounded-xl bg-cover bg-center ring-1 ring-white/30 shrink-0 shadow-md"
                          :style="activeBackground ? { backgroundImage: `url(${activeBackground})` } : { background: '#F4F1EC' }"
                        />
                      </div>
                      <div class="min-w-0">
                        <div class="cc-title">{{ t('app.settings.wallpaper') }}</div>
                        <div class="cc-sub" :title="currentWallpaper?.title">
                          {{ backgroundImage ? t('app.settings.customImage') : (currentWallpaper ? currentWallpaper.author : '—') }}
                        </div>
                      </div>
                      <div class="flex items-center justify-around text-white/90">
                        <button v-if="backgroundImage" type="button" class="cc-mini" @click="removeBackgroundImage" :title="t('app.settings.removeImage')">
                          <Trash2 :size="17" :stroke-width="2.4" />
                        </button>
                        <button type="button" class="cc-mini" :disabled="!!backgroundImage" @click="shuffleWallpaper" :title="t('app.settings.shuffleWallpaper')">
                          <Shuffle :size="19" :stroke-width="2.4" />
                        </button>
                      </div>
                    </LiquidGlass>

                    <!-- Right: two circular buttons -->
                    <LiquidGlass tag="button" radius="pill" v-bind="ccGlass" class="cc-glass cc-circle" @click="resetBackground" :title="t('app.settings.resetBackground')">
                      <RotateCcw :size="20" :stroke-width="2.3" />
                    </LiquidGlass>
                    <LiquidGlass tag="button" radius="pill" v-bind="ccGlass" class="cc-glass cc-circle" @click="showGithubModal = true; showSettingsDropdown = false" title="GitHub">
                      <Github :size="20" :stroke-width="2.3" />
                    </LiquidGlass>

                    <!-- Blur slider module (full width, icon at both ends) -->
                    <LiquidGlass :radius="28" v-bind="ccGlass" class="cc-glass col-span-4 px-4 pt-3 pb-3.5">
                      <div class="flex items-center justify-between mb-2.5">
                        <span class="cc-title">{{ t('app.settings.glassBlur') }}</span>
                        <span class="text-[11px] text-white/70 tabular-nums">{{ Math.round(computedBlurValue) }}px</span>
                      </div>
                      <div v-if="!smartBlurEnabled || !hasPhotoBg" class="flex items-center gap-3">
                        <Droplet :size="15" class="text-white/80 shrink-0" />
                        <input
                          type="range" min="0" max="100"
                          :value="glassBlurIntensity"
                          @input="handleBlurChange"
                          class="cc-slider flex-1"
                          :style="{ '--val': `${glassBlurIntensity}%` }"
                          :aria-label="t('app.settings.blurIntensity')"
                        />
                        <Droplets :size="18" class="text-white shrink-0" />
                      </div>
                      <template v-else>
                        <div class="flex items-center gap-3">
                          <Sparkles :size="15" class="text-white/80 shrink-0" />
                          <div class="cc-track flex-1">
                            <div class="cc-track-fill" :style="{ width: quizTotalCount > 0 ? `${(quizCorrectCount / quizTotalCount) * 100}%` : '0%' }" />
                          </div>
                          <span class="text-[11px] text-white/80 tabular-nums shrink-0">{{ quizCorrectCount }}/{{ quizTotalCount }}</span>
                        </div>
                        <div class="text-[11px] text-white/70 mt-1.5">{{ t('app.settings.smartBlurDesc') }}</div>
                      </template>
                    </LiquidGlass>

                    <!-- Theme colours: preset swatches + custom pickers -->
                    <LiquidGlass :radius="28" v-bind="ccGlass" class="cc-glass col-span-4 px-4 pt-3 pb-3.5">
                      <div class="flex items-center justify-between mb-2.5 gap-2">
                        <span class="cc-title">{{ t('app.settings.theme') }}</span>
                        <span class="cc-sub text-right">{{ currentThemeName }}</span>
                      </div>
                      <div class="flex items-center justify-between gap-1" role="radiogroup" :aria-label="t('app.settings.theme')">
                        <button
                          v-for="p in themePresets"
                          :key="p.id"
                          type="button"
                          role="radio"
                          :aria-checked="theme.preset === p.id"
                          :title="p.name[language]"
                          :class="['cc-swatch', theme.preset === p.id ? 'is-active' : '']"
                          :style="{ '--sw-a': p.primary, '--sw-b': p.accent }"
                          @click="selectPreset(p.id)"
                        />
                        <button
                          type="button"
                          role="radio"
                          :aria-checked="isCustomTheme"
                          :title="t('app.settings.themeCustom')"
                          :class="['cc-swatch cc-swatch--custom', isCustomTheme ? 'is-active' : '']"
                          :style="isCustomTheme ? { '--sw-a': theme.primary, '--sw-b': theme.accent } : {}"
                          @click="enterCustomTheme"
                        >
                          <Pipette v-if="!isCustomTheme" :size="14" :stroke-width="2.4" />
                        </button>
                      </div>
                      <div v-if="isCustomTheme" class="grid grid-cols-2 gap-2 mt-3">
                        <label class="cc-color">
                          <input type="color" :value="theme.primary.toLowerCase()" @input="onCustomColor('primary', $event)" :aria-label="t('app.settings.primaryColor')" />
                          <span class="min-w-0">
                            <span class="cc-title !text-[12px]">{{ t('app.settings.primaryColor') }}</span>
                            <span class="cc-sub font-mono">{{ theme.primary }}</span>
                          </span>
                        </label>
                        <label class="cc-color">
                          <input type="color" :value="theme.accent.toLowerCase()" @input="onCustomColor('accent', $event)" :aria-label="t('app.settings.accentColor')" />
                          <span class="min-w-0">
                            <span class="cc-title !text-[12px]">{{ t('app.settings.accentColor') }}</span>
                            <span class="cc-sub font-mono">{{ theme.accent }}</span>
                          </span>
                        </label>
                      </div>
                    </LiquidGlass>

                    <!-- Bottom pill (like 「编辑控制…」) -->
                    <div class="col-span-4 flex justify-center pt-1">
                      <LiquidGlass tag="button" radius="pill" v-bind="ccGlass" :bezel="12" class="cc-glass cc-pill" @click="showAIModal = true; showSettingsDropdown = false">
                        <Bot :size="14" :stroke-width="2.4" />
                        <span>{{ t('app.settings.configureAI') }}…</span>
                      </LiquidGlass>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LiquidGlass>

      <!-- Main Content -->
      <main :class="[
        'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-glass-in pb-24 sm:pb-10 relative z-10',
        hasPhotoBg ? 'custom-bg-text' : ''
      ]">
        <router-view />
      </main>
    </div>

    <!-- GitHub Star Modal -->
    <Teleport to="body">
      <div 
        v-if="showGithubModal" 
        class="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-4" 
        @click="showGithubModal = false"
      >
        <div class="absolute inset-0 bg-slate-900/30 backdrop-blur-md animate-fade-in" aria-hidden="true"></div>
        <LiquidGlass
          :radius="32"
          :blur="1"
          tint="rgba(250, 248, 245, 0.74)"
          class="p-6 sm:p-8 max-w-md w-full relative animate-glass-in"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="flex items-start justify-between mb-4 relative z-10">
            <div class="flex items-center gap-3 text-slate-800">
              <div class="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center shrink-0 text-white">
                <Github :size="24" />
              </div>
              <h3 class="text-2xl font-bold leading-tight">给个 Star 吧！</h3>
            </div>
            <button @click="showGithubModal = false" class="p-2 rounded-full hover:bg-slate-100/50 text-slate-400 hover:text-slate-600 transition-colors">
              <X :size="24" />
            </button>
          </div>

          <p class="text-slate-600 mb-6 font-medium leading-relaxed relative z-10">
            如果这个项目对你有帮助，请考虑在 GitHub 上给个 ⭐ Star！你的支持是我们持续改进的动力。
          </p>

          <!-- Buttons -->
          <div class="flex gap-3 relative z-10">
            <button 
              @click="showGithubModal = false"
              class="flex-1 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100/50 font-bold transition-colors"
            >
              稍后再说
            </button>
            <a
              href="https://github.com/Xiehuang01/Good-Review-VueVersion"
              target="_blank"
              rel="noopener noreferrer"
              @click="showGithubModal = false"
              class="flex-1 px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Github :size="18" />
              <span>去 Star</span>
            </a>
          </div>
        </LiquidGlass>
      </div>
    </Teleport>

    <!-- AI Configuration Modal -->
    <Teleport to="body">
      <div 
        v-if="showAIModal" 
        class="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-4" 
        @click="showAIModal = false"
      >
        <div class="absolute inset-0 bg-slate-900/30 backdrop-blur-md animate-fade-in" aria-hidden="true"></div>
        <LiquidGlass
          :radius="32"
          :blur="1"
          tint="rgba(250, 248, 245, 0.74)"
          class="p-6 sm:p-8 max-w-md w-full relative animate-glass-in"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="flex items-start justify-between mb-6 relative z-10">
            <div class="flex items-center gap-3 text-slate-800">
              <div class="w-12 h-12 rounded-full bg-ember-600 flex items-center justify-center shrink-0 text-white">
                <Bot :size="24" />
              </div>
              <h3 class="text-2xl font-bold leading-tight">{{ t('app.ai.title') }}</h3>
            </div>
            <button @click="showAIModal = false" class="p-2 rounded-full hover:bg-slate-100/50 text-slate-400 hover:text-slate-600 transition-colors">
              <X :size="24" />
            </button>
          </div>

          <!-- AI Configuration Form -->
          <div class="space-y-4 relative z-10">
            <!-- Platform Selection -->
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">{{ t('app.ai.platform') }}</label>
              <CustomSelect
                v-model="aiConfig.platform"
                :options="platformOptions"
                :placeholder="t('app.ai.platform')"
              />
            </div>

            <!-- API Key Input -->
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">{{ t('app.ai.apiKey') }}</label>
              <input 
                v-model="aiConfig.apiKey"
                type="password"
                :placeholder="t('app.ai.apiKeyPlaceholder')"
                class="w-full p-3 rounded-xl border border-slate-200 bg-white/90 text-slate-700 focus:outline-none focus:ring-2 focus:ring-ember-500/30 shadow-sm transition-all"
              />
            </div>

            <!-- Model Selection -->
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">{{ t('app.ai.model') }}</label>
              <CustomSelect
                v-model="aiConfig.model"
                :options="modelOptions"
                :placeholder="t('app.ai.model')"
              />
            </div>

            <!-- Description -->
            <div class="bg-brand-50/50 border border-brand-200/50 rounded-xl p-4">
              <p class="text-sm text-brand-700 mb-2">{{ t('app.ai.description') }}</p>
              <a 
                :href="t('app.ai.registerLink')" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-sm text-brand-600 hover:text-brand-800 underline font-medium"
              >
                {{ t('app.ai.registerLink') }}
              </a>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 mt-6 relative z-10">
            <button 
              @click="showAIModal = false"
              class="flex-1 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100/50 font-bold transition-colors"
            >
              {{ t('app.ai.cancel') }}
            </button>
            <button
              @click="saveAIConfig"
              class="flex-1 px-4 py-3 rounded-xl bg-ember-600 hover:bg-ember-700 text-white font-bold shadow-lg transition-all"
            >
              {{ t('app.ai.save') }}
            </button>
          </div>
        </LiquidGlass>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import { Layout, Import, BookMarked, Sparkles, Languages, Github, X, Settings, RotateCcw, ImageIcon, Trash2, Bot, Shuffle, Droplet, Droplets, Pipette } from 'lucide-vue-next'
import { provideLanguage } from './composables/useLanguage'
import { useBankStore } from './stores/bankStore'
import { aiService } from './services/aiService'
import CustomSelect from './components/CustomSelect.vue'
import { useTheme } from './composables/useTheme'
import LiquidGlass from './components/LiquidGlass.vue'
import { setGlassBlur } from './utils/liquidGlass'
import { WALLPAPERS, wallpaperUrl, randomWallpaperIndex } from './constants/wallpapers'

// Language context
const { language, setLanguage, t } = provideLanguage()

// Bank store
const bankStore = useBankStore()

// Route
const route = useRoute()

// 判断是否在答题页面（隐藏导航栏）
const isQuizRoute = computed(() => route.name === 'Quiz')

// GitHub弹窗状态
const showGithubModal = ref(false)

// 站点 logo（public/images/logo，已裁掉透明边，80px=2x / 120px=3x）
const logoSrc = `${import.meta.env.BASE_URL}images/logo/logo-80.webp`
const logoSrc3x = `${import.meta.env.BASE_URL}images/logo/logo-120.webp`

// 主题配色（预设 + 自定义），选择会写入 localStorage，index.html 在首帧前应用
const { theme, isCustom: isCustomTheme, presets: themePresets, selectPreset, enterCustom: enterCustomTheme, setCustomColor, initTheme } = useTheme()
initTheme()
const currentThemeName = computed(() => {
  if (isCustomTheme.value) return t('app.settings.themeCustom')
  const p = themePresets.find((x) => x.id === theme.value.preset)
  return p ? p.name[language.value] : ''
})
const onCustomColor = (which: 'primary' | 'accent', e: Event) => {
  setCustomColor(which, (e.target as HTMLInputElement).value.toUpperCase())
}

// 设置下拉菜单状态
const showSettingsDropdown = ref(false)

// AI配置模态框状态
const showAIModal = ref(false)

// 背景图片状态
const backgroundImage = ref<string | null>(null)

// Control Center 模块统一的液态玻璃参数：低模糊、强边缘折射、浅色调，让背后的壁纸弯折清晰可见
const ccGlass = {
  thickness: 80,
  bezel: 24,
  ior: 3,
  scaleRatio: 1,
  blur: 0.6,
  specularOpacity: 0.8,
  specularSaturation: 6,
  tint: 'rgba(22, 26, 32, 0.30)',
} as const

// 默认随机壁纸（用户没有上传自定义背景时使用，每次加载随机一张）
const wallpaperIndex = ref<number>(randomWallpaperIndex())
const wallpaperFailed = ref(false)
const currentWallpaper = computed(() => (wallpaperFailed.value ? null : WALLPAPERS[wallpaperIndex.value] ?? null))
const activeBackground = computed<string | null>(() =>
  backgroundImage.value || (currentWallpaper.value ? wallpaperUrl(currentWallpaper.value) : null)
)
// 只要背后是照片（自定义或默认壁纸），就使用照片模式的文字/玻璃样式
const hasPhotoBg = computed(() => !!activeBackground.value)

const loadWallpaper = (index: number) => {
  const w = WALLPAPERS[index]
  if (!w) return
  const img = new Image()
  img.onload = () => {
    wallpaperIndex.value = index
    wallpaperFailed.value = false
  }
  img.onerror = () => {
    // 图片加载失败时退回到纸色背景 + 光斑
    if (index === wallpaperIndex.value) wallpaperFailed.value = true
  }
  img.src = wallpaperUrl(w)
}

// 首次加载的壁纸也探测一次：加载失败（离线、被拦截）时退回纸色背景，而不是一片深色
if (typeof window !== 'undefined' && !backgroundImage.value) loadWallpaper(wallpaperIndex.value)

const shuffleWallpaper = () => {
  // 预加载完成后再切换，避免闪白
  loadWallpaper(randomWallpaperIndex(wallpaperIndex.value))
}

// 毛玻璃模糊程度状态 (0-100)
const glassBlurIntensity = ref<number>(50)

// 小巧思功能状态
const smartBlurEnabled = ref<boolean>(false)
const quizCorrectCount = ref<number>(0)
const quizTotalCount = ref<number>(0)

// AI配置状态
const aiConfig = ref({
  platform: 'siliconflow',
  apiKey: '',
  model: 'deepseek-ai/DeepSeek-V3'
})

// AI配置选项
const platformOptions = [
  { value: 'siliconflow', label: '硅基流动 (SiliconFlow)' }
]

const modelOptions = [
  { value: 'deepseek-ai/DeepSeek-R1', label: 'DeepSeek R1' },
  { value: 'deepseek-ai/DeepSeek-V3', label: 'DeepSeek V3' }
]

// 文件输入引用
const fileInput = ref<HTMLInputElement | null>(null)

// 计算模糊值
const computedBlurValue = computed(() => {
  const minBlur = 4
  const maxBlur = 40
  
  if (smartBlurEnabled.value && hasPhotoBg.value) {
    // 小巧思模式：每答对一题就减少模糊度
    if (quizCorrectCount.value === 0 || quizTotalCount.value === 0) {
      // 还没答对任何题或没有题目，使用最大模糊度
      return maxBlur
    }
    
    // 根据当前题目总数计算每题的模糊度减少量
    const blurReductionPerCorrect = (maxBlur - minBlur) / quizTotalCount.value
    const currentBlur = maxBlur - (quizCorrectCount.value * blurReductionPerCorrect)
    
    // 确保模糊度不会低于最小值
    return Math.max(currentBlur, minBlur)
  } else {
    // 普通模式：使用用户设置的模糊度
    return minBlur + (glassBlurIntensity.value / 100) * (maxBlur - minBlur)
  }
})

// 切换语言
const toggleLanguage = () => {
  setLanguage(language.value === 'en' ? 'cn' : 'en')
}

// 重置背景色
const resetBackground = () => {
  backgroundImage.value = null
  localStorage.removeItem('background-image')
  showSettingsDropdown.value = false
}

// 压缩图片函数
const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // 计算新的尺寸，保持宽高比
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      // 绘制压缩后的图片
      ctx?.drawImage(img, 0, 0, width, height)
      
      // 转换为base64，使用指定质量
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedDataUrl)
    }
    
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

// 处理图片上传
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // 检查文件大小（10MB = 10 * 1024 * 1024 bytes）
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    alert(t('app.settings.fileSizeError'))
    return
  }
  
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    alert(t('app.settings.fileTypeError'))
    return
  }
  
  try {
    // 压缩图片
    const compressedDataUrl = await compressImage(file, 1920, 0.7)
    
    // 检查压缩后的大小（localStorage通常限制在5MB左右）
    const maxLocalStorageSize = 4 * 1024 * 1024 // 4MB安全限制
    if (compressedDataUrl.length > maxLocalStorageSize) {
      // 如果还是太大，进一步压缩
      const furtherCompressed = await compressImage(file, 1280, 0.5)
      
      if (furtherCompressed.length > maxLocalStorageSize) {
        alert(t('app.settings.imageTooLarge'))
        return
      }
      
      backgroundImage.value = furtherCompressed
      localStorage.setItem('background-image', furtherCompressed)
    } else {
      backgroundImage.value = compressedDataUrl
      localStorage.setItem('background-image', compressedDataUrl)
    }
    
    showSettingsDropdown.value = false
  } catch (error) {
    console.error('Error processing image:', error)
    alert(t('app.settings.processingError') + (error as Error).message)
  }
}

// 处理模糊度变化
const handleBlurChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  glassBlurIntensity.value = parseInt(target.value)
  localStorage.setItem('glass-blur-intensity', target.value)
  updateGlassBlur()
}

// 处理小巧思功能开关
const handleSmartBlurToggle = () => {
  localStorage.setItem('smart-blur-enabled', smartBlurEnabled.value.toString())
  if (smartBlurEnabled.value) {
    // 启用小巧思时，重置答题统计
    quizCorrectCount.value = 0
    quizTotalCount.value = 0
  }
  updateGlassBlur()
}

// 更新答题统计（供其他组件调用）
const updateQuizStats = (correct: number, total: number) => {
  quizCorrectCount.value = correct
  quizTotalCount.value = total
  updateGlassBlur()
}

// 重置答题统计
const resetQuizStats = () => {
  quizCorrectCount.value = 0
  quizTotalCount.value = 0
  updateGlassBlur()
}

// 提供给子组件使用
provide('updateQuizStats', updateQuizStats)
provide('resetQuizStats', resetQuizStats)

// 更新CSS变量
const updateGlassBlur = () => {
  document.documentElement.style.setProperty('--glass-blur', `${computedBlurValue.value}px`)
  // 同步给 LiquidGlass 组件（Chromium 的 SVG 折射滤镜和降级模式都会跟随）
  setGlassBlur(computedBlurValue.value)
}

// 保存AI配置
const saveAIConfig = () => {
  try {
    localStorage.setItem('ai-config', JSON.stringify(aiConfig.value))
    // 更新AI服务的配置
    aiService.updateConfig(aiConfig.value)
    console.log('AI配置已保存')
    showAIModal.value = false
  } catch (error) {
    console.error('保存AI配置失败:', error)
    alert('保存失败，请重试')
  }
}

// 加载AI配置
const loadAIConfig = () => {
  try {
    const saved = localStorage.getItem('ai-config')
    if (saved) {
      aiConfig.value = JSON.parse(saved)
      console.log('AI配置已加载')
    }
  } catch (error) {
    console.error('加载AI配置失败:', error)
  }
}
const removeBackgroundImage = () => {
  backgroundImage.value = null
  localStorage.removeItem('background-image')
  showSettingsDropdown.value = false
  
  // 清空文件输入
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Element
  const settingsButton = target.closest('[title="设置"]')
  const settingsDropdown = target.closest('.settings-dropdown')
  
  if (!settingsButton && !settingsDropdown) {
    showSettingsDropdown.value = false
  }
}

// 组件挂载时加载保存的背景图片和模糊设置
onMounted(() => {
  console.log('Component mounted, checking localStorage...')
  const savedImage = localStorage.getItem('background-image')
  console.log('Saved image exists:', !!savedImage)
  console.log('Saved image length:', savedImage ? savedImage.length : 0)
  
  if (savedImage) {
    backgroundImage.value = savedImage
    console.log('Background image loaded from localStorage')
  } else {
    console.log('No background image found in localStorage')
  }
  
  // 加载保存的模糊设置
  const savedBlur = localStorage.getItem('glass-blur-intensity')
  if (savedBlur) {
    glassBlurIntensity.value = parseInt(savedBlur)
    console.log('Glass blur intensity loaded from localStorage:', savedBlur)
  }
  
  // 加载小巧思设置
  const savedSmartBlur = localStorage.getItem('smart-blur-enabled')
  if (savedSmartBlur) {
    smartBlurEnabled.value = savedSmartBlur === 'true'
    console.log('Smart blur enabled loaded from localStorage:', savedSmartBlur)
  }
  
  // 加载AI配置
  loadAIConfig()
  
  // 初始化CSS变量
  updateGlassBlur()
  
  document.addEventListener('click', handleClickOutside)
  
  // 监听localStorage变化
  window.addEventListener('storage', (e) => {
    if (e.key === 'background-image') {
      console.log('localStorage background-image changed:', e.newValue ? 'Set' : 'Removed')
      if (e.newValue) {
        backgroundImage.value = e.newValue
      } else {
        backgroundImage.value = null
      }
    }
    if (e.key === 'glass-blur-intensity') {
      console.log('localStorage glass-blur-intensity changed:', e.newValue)
      if (e.newValue) {
        glassBlurIntensity.value = parseInt(e.newValue)
        updateGlassBlur()
      }
    }
    if (e.key === 'smart-blur-enabled') {
      console.log('localStorage smart-blur-enabled changed:', e.newValue)
      if (e.newValue) {
        smartBlurEnabled.value = e.newValue === 'true'
        updateGlassBlur()
      }
    }
    if (e.key === 'ai-config') {
      console.log('localStorage ai-config changed')
      loadAIConfig()
    }
  })
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>