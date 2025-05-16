<script setup lang="ts">
import { searchInvTypeShortsContains, searchInvTypeShortsStartsWith } from '../../services/db';
import { ref, watch } from 'vue';
import type { InvTypeShortDto } from '../../api-client';
import CustomCombobox from '../shared/CustomCombobox.vue'; // Import the new component
import MeButtonGroup, { type MeButtonGroupOption } from '../shared/MeButtonGroup.vue';

const invTypes = ref<InvTypeShortDto[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');
const selectedInvType = ref<InvTypeShortDto | null>(null);
const isStartsWith = ref(true);

const areInvTypeArraysEqual = (arr1: InvTypeShortDto[], arr2: InvTypeShortDto[]): boolean => {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].typeId !== arr2[i].typeId) {
            return false;
        }
    }
    return true;
};

const options = ref<MeButtonGroupOption[]>([
    { id: 1, name: 'Starts With', selected: true },
    { id: 2, name: 'Contains', selected: false },
]);

const handleOptionSelected = (selectedOption: MeButtonGroupOption) => {
    options.value = options.value.map(opt => ({
        ...opt,
        selected: opt.id === selectedOption.id
    }));
    isStartsWith.value = selectedOption.id === 1;
    if (searchQuery.value.trim() !== '') {
        const currentQuery = searchQuery.value;
        searchQuery.value = ' ';
        searchQuery.value = currentQuery;
    }
};

watch(searchQuery, (newQuery, _oldQuery) => {
    if (selectedInvType.value && newQuery === selectedInvType.value.typeName) {
        if (newQuery.trim() === '') {
            invTypes.value = [];
            selectedInvType.value = null;
            error.value = null;
        }
        return;
    }

    const trimmedQuery = newQuery.trim();
    if (trimmedQuery !== '') {
        isLoading.value = true;
        const func = isStartsWith.value ? searchInvTypeShortsStartsWith : searchInvTypeShortsContains;
        func(trimmedQuery, 1000)
            .then((response) => {
                error.value = null;
                if (!areInvTypeArraysEqual(invTypes.value, response)) {
                    invTypes.value = response;
                }
            })
            .catch((err) => {
                console.error("Error fetching InvTypes:", err);
                error.value = "Failed to fetch item types. " + (err.message || '');
                invTypes.value = [];
            })
            .finally(() => {
                isLoading.value = false;
            });
    } else {
        invTypes.value = [];
        selectedInvType.value = null;
        error.value = null;
    }
});

function handleComboboxSelect(item: InvTypeShortDto) {
    selectedInvType.value = item;
    error.value = null;
}
</script>
<template>
    <div class="search-controls-wrapper">
        <!-- <MeButtonGroup :options="options" :multi="false" @optionSelected="handleOptionSelected" /> -->
        <label class="me-switch">
            <span :class="{ 'text-active': !isStartsWith }">starts with</span>
            <div class="switch-outer">
                <div class="switch-inner" :class="{ 'switch-inner-active': isStartsWith }"></div>
                <input type="checkbox" v-model="isStartsWith" @change="handleOptionSelected(isStartsWith ? options[0] : options[1])" />
            </div>
            <span :class="{ 'text-active': isStartsWith }">contains</span>
        </label>
        <CustomCombobox :items="invTypes" v-model="searchQuery" labelField="typeName" valueField="typeId"
            placeholder="Type to search items..." @select="handleComboboxSelect" class="search-input-container" />
    </div>
</template>
<style scoped>
.search-controls-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background-color: var(--jet);
      box-shadow: 0 0 3px 1px var(--night);
    border-radius: 0.5rem;
    border: 1px solid var(--translucent-white-3);
}

.me-switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: max-content;
    padding: 0.25rem 1rem;
    gap: 0.5rem;
    border-radius: .5rem;
    background-color: var(--eerie-black);
    border: 1px solid var(--translucent-white-3);
    cursor: pointer;
    user-select: none;
    color: var(--gray);
}

.me-switch:hover{
    box-shadow: 0 0 2px 1px turquoise inset;
}

.me-switch:active {
    box-shadow: 0 0 2px 2px turquoise inset;
}

.me-switch input[type="checkbox"] {
    display: none;
}

.me-switch span {
    font-size: 0.7rem;
    transition: color 0.15s ease;
}

.switch-outer {
    width: calc(var(--sidebar-width-compressed) / 2);
    height: calc(var(--sidebar-width-compressed) / 4);
    background-color: var(--eerie-black);
    border-radius:  1.5rem;
    border: 1px solid var(--translucent-white-3);
    padding: 1px;
}

.switch-inner {
    width: calc(var(--sidebar-width-compressed) / 4);
    height: 100%;
    background-color: var(--flame);
    border-radius: 1.5rem;
    transition: transform 0.15s ease;
}

.switch-inner-active {
    transform: translateX(calc(var(--sidebar-width-compressed) / 4 - 4px));
}

.me-switch .text-active {
    color: var(--flame);
}

</style>