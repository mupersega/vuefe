<script setup  lang="ts">
// import { ref } from 'vue'; // ref is not used for props

export interface MeButtonGroupOption {
    id: number;
    name: string;
    selected: boolean;
}

const props = defineProps<{
    options: MeButtonGroupOption[],
    multi: boolean,
}>()

const emit = defineEmits<{
    (e: 'optionSelected', option: MeButtonGroupOption): void
}>()

const handleOptionClick = (clickedOption: MeButtonGroupOption) => {
    // Emit an event with the clicked option.
    // The parent component will be responsible for updating the 'selected' state.
    emit('optionSelected', clickedOption);
}
</script>
<template>
    <div class="me-button-group">
        <button v-for="option in props.options" :key="option.id" class="button"
            :class="{ 'selected': option.selected }"
            @click="handleOptionClick(option)">
            <span class="text">
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
    height: 2rem;
}

.button {
    text-wrap: nowrap;
    white-space: nowrap;
    padding: 0.2rem 1rem;
    z-index: 1;
    color: var(--silver);
    position: relative;
    overflow: hidden;
    border-right: 2px solid var(--jet);
    border-top: 1px solid var(--jet);
    border-bottom: 1px solid var(--jet);
    background-color: var(--eerie-black);
    flex: 1;
    min-width: 8rem;
    align-items: center;
    display: flex;
    justify-content: center;
    user-select: none;
    &::after {
        content: '';
        position: absolute;
        top: -100%;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 1;
        rotate: 0deg;
        filter: drop-shadow(0 0 3px var(--eerie-black));
        background: linear-gradient(to right, var(--flame) 50%, var(--burnt-sienna) 95%);
        z-index: -1;
        transition: top 0.1s cubic-bezier(0.68, -0, 0.265, 1.2);
    }
}

.button.small {
    padding: 0.2rem 0.5rem;
}

.button.large {
    padding: 0.2rem 1.5rem;
}

.button:last-child {
    border-right: 1px solid var(--jet);
    &::after {
        left: 0;
        top: -100%;
        rotate: 0deg;
        transition: top 0.1s cubic-bezier(0.68, -0, 0.265, 1.2);
    }
}

.button:first-child {
    border-left: 1px solid var(--jet);
    border-bottom-left-radius: 5rem;
    &::after {
        left: 0;
        top: -100%;
        rotate: 0deg;
        transition: top 0.1s cubic-bezier(0.68, -0, 0.265, 1.2);
    }
}

.button:hover {
    background-color: var(--jet);
    color: var(--platinum);
}

.button.selected {
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 1;
        rotate: 0deg;
        filter: drop-shadow(0 0 3px var(--eerie-black));
        background: linear-gradient(to right, var(--flame) 50%, var(--burnt-sienna) 95%);
        z-index: -1;
    }
    .text {
        color: var(--flame);
        font-weight: bold;
        text-wrap: nowrap;
        white-space: nowrap;
        z-index: 2;
        mix-blend-mode: plus-lighter;
    }
}
</style>