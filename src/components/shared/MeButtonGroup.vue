<script setup lang="ts">
import { ref, watch } from 'vue';

export interface MeButtonGroupOption {
    id: number | string;
    name: string;
    selected: boolean;
    disabled?: boolean;
}

const props = defineProps<{
    options: MeButtonGroupOption[];
    multi: boolean;
    ariaLabel?: string;
    groupClass?: string;
    buttonClass?: string;
    selectedClass?: string;
}>()

const emit = defineEmits<{
    (e: 'optionSelected', selectedOptions: MeButtonGroupOption[]): void;
    (e: 'update:options', options: MeButtonGroupOption[]): void;
}>()

// Local copy of options for internal state management
const localOptions = ref<MeButtonGroupOption[]>([...props.options]);

// Watch for external changes to options
watch(() => props.options, (newOptions) => {
    localOptions.value = [...newOptions];
}, { deep: true });

const handleOptionClick = (clickedOption: MeButtonGroupOption) => {
    // Skip processing if the clicked option is disabled
    if (clickedOption.disabled) {
        return;
    }
    
    // Create a new array with updated selection states
    const updatedOptions = localOptions.value.map(option => {
        let isSelected = option.id === clickedOption.id;
        
        // If multi-select is enabled, toggle the clicked item and keep others unchanged
        if (props.multi) {
            isSelected = option.id === clickedOption.id 
                ? !option.selected // Toggle the clicked one
                : option.selected; // Keep others as they are
        } else {
            // For single select, only the clicked item should be selected
            isSelected = option.id === clickedOption.id;
        }
        
        return {
            ...option,
            selected: isSelected
        };
    });
      // Update local state
    localOptions.value = updatedOptions;
    
    // Get all currently selected options
    const selectedOptions = updatedOptions.filter(option => option.selected);
    
    // Emit the selected options for parent component handling
    emit('optionSelected', selectedOptions);
    
    // Emit the updated options array for v-model support
    emit('update:options', updatedOptions);
}

// Compute a unique ID for the button group for accessibility
const buttonGroupId = `me-button-group-${Math.random().toString(36).substr(2, 9)}`;
</script>

<template>
    <div 
        class="me-button-group" 
        :class="groupClass"
        role="group"
        :aria-label="ariaLabel || 'Button group'"
        :id="buttonGroupId"
    >        <button 
            v-for="option in localOptions" 
            :key="option.id" 
            class="option"
            :class="{
                'selected': option.selected,
                'disabled': option.disabled,
                [selectedClass || '']: option.selected && selectedClass,
                ...(buttonClass ? { [buttonClass]: true } : {})
            }"
            @click="handleOptionClick(option)"
            :aria-pressed="option.selected"
            :aria-disabled="option.disabled"
            :disabled="option.disabled"
            role="button"
            type="button"
        >
            <span class="text" :class="{ 'text-active': option.selected }">
                {{ option.name }}
            </span>
        </button>
    </div>
</template>

<style scoped>
.me-button-group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: max-content;
    background-color: var(--eerie-black);
    border: 1px solid var(--translucent-white-3);
    border-radius: 0.5rem;
    overflow: hidden;
    user-select: none;
}

.option {
    text-wrap: nowrap;
    white-space: nowrap;
    padding: 0.25rem 1rem;
    flex: 1;
    cursor: pointer;
    border: 0;
    border-right: 1px solid var(--translucent-white-3);
    background-color: transparent;
    transition: all 0.15s ease;
    font-family: inherit;
    font-size: 0.7rem;
    color: var(--gray);
    position: relative;
}

/* Base pseudo-element for all buttons that will be used for effects */
.option::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 0px solid transparent;
    box-shadow: 0 0 0 0 transparent;
    pointer-events: none;
    transition: border-color 0.15s ease, border-width 0.15s ease, box-shadow 0.15s ease;
}

.option:last-child {
    border-right: 0;
}

.option:hover {
    color: var(--platinum);
}

.option:hover::after {
    border: 1px solid turquoise;
}

/* Apply border radius to first and last elements */
.option:first-child::after {
    border-top-left-radius: calc(0.5rem - 1px);
    border-bottom-left-radius: calc(0.5rem - 1px);
}

.option:last-child::after {
    border-top-right-radius: calc(0.5rem - 1px);
    border-bottom-right-radius: calc(0.5rem - 1px);
}

.option:active::after {
    box-shadow: 0 0 3px 3px turquoise inset;
}

.option:focus-visible {
    outline: 2px solid var(--flame);
    outline-offset: -2px;
    position: relative;
    z-index: 1;
}

.option.selected {
    background-color: rgba(255, 255, 255, 0.05);
}

.option.disabled {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
}

.option>.text {
    /* Apply consistent width to prevent layout shift */
    display: inline-block;
    font-weight: normal;
    position: relative;
    text-wrap: nowrap;
    white-space: nowrap;
    transition: color 0.15s ease;
}

.option.selected>.text {
    color: var(--flame);
    /* Use text-shadow instead of font-weight to avoid layout shift */
    text-shadow: 0 0 0.5px currentColor;
    z-index: 2;
}
</style>