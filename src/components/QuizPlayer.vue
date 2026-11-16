<template>
  <!-- Results Screen -->
  <div v-if="isFinished" class="max-w-2xl mx-auto min-h-[calc(100vh-140px)] flex flex-col items-center justify-center animate-fade-in p-4">
    <div v-if="isPerfect" class="fixed inset-0 pointer-events-none overflow-hidden z-0">
       <div 
         v-for="i in 20"
         :key="i" 
         class="absolute animate-confetti text-4xl"
         :style="{
           left: `${Math.random() * 100}%`,
           animationDelay: `${Math.random() * 2}s`,
           animationDuration: `${2 + Math.random() * 3}s`
         }"
       >
         {{ ['🎉', '⭐', '✨', '🏆', '💯'][Math.floor(Math.random() * 5)] }}
       </div>
    </div>

    <LiquidGlass :radius="48" :bezel="30" tint="rgba(255, 255, 255, 0.36)" class="relative z-10 w-full p-8 sm:p-12 text-center">
       
       <div :class="[
         'mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-white/50 backdrop-blur-md',
         isPerfect ? 'bg-gradient-to-br from-ember-300 to-ember-500 text-white' : 'bg-brand-600 text-white'
       ]">
          <Trophy v-if="isPerfect" :size="48" class="animate-bounce" />
          <LayoutDashboard v-else :size="40" />
       </div>

       <h2 class="text-3xl sm:text-4xl font-black text-slate-800 mb-2">
         {{ isPerfect ? t('quiz.results.perfectTitle') : t('quiz.results.title') }}
       </h2>
       <p class="text-slate-600 font-medium mb-10 text-lg">
         {{ isPerfect ? t('quiz.results.msgPerfect') : t('quiz.results.msgKeepGoing') }}
       </p>

       <div class="grid grid-cols-2 gap-4 mb-10">
          <div class="p-6 rounded-3xl bg-sage-100/40 border border-sage-200/50 flex flex-col items-center justify-center group hover:scale-105 transition-transform backdrop-blur-sm">
             <div class="text-5xl font-black text-sage-500 mb-2 group-hover:scale-110 transition-transform drop-shadow-sm">{{ results.correct }}</div>
             <div class="text-sm font-bold text-sage-700 uppercase tracking-wide flex items-center gap-1">
               <CheckCircle :size="16" /> {{ t('quiz.results.statsCorrect') }}
             </div>
          </div>
          <div class="p-6 rounded-3xl bg-red-100/40 border border-red-200/50 flex flex-col items-center justify-center group hover:scale-105 transition-transform backdrop-blur-sm">
             <div class="text-5xl font-black text-red-500 mb-2 group-hover:scale-110 transition-transform drop-shadow-sm">{{ results.wrong }}</div>
             <div class="text-sm font-bold text-red-700 uppercase tracking-wide flex items-center gap-1">
               <XCircle :size="16" /> {{ t('quiz.results.statsWrong') }}
             </div>
          </div>
       </div>

       <div class="space-y-4">
         <button 
           v-if="!isPerfect"
           @click="handleRetryMistakes"
           class="w-full flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
         >
           <RotateCcw :size="22" :stroke-width="2.5" />
           <span>{{ t('quiz.results.btnRetry') }}</span>
         </button>
         
         <button 
           @click="emit('exit')"
           :class="[
             'w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl font-bold text-lg transition-all',
             isPerfect ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-lg' : 'glass-button text-slate-700'
           ]"
         >
           <ArrowLeft :size="22" :stroke-width="2.5" />
           <span>{{ t('quiz.results.btnDashboard') }}</span>
         </button>
       </div>
    </LiquidGlass>
  </div>

  <!-- Quiz Question -->
  <div v-else class="max-w-4xl mx-auto min-h-[calc(100vh-140px)] flex flex-col animate-fade-in pb-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <button 
        @click="emit('exit')"
        class="group text-slate-600 hover:text-brand-700 flex items-center space-x-1 font-bold transition-colors px-4 py-2 rounded-xl hover:bg-white/30 glass-button border-0"
      >
        <ArrowLeft :size="20" class="group-hover:-translate-x-1 transition-transform" />
        <span>{{ t('quiz.exit') }}</span>
      </button>
      <div class="text-sm font-bold text-brand-700 glass-button px-5 py-2 rounded-full">
        {{ currentIdx + 1 }} <span class="text-slate-400 mx-1">/</span> {{ total }}
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="w-full bg-slate-200/30 h-3 rounded-full mb-8 overflow-hidden backdrop-blur-sm border border-white/20">
      <div 
        class="bg-brand-500 h-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(42,107,144,0.45)]"
        :style="{ width: `${((currentIdx + 1) / total) * 100}%` }"
      />
    </div>

    <!-- Question Card -->
    <LiquidGlass :radius="40" :bezel="28" tint="rgba(255, 255, 255, 0.4)" class="p-6 md:p-10 flex-1 flex flex-col relative overflow-hidden">
      
      <div class="mb-8 relative z-10">
        <div class="flex items-start justify-between gap-4 mb-4">
          <span class="inline-block bg-white/50 text-brand-700 text-xs font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider border border-white/50 shadow-sm backdrop-blur-md">
            {{ isJudgment ? "判断" : question.type }}
          </span>
          <button
            @click="copyQuestion"
            class="flex items-center gap-2 px-3 py-1.5 bg-white/50 hover:bg-white/70 text-slate-600 hover:text-slate-800 rounded-lg text-xs font-medium border border-white/50 shadow-sm backdrop-blur-md transition-all"
            :title="copyButtonText"
          >
            <Copy :size="14" />
            <span class="hidden sm:inline">{{ copyButtonText }}</span>
          </button>
        </div>
        <component :is="renderTitle(question.title)" />
        <div v-if="question.images && question.images.length > 0" class="mt-6 flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-brand-200">
          <img 
            v-for="(img, i) in question.images" 
            :key="i" 
            :src="getImageUrl(img)" 
            alt="Question attachment" 
            class="max-h-64 rounded-2xl border-4 border-white/50 shadow-lg hover:scale-105 transition-transform cursor-pointer" 
            @click="openImageModal(getImageUrl(img))"
          />
        </div>
      </div>

      <!-- Options Area -->
      <div class="space-y-4 mb-8 relative z-10">
        <!-- Text Input -->
        <div v-if="isText" class="space-y-4">
          <!-- 检测题目中的空格数量，为每个空格创建输入框 -->
          <div v-if="getBlankCount(question.title) > 1" class="space-y-3">
            <div class="text-sm font-medium text-slate-600 mb-3 flex items-center justify-between">
              <span>请依次填入 {{ getBlankCount(question.title) }} 个答案：</span>
              <span class="text-xs text-slate-400 flex items-center gap-1">
                <span>↑↓</span>
                <span>切换输入框</span>
              </span>
            </div>
            <div 
              v-for="(blank, index) in getBlankCount(question.title)" 
              :key="index"
              class="flex items-center gap-3"
            >
              <span class="text-sm font-bold text-slate-500 w-8">{{ index + 1 }}.</span>
              <input 
                :ref="(el) => { if (el) blankInputRefs[index] = el as HTMLInputElement }"
                :class="[
                  'flex-1 p-4 glass-input rounded-2xl outline-none focus:ring-0 transition-all text-lg font-medium placeholder:text-slate-400',
                  revealed[currentIdx] 
                   ? isBlankCorrect(index) 
                       ? 'border-sage-300 bg-sage-50/50 text-sage-900' 
                       : 'border-red-300 bg-red-50/50 text-red-900'
                   : 'focus:bg-white/60 text-slate-800'
                ]"
                :placeholder="`第 ${index + 1} 个答案`"
                :value="userAnswers[currentIdx]?.[index] || ''"
                @input="handleBlankChange(index, $event)"
                @keydown="handleBlankKeyDown(index, $event)"
                :disabled="revealed[currentIdx]"
              />
            </div>
          </div>
          
          <!-- 单个填空的情况，保持原有的大文本框 -->
          <textarea 
            v-else
            ref="textareaRef"
            :class="[
              'w-full p-6 glass-input rounded-3xl outline-none focus:ring-0 transition-all min-h-[160px] text-lg font-medium placeholder:text-slate-400',
              revealed[currentIdx] 
               ? isCurrentCorrect 
                   ? 'border-sage-300 bg-sage-50/50 text-sage-900' 
                   : 'border-red-300 bg-red-50/50 text-red-900'
               : 'focus:bg-white/60 text-slate-800'
            ]"
            :placeholder="t('quiz.typePlaceholder')"
            :value="userAnswers[currentIdx]?.[0] || ''"
            @input="handleTextChange"
            @keydown="handleTextKeyDown"
            :disabled="revealed[currentIdx]"
          />
          
          <button 
            v-if="!revealed[currentIdx]"
            @click="() => { answeredBeforeReveal[currentIdx] = true; setRevealed(currentIdx, true) }"
            :disabled="!hasValidAnswers()"
            class="w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300/50 disabled:cursor-not-allowed text-white rounded-2xl font-bold shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 ml-auto"
          >
            <CheckSquare :size="20" />
            <span>{{ t('quiz.check') }}</span>
          </button>
        </div>

        <!-- Multiple Choice Options -->
        <div 
          v-else
          v-for="(opt, i) in question.options" 
          :key="i"
          @click="handleSelect(opt.text)"
          :class="getOptionClasses(opt, i)"
        >
          <div :class="getMarkerClasses(opt)">
            <div v-if="(revealed[currentIdx] && question.correctAnswer.includes(opt.text)) || (userAnswers[currentIdx] || []).includes(opt.text)" :class="['w-2.5 h-2.5 bg-white', isMultiSelect ? 'rounded-[2px]' : 'rounded-full']" />
          </div>
          <div :class="getTextClasses(opt)">
             <span v-if="!isJudgment" class="mr-3 opacity-60 font-black">{{ opt.label }}.</span>
             {{ getOptionText(opt) }}
          </div>
        </div>
      </div>

      <!-- Feedback Area -->
      <div 
        v-if="revealed[currentIdx]" 
        :class="[
          'mt-auto mb-6 p-6 rounded-3xl border flex flex-col items-start relative z-10 animate-scale-in backdrop-blur-md',
          isCurrentCorrect ? 'bg-sage-100/40 border-sage-200/50 text-sage-900' : 'bg-red-100/40 border-red-200/50 text-red-900'
        ]"
      >
          <div class="flex items-center gap-3 mb-4">
              <div :class="['p-2.5 rounded-full shrink-0 shadow-sm', isCurrentCorrect ? 'bg-sage-200 text-sage-700' : 'bg-red-200 text-red-700']">
                <CheckCircle v-if="isCurrentCorrect" :size="28"/>
                <XCircle v-else :size="28"/>
              </div>
              <div class="font-bold text-xl">
                {{ isCurrentCorrect ? t('quiz.correct') : t('quiz.incorrect') }}
              </div>
          </div>
          
          <div v-if="!isCurrentCorrect" class="w-full">
              <span class="block mb-2 font-bold opacity-70 text-sm uppercase tracking-wider">{{ t('quiz.correctAnswer') }}</span>
              <div class="w-full bg-white/50 rounded-2xl border border-white/50 p-4 text-lg font-bold shadow-sm overflow-x-auto">
                <div v-for="(ans, idx) in question.correctAnswer" :key="idx" class="mb-2 last:mb-0">
                    <div v-if="isHtml(ans)" :class="['font-mono bg-sage-50 text-sage-700 p-2 rounded border border-sage-200']">{{ ans }}</div>
                    <pre v-else class="whitespace-pre-wrap font-mono">{{ ans }}</pre>
                </div>
              </div>
          </div>
      </div>

      <!-- Controls -->
      <div class="mt-auto pt-6 border-t border-white/30 flex items-center justify-between relative z-10">
         <div class="flex gap-2 sm:gap-4">
           <button 
              @click="prevQuestion"
              :disabled="currentIdx === 0"
              class="p-3 sm:p-4 rounded-2xl glass-button hover:bg-white/60 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 transition-all active:scale-95"
              :title="t('quiz.prev')"
           >
              <ChevronLeft :size="20" :stroke-width="3" class="sm:w-6 sm:h-6" />
           </button>
           <button 
              @click="toggleReveal"
              class="p-3 sm:p-4 rounded-2xl glass-button text-brand-600 hover:text-brand-700 hover:bg-white/60 transition-all active:scale-95"
              :title="revealed[currentIdx] ? t('quiz.hide') : t('quiz.show')"
           >
              <EyeOff v-if="revealed[currentIdx]" :size="20" :stroke-width="2.5" class="sm:w-6 sm:h-6" />
              <Eye v-else :size="20" :stroke-width="2.5" class="sm:w-6 sm:h-6" />
           </button>
           <button 
              @click="askAI"
              :disabled="aiLoading"
              class="p-3 sm:p-4 rounded-2xl glass-button text-ember-600 hover:text-ember-700 hover:bg-white/60 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              :title="aiLoading ? t('app.ai.thinking') : t('app.ai.askAI')"
           >
              <Bot :size="20" :stroke-width="2.5" :class="{ 'animate-pulse': aiLoading }" class="sm:w-6 sm:h-6" />
              <span v-if="aiLoading" class="text-xs font-medium hidden sm:inline">{{ t('app.ai.thinking') }}</span>
           </button>
         </div>
         
         <button 
           @click="nextQuestion"
           class="flex items-center space-x-2 sm:space-x-3 bg-brand-800 hover:bg-brand-900 text-white ring-1 ring-inset ring-white/15 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex-shrink-0"
         >
           <span class="text-base sm:text-lg">{{ currentIdx === total - 1 ? t('quiz.finish') : t('quiz.next') }}</span>
           <ChevronRight :size="18" :stroke-width="3" class="sm:w-5 sm:h-5" />
         </button>
      </div>

      <!-- AI Loading Display -->
      <div 
        v-if="aiLoading" 
        class="mt-6 p-6 rounded-3xl border bg-ember-50/40 border-ember-200/50 text-ember-900 relative z-10 animate-scale-in backdrop-blur-md"
      >
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-full shrink-0 shadow-sm bg-ember-200 text-ember-700">
            <Bot :size="28" class="animate-pulse"/>
          </div>
          <div class="font-bold text-xl">{{ t('app.ai.thinking') }}</div>
          <div class="ml-auto flex space-x-1">
            <div class="w-2 h-2 bg-ember-500 rounded-full animate-bounce-dots"></div>
            <div class="w-2 h-2 bg-ember-500 rounded-full animate-bounce-dots"></div>
            <div class="w-2 h-2 bg-ember-500 rounded-full animate-bounce-dots"></div>
          </div>
        </div>
      </div>

      <!-- AI Answer Display -->
      <div 
        v-if="showAIAnswer && aiAnswer" 
        class="mt-6 p-6 rounded-3xl border bg-ember-50/40 border-ember-200/50 text-ember-900 relative z-10 animate-scale-in backdrop-blur-md"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2.5 rounded-full shrink-0 shadow-sm bg-ember-200 text-ember-700">
            <Bot :size="28"/>
          </div>
          <div class="font-bold text-xl">AI 解答</div>
          <button 
            @click="showAIAnswer = false"
            class="ml-auto p-1 rounded-full hover:bg-ember-200/50 text-ember-500 hover:text-ember-700 transition-colors"
          >
            <X :size="20" />
          </button>
        </div>
        
        <div class="prose prose-ember max-w-none">
          <div class="whitespace-pre-wrap text-sm leading-relaxed" v-html="renderMarkdown(aiAnswer)"></div>
        </div>
      </div>
    </LiquidGlass>
  </div>

  <!-- Image Modal -->
  <Teleport to="body">
    <div 
      v-if="showImageModal" 
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4" 
      @click="closeImageModal"
    >
      <div 
        class="relative max-w-[90vw] max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl"
        @click.stop
      >
        <img 
          :src="selectedImage" 
          alt="Enlarged image" 
          class="w-full h-full object-contain"
        />
        <button
          @click="closeImageModal"
          class="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
        >
          <X :size="20" />
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, h, nextTick, inject } from 'vue'
import { ArrowLeft, CheckCircle, XCircle, ChevronLeft, ChevronRight, Eye, EyeOff, RotateCcw, LayoutDashboard, Trophy, CheckSquare, X, Copy, Bot } from 'lucide-vue-next'
import LiquidGlass from './LiquidGlass.vue'
import type { QuestionBank, QuestionItem } from '../types/types'
import { useLanguage } from '../composables/useLanguage'
import { aiService } from '../services/aiService'

interface Props {
  bank: QuestionBank
  initialQuestions?: QuestionItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  exit: []
}>()

const { t } = useLanguage()

// Inject quiz stats functions from App.vue
const updateQuizStats = inject<(correct: number, total: number) => void>('updateQuizStats')
const resetQuizStats = inject<() => void>('resetQuizStats')

// State
const questions = ref<QuestionItem[]>(props.initialQuestions || props.bank.questions)
const currentIdx = ref(0)
const userAnswers = ref<Record<number, string[]>>({})
const revealed = ref<Record<number, boolean>>({})
const answeredBeforeReveal = ref<Record<number, boolean>>({}) // 记录是否在查看答案前就已回答
const isFinished = ref(false)
const showImageModal = ref(false)
const selectedImage = ref('')
const copyButtonText = ref('复制题目')
const showAIAnswer = ref(false)
const aiAnswer = ref('')
const aiLoading = ref(false)
const blankInputRefs = ref<Record<number, HTMLInputElement>>({}) // 填空输入框的引用
const textareaRef = ref<HTMLTextAreaElement | null>(null) // 单个填空textarea的引用

// Computed
const total = computed(() => questions.value.length)
const question = computed(() => questions.value[currentIdx.value])

const isJudgment = computed(() => {
  if (!question.value) return false
  if (question.value.type.includes("判断")) return true
  if (question.value.title.includes("判断")) return true
  if (question.value.options.length === 2) {
     const hasKeywords = question.value.options.some(o => 
       /^(true|false|对|错)/i.test(o.text)
     )
     if (hasKeywords) return true
  }
  return false
})

const isMultiSelect = computed(() => question.value?.type.includes("多选"))
const isText = computed(() => question.value?.type.includes("填空") || question.value?.type.includes("简答"))

const isCurrentCorrect = computed(() => {
  if (!question.value) return false
  return checkAnswer(question.value, userAnswers.value[currentIdx.value] || [])
})

const results = computed(() => {
  let correct = 0
  let wrong = 0
  
  // 遍历所有已显示答案的题目
  Object.keys(revealed.value).forEach(idxStr => {
    const idx = parseInt(idxStr)
    if (idx < questions.value.length && revealed.value[idx]) {
      const q = questions.value[idx]
      const userAns = userAnswers.value[idx] || []
      const wasAnsweredFirst = answeredBeforeReveal.value[idx] || false
      
      // 如果用户在查看答案前就回答了，按正常逻辑判断
      if (wasAnsweredFirst) {
        const res = checkAnswer(q, userAns)
        if (res === true) correct++
        else wrong++
      } else {
        // 如果直接查看答案，计为错误
        wrong++
      }
    }
  })
  
  return { correct, wrong }
})

const isPerfect = computed(() => results.value.wrong === 0)

// Methods
const normalizeText = (s: string) => {
  return s.trim()
    .toLowerCase()
    // 转换全角字符为半角
    .replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    // 处理CJK兼容字符 - 将特殊编码的汉字转换为标准汉字
    .replace(/[\u2f00-\u2fff]/g, (ch) => {
      // 这是CJK部首补充区，需要转换为对应的标准汉字
      const code = ch.charCodeAt(0)
      // 特殊处理一些常见的字符映射
      const mapping: Record<number, string> = {
        0x2f42: '文', // ⽂ -> 文
        0x2f06: '人', // ⼈ -> 人
        0x2f08: '入', // ⼊ -> 入
        0x2f0a: '刀', // ⼑ -> 刀
        0x2f0b: '力', // ⼒ -> 力
        0x2f11: '口', // ⼝ -> 口
        0x2f1c: '大', // ⼤ -> 大
        0x2f1d: '女', // ⼥ -> 女
        0x2f1f: '子', // ⼦ -> 子
        0x2f24: '心', // ⼼ -> 心
        0x2f2c: '手', // ⼿ -> 手
        0x2f38: '水', // ⽔ -> 水
        0x2f3a: '火', // ⽕ -> 火
        0x2f3e: '田', // ⽥ -> 田
        0x2f52: '网', // ⽹ -> 网
        0x2f5f: '糸', // ⽷ -> 糸
        0x2f70: '艸', // ⾋ -> 艸
        0x2f75: '言', // ⾔ -> 言
        0x2f8a: '金', // ⾦ -> 金
      }
      return mapping[code] || ch
    })
    // 标点符号统一
    .replace(/。/g, '.')
    .replace(/，/g, ',')
    .replace(/：/g, ':')
    .replace(/？/g, '?')
    .replace(/！/g, '!')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    // 处理空白字符
    .replace(/\s+/g, ' ')
    // 移除常见的无关字符
    .replace(/[""'']/g, '"')
    .replace(/[、]/g, ',')
    // 移除末尾的标点符号
    .replace(/[.,;:!?]+$/, '')
    // Unicode规范化 - 将不同编码的相同字符统一
    .normalize('NFKC')
}

const checkAnswer = (q: QuestionItem, userAns: string[]) => {
  const correct = q.correctAnswer || []
  if (correct.length === 0) return null

  const isTextType = q.type.includes("填空") || q.type.includes("简答")

  if (isTextType) {
    const blankCount = getBlankCount(q.title)
    
    if (blankCount > 1) {
      // 多个填空：每个空格都要正确
      if (userAns.length < blankCount || correct.length < blankCount) return false
      
      for (let i = 0; i < blankCount; i++) {
        if (!userAns[i] || !correct[i]) return false
        const userNorm = normalizeText(userAns[i])
        const correctNorm = normalizeText(correct[i])
        
        // 精确匹配
        if (userNorm === correctNorm) continue
        
        // 只有当用户答案比正确答案长，且包含正确答案时才认为正确
        // 这样可以处理用户输入了更完整答案的情况，但不允许部分匹配
        if (userNorm.length > correctNorm.length && userNorm.includes(correctNorm)) continue
        
        return false
      }
      return true
    } else {
      // 单个填空：检查第一个答案是否匹配任何正确答案
      if (userAns.length === 0) return false
      const userNorm = normalizeText(userAns[0])
      
      return correct.some(c => {
        const correctNorm = normalizeText(c)
        // 精确匹配
        if (userNorm === correctNorm) return true
        // 只允许用户答案更完整的情况
        if (userNorm.length > correctNorm.length && userNorm.includes(correctNorm)) return true
        return false
      })
    }
  }

  // 选择题和判断题的逻辑保持不变
  if (userAns.length !== correct.length) return false
  const s1 = [...userAns].sort()
  const s2 = [...correct].sort()
  return s1.every((val, index) => normalizeText(val) === normalizeText(s2[index]))
}

const renderTitle = (title: string) => {
  // 检查是否包含HTML标签
  const hasHtmlTags = title.includes('<') && title.includes('>')
  
  if (hasHtmlTags) {
    // 处理JSON转义的引号，但保持HTML标签作为文本显示
    let processedTitle = title
      .replace(/\\"/g, '"')  // JSON转义的双引号
      .replace(/\\'/g, "'")  // JSON转义的单引号
    
    // 使用textContent而不是innerHTML，这样HTML标签会作为文本显示
    return h('div', {
      class: 'text-xl md:text-3xl font-bold text-slate-800 leading-relaxed drop-shadow-sm select-text question-content'
    }, [
      h('span', {}, processedTitle)
    ])
  }
  
  const looksLikeJs = /function\s+\w+\s*\(|[{;}]/.test(title)
  const looksLikePy = /\b(if|else|elif|while|for|def|class|print)\b/.test(title) || /:\s*\b(if|else|elif)\b/.test(title)
  
  if (looksLikeJs || looksLikePy) {
    let formatted = title
    if (looksLikeJs) {
      formatted = formatted
        .replace(/\)\s*\{/g, ') {\n')
        .replace(/\{\s*/g, '{\n')
        .replace(/;\s*/g, ';\n')
        .replace(/\}\s*/g, '\n}')
    }
    if (looksLikePy) {
      formatted = formatted
        .replace(/\s+def\s+/g, '\ndef ')
        .replace(/\s+class\s+/g, '\nclass ')
        .replace(/\s+if\s+/g, '\nif ')
        .replace(/\s+elif\s+/g, '\nelif ')
        .replace(/\s+else\s*:/g, '\nelse:')
        .replace(/\s+while\s+/g, '\nwhile ')
        .replace(/\s+for\s+/g, '\nfor ')
        .replace(/:\s*print\(/g, ':\nprint(')
        .replace(/\)\s+if\s+/g, ')\nif ')
        .replace(/\)\s+while\s+/g, ')\nwhile ')
        .replace(/\{\s*/g, '{\n')
        .replace(/,\s*"/g, ',\n"')
        .replace(/\}\s*print/g, '\n}\nprint')
    }
    
    const applyIndent = (code: string, lang: 'js' | 'py') => {
      const lines = code.split('\n').map(l => l.trim())
      let indent = 0
      const out: string[] = []
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (lang === 'js') {
          if (/^\}/.test(line)) indent = Math.max(0, indent - 1)
          out.push(`${'  '.repeat(indent)}${line}`)
          if (/\{$/.test(line)) indent++
        } else {
          const startsBlock = /^(def|class|if|elif|else:|for|while)\b/.test(line)
          const isCallOrPrint = /^[a-zA-Z_]\w*\s*\(/.test(line) || /^print\(/.test(line)
          if (isCallOrPrint) indent = 0
          out.push(`${'  '.repeat(indent)}${line}`)
          if (line.endsWith(':')) indent = 1
          if (startsBlock && !line.endsWith(':')) indent = 0
        }
      }
      return out.join('\n')
    }
    
    formatted = applyIndent(formatted, looksLikeJs ? 'js' : 'py')
    return h('div', { class: 'rounded-2xl border border-slate-300/50 bg-slate-900/5 p-4 shadow-sm' }, [
      h('pre', { 
        class: 'text-base md:text-lg font-mono whitespace-pre-wrap text-slate-800 leading-relaxed drop-shadow-sm select-text' 
      }, formatted)
    ])
  }
  
  return h('h2', { 
    class: 'text-xl md:text-3xl font-bold text-slate-800 leading-relaxed drop-shadow-sm select-text' 
  }, title)
}

const isHtml = (text: string) => {
  return /<[a-z][\s\S]*>/i.test(text) || text.includes('&lt;') || text.includes('&nbsp;')
}

const getOptionClasses = (opt: any, i: number) => {
  const isSelected = (userAnswers.value[currentIdx.value] || []).includes(opt.text)
  const isActualAnswer = question.value.correctAnswer.includes(opt.text)
  
  let containerClass = "border-white/40 bg-white/20 hover:bg-white/40 cursor-pointer shadow-sm backdrop-blur-md"

  if (revealed.value[currentIdx.value]) {
    if (isActualAnswer) {
      containerClass = "border-sage-400 bg-sage-100/40 shadow-md ring-1 ring-sage-400/50"
    } else if (isSelected && !isActualAnswer) {
      containerClass = "border-red-400 bg-red-100/40 shadow-md ring-1 ring-red-400/50"
    } else {
      containerClass = "border-transparent bg-slate-100/10 opacity-40"
    }
  } else if (isSelected) {
    containerClass = "border-brand-400 bg-brand-50/40 ring-2 ring-brand-400/30 shadow-md"
  }

  return `relative p-5 rounded-2xl border-2 transition-all duration-200 flex items-start gap-4 group active:scale-[0.99] select-none ${containerClass}`
}

const getMarkerClasses = (opt: any) => {
  const isSelected = (userAnswers.value[currentIdx.value] || []).includes(opt.text)
  const isActualAnswer = question.value.correctAnswer.includes(opt.text)
  
  let markerClass = "border-slate-300/50 bg-white/50"

  if (revealed.value[currentIdx.value]) {
    if (isActualAnswer) {
      markerClass = "bg-sage-500 border-sage-500 text-white"
    } else if (isSelected && !isActualAnswer) {
      markerClass = "bg-red-500 border-red-500 text-white"
    }
  } else if (isSelected) {
    markerClass = "bg-brand-500 border-brand-500 text-white scale-110"
  }

  return `mt-0.5 w-6 h-6 ${isMultiSelect.value ? 'rounded-lg' : 'rounded-full'} border-2 flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm ${markerClass}`
}

const getTextClasses = (opt: any) => {
  const isSelected = (userAnswers.value[currentIdx.value] || []).includes(opt.text)
  const isActualAnswer = question.value.correctAnswer.includes(opt.text)
  
  let textClass = "text-slate-700"

  if (revealed.value[currentIdx.value]) {
    if (isActualAnswer) {
      textClass = "text-sage-900"
    } else if (isSelected && !isActualAnswer) {
      textClass = "text-red-900"
    }
  } else if (isSelected) {
    textClass = "text-brand-900"
  }

  return `flex-1 font-bold text-lg leading-snug ${textClass}`
}

const getOptionText = (opt: any) => {
  if (isJudgment.value) {
    return opt.text.replace(/^(true|false)[\.\s]*/i, '') || 
           (opt.text.toLowerCase().includes('true') ? '对' : 
            opt.text.toLowerCase().includes('false') ? '错' : opt.text)
  }
  return opt.text
}

const getImageUrl = (imagePath: string) => {
  // 如果是完整的URL（http/https），直接返回
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // 对于本地图片，需要添加base路径
  const baseUrl = '/Good-Review-VueVersion/'
  let finalUrl = imagePath
  
  // 如果路径不是以base开头，添加base路径
  if (!imagePath.startsWith(baseUrl)) {
    // 移除开头的斜杠（如果有的话）
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    finalUrl = baseUrl + cleanPath
  }
  
  return finalUrl
}

const openImageModal = (imageUrl: string) => {
  selectedImage.value = imageUrl
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
  selectedImage.value = ''
}

const copyQuestion = async () => {
  if (!question.value) return
  
  // 构建要复制的文本
  let textToCopy = `${question.value.title}\n\n`
  
  // 添加选项
  if (question.value.options && question.value.options.length > 0) {
    textToCopy += '选项：\n'
    question.value.options.forEach(option => {
      textToCopy += `${option.label}. ${option.text}\n`
    })
  }
  
  // 添加正确答案
  if (question.value.correctAnswer && question.value.correctAnswer.length > 0) {
    textToCopy += `\n正确答案：${question.value.correctAnswer.join(', ')}`
  }
  
  try {
    // 复制到剪贴板
    await navigator.clipboard.writeText(textToCopy)
    
    // 显示成功反馈
    copyButtonText.value = '已复制!'
    setTimeout(() => {
      copyButtonText.value = '复制题目'
    }, 2000)
    
  } catch (error) {
    console.error('复制失败:', error)
    // 降级方案：使用传统的复制方法
    try {
      const textArea = document.createElement('textarea')
      textArea.value = textToCopy
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      copyButtonText.value = '已复制!'
      setTimeout(() => {
        copyButtonText.value = '复制题目'
      }, 2000)
    } catch (fallbackError) {
      console.error('降级复制也失败:', fallbackError)
      copyButtonText.value = '复制失败'
      setTimeout(() => {
        copyButtonText.value = '复制题目'
      }, 2000)
    }
  }
}

const handleSelect = (val: string) => {
  if (revealed.value[currentIdx.value]) return

  const current = userAnswers.value[currentIdx.value] || []
  if (isMultiSelect.value) {
    if (current.includes(val)) {
      userAnswers.value[currentIdx.value] = current.filter(v => v !== val)
    } else {
      userAnswers.value[currentIdx.value] = [...current, val]
    }
  } else {
    userAnswers.value[currentIdx.value] = [val]
    // 记录用户在查看答案前就已回答
    answeredBeforeReveal.value[currentIdx.value] = true
    setRevealed(currentIdx.value, true)
  }
}

const handleTextChange = (e: Event) => {
  if (revealed.value[currentIdx.value]) return
  const val = (e.target as HTMLTextAreaElement).value
  userAnswers.value[currentIdx.value] = [val]
  // 记录用户正在输入答案
  if (val.trim()) {
    answeredBeforeReveal.value[currentIdx.value] = true
  }
}

const handleBlankKeyDown = (index: number, e: KeyboardEvent) => {
  if (revealed.value[currentIdx.value]) return
  
  const blankCount = getBlankCount(question.value?.title || '')
  
  // 处理上下箭头键跳转
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    const prevIndex = index > 0 ? index - 1 : blankCount - 1
    const prevInput = blankInputRefs.value[prevIndex]
    if (prevInput) {
      prevInput.focus()
      // 将光标移到末尾
      setTimeout(() => {
        prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length)
      }, 0)
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    const nextIndex = index < blankCount - 1 ? index + 1 : 0
    const nextInput = blankInputRefs.value[nextIndex]
    if (nextInput) {
      nextInput.focus()
      // 将光标移到末尾
      setTimeout(() => {
        nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length)
      }, 0)
    }
  } else if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    // 如果当前输入框有内容，跳转到下一个空的输入框
    const currentValue = userAnswers.value[currentIdx.value]?.[index] || ''
    if (currentValue.trim()) {
      // 查找下一个空的输入框
      let nextEmptyIndex = -1
      const currentAnswers = userAnswers.value[currentIdx.value] || []
      
      for (let i = index + 1; i < blankCount; i++) {
        if (!currentAnswers[i] || !currentAnswers[i].trim()) {
          nextEmptyIndex = i
          break
        }
      }
      
      // 如果没找到后面的空输入框，从头开始找
      if (nextEmptyIndex === -1) {
        for (let i = 0; i < index; i++) {
          if (!currentAnswers[i] || !currentAnswers[i].trim()) {
            nextEmptyIndex = i
            break
          }
        }
      }
      
      if (nextEmptyIndex !== -1) {
        const nextInput = blankInputRefs.value[nextEmptyIndex]
        if (nextInput) {
          nextInput.focus()
        }
      } else {
        // 所有输入框都有内容，提交答案
        if (hasValidAnswers()) {
          answeredBeforeReveal.value[currentIdx.value] = true
          setRevealed(currentIdx.value, true)
        }
      }
    }
  }
}

const handleBlankChange = (index: number, e: Event) => {
  if (revealed.value[currentIdx.value]) return
  const val = (e.target as HTMLInputElement).value
  const current = userAnswers.value[currentIdx.value] || []
  const newAnswers = [...current]
  newAnswers[index] = val
  userAnswers.value[currentIdx.value] = newAnswers
  
  // 记录用户正在输入答案
  if (val.trim()) {
    answeredBeforeReveal.value[currentIdx.value] = true
  }
}

const getBlankCount = (title: string) => {
  // 计算题目中填空的数量，支持多种格式：
  // 1. 括号格式：（ ）、( )
  // 2. 下划线格式：______、________
  // 3. 单个空格格式：被中文字符包围的单个空格
  
  let count = 0
  
  // 检测括号格式
  const bracketMatches = title.match(/[（(]\s*[）)]/g)
  if (bracketMatches) {
    count += bracketMatches.length
  }
  
  // 检测下划线格式（连续4个或以上下划线）
  const underlineMatches = title.match(/_{4,}/g)
  if (underlineMatches) {
    count += underlineMatches.length
  }
  
  // 检测单个空格格式：被中文字符包围的单个空格
  // 先移除括号内的空格，然后检测被中文字符包围的单个空格
  let titleWithoutBrackets = title.replace(/[（(]\s*[）)]/g, '')
  // 匹配：中文字符 + 空格 + 中文字符
  const chineseSpaceMatches = titleWithoutBrackets.match(/[\u4e00-\u9fff]\s[\u4e00-\u9fff]/g)
  if (chineseSpaceMatches) {
    count += chineseSpaceMatches.length
  }
  
  // 如果没有检测到任何填空格式，默认返回1
  return count > 0 ? count : 1
}

const isBlankCorrect = (index: number) => {
  if (!question.value) return false
  const userAns = userAnswers.value[currentIdx.value] || []
  const correctAns = question.value.correctAnswer || []
  
  if (index >= correctAns.length || index >= userAns.length) return false
  
  const userNorm = normalizeText(userAns[index])
  const correctNorm = normalizeText(correctAns[index])
  
  // 精确匹配
  if (userNorm === correctNorm) return true
  // 只允许用户答案更完整的情况
  if (userNorm.length > correctNorm.length && userNorm.includes(correctNorm)) return true
  
  return false
}

const hasValidAnswers = () => {
  const current = userAnswers.value[currentIdx.value] || []
  const blankCount = getBlankCount(question.value?.title || '')
  
  if (blankCount > 1) {
    // 多个填空：检查是否所有空格都有答案
    return current.length >= blankCount && current.every((ans, idx) => idx < blankCount ? ans?.trim() : true)
  } else {
    // 单个填空：检查第一个答案是否有内容
    return current[0]?.trim()
  }
}

const handleTextKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (userAnswers.value[currentIdx.value]?.[0]?.trim()) {
        // 记录用户在查看答案前就已回答
        answeredBeforeReveal.value[currentIdx.value] = true
        setRevealed(currentIdx.value, true)
      }
  }
}

const setRevealed = (idx: number, value: boolean) => {
  revealed.value[idx] = value
  
  // 如果是显示答案，立即更新统计
  if (value && updateQuizStats) {
    updateQuizStatsImmediate()
  }
}

// 立即更新统计的函数
const updateQuizStatsImmediate = () => {
  let correct = 0
  
  // 遍历所有已显示答案的题目
  Object.keys(revealed.value).forEach(idxStr => {
    const idx = parseInt(idxStr)
    if (idx < questions.value.length && revealed.value[idx]) {
      const q = questions.value[idx]
      const userAns = userAnswers.value[idx] || []
      const wasAnsweredFirst = answeredBeforeReveal.value[idx] || false
      
      // 如果用户在查看答案前就回答了，按正常逻辑判断
      if (wasAnsweredFirst) {
        const res = checkAnswer(q, userAns)
        if (res === true) correct++
      }
      // 如果直接查看答案，不增加正确数
    }
  })
  
  // 更新全局统计（用于Smart Blur功能）
  // 传递正确数和当前题目总数
  if (updateQuizStats) {
    updateQuizStats(correct, questions.value.length)
  }
}

const nextQuestion = () => {
  // 清空当前题目的输入框引用
  blankInputRefs.value = {}
  
  if (currentIdx.value < total.value - 1) {
    currentIdx.value++
    // 切换题目后自动聚焦到输入框
    autoFocusInput()
  } else {
    isFinished.value = true
  }
}

const prevQuestion = () => {
  // 清空当前题目的输入框引用
  blankInputRefs.value = {}
  
  if (currentIdx.value > 0) {
    currentIdx.value--
    // 切换题目后自动聚焦到输入框
    autoFocusInput()
  }
}

const autoFocusInput = () => {
  // 使用nextTick确保DOM已更新
  nextTick(() => {
    if (!question.value) return
    
    const isTextType = question.value.type.includes("填空") || question.value.type.includes("简答")
    
    if (isTextType) {
      const blankCount = getBlankCount(question.value.title)
      
      if (blankCount > 1) {
        // 多个填空：聚焦到第一个输入框
        const firstInput = blankInputRefs.value[0]
        if (firstInput) {
          firstInput.focus()
        }
      } else {
        // 单个填空：聚焦到textarea
        const textarea = document.querySelector('textarea') as HTMLTextAreaElement
        if (textarea && !revealed.value[currentIdx.value]) {
          textarea.focus()
        }
      }
    }
  })
}

const toggleReveal = () => {
  setRevealed(currentIdx.value, !revealed.value[currentIdx.value])
}

const handleRetryMistakes = () => {
  const wrongQuestions = questions.value.filter((q, idx) => {
    // 只有已显示答案的题目才参与错题筛选
    if (!revealed.value[idx]) return false
    
    const userAns = userAnswers.value[idx] || []
    const wasAnsweredFirst = answeredBeforeReveal.value[idx] || false
    
    // 如果用户在查看答案前就回答了，按正常逻辑判断
    if (wasAnsweredFirst) {
      return checkAnswer(q, userAns) === false
    } else {
      // 如果直接查看答案，也算错题
      return true
    }
  })

  if (wrongQuestions.length > 0) {
    questions.value = wrongQuestions
    currentIdx.value = 0
    userAnswers.value = {}
    revealed.value = {}
    answeredBeforeReveal.value = {}
    isFinished.value = false
    
    // 重置答题统计，设置新的题目总数
    if (updateQuizStats) {
      updateQuizStats(0, wrongQuestions.length)
    }
  }
}

const askAI = async () => {
  if (!question.value) return
  
  if (!aiService.hasValidConfig()) {
    alert(t('app.ai.error'))
    return
  }
  
  aiLoading.value = true
  showAIAnswer.value = false
  aiAnswer.value = ''
  
  try {
    // 准备问题和选项
    const questionText = question.value.title
    const options = question.value.options?.map(opt => opt.text) || []
    
    // 调用AI服务
    const answer = await aiService.askQuestion(questionText, options)
    
    aiAnswer.value = answer
    showAIAnswer.value = true
  } catch (error) {
    console.error('AI request failed:', error)
    alert(error instanceof Error ? error.message : t('app.ai.error'))
  } finally {
    aiLoading.value = false
  }
}

const renderMarkdown = (text: string) => {
  if (!text) return ''
  
  return text
    // 粗体
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // 代码块
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-100 p-3 rounded-lg overflow-x-auto"><code>$1</code></pre>')
    // 行内代码
    .replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1 py-0.5 rounded text-sm">$1</code>')
    // 换行
    .replace(/\n/g, '<br>')
}

// Keyboard navigation
const handleKey = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    return
  }
  
  // ESC键关闭图片模态框
  if (e.key === 'Escape' && showImageModal.value) {
    closeImageModal()
    return
  }
  
  if (!isFinished.value) {
    if (e.key === 'ArrowRight') nextQuestion()
    if (e.key === 'ArrowLeft') prevQuestion()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKey)
  // 初始化时自动聚焦到输入框
  autoFocusInput()
  // 初始化答题统计，设置题目总数
  if (updateQuizStats) {
    updateQuizStats(0, questions.value.length)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
  // 组件卸载时重置答题统计
  if (resetQuizStats) {
    resetQuizStats()
  }
})
</script>