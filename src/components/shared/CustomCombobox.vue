<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { PropType } from 'vue';

interface ComboboxItem {
  [key: string]: any; // Allow any string as a key, and any type as a value
}

const props = defineProps({
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
    default: 'name' // Default field to display in the dropdown
  },
  valueField: {
    type: String,
    default: 'id' // Default field to use as the key and potentially the emitted value
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

const inputValue = ref(props.modelValue);
const isDropdownVisible = ref(false);
const highlightedIndex = ref(-1);
const inputRef = ref<HTMLInputElement | null>(null);

watch(() => props.modelValue, (newValue) => {
  if (newValue !== inputValue.value) {
    inputValue.value = newValue;
  }
});

const filteredItems = computed(() => {
  if (!inputValue.value) {
    // When input is empty, show no items, or all items if you prefer.
    // For a search/lookup, typically show no items until user types.
    return [];
  }
  const searchTerm = inputValue.value.toLowerCase();
  return props.items.filter(item =>
    String(item[props.labelField]).toLowerCase().includes(searchTerm)
  );
});

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  inputValue.value = target.value;
  emit('update:modelValue', inputValue.value);
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
        // If the dropdown is closed, try to open it.
        // showDropdown() will set isDropdownVisible to true if filteredItems has content.
        showDropdown(); 
        if (isDropdownVisible.value) { // If it was successfully opened
          highlightedIndex.value = 0; // Highlight the first item
        }
      } else {
        // Dropdown is already visible, navigate down the list
        if (highlightedIndex.value < filteredItems.value.length - 1) {
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
        highlightedIndex.value = filteredItems.value.length - 1; // Loop to bottom
      }
      scrollToHighlightedItem();
      break;
    case 'Enter':
      event.preventDefault();
      if (highlightedIndex.value >= 0 && filteredItems.value[highlightedIndex.value]) {
        selectItem(filteredItems.value[highlightedIndex.value]);
      } else if (inputValue.value && filteredItems.value.length > 0) {
        // If user typed something that matches, but didn't navigate, select first match
        // Or, allow free text entry if no match is highlighted (current behavior)
      }
      isDropdownVisible.value = false;
      break;
    case 'Escape':
      isDropdownVisible.value = false;
      highlightedIndex.value = -1;
      break;
    case 'Tab':
      // Allow tab to function normally, potentially closing dropdown if desired
      isDropdownVisible.value = false;
      break;
  }
}

function showDropdown() {
  if (filteredItems.value.length > 0) {
    isDropdownVisible.value = true;
  }
}

function hideDropdownDelayed() {
  // Delay hiding to allow click on dropdown items
  setTimeout(() => {
    // A more robust check for focus within the component
    const activeElement = document.activeElement;
    const wrapper = inputRef.value?.closest('.custom-combobox-wrapper');
    if (wrapper && !wrapper.contains(activeElement)) {
        isDropdownVisible.value = false;
    } else if (!wrapper) { // Fallback if wrapper isn't found for some reason
        isDropdownVisible.value = false;
    }
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
    <ul
      v-if="isDropdownVisible && filteredItems.length > 0"
      class="combobox-dropdown"
      role="listbox"
      :id="`combobox-listbox-${Date.now()}`" 
    >
      <li
        v-for="(item, index) in filteredItems"
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
    </ul>
    <div v-if="isDropdownVisible && filteredItems.length === 0 && inputValue" class="no-results">
      No results found.
    </div>
  </div>
</template>

<style scoped>
.me-combobox-wrapper {
  position: relative;
  width: 100%;
  border-left: 1px solid var(--gray);
}

.combobox-input {
  width: 100%;
  padding: 0.35rem 0.55rem;
  box-sizing: border-box;
  border: 1px solid var(--jet);
  height: 2rem;
  background-color: var(--jet, #302e2bff); /* Using your jet */
  color: var(--platinum, #e1e0dcff); /* Using your platinum */
  transition: box-shadow 0.125s ease-in-out;
  outline: none;
}

.combobox-input:focus {
  animation: glow-pop 0.2s ease-out;
  box-shadow: inset 0 0 2px 2px var(--flame, #eb5e28ff);
}

@keyframes glow-pop {
  0% {
    box-shadow: inset 0 0 0 0 var(--flame, #eb5e28ff);
  }
  60% {
    box-shadow: inset 0 0 0.2rem 0.2rem var(--flame, #eb5e28ff);
  }
  100% {
    box-shadow: inset 0 0 1px 1px var(--flame, #eb5e28ff);
  }
}

.combobox-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: var(--jet); /* Using your jet */
  border: 1px solid var(--translucent-white-05);
  list-style-type: none;
  margin: 0;
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2); /* Darker shadow for dark theme */
  border-bottom-left-radius: 0.375rem;
}

.combobox-item {
  padding: 0.65rem 0.75rem;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
  color: var(--platinum, #e1e0dcff); /* Using your platinum */
}

.combobox-item.highlighted {
  background-color: var(--flame, #eb5e28ff); /* Using your flame */
  color: var(--white, #ffffff); /* Ensuring contrast */
}

.combobox-item:hover:not(.highlighted) {
  background-color: var(--gray, #7e7a72ff); /* Using your gray for hover */
}

.no-results {
  padding: 0.65rem 0.75rem;
  color: var(--silver, #b0ada7ff); /* Using your silver */
  font-style: italic;
  background-color: var(--jet, #302e2bff); /* Using your jet */
  border: 1px solid var(--gray, #7e7a72ff); /* Using your gray */
  border-top: none;
  border-radius: 0 0 0.375rem 0.375rem;
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2); /* Darker shadow */
}
</style>
