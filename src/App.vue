<template>
  <div 
    class="fixed inset-0 w-full h-[100dvh] font-sans text-slate-800 overflow-hidden"
    :class="backgroundImage ? '' : 'bg-gradient-to-br from-white via-emerald-50/30 via-teal-50/30 to-green-50/50'"
    :style="backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {}"
  >
    
    <!-- Custom Background Image Overlay (if image exists) -->
    <div v-if="backgroundImage" class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30"></div>
    
    <!-- Animated Background Blobs (only show if no custom image) -->
    <div v-if="!backgroundImage" class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Main Green Blob - Emerald (Dominant) -->
      <div class="absolute top-[-15%] left-[-15%] w-[60vw] h-[60vw] bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <!-- Secondary Green Blob - Teal (Large) -->
      <div class="absolute top-[30%] left-[35%] w-[45vw] h-[45vw] bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-blob animation-delay-3000"></div>
      <!-- Third Green Blob - Lime (Medium) -->
      <div class="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-lime-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <!-- Fourth Green Blob - Cyan (Medium) -->
      <div class="absolute top-[15%] left-[-8%] w-[40vw] h-[40vw] bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
      
      <!-- Accent Colors (Smaller, Lower Opacity) -->
      <!-- Purple Accent (Small) -->
      <div class="absolute top-[-5%] right-[-5%] w-[25vw] h-[25vw] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
      <!-- Pink Accent (Small) -->
      <div class="absolute bottom-[-5%] left-[-5%] w-[20vw] h-[20vw] bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-12 animate-blob animation-delay-4000"></div>
      <!-- Yellow Accent (Small) -->
      <div class="absolute top-[5%] left-[60%] w-[18vw] h-[18vw] bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-1000"></div>
      <!-- Amber Accent (Tiny) -->
      <div class="absolute top-[50%] right-[5%] w-[15vw] h-[15vw] bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-12 animate-blob animation-delay-3500"></div>
      <!-- Orange Accent (Tiny) -->
      <div class="absolute bottom-[20%] left-[70%] w-[12vw] h-[12vw] bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-1500"></div>
    </div>

    <!-- Scrollable Container -->
    <div 
      class="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden pb-safe scroll-smooth"
      @click="showSettingsDropdown = false"
    >
      <!-- Glass Navigation -->
      <nav v-if="!isQuizRoute" :class="[
        'sticky top-4 z-50 mx-4 sm:mx-8 mt-4 rounded-2xl shadow-sm transition-all mb-4',
        backgroundImage ? 'glass-panel-strong' : 'glass-panel'
      ]">
        <div class="px-3 sm:px-6">
          <div class="flex justify-between items-center h-14 sm:h-16">
            
            <!-- Logo Area -->
            <router-link 
              to="/"
              class="flex items-center cursor-pointer group select-none flex-shrink-0"
            >
              <div class="relative">
                <div class="relative bg-gradient-to-br from-brand-400 to-brand-600 p-1.5 sm:p-2 rounded-xl text-white mr-2 sm:mr-3 shadow-lg shadow-brand-200/50 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles :size="18" />
                </div>
              </div>
              <span :class="[
                'font-black text-lg sm:text-xl tracking-tight group-hover:text-emerald-500 transition-colors',
                backgroundImage ? 'text-white drop-shadow-lg' : 'text-slate-800/90'
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
                    ? (backgroundImage ? 'bg-white/80 text-slate-800 shadow-sm ring-1 ring-white/60' : 'bg-white/60 text-emerald-500 shadow-sm ring-1 ring-white/60')
                    : (backgroundImage ? 'text-white/90 hover:text-white hover:bg-white/20 drop-shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-white/30')
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
                    ? (backgroundImage ? 'bg-white/80 text-slate-800 shadow-sm ring-1 ring-white/60' : 'bg-white/60 text-emerald-500 shadow-sm ring-1 ring-white/60')
                    : (backgroundImage ? 'text-white/90 hover:text-white hover:bg-white/20 drop-shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-white/30')
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
                    ? (backgroundImage ? 'bg-white/80 text-slate-800 shadow-sm ring-1 ring-white/60' : 'bg-white/60 text-emerald-500 shadow-sm ring-1 ring-white/60')
                    : (backgroundImage ? 'text-white/90 hover:text-white hover:bg-white/20 drop-shadow' : 'text-slate-500 hover:text-slate-800 hover:bg-white/30')
                ]"
              >
                <BookMarked :size="16" :stroke-width="2.5" />
                <span class="hidden md:inline">{{ t('app.nav.banks') }}</span>
                <span v-if="bankStore.banks.value.length > 0" class="absolute -top-1 -right-1 flex h-2 w-2 sm:h-auto sm:w-auto">
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-500 sm:bg-brand-500 sm:text-white sm:px-1.5 sm:py-0.5 sm:text-[10px] sm:h-auto sm:w-auto justify-center items-center">
                    <span class="hidden sm:inline">{{ bankStore.banks.value.length }}</span>
                  </span>
                </span>
              </router-link>

              <div :class="[
                'w-px h-4 sm:h-5 mx-0.5 sm:mx-1',
                backgroundImage ? 'bg-white/30' : 'bg-slate-300/50'
              ]" />

              <button
                @click="toggleLanguage"
                :class="[
                  'p-1.5 sm:p-2 rounded-xl hover:text-emerald-500 transition-all',
                  backgroundImage ? 'hover:bg-white/20 text-white/90 drop-shadow' : 'hover:bg-white/40 text-slate-500'
                ]"
              >
                <Languages :size="18" :stroke-width="2.5" />
              </button>

              <!-- GitHub Button -->
              <button
                @click="showGithubModal = true"
                :class="[
                  'p-1.5 sm:p-2 rounded-xl transition-all',
                  backgroundImage ? 'hover:bg-white/20 text-white/90 hover:text-white drop-shadow' : 'hover:bg-white/40 text-slate-500 hover:text-slate-800'
                ]"
                title="GitHub Repository"
              >
                <Github :size="18" :stroke-width="2.5" />
              </button>

              <!-- Settings Button -->
              <div class="relative">
                <button
                  @click.stop="showSettingsDropdown = !showSettingsDropdown"
                  :class="[
                    'p-1.5 sm:p-2 rounded-xl transition-all',
                    backgroundImage ? 'hover:bg-white/20 text-white/90 hover:text-white drop-shadow' : 'hover:bg-white/40 text-slate-500 hover:text-slate-800'
                  ]"
                  :title="t('app.settings.title')"
                >
                  <Settings :size="18" :stroke-width="2.5" />
                </button>

                <!-- Settings Dropdown -->
                <div 
                  v-if="showSettingsDropdown"
                  :class="[
                    'absolute right-0 top-full mt-2 w-64 sm:w-64 w-72 rounded-2xl shadow-2xl border overflow-hidden animate-fade-in z-[60]',
                    backgroundImage ? 'glass-panel-mobile border-white/40' : 'glass-panel-mobile border-white/30'
                  ]"
                  @click.stop
                >
                  <div class="p-4 space-y-3">
                    <h3 class="text-sm font-bold mb-3 text-slate-800">{{ t('app.settings.background') }}</h3>
                    
                    <!-- Reset Background -->
                    <button
                      @click="resetBackground"
                      class="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                    >
                      <RotateCcw :size="18" />
                      <span class="text-sm font-medium">{{ t('app.settings.resetBackground') }}</span>
                    </button>

                    <!-- Upload Background Image -->
                    <div class="relative">
                      <input
                        ref="fileInput"
                        type="file"
                        accept="image/*"
                        @change="handleImageUpload"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <button
                        class="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                      >
                        <ImageIcon :size="18" />
                        <div class="flex-1">
                          <div class="text-sm font-medium">{{ t('app.settings.uploadImage') }}</div>
                          <div class="text-xs text-slate-500">{{ t('app.settings.uploadImageDesc') }}</div>
                        </div>
                      </button>
                    </div>

                    <!-- Remove Background Image (if exists) -->
                    <button
                      v-if="backgroundImage"
                      @click="removeBackgroundImage"
                      class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-all text-left"
                    >
                      <Trash2 :size="18" />
                      <span class="text-sm font-medium">{{ t('app.settings.removeImage') }}</span>
                    </button>

                    <!-- Glass Blur Intensity Control -->
                    <div class="border-t border-slate-200 pt-3 mt-3">
                      <h3 class="text-sm font-bold mb-3 text-slate-800">{{ t('app.settings.glassBlur') }}</h3>
                      <div class="space-y-2">
                        <div class="flex items-center justify-between text-xs text-slate-600">
                          <span>{{ t('app.settings.blurLight') }}</span>
                          <span>{{ t('app.settings.blurStrong') }}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          :value="glassBlurIntensity"
                          @input="handleBlurChange"
                          class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div class="text-xs text-slate-500 text-center">
                          {{ t('app.settings.blurIntensity') }}: {{ glassBlurIntensity }}%
                        </div>
                      </div>
                    </div>

                    <!-- AI Configuration -->
                    <div class="border-t border-slate-200 pt-3 mt-3">
                      <h3 class="text-sm font-bold mb-3 text-slate-800">{{ t('app.settings.aiSettings') }}</h3>
                      <button
                        @click="showAIModal = true; showSettingsDropdown = false"
                        class="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                      >
                        <Bot :size="18" />
                        <span class="text-sm font-medium">{{ t('app.settings.configureAI') }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main :class="[
        'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-fade-in pb-24 sm:pb-10 relative z-10',
        backgroundImage ? 'custom-bg-text' : ''
      ]">
        <router-view />
      </main>
    </div>

    <!-- GitHub Star Modal -->
    <Teleport to="body">
      <div 
        v-if="showGithubModal" 
        class="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-fade-in p-4" 
        @click="showGithubModal = false"
      >
        <div 
          class="glass-panel-modal rounded-[2rem] shadow-2xl p-6 sm:p-8 max-w-md w-full transform transition-all scale-100 relative overflow-hidden"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="flex items-start justify-between mb-4 relative z-10">
            <div class="flex items-center gap-3 text-slate-800">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shrink-0 text-white">
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
              class="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Github :size="18" />
              <span>去 Star</span>
            </a>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- AI Configuration Modal -->
    <Teleport to="body">
      <div 
        v-if="showAIModal" 
        class="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-fade-in p-4" 
        @click="showAIModal = false"
      >
        <div 
          class="glass-panel-modal rounded-[2rem] shadow-2xl p-6 sm:p-8 max-w-md w-full transform transition-all scale-100 relative overflow-hidden"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="flex items-start justify-between mb-6 relative z-10">
            <div class="flex items-center gap-3 text-slate-800">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shrink-0 text-white">
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
                class="w-full p-3 rounded-xl border border-slate-200 bg-white/90 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/30 shadow-sm transition-all"
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
            <div class="bg-blue-50/50 border border-blue-200/50 rounded-xl p-4">
              <p class="text-sm text-blue-700 mb-2">{{ t('app.ai.description') }}</p>
              <a 
                :href="t('app.ai.registerLink')" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
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
              class="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold shadow-lg transition-all"
            >
              {{ t('app.ai.save') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Layout, Import, BookMarked, Sparkles, Languages, Github, X, Settings, RotateCcw, ImageIcon, Trash2, Bot } from 'lucide-vue-next'
import { provideLanguage } from './composables/useLanguage'
import { useBankStore } from './stores/bankStore'
import { aiService } from './services/aiService'
import CustomSelect from './components/CustomSelect.vue'

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

// 设置下拉菜单状态
const showSettingsDropdown = ref(false)

// AI配置模态框状态
const showAIModal = ref(false)

// 背景图片状态
const backgroundImage = ref<string | null>(null)

// 毛玻璃模糊程度状态 (0-100)
const glassBlurIntensity = ref<number>(50)

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
  // 将0-100的值映射到4px-40px的模糊范围
  const minBlur = 4
  const maxBlur = 40
  return minBlur + (glassBlurIntensity.value / 100) * (maxBlur - minBlur)
})

// 切换语言
const toggleLanguage = () => {
  setLanguage(language.value === 'en' ? 'cn' : 'en')
}

// 重置背景色
const resetBackground = () => {
  console.log('Resetting background...')
  backgroundImage.value = null
  localStorage.removeItem('background-image')
  console.log('Background reset and removed from localStorage')
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
    console.log('Original file size:', file.size)
    
    // 压缩图片
    const compressedDataUrl = await compressImage(file, 1920, 0.7)
    console.log('Compressed image data length:', compressedDataUrl.length)
    
    // 检查压缩后的大小（localStorage通常限制在5MB左右）
    const maxLocalStorageSize = 4 * 1024 * 1024 // 4MB安全限制
    if (compressedDataUrl.length > maxLocalStorageSize) {
      // 如果还是太大，进一步压缩
      const furtherCompressed = await compressImage(file, 1280, 0.5)
      console.log('Further compressed image data length:', furtherCompressed.length)
      
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
    
    // 验证保存是否成功
    const saved = localStorage.getItem('background-image')
    console.log('Image saved to localStorage:', !!saved)
    
    showSettingsDropdown.value = false
    console.log('Background image uploaded and saved successfully')
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

// 更新CSS变量
const updateGlassBlur = () => {
  document.documentElement.style.setProperty('--glass-blur', `${computedBlurValue.value}px`)
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
  console.log('Removing background image...')
  backgroundImage.value = null
  localStorage.removeItem('background-image')
  console.log('Background image removed from localStorage')
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
  const settingsDropdown = target.closest('.glass-panel')
  
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