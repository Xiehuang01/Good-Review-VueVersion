<template>
  <div class="max-w-6xl mx-auto space-y-8">
    <h2 class="text-4xl font-black text-slate-800/90 drop-shadow-sm flex items-center gap-3">
      {{ t('dashboard.title') }}
    </h2>
    
    <div v-if="banks.length === 0" class="text-center py-20 animate-fade-in glass-panel rounded-[3rem]">
      <div class="bg-white/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/50 backdrop-blur-sm">
        <Layers :size="48" class="text-brand-400" />
      </div>
      <h2 class="text-3xl font-bold text-slate-800 mb-3">{{ t('dashboard.emptyTitle') }}</h2>
      <p class="text-slate-600 max-w-md mx-auto text-lg font-medium">
        {{ t('dashboard.emptyDesc') }}
      </p>
    </div>
    
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="bank in banks" 
        :key="bank.id" 
        class="glass-card rounded-3xl p-6 flex flex-col h-full group hover:bg-white/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
      >
        <!-- Glossy shine effect -->
        <div class="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

        <div class="flex-1 relative z-10">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-end gap-3">
              <div class="w-12 h-12 rounded-2xl bg-white/50 text-brand-600 flex items-center justify-center shadow-sm backdrop-blur-sm">
                  <BookOpen :size="22" />
              </div>
              <div class="px-3 py-1 bg-white/40 text-slate-500 text-xs rounded-lg font-mono font-bold border border-white/40">
                  {{ new Date(bank.createdAt).toLocaleDateString() }}
              </div>
            </div>
            <!-- 删除按钮在右上角 -->
            <button
              type="button"
              @click.stop="emit('delete', bank.id)"
              class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all border border-transparent hover:border-red-200/50 active:scale-95"
              :title="t('dashboard.btnDelete')"
            >
              <Trash2 :size="16" />
            </button>
          </div>

          <h3 class="text-xl font-bold text-slate-800 line-clamp-2 mb-3 leading-snug group-hover:text-brand-700 transition-colors" :title="bank.name">
            {{ bank.name }}
          </h3>
          
          <div class="flex items-center text-slate-600 text-sm font-medium mb-6">
            <div class="flex items-center space-x-1.5 bg-white/30 px-3 py-1.5 rounded-lg border border-white/40">
               <Layers :size="14" />
               <span>{{ bank.questions.length }} {{ t('dashboard.questions') }}</span>
            </div>
          </div>
        </div>

        <div class="pt-5 mt-auto border-t border-white/40 space-y-3 relative z-10">
          <!-- 按钮组 -->
          <div class="flex items-center gap-2">
            <button
              @click="handleStartClick(bank)"
              class="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white px-3 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 active:scale-95 text-sm"
            >
              <PlayCircle :size="18" />
              <span>{{ t('dashboard.btnPractice') }}</span>
            </button>
            
            <button
              @click="handleExamClick(bank)"
              class="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 active:scale-95 text-sm"
            >
              <FileText :size="18" />
              <span>{{ t('dashboard.btnExam') }}</span>
            </button>
          </div>
          

        </div>
      </div>
    </div>

    <!-- Filter Modal -->
    <Teleport to="body">
      <div 
        v-if="configBank" 
        class="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-fade-in p-4" 
        @click="configBank = null"
      >
         <div 
           class="glass-panel-modal rounded-[2rem] shadow-2xl p-6 sm:p-8 max-w-md w-full transform transition-all scale-100 relative overflow-hidden flex flex-col max-h-[90vh]"
           @click.stop
         >
            <!-- Modal Header -->
            <div class="flex items-start justify-between mb-4 relative z-10 shrink-0">
               <div class="flex items-center gap-3 text-brand-700">
                   <div class="w-12 h-12 rounded-full bg-brand-100/50 flex items-center justify-center shrink-0 backdrop-blur-sm">
                       <Filter :size="24" />
                   </div>
                   <h3 class="text-2xl font-bold text-slate-800 leading-tight">{{ t('dashboard.setupTitle') }}</h3>
               </div>
               <button @click="configBank = null" class="p-2 rounded-full hover:bg-slate-100/50 text-slate-400 hover:text-slate-600 transition-colors">
                  <X :size="24" />
               </button>
            </div>

            <p class="text-slate-600 mb-4 font-medium leading-relaxed relative z-10 shrink-0">
               {{ t('dashboard.setupDesc') }}
            </p>

            <!-- Type Selection -->
            <div class="flex justify-between items-center px-1 mb-2 shrink-0 relative z-10">
               <button @click="toggleAll" class="text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-wide flex items-center gap-1">
                  <CheckSquare v-if="selectedGroupIds.length === filterGroups.length" :size="16"/>
                  <Square v-else :size="16"/>
                  {{ t('dashboard.selectAll') }}
               </button>
               <span class="text-xs font-bold text-slate-400">
                   {{ t('dashboard.selectedCount') }}: {{ selectedCount }}
               </span>
            </div>

            <div class="space-y-3 mb-6 overflow-y-auto pr-2 relative z-10 custom-scrollbar flex-1">
               <div 
                 v-for="group in filterGroups"
                 :key="group.id"
                 @click="toggleGroup(group.id)"
                 :class="[
                   'flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border',
                   selectedGroupIds.includes(group.id) 
                     ? 'bg-brand-50/50 border-brand-200/50 shadow-sm' 
                     : 'bg-white/40 border-transparent hover:bg-white/60'
                 ]"
               >
                  <div class="flex items-center gap-3">
                      <div :class="['transition-colors', selectedGroupIds.includes(group.id) ? 'text-brand-500' : 'text-slate-300']">
                          <CheckSquare v-if="selectedGroupIds.includes(group.id)" :size="22" />
                          <Square v-else :size="22" />
                      </div>
                      <span :class="['font-bold text-lg', selectedGroupIds.includes(group.id) ? 'text-slate-800' : 'text-slate-500']">{{ group.label }}</span>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-lg bg-white/60 text-xs font-bold text-slate-500 border border-white/50 shadow-sm">
                     {{ group.count }}
                  </span>
               </div>
            </div>
            
            <div class="shrink-0 relative z-10 pt-2">
              <button 
                  @click="confirmStartFiltered"
                  :disabled="selectedGroupIds.length === 0"
                  class="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg shadow-lg shadow-brand-500/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                  <PlayCircle :size="22" />
                  <span>{{ t('dashboard.startFiltered') }}</span>
              </button>
            </div>
         </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Trash2, PlayCircle, BookOpen, Layers, Filter, CheckSquare, Square, X, FileText } from 'lucide-vue-next'
import type { QuestionBank, QuestionItem } from '../types/types'
import { useLanguage } from '../composables/useLanguage'

interface Props {
  banks: QuestionBank[]
}

interface FilterGroup {
  id: string
  label: string
  count: number
  questions: QuestionItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  delete: [id: string]
  start: [id: string, filteredQuestions?: QuestionItem[]]
  exam: [id: string]
}>()

const { t } = useLanguage()

// State for config modal
const configBank = ref<QuestionBank | null>(null)
const selectedGroupIds = ref<string[]>([])

// Helper to generate groups (types + chunks)
const filterGroups = computed<FilterGroup[]>(() => {
  if (!configBank.value) return []
  
  const groups: FilterGroup[] = []
  const typeMap = new Map<string, QuestionItem[]>()

  // Group by type first
  configBank.value.questions.forEach(q => {
    const list = typeMap.get(q.type) || []
    list.push(q)
    typeMap.set(q.type, list)
  })

  // Process types
  typeMap.forEach((questions, type) => {
    // Chunking logic for '单选' if > 50
    if (type === '单选' && questions.length > 50) {
      const chunkSize = 50
      for (let i = 0; i < questions.length; i += chunkSize) {
        const chunk = questions.slice(i, i + chunkSize)
        const chunkIndex = Math.floor(i / chunkSize) + 1
        groups.push({
          id: `${type}_part_${chunkIndex}`,
          label: `${type} ${chunkIndex}`,
          count: chunk.length,
          questions: chunk
        })
      }
    } else {
      groups.push({
        id: type,
        label: type,
        count: questions.length,
        questions: questions
      })
    }
  })

  // Stable sort
  return groups.sort((a, b) => {
    const [alType, blType] = [a.label.split(' ')[0], b.label.split(' ')[0]]
    if (alType !== blType) return alType.localeCompare(blType)
    const aNum = parseInt(a.id.match(/_part_(\d+)/)?.[1] || '0', 10)
    const bNum = parseInt(b.id.match(/_part_(\d+)/)?.[1] || '0', 10)
    return aNum - bNum
  })
})

const selectedCount = computed(() => {
  return filterGroups.value
    .filter(g => selectedGroupIds.value.includes(g.id))
    .reduce((acc, g) => acc + g.count, 0)
})

const handleStartClick = (bank: QuestionBank) => {
  const typeMap = new Map<string, number>()
  bank.questions.forEach(q => typeMap.set(q.type, (typeMap.get(q.type) || 0) + 1))
  
  const hasLargeSingleChoice = (typeMap.get('单选') || 0) > 50
  const hasMultipleTypes = typeMap.size > 1

  if (hasMultipleTypes || hasLargeSingleChoice) {
    configBank.value = bank
    
    // Pre-select all groups
    const tempGroups: string[] = []
    typeMap.forEach((count, type) => {
       if (type === '单选' && count > 50) {
           const chunks = Math.ceil(count / 50)
           for(let i=1; i<=chunks; i++) tempGroups.push(`${type}_part_${i}`)
       } else {
           tempGroups.push(type)
       }
    })
    
    selectedGroupIds.value = tempGroups
  } else {
    emit('start', bank.id)
  }
}

const toggleGroup = (groupId: string) => {
  if (selectedGroupIds.value.includes(groupId)) {
    selectedGroupIds.value = selectedGroupIds.value.filter(id => id !== groupId)
  } else {
    selectedGroupIds.value = [...selectedGroupIds.value, groupId]
  }
}

const toggleAll = () => {
  if (selectedGroupIds.value.length === filterGroups.value.length) {
    selectedGroupIds.value = []
  } else {
    selectedGroupIds.value = filterGroups.value.map(g => g.id)
  }
}

const confirmStartFiltered = () => {
  if (configBank.value) {
    const selectedIds = new Set<number>()
    filterGroups.value
      .filter(g => selectedGroupIds.value.includes(g.id))
      .forEach(g => g.questions.forEach(q => selectedIds.add(q.id)))

    const selectedQuestions = configBank.value.questions.filter(q => selectedIds.has(q.id))
    
    emit('start', configBank.value.id, selectedQuestions)
    configBank.value = null
  }
}

const handleExamClick = (bank: QuestionBank) => {
  emit('exam', bank.id)
}
</script>