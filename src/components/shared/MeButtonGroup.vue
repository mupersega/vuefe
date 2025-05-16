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
    emit('optionSelected', clickedOption);
}
</script>
<template>
    <div class="me-button-group">
        <button v-for="option in props.options" :key="option.id" class="option"
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

.option {
    text-wrap: nowrap;
    white-space: nowrap;
    padding: 0.2rem 1rem;
    flex: 1;
}

.option:last-child {
    border-right: 1px solid var(--jet);
}

.option:first-child {
    border-left: 1px solid var(--jet);

}

.option:hover {
    background-color: var(--jet);
    color: var(--platinum);
}

.option.selected>.text {
    color: var(--flame);
    font-weight: bold;
    text-wrap: nowrap;
    white-space: nowrap;
    z-index: 2;
    mix-blend-mode: plus-lighter;
}
</style>