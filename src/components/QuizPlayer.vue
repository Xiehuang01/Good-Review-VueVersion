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

    <div class="relative z-10 w-full glass-panel rounded-[3rem] p-8 sm:p-12 text-center">
       
       <div :class="[
         'mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-white/50 backdrop-blur-md',
         isPerfect ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-white' : 'bg-gradient-to-br from-brand-500 to-brand-600 text-white'
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
          <div class="p-6 rounded-3xl bg-emerald-100/40 border border-emerald-200/50 flex flex-col items-center justify-center group hover:scale-105 transition-transform backdrop-blur-sm">
             <div class="text-5xl font-black text-emerald-500 mb-2 group-hover:scale-110 transition-transform drop-shadow-sm">{{ results.correct }}</div>
             <div class="text-sm font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1">
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
           class="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
         >
           <RotateCcw :size="22" :stroke-width="2.5" />
           <span>{{ t('quiz.results.btnRetry') }}</span>
         </button>
         
         <button 
           @click="emit('exit')"
           :class="[
             'w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl font-bold text-lg transition-all',
             isPerfect ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-lg' : 'bg-white/40 hover:bg-white/60 text-slate-700 border border-white/50'
           ]"
         >
           <ArrowLeft :size="22" :stroke-width="2.5" />
           <span>{{ t('quiz.results.btnDashboard') }}</span>
         </button>
       </div>
    </div>
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
      <div class="text-sm font-bold text-brand-700 bg-white/40 px-5 py-2 rounded-full border border-white/50 shadow-sm backdrop-blur-md">
        {{ currentIdx + 1 }} <span class="text-slate-400 mx-1">/</span> {{ total }}
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="w-full bg-slate-200/30 h-3 rounded-full mb-8 overflow-hidden backdrop-blur-sm border border-white/20">
      <div 
        class="bg-gradient-to-r from-brand-400 to-brand-500 h-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(52,211,153,0.6)]"
        :style="{ width: `${((currentIdx + 1) / total) * 100}%` }"
      />
    </div>

    <!-- Question Card -->
    <div class="glass-panel rounded-[2.5rem] p-6 md:p-10 flex-1 flex flex-col relative overflow-hidden transition-all duration-300">
      
      <div class="mb-8 relative z-10">
        <span class="inline-block bg-white/50 text-brand-700 text-xs font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider mb-4 border border-white/50 shadow-sm backdrop-blur-md">
          {{ isJudgment ? "判断" : question.type }}
        </span>
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
          <textarea 
              :class="[
                'w-full p-6 glass-input rounded-3xl outline-none focus:ring-0 transition-all min-h-[160px] text-lg font-medium placeholder:text-slate-400',
                revealed[currentIdx] 
                 ? isCurrentCorrect 
                     ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900' 
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
            @click="setRevealed(currentIdx, true)"
            :disabled="!userAnswers[currentIdx]?.[0]?.trim()"
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
          isCurrentCorrect ? 'bg-emerald-100/40 border-emerald-200/50 text-emerald-900' : 'bg-red-100/40 border-red-200/50 text-red-900'
        ]"
      >
          <div class="flex items-center gap-3 mb-4">
              <div :class="['p-2.5 rounded-full shrink-0 shadow-sm', isCurrentCorrect ? 'bg-emerald-200 text-emerald-700' : 'bg-red-200 text-red-700']">
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
                    <div v-if="isHtml(ans)" :class="['font-mono bg-emerald-50 text-emerald-700 p-2 rounded border border-emerald-200']">{{ ans }}</div>
                    <pre v-else class="whitespace-pre-wrap font-mono">{{ ans }}</pre>
                </div>
              </div>
          </div>
      </div>

      <!-- Controls -->
      <div class="mt-auto pt-6 border-t border-white/30 flex items-center justify-between relative z-10">
         <div class="flex gap-4">
           <button 
              @click="prevQuestion"
              :disabled="currentIdx === 0"
              class="p-4 rounded-2xl glass-button hover:bg-white/60 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 transition-all active:scale-95"
              :title="t('quiz.prev')"
           >
              <ChevronLeft :size="24" :stroke-width="3" />
           </button>
           <button 
              @click="toggleReveal"
              class="p-4 rounded-2xl glass-button text-brand-600 hover:text-brand-700 hover:bg-white/60 transition-all active:scale-95"
              :title="revealed[currentIdx] ? t('quiz.hide') : t('quiz.show')"
           >
              <EyeOff v-if="revealed[currentIdx]" :size="24" :stroke-width="2.5" />
              <Eye v-else :size="24" :stroke-width="2.5" />
           </button>
         </div>
         
         <button 
           @click="nextQuestion"
           class="flex items-center space-x-3 bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
         >
           <span class="text-lg">{{ currentIdx === total - 1 ? t('quiz.finish') : t('quiz.next') }}</span>
           <ChevronRight :size="22" :stroke-width="3" />
         </button>
      </div>
    </div>
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
import { ref, computed, onMounted, onUnmounted, h } from 'vue'
import { ArrowLeft, CheckCircle, XCircle, ChevronLeft, ChevronRight, Eye, EyeOff, RotateCcw, LayoutDashboard, Trophy, CheckSquare, X } from 'lucide-vue-next'
import type { QuestionBank, QuestionItem } from '../types/types'
import { useLanguage } from '../composables/useLanguage'

interface Props {
  bank: QuestionBank
  initialQuestions?: QuestionItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  exit: []
}>()

const { t } = useLanguage()

// State
const questions = ref<QuestionItem[]>(props.initialQuestions || props.bank.questions)
const currentIdx = ref(0)
const userAnswers = ref<Record<number, string[]>>({})
const revealed = ref<Record<number, boolean>>({})
const isFinished = ref(false)
const showImageModal = ref(false)
const selectedImage = ref('')

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
  questions.value.forEach((q, idx) => {
     const res = checkAnswer(q, userAnswers.value[idx] || [])
     if (res === true) correct++
     else wrong++
  })
  return { correct, wrong }
})

const isPerfect = computed(() => results.value.wrong === 0)

// Methods
const checkAnswer = (q: QuestionItem, userAns: string[]) => {
  const normalize = (s: string) => s.trim().toLowerCase()
      .replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
      .replace(/。/g, '.')
      .replace(/，/g, ',')
      .replace(/：/g, ':')
      .replace(/？/g, '?')
      .replace(/！/g, '!')
      .replace(/（/g, '(')
      .replace(/）/g, ')')
      .replace(/\s+/g, ' ')

  const correct = q.correctAnswer || []
  if (correct.length === 0) return null

  const isTextType = q.type.includes("填空") || q.type.includes("简答")

  if (isTextType) {
    return userAns.length > 0 && correct.some(c => normalize(c) === normalize(userAns[0]))
  }

  if (userAns.length !== correct.length) return false
  const s1 = [...userAns].sort()
  const s2 = [...correct].sort()
  return s1.every((val, index) => normalize(val) === normalize(s2[index]))
}

const renderTitle = (title: string) => {
  // 检查是否包含HTML标签
  const hasHtmlTags = title.includes('<') && title.includes('>')
  
  if (hasHtmlTags) {
    // 处理JSON转义的引号，但保持HTML标签作为文本显示
    let processedTitle = title
      .replace(/\\"/g, '"')  // JSON转义的双引号
      .replace(/\\'/g, "'")  // JSON转义的单引号
    
    console.log('Original title:', title)
    console.log('Processed title (as text):', processedTitle)
    
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
      containerClass = "border-emerald-400 bg-emerald-100/40 shadow-md ring-1 ring-emerald-400/50"
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
      markerClass = "bg-emerald-500 border-emerald-500 text-white"
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
      textClass = "text-emerald-900"
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
  console.log('Original image path:', imagePath)
  
  // 如果是完整的URL（http/https），直接返回
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('Returning URL as-is:', imagePath)
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
  
  console.log('Final image URL:', finalUrl)
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
    setRevealed(currentIdx.value, true)
  }
}

const handleTextChange = (e: Event) => {
  if (revealed.value[currentIdx.value]) return
  const val = (e.target as HTMLTextAreaElement).value
  userAnswers.value[currentIdx.value] = [val]
}

const handleTextKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (userAnswers.value[currentIdx.value]?.[0]?.trim()) {
        setRevealed(currentIdx.value, true)
      }
  }
}

const setRevealed = (idx: number, value: boolean) => {
  revealed.value[idx] = value
}

const nextQuestion = () => {
  if (currentIdx.value < total.value - 1) {
    currentIdx.value++
  } else {
    isFinished.value = true
  }
}

const prevQuestion = () => {
  if (currentIdx.value > 0) {
    currentIdx.value--
  }
}

const toggleReveal = () => {
  setRevealed(currentIdx.value, !revealed.value[currentIdx.value])
}

const handleRetryMistakes = () => {
  const wrongQuestions = questions.value.filter((q, idx) => {
    const userAns = userAnswers.value[idx] || []
    return checkAnswer(q, userAns) === false
  })

  if (wrongQuestions.length > 0) {
    questions.value = wrongQuestions
    currentIdx.value = 0
    userAnswers.value = {}
    revealed.value = {}
    isFinished.value = false
  }
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
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
})
</script>