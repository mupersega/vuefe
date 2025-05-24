<script setup lang="ts">
import { ref, watch } from 'vue';
import { searchStartsWith, searchContains, db } from '@services/db';

import MeCombobox from '@components/shared/MeCombobox.vue';
import MeButtonGroup from '@components/shared/MeButtonGroup.vue';
import MeSwitch from '@components/shared/MeSwitch.vue';
import { createComboboxHandler } from './ComboboxHandler';
import type { BlueprintDto, InvCategoryDto } from '@/api-client';

const disabledRoutes = [
    '/admin'
];

let mainSearchString = "";
const selectedCategories = [1, 2, 3];
const viewCats = ref<InvCategoryDto[]>([]);

const getAllBlueprints = async () => {
    if (mainSearchString == "") {
        console.log('No search string - searching on activity ID', mainSearchString);
        return await db.blueprints
            .where('activityId').equals(activityId.value)
            .filter((bp) => selectedCategories.includes(bp.categoryId))
            .toArray();
    } else {
        console.log('Main search string:', mainSearchString);
        return await db.blueprints
            .where('blueprintName').startsWithIgnoreCase(mainSearchString)
            .and((bp) => bp.activityId === activityId.value)
            .toArray();
    }
};
// Watch for changes to activityId and refresh search results
const activityId = ref(1);
watch(activityId, () => {
    if (typeCombobox.state.searchQuery) {
        typeCombobox.setSearchQuery(typeCombobox.state.searchQuery);
    }
});

const byBlueprint = ref(false);
watch(byBlueprint, async (newValue) => {
    console.log('By Blueprint: ' + newValue);
    const results = await getAllBlueprints()
    console.log('Search results:', results);
});

// Helper function to compare arrays by a specific field
const areArraysEqualByField = <T>(arr1: T[], arr2: T[], field: keyof T): boolean => {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i][field] !== arr2[i][field]) {
            return false;
        }
    }
    return true;
};

const typeCombobox = createComboboxHandler<BlueprintDto>({
    labelField: 'productName',
    valueField: 'productId',
    searchFn: (query, limit = 1000, isStartsWith = true) => {

        return isStartsWith
            ? searchStartsWith(
                db.blueprints,
                'productName',
                query,
                limit,
            )
            : searchContains(
                db.blueprints,
                'productName',
                query,
                limit,
            );
    },
    onSelect: (item) => {
        console.log('Selected item type:', item);
        mainSearchString = item.productName || '';
    },
    onChange: (value) => {
        console.log('Input changed:', value);
        mainSearchString = value;
    },
    areItemsEqual: (arr1, arr2) => areArraysEqualByField(arr1, arr2, 'blueprintId'),
    defaultSearchMode: 'startsWith'
});

// Create our combobox handler for groups search
// Note: You'll need to implement the actual search function
const groupsCombobox = createComboboxHandler<InvCategoryDto>({
    labelField: 'categoryName',
    valueField: 'categoryId',
    searchFn: async (query, limit = 1000, isStartsWith = true) =>
        isStartsWith
            ? searchStartsWith(db.invCategories, 'categoryName', query, limit)
            : searchContains(db.invCategories, 'categoryName', query, limit),
    onSelect: async (item) => {
        console.log('Selected category:', item);
        addCategory(item.categoryId);
        viewCats.value = await getCategories();
    },
    areItemsEqual: (arr1, arr2) => areArraysEqualByField(arr1, arr2, 'categoryId'),
    defaultSearchMode: 'contains'
});

const addCategory = async (categoryId: number) => {
    if (!selectedCategories.includes(categoryId)) {
        selectedCategories.push(categoryId);
        console.log('Added category:', categoryId);
    }
};

const removeCategory = async (categoryId: number) => {
    const index = selectedCategories.indexOf(categoryId);
    if (index !== -1) {
        selectedCategories.splice(index, 1);
        console.log('Removed category:', categoryId);
    }
};

const getCategories = async () => {
    return await db.invCategories
        .where('categoryId')
        .anyOf(selectedCategories)
        .toArray();
};

</script>


<template>
    <div v-if="!disabledRoutes.includes($route.path)"
        :class="['search-controls-wrapper', { 'search-controls-disabled': disabledRoutes.includes($route.path) }]">
        <div class="filter-options">
            <MeSwitch v-model="byBlueprint" :label="'By Blueprint'" :labelPosition="'right'" />
            <!-- Activity selector -->
            <div class="activity-selector">
                <label>Activity ID:</label>
                <select v-model="activityId">
                    <option :value="1">Manufacturing (1)</option>
                    <option :value="3">Time Efficiency Research (3)</option>
                    <option :value="4">Material Efficiency Research (4)</option>
                    <option :value="5">Copying (5)</option>
                    <option :value="8">Invention (8)</option>
                    <option :value="11">Reaction (11)</option>
                </select>
            </div>
        </div>

        <MeCombobox :items="typeCombobox.state.items" v-model="typeCombobox.state.searchQuery"
            :labelField="typeCombobox.fields.label" :valueField="typeCombobox.fields.value"
            placeholder="Type to search blueprints..." @select="typeCombobox.handleSelect"
            @input="typeCombobox.handleInput" :showSearchMode="true" :isStartsWith="typeCombobox.isStartsWith.value"
            @update:isStartsWith="(value) => typeCombobox.isStartsWith.value = value" class="search-input-container" />
        <div class="filter">
            add filter
            <MeCombobox :items="groupsCombobox.state.items" v-model="groupsCombobox.state.searchQuery"
                :labelField="groupsCombobox.fields.label" :valueField="groupsCombobox.fields.value"
                placeholder="Type to search groups..." @select="groupsCombobox.handleSelect"
                @input="groupsCombobox.handleInput" :showSearchMode="true"
                :isStartsWith="groupsCombobox.isStartsWith.value"
                @update:isStartsWith="(value) => groupsCombobox.isStartsWith.value = value"
                class="search-input-container" />
            <div class="cat" v-for="cat in viewCats">
                {{ cat.categoryName }}
            </div>
        </div>
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
    margin: 1rem;
}

.filter-options {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.activity-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.activity-selector select {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    background-color: var(--night);
    color: white;
    border: 1px solid var(--translucent-white-3);
}
</style>