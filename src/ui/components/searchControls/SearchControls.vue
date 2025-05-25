<script lang="ts">
import { defineComponent } from 'vue';
import { searchStartsWith, searchContains, db } from '@services/db';

import MeCombobox from '@components/shared/MeCombobox.vue';
import { createComboboxHandler } from './ComboboxHandler';
import MarketGroupFilter from '@components/searchControls/MarketGroupFilter.vue'; // Use relative path for clarity

import MeButtonGroup from '@components/shared/MeButtonGroup.vue';
import MeSwitch from '@components/shared/MeSwitch.vue';

import type { BlueprintDto, InvCategoryDto, MarketGroupNodeDto } from '@/api-client';
import { useGroupTreeStore } from '@/stores/useGroupTreeStore';
import { useStagingStore } from '@/stores/useStagingStore';

export default defineComponent({
    name: 'SearchControls',

    components: {
        MeCombobox,
        MeButtonGroup,
        MeSwitch,
        MarketGroupFilter // Add the component to the registration
    },
    data() {
        return {
            mainSearchString: "",
            viewCats: [] as InvCategoryDto[],
            bpMode: true,
            baseNode: null as MarketGroupNodeDto | null,
        };
    },
    watch: {
        async bpMode(newValue) {
            console.log('bpMode: ' + newValue);
        },
    },

    computed: {
        stagingStore() {
            return useStagingStore();
        },
        groupTreeStore() {
            return useGroupTreeStore();
        },
        marketGroupOptions() {
            return this.groupTreeStore.tree;
        },
        typeCombobox() {
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

            return createComboboxHandler<BlueprintDto>({
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
        }
    },
    methods: {
        /**
         * Handle selection from the market group dropdown
         * @param event - The change event from the select element
         */
        handleFilterSelect(event: Event) {
            const target = event.target as HTMLSelectElement;
            const selectedValue = parseInt(target.value, 10);
            const marketGroup = this.marketGroupOptions.find(group => group.marketGroupId === selectedValue);
            if (marketGroup) {
                this.baseNode = marketGroup;
            } else {
                console.warn('No market group found for selected value:', selectedValue);
            }
        },
    }
});
</script>

<template>
    <div class="search-controls-wrapper">
        <div class="filter-options">
            <MeSwitch
                v-model="bpMode"
                left-label="bp"
                right-label="item"/>
        </div>

        <MeCombobox
            class="search-input-container" 
            v-if="typeCombobox"
            v-model="typeCombobox.state.searchQuery"
            :items="typeCombobox.state.items" 
            :labelField="typeCombobox.fields.label" 
            :valueField="typeCombobox.fields.value"
            placeholder="Type to search Items..." 
            @select="typeCombobox.handleSelect" 
            @input="typeCombobox.handleInput"
            :showSearchMode="true" 
            :isStartsWith="typeCombobox.isStartsWith.value"
            @update:isStartsWith="(value) => typeCombobox.isStartsWith.value = value"/>
        <select
            name="filterOptions" id=""
            v-on:change="handleFilterSelect">
            <option v-for="group in marketGroupOptions" :value="group.marketGroupId" :key="group.marketGroupId">
                {{ group.marketGroupName }}
            </option>
        </select>
        <!-- Only render MarketGroupFilter when baseNode is not null -->
        <MarketGroupFilter
            v-if="baseNode"
            :baseNode="baseNode"
        />
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
    z-index: 2;

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