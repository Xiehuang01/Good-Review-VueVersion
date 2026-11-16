<template>
  <div class="max-w-5xl mx-auto space-y-8">
    <div class="text-center space-y-4 pt-6">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-button text-brand-600 text-xs font-extrabold uppercase tracking-wide mb-2 animate-float">
        <span>✨ New Way to Review</span>
      </div>
      <h1 class="text-4xl sm:text-6xl font-black tracking-tight text-slate-800/90 drop-shadow-sm leading-tight">
        {{ t('guide.title') }} <br class="sm:hidden" />
        <span class="text-transparent bg-clip-text bg-brand-700">{{ t('guide.titleHighlight') }}</span>
      </h1>
      <p class="text-lg text-slate-600/90 max-w-xl mx-auto leading-relaxed px-4 font-medium">
        {{ t('guide.subtitle') }}
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6 sm:gap-8">
      <!-- Step 1 -->
      <div class="relative group">
        <LiquidGlass :radius="32" :bezel="26" tint="rgba(255, 255, 255, 0.34)" class="p-6 sm:p-8 h-full flex flex-col">
          <div class="flex items-center gap-4 mb-5">
            <div class="w-12 h-12 rounded-2xl bg-white/50 flex items-center justify-center text-brand-600 shadow-sm shrink-0 backdrop-blur-md">
               <Terminal :size="24" :stroke-width="2.5" />
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-800">{{ t('guide.step1.title') }}</h2>
          </div>
          
          <p class="text-slate-600 mb-6 leading-relaxed font-medium">
            {{ t('guide.step1.desc') }}
          </p>

          <div class="mt-auto space-y-4">
              <div class="bg-brand-900/90 backdrop-blur rounded-2xl p-4 relative group/code overflow-hidden border border-brand-800/50 shadow-inner h-32">
                  <div class="absolute top-0 right-0 p-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                       <div class="bg-slate-800 text-[10px] text-slate-400 px-1.5 py-0.5 rounded">JS</div>
                  </div>
                  <code class="text-brand-200 font-mono text-xs block opacity-80">
                      // ==UserScript==<br/>
                      // @name Chaoxing...<br/>
                      // @name         Chaoxing Work Scraper<br/>
                      // @namespace    cx-work-scraper<br/>
                      ...
                  </code>
              </div>
              
              <!-- 两个按钮并排 -->
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="handleCopyScript"
                  class="py-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold transition-all shadow-lg shadow-brand-900/20 ring-1 ring-inset ring-white/20 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <CheckCircle2 v-if="copiedScript" :size="18" />
                  <Clipboard v-else :size="18" />
                  <span>{{ copiedScript ? t('guide.step1.copied') : t('guide.step1.copy') }}</span>
                </button>
                
                <button
                  @click="handleCopyFormat"
                  class="py-4 rounded-2xl glass-button text-brand-700 font-bold flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <CheckCircle2 v-if="copiedFormat" :size="18" />
                  <FileText v-else :size="18" />
                  <span>{{ copiedFormat ? t('guide.step1.formatCopied') : t('guide.step1.copyFormat') }}</span>
                </button>
              </div>
              
              <!-- 按钮说明 -->
              <!-- <div class="grid grid-cols-2 gap-3 text-xs text-slate-500 font-medium">
                <div class="text-center">
                  <span>{{ t('guide.step1.scriptDesc') }}</span>
                </div>
                <div class="text-center">
                  <span>{{ t('guide.step1.formatDesc') }}</span>
                </div>
              </div> -->
              
              <div class="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <ArrowDownCircle :size="14" />
                  <span>{{ t('guide.step1.tip') }}</span>
              </div>
          </div>
        </LiquidGlass>
      </div>

      <!-- Step 2 -->
      <div class="relative group">
        <LiquidGlass :radius="32" :bezel="26" tint="rgba(255, 255, 255, 0.34)" class="p-6 sm:p-8 h-full flex flex-col">
           <div class="flex items-center gap-4 mb-5">
            <div class="w-12 h-12 rounded-2xl bg-white/50 flex items-center justify-center text-ember-500 shadow-sm shrink-0 backdrop-blur-md">
               <Database :size="24" :stroke-width="2.5" />
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-800">{{ t('guide.step2.title') }}</h2>
          </div>

          <div class="space-y-5 flex-1">
              <div class="flex items-start gap-4">
                  <div class="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-slate-600 font-bold text-sm shadow-sm shrink-0 backdrop-blur-sm">1</div>
                  <div>
                      <h3 class="font-bold text-slate-800 text-base mb-1">{{ t('guide.step2.goto') }}</h3>
                      <p class="text-slate-600 text-sm font-medium">{{ t('guide.step2.gotoDesc') }}</p>
                  </div>
              </div>
              
              <div class="flex items-start gap-4">
                  <div class="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-slate-600 font-bold text-sm shadow-sm shrink-0 backdrop-blur-sm">2</div>
                   <div>
                      <h3 class="font-bold text-slate-800 text-base mb-1">{{ t('guide.step2.panel') }}</h3>
                      <p class="text-slate-600 text-sm font-medium">{{ t('guide.step2.panelDesc') }}</p>
                  </div>
              </div>

              <div class="flex items-start gap-4">
                   <div class="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-slate-600 font-bold text-sm shadow-sm shrink-0 backdrop-blur-sm">3</div>
                   <div>
                      <h3 class="font-bold text-slate-800 text-base mb-1">{{ t('guide.step2.import') }}</h3>
                      <p class="text-slate-600 text-sm font-medium">{{ t('guide.step2.importDesc') }}</p>
                  </div>
              </div>
          </div>

           <div class="mt-8 p-4 bg-ember-50/30 rounded-2xl border border-ember-200/40 flex items-start gap-3 text-ember-800 text-sm font-medium backdrop-blur-sm">
               <div class="mt-0.5">💡</div>
               <p>{{ t('guide.step2.tipBox') }}</p>
           </div>
        </LiquidGlass>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Clipboard, CheckCircle2, Terminal, ArrowDownCircle, Database, FileText } from 'lucide-vue-next'
import LiquidGlass from './LiquidGlass.vue'
import { FULL_USERSCRIPT } from '../constants/constants'
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
const copiedScript = ref(false)
const copiedFormat = ref(false)

// 直接定义formatJson内容，避免导入问题
const formatJsonContent = {
  "source": "https://mooc1.chaoxing.com/mooc-ans/mooc2/work/view?courseId=254598688&classId=125773241&cpi=357258724&workId=49219572&answerId=54944796&enc=6041469bb1337fbfd8a5f63ac28cafca",
  "ts": 1768064502786,
  "items": [
     {
      "id": 1,
      "type": "单选",
      "title": "1、单片机与微型计算机的区别是：（ ）",
      "options": [
        { "label": "A", "text": "单片机的体积小，微型计算机的体积大" },
        { "label": "B", "text": "单片机功能全，微型计算机功能不全" },
        { "label": "C", "text": "单片机是将计算机各功能模块集成一块芯片上，微型计算机是将计算机的各功能模块放在不同的板上" },
        { "label": "D", "text": "单片机价格低，微型计算机价格高" }
      ],
      "correctAnswer": [
        "单片机是将计算机各功能模块集成一块芯片上，微型计算机是将计算机的各功能模块放在不同的板上"
      ],
      "selectedAnswer": [],
      "images": []
    },
    {
      "id": 2,
      "type": "判断",
      "title": "20、AT89S51单片机中的同级中断不能嵌套。（ ）",
      "options": [
        { "label": "true", "text": "正确" },
        { "label": "false", "text": "错误" }
      ],
      "correctAnswer": [
        "正确"
      ],
      "selectedAnswer": [],
      "images": []
    },
    {
      "id": 3,
      "type": "填空",
      "title": "银行家算法中，当一个进程提出的资源请求将导致系统从 状态进入 状态时，系统就拒绝它的资源请求。",
      "options": [],
      "correctAnswer": [
        "安全",
        "不安全"
      ],
      "selectedAnswer": [],
      "images": []
    }
  ]
}

const handleCopyScript = async () => {
  console.log('handleCopyScript called') // 调试信息
  try {
    await navigator.clipboard.writeText(FULL_USERSCRIPT)
    copiedScript.value = true
    console.log('Script copied successfully') // 调试信息
    setTimeout(() => {
      copiedScript.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy script:', err)
    // 降级方案：使用传统的复制方法
    try {
      const textArea = document.createElement('textarea')
      textArea.value = FULL_USERSCRIPT
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      copiedScript.value = true
      console.log('Script copied with fallback method') // 调试信息
      setTimeout(() => {
        copiedScript.value = false
      }, 2000)
    } catch (fallbackErr) {
      console.error('Fallback copy also failed:', fallbackErr)
    }
  }
}

const handleCopyFormat = async () => {
  console.log('handleCopyFormat called') // 调试信息
  try {
    const jsonString = JSON.stringify(formatJsonContent, null, 2)
    await navigator.clipboard.writeText(jsonString)
    copiedFormat.value = true
    console.log('Format copied successfully') // 调试信息
    setTimeout(() => {
      copiedFormat.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy format:', err)
    // 降级方案：使用传统的复制方法
    try {
      const jsonString = JSON.stringify(formatJsonContent, null, 2)
      const textArea = document.createElement('textarea')
      textArea.value = jsonString
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      copiedFormat.value = true
      console.log('Format copied with fallback method') // 调试信息
      setTimeout(() => {
        copiedFormat.value = false
      }, 2000)
    } catch (fallbackErr) {
      console.error('Fallback copy also failed:', fallbackErr)
    }
  }
}
</script>