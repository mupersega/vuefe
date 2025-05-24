<script lang="ts">
import { defineComponent } from 'vue';
import { searchStartsWith, searchContains, db } from '@services/db';

import MeCombobox from '@components/shared/MeCombobox.vue';
import MeButtonGroup from '@components/shared/MeButtonGroup.vue';
import MeSwitch from '@components/shared/MeSwitch.vue';
import { createComboboxHandler } from './ComboboxHandler';
import type { BlueprintDto, InvCategoryDto } from '@/api-client';

export default defineComponent({
    name: 'SearchControls',
    
    components: {
        MeCombobox,
        MeButtonGroup,
        MeSwitch
    },
      data() {
        return {
            mainSearchString: "",
            selectedCategories: [1, 2, 3],
            viewCats: [] as InvCategoryDto[],
            bpMode: true,
            
            // Will initialize these in created hook
            typeCombobox: null as any,
            groupsCombobox: null as any
        };
    },
    
    watch: {
        activityId() {
            if (this.typeCombobox?.state.searchQuery) {
                this.typeCombobox.setSearchQuery(this.typeCombobox.state.searchQuery);
            }
        },
        
        async bpMode(newValue) {
            console.log('bpMode: ' + newValue);
        }
    },
    
    created() {
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
        
        // Initialize typeCombobox
        this.typeCombobox = createComboboxHandler<BlueprintDto>({
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
                this.mainSearchString = item.productName || '';
            },
            onChange: (value) => {
                console.log('Input changed:', value);
                this.mainSearchString = value;
            },
            areItemsEqual: (arr1, arr2) => areArraysEqualByField(arr1, arr2, 'blueprintId'),
            defaultSearchMode: 'startsWith'
        });
        
        // Initialize groupsCombobox
        this.groupsCombobox = createComboboxHandler<InvCategoryDto>({
            labelField: 'categoryName',
            valueField: 'categoryId',
            searchFn: async (query, limit = 1000, isStartsWith = true) =>
                isStartsWith
                    ? searchStartsWith(db.invCategories, 'categoryName', query, limit)
                    : searchContains(db.invCategories, 'categoryName', query, limit),
            onSelect: async (item) => {
                console.log('Selected category:', item);
                await this.addCategory(item.categoryId);
                this.viewCats = await this.getCategories();
            },
            areItemsEqual: (arr1, arr2) => areArraysEqualByField(arr1, arr2, 'categoryId'),
            defaultSearchMode: 'contains'
        });
    },
    
    methods: {
        async addCategory(categoryId: number) {
            if (!this.selectedCategories.includes(categoryId)) {
                this.selectedCategories.push(categoryId);
                console.log('Added category:', categoryId);
            }
        },
        
        async removeCategory(categoryId: number) {
            const index = this.selectedCategories.indexOf(categoryId);
            if (index !== -1) {
                this.selectedCategories.splice(index, 1);
                console.log('Removed category:', categoryId);
            }
        },
        
        async getCategories() {
            return await db.invCategories
                .where('categoryId')
                .anyOf(this.selectedCategories)
                .toArray();
        }
    }
});
</script>


<template>
    <div class="search-controls-wrapper">
        <div class="filter-options">
            <MeSwitch v-model="bpMode" :label="'bpMode'" :labelPosition="'right'" left-label="bp" right-label="item" />
            <!-- Activity selector -->
        </div>

        <MeCombobox 
            v-if="typeCombobox"
            :items="typeCombobox.state.items" 
            v-model="typeCombobox.state.searchQuery"
            :labelField="typeCombobox.fields.label" 
            :valueField="typeCombobox.fields.value"
            placeholder="Type to search Items..." 
            @select="typeCombobox.handleSelect"
            @input="typeCombobox.handleInput" 
            :showSearchMode="true" 
            :isStartsWith="typeCombobox.isStartsWith.value"
            @update:isStartsWith="(value) => typeCombobox.isStartsWith.value = value" 
            class="search-input-container" 
        />
        <!-- <div class="filter">
            add filter
            <MeCombobox 
                v-if="groupsCombobox"
                :items="groupsCombobox.state.items" 
                v-model="groupsCombobox.state.searchQuery"
                :labelField="groupsCombobox.fields.label" 
                :valueField="groupsCombobox.fields.value"
                placeholder="Type to search groups..." 
                @select="groupsCombobox.handleSelect"
                @input="groupsCombobox.handleInput" 
                :showSearchMode="true"
                :isStartsWith="groupsCombobox.isStartsWith.value"
                @update:isStartsWith="(value) => groupsCombobox.isStartsWith.value = value"
                class="search-input-container" 
            />
            <div class="cat" v-for="cat in viewCats" :key="cat.categoryId">
                {{ cat.categoryName }}
            </div>
        </div> -->
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
    transform: translateY(0px);
    transition: transform 0.3s ease-in-out;

    @starting-style {
        transform: translateY(-100%);
    }
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