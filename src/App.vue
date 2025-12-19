<template>
  <div class="fixed inset-0 w-full h-[100dvh] font-sans text-slate-800 overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    
    <!-- Animated Background Blobs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Top Left Blob - Green/Teal -->
      <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
      <!-- Top Right Blob - Purple -->
      <div class="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
      <!-- Bottom Left Blob - Pink -->
      <div class="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
      <!-- Center/Random Blob - Blue -->
      <div class="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-3000"></div>
    </div>

    <!-- Scrollable Container -->
    <div class="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden pb-safe scroll-smooth">
      <!-- Glass Navigation -->
      <nav v-if="!isQuizRoute" class="sticky top-4 z-50 mx-4 sm:mx-8 mt-4 rounded-2xl glass-panel shadow-sm transition-all mb-4">
        <div class="px-4 sm:px-6">
          <div class="flex justify-between items-center h-16">
            
            <!-- Logo Area -->
            <router-link 
              to="/"
              class="flex items-center cursor-pointer group select-none"
            >
              <div class="relative">
                <div class="relative bg-gradient-to-br from-brand-400 to-brand-600 p-2 rounded-xl text-white mr-3 shadow-lg shadow-brand-200/50 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles :size="20" />
                </div>
              </div>
              <span class="font-black text-xl tracking-tight text-slate-800/90 group-hover:text-brand-600 transition-colors">
                Good Review
              </span>
            </router-link>
            
            <!-- Nav Items -->
            <div class="flex items-center gap-2">
              <router-link 
                to="/"
                :class="[
                  'px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5',
                  $route.name === 'Home' 
                    ? 'bg-white/60 text-brand-700 shadow-sm ring-1 ring-white/60' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/30'
                ]"
              >
                <Layout :size="18" :stroke-width="2.5" />
                <span class="hidden sm:inline">{{ t('app.nav.guide') }}</span>
              </router-link>
              <router-link 
                to="/import"
                :class="[
                  'px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5',
                  $route.name === 'Import' 
                    ? 'bg-white/60 text-brand-700 shadow-sm ring-1 ring-white/60' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/30'
                ]"
              >
                <Import :size="18" :stroke-width="2.5" />
                <span class="hidden sm:inline">{{ t('app.nav.import') }}</span>
              </router-link>
              <router-link 
                to="/dashboard"
                :class="[
                  'px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5',
                  $route.name === 'Dashboard' 
                    ? 'bg-white/60 text-brand-700 shadow-sm ring-1 ring-white/60' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/30'
                ]"
              >
                <BookMarked :size="18" :stroke-width="2.5" />
                <span class="hidden sm:inline">{{ t('app.nav.banks') }}</span>
                <span v-if="bankStore.banks.value.length > 0" class="flex h-2 w-2 sm:h-auto sm:w-auto ml-0.5">
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-500 sm:bg-brand-500 sm:text-white sm:px-1.5 sm:py-0.5 sm:text-[10px] sm:h-auto sm:w-auto justify-center items-center">
                    <span class="hidden sm:inline">{{ bankStore.banks.value.length }}</span>
                  </span>
                </span>
              </router-link>

              <div class="w-px h-5 bg-slate-300/50 mx-1" />

              <button
                @click="toggleLanguage"
                class="p-2 rounded-xl hover:bg-white/40 text-slate-500 hover:text-brand-600 transition-all"
              >
                <Languages :size="20" :stroke-width="2.5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-fade-in pb-24 sm:pb-10">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Layout, Import, BookMarked, Sparkles, Languages } from 'lucide-vue-next'
import { provideLanguage } from './composables/useLanguage'
import { useBankStore } from './stores/bankStore'

// Language context
const { language, setLanguage, t } = provideLanguage()

// Bank store
const bankStore = useBankStore()

// Route
const route = useRoute()

// 判断是否在答题页面（隐藏导航栏）
const isQuizRoute = computed(() => route.name === 'Quiz')

// 切换语言
const toggleLanguage = () => {
  setLanguage(language.value === 'en' ? 'cn' : 'en')
}
</script>