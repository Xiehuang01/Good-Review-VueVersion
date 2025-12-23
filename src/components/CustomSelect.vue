<template>
  <div class="relative" ref="selectRef">
    <button
      @click="toggleDropdown"
      :class="[
        'w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all',
        isOpen 
          ? 'border-purple-500 ring-2 ring-purple-500/30 bg-white shadow-lg' 
          : 'border-slate-200 bg-white/90 hover:border-purple-300 hover:shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500'
      ]"
    >
      <span :class="selectedOption ? 'text-slate-700' : 'text-slate-400'">
        {{ selectedOption?.label || placeholder }}
      </span>
      <ChevronDown 
        :size="20" 
        :class="['text-slate-400 transition-transform duration-200', isOpen ? 'rotate-180' : '']"
      />
    </button>

    <!-- Dropdown Options -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        :style="dropdownStyle"
        class="fixed z-[10000] min-w-[200px] bg-white rounded-xl shadow-2xl border border-slate-200/80 py-2 animate-fade-in"
        @click.stop
      >
        <div
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option)"
          :class="[
            'px-4 py-3 cursor-pointer transition-all duration-150 flex items-center justify-between',
            'hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/50 hover:text-purple-700',
            modelValue === option.value 
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold' 
              : 'text-slate-700'
          ]"
        >
          <span>{{ option.label }}</span>
          <Check 
            v-if="modelValue === option.value" 
            :size="16" 
            class="text-white"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

interface Option {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options: Option[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectRef = ref<HTMLElement>()
const isOpen = ref(false)
const dropdownStyle = ref({})

const selectedOption = computed(() => 
  props.options.find(option => option.value === props.modelValue)
)

const toggleDropdown = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await nextTick()
    updateDropdownPosition()
  }
}

const selectOption = (option: Option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

const updateDropdownPosition = () => {
  if (!selectRef.value) return
  
  const rect = selectRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const dropdownHeight = props.options.length * 48 + 16 // 估算高度
  
  // 判断是否应该向上展开
  const shouldOpenUpward = rect.bottom + dropdownHeight > viewportHeight && rect.top > dropdownHeight
  
  dropdownStyle.value = {
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    ...(shouldOpenUpward 
      ? { bottom: `${viewportHeight - rect.top}px` }
      : { top: `${rect.bottom + 4}px` }
    )
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
  window.addEventListener('resize', updateDropdownPosition)
  window.addEventListener('scroll', updateDropdownPosition)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
  window.removeEventListener('resize', updateDropdownPosition)
  window.removeEventListener('scroll', updateDropdownPosition)
})
</script>