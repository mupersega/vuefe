<script setup lang="ts">
import { ref, watch } from 'vue';
import type { PropType } from 'vue';

interface ComboboxItem {
  [key: string]: any;
}

interface MeComboboxProps {
  items: ComboboxItem[];
  modelValue: string;
  placeholder?: string;
  labelField: string;
  valueField: string;
  showSearchMode?: boolean;
  isStartsWith?: boolean;
  openUpward?: boolean;
}

interface MeComboboxEmits {
  'update:modelValue': (value: string) => void;
  'select': (item: ComboboxItem) => void;
  'input': (value: string) => void;
  'update:isStartsWith': (value: boolean) => void;
}

export interface MeComboboxHandle {
  props: MeComboboxProps;
  emit: MeComboboxEmits;
}

const props: MeComboboxProps = defineProps({
  items: {
    type: Array as PropType<ComboboxItem[]>,
    required: true,
    default: () => []
  },
  modelValue: { // For v-model
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  },
  labelField: {
    type: String,
    default: 'name' // Default field to use for displaying item labels
  },
  valueField: {
    type: String,
    default: 'id' // Default field to use as the key and potentially the emitted value
  },
  showSearchMode: {
    type: Boolean,
    default: false // Whether to show the search mode toggle
  },  isStartsWith: {
    type: Boolean,
    default: true // Whether to match from beginning (true) or anywhere (false)
  },
  openUpward: {
    type: Boolean,
    default: false // Whether to open the dropdown upward instead of downward
  }
});

const emit = defineEmits(['update:modelValue', 'select', 'input', 'update:isStartsWith']);

const inputValue = ref(props.modelValue);
const isDropdownVisible = ref(false);
const highlightedIndex = ref(-1);
const inputRef = ref<HTMLInputElement | null>(null);

// Function to toggle search mode (startsWith or contains)
function toggleSearchMode() {
  emit('update:isStartsWith', !props.isStartsWith);
}

watch(() => props.modelValue, (newValue) => {
  if (newValue !== inputValue.value) {
    inputValue.value = newValue;
  }
});

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  inputValue.value = target.value;
  emit('update:modelValue', inputValue.value);
  emit('input', inputValue.value); // Additional event for more flexibility
  isDropdownVisible.value = true;
  highlightedIndex.value = -1; // Reset highlight when input changes
}

function selectItem(item: ComboboxItem) {
  inputValue.value = String(item[props.labelField]);
  emit('update:modelValue', inputValue.value);
  emit('select', item);
  isDropdownVisible.value = false;
  inputRef.value?.focus(); // Return focus to input
}

function handleKeyDown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      if (!isDropdownVisible.value) {
        showDropdown(); 
      } else {
        // Dropdown is already visible, navigate down the list
        if (highlightedIndex.value < props.items.length - 1) {
          highlightedIndex.value++;
        } else {
          highlightedIndex.value = 0; // Loop to top
        }
        scrollToHighlightedItem();
      }
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (highlightedIndex.value > 0) {
        highlightedIndex.value--;
      } else {
        highlightedIndex.value = props.items.length - 1; // Loop to bottom
      }
      scrollToHighlightedItem();
      break;
    case 'Enter':
      event.preventDefault();
      if (highlightedIndex.value >= 0 && props.items[highlightedIndex.value]) {
        selectItem(props.items[highlightedIndex.value]);
      }
      isDropdownVisible.value = false;
      break;
    case 'Escape':
      isDropdownVisible.value = false;
      highlightedIndex.value = -1;
      break;
    case 'Tab':
      // Allow tab to function normally, closing dropdown
      isDropdownVisible.value = false;
      break;
  }
}

function showDropdown() {
  if (props.items.length > 0) {
    isDropdownVisible.value = true;
  }
}

function hideDropdownDelayed() {
  // Delay hiding to allow click on dropdown items
  setTimeout(() => {
    isDropdownVisible.value = false;
  }, 200);
}

function scrollToHighlightedItem() {
  const listElement = inputRef.value?.nextElementSibling as HTMLElement; // Assuming ul is the next sibling
  if (listElement && highlightedIndex.value >= 0) {
    const itemElement = listElement.children[highlightedIndex.value] as HTMLElement;
    if (itemElement) {
      itemElement.scrollIntoView({ block: 'nearest' });
    }
  }
}

// Expose a method to focus the input if needed from parent
defineExpose({
  focus: () => inputRef.value?.focus()
});

</script>

<template>
  <div class="me-combobox" @focusout="hideDropdownDelayed">
    <div class="combobox-container">
      <input
        ref="inputRef"
        type="text"
        :value="inputValue"
        @input="handleInput"
        @keydown="handleKeyDown"
        @focus="showDropdown"
        @click="showDropdown"
        :placeholder="placeholder"
        class="combobox-input"
        autocomplete="off"
        aria-haspopup="listbox"
        :aria-expanded="isDropdownVisible"
        :aria-activedescendant="highlightedIndex >= 0 ? `combobox-item-${highlightedIndex}` : undefined"
        role="combobox"
      />
      <div 
        v-if="showSearchMode" 
        class="search-mode-toggle" 
        @click="toggleSearchMode"
        :title="isStartsWith ? 'Currently matching from start - Click to match anywhere' : 'Currently matching anywhere - Click to match from start'"
      >
        {{ isStartsWith ? 'Aa...' : '...Aa...' }}
      </div>
    </div>    <ul
      v-if="isDropdownVisible && items.length > 0"
      class="combobox-dropdown"
      :class="{ 'combobox-dropdown--upward': openUpward }"
      role="listbox"
      :id="`combobox-listbox-${Date.now()}`" 
    >
      <li
        v-for="(item, index) in items"
        :key="item[props.valueField] || index"
        @mousedown.prevent="selectItem(item)"
        :class="{ 'highlighted': index === highlightedIndex }"
        class="combobox-item"
        role="option"
        :id="`combobox-item-${index}`"
        :aria-selected="index === highlightedIndex"
      >
        {{ item[props.labelField] }}
      </li>
    </ul>    <div v-if="isDropdownVisible && items.length === 0 && inputValue" class="no-results" :class="{ 'no-results--upward': openUpward }">
      No results found.
    </div>
  </div>
</template>

<style scoped>
.me-combobox {
  position: relative;
  width: 100%;
  max-width: 400px; /* Adjust as needed */
}

.combobox-container {
  position: relative;
  display: flex;
  width: 100%;
}

.combobox-input {
  width: 100%;
  padding: 0.25rem 0.75rem;
  box-sizing: border-box;
  border: 1px solid var(--translucent-white-3);
  border-radius: 0.5rem;
  height: 2rem;
  background-color: var(--eerie-black);
  color: var(--gray);
  font-size: 0.7rem;
  outline: none;
  transition: all 0.15s ease;
}

.search-mode-toggle {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 0.7rem;
  color: var(--gray);
  background: var(--eerie-black);
  padding: 0.2rem 0.4rem;
  border-radius: 0.3rem;
  transition: all 0.15s ease;
  user-select: none;
}

.search-mode-toggle:hover {
  color: var(--flame);
  text-shadow: 0 0 0.5px currentColor;
}

/* Position relative is on the container, not directly on the input */
.me-combobox {
  position: relative;
}

.combobox-input:hover {
  color: var(--platinum);
  border-color: turquoise;
}

.combobox-input:focus {
  outline: none;
  border-color: var(--flame);
  color: var(--flame);
  text-shadow: 0 0 0.5px currentColor;
}

/* Apply flame color to input with content */
.combobox-input:not(:placeholder-shown) {
  color: var(--flame);
  text-shadow: 0 0 0.5px currentColor;
}

.combobox-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: var(--eerie-black);
  border: 1px solid var(--translucent-white-3);
  border-radius: 0.5rem;
  list-style-type: none;
  padding: 0;
  margin: 0;
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.combobox-dropdown--upward {
  top: auto;
  bottom: calc(100% + 4px);
}

.combobox-item {
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
  color: var(--gray);
  font-size: 0.7rem;
  position: relative;
  border-bottom: 1px solid var(--translucent-white-3);
}

.combobox-item:last-child {
  border-bottom: none;
}

.combobox-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 0px solid transparent;
  pointer-events: none;
  transition: border-color 0.15s ease, border-width 0.15s ease, box-shadow 0.15s ease;
}

.combobox-item.highlighted {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--flame);
  text-shadow: 0 0 0.5px currentColor;
}

.combobox-item:hover:not(.highlighted) {
  color: var(--platinum);
}

.combobox-item:hover:not(.highlighted)::after {
  border: 1px solid turquoise;
}

.no-results {
  padding: 0.25rem 0.75rem;
  color: var(--gray);
  font-style: italic;
  font-size: 0.7rem;
  background-color: var(--eerie-black);
  border: 1px solid var(--translucent-white-3);
  border-radius: 0.5rem;
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.no-results--upward {
  top: auto;
  bottom: calc(100% + 4px);
}
</style>
