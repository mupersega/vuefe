<script setup lang="ts">
import { searchInvTypeShortsContains, searchInvTypeShortsStartsWith } from '../../services/db';
import { ref, watch } from 'vue';
import type { InvTypeShortDto } from '../../api-client';
import CustomCombobox from '../shared/MeCombobox.vue'; 
import MeSwitch from '../shared/MeSwitch.vue';
import MeButtonGroup from '../shared/MeButtonGroup.vue';

const invTypes = ref<InvTypeShortDto[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');
const selectedInvType = ref<InvTypeShortDto | null>(null);
const isStartsWith = ref(true);

const options = ref([
    { id: 1, name: 'Option 1', selected: false, disabled: false },
    { id: 2, name: 'Option 2', selected: false, disabled: false },
    { id: 3, name: 'Option 3', selected: false, disabled: true },
    { id: 4, name: 'Option 4', selected: false, disabled: false },
    { id: 5, name: 'Option 5', selected: false, disabled: false },
]);

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

function handleSwitchChange() {
    // Refresh the search results by triggering the search query watcher
    if (searchQuery.value.trim() !== '') {
        const currentQuery = searchQuery.value;
        searchQuery.value = ' ';
        searchQuery.value = currentQuery;
    }
}

function handleComboboxInput(query: string) {
    // This handler isn't strictly needed since we watch searchQuery,
    // but it's here to demonstrate how to handle combobox direct inputs
    // You could add additional logic here if needed
    console.log('Combobox input:', query);
}

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
        <MeSwitch 
            v-model="isStartsWith"
            leftLabel="starts with"
            rightLabel="contains"
            @change="handleSwitchChange" 
        />
        <CustomCombobox :items="invTypes" v-model="searchQuery" labelField="typeName" valueField="typeId"
            placeholder="Type to search items..." @select="handleComboboxSelect" @input="handleComboboxInput"
            class="search-input-container" />
        <MeButtonGroup :options="options" :multi="true" />
    </div>
</template>
<style scoped>
.search-controls-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background-color: var(--jet);
    box-shadow: 1px 1px 3px var(--night);
    border-radius: 0.5rem;
    border: 1px solid var(--translucent-white-3);
}
</style>