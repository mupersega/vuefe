<template>
    <div class="filter-housing">
        <button popovertarget="filterPopover"> Group Filters</button>
        <div id="filterPopover" class="filterPopover" popover="manual">
            <div class="filter-selection-container">
                <select
                    name="filterOptions" id=""
                    v-on:change="handleFilterSelect">
                    <option value="0" disabled selected>Select a market group</option>
                    <option v-for="group in marketGroupOptions"
                        :value="group.marketGroupId"
                        :key="group.marketGroupId"
                    >
                        {{ group.marketGroupName }}
                    </option>
                </select>
                <div class="all-filters">
                    <MarketGroupFilter
                        v-if="baseNode"
                        :baseNode="baseNode"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { type MarketGroupNodeDto } from '@/api-client';
import { useGroupTreeStore } from '@/stores/useGroupTreeStore';
import MarketGroupFilter from './MarketGroupFilter.vue';

export default {
    name: 'FilterHousing',
    components: {
        MarketGroupFilter
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
    },
    data() {
        return {
            baseNode: null as MarketGroupNodeDto | null,
            filtersOpen: false,
        };
    },
    computed: {
        groupTreeStore() {
            return useGroupTreeStore();
        },
        marketGroupOptions() {
            return this.groupTreeStore.tree;
        }
    },
};
</script>
<style scoped>
.filter-housing {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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

.filterPopover {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--translucent-white-01);
    border: none;
    backdrop-filter: blur(1px);
    transition: top 0.3s cubic-bezier(0.68, 0, 0.265, 1.2), 
                opacity 0.3s cubic-bezier(0.68, 0, 0.265, 1.2);
    opacity: 1;

    @starting-style {
        top: -100%;
        opacity: 0;
    }
}
.filter-selection-container {
    display: flex;
    flex-direction: column;
    width: 400px;
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    background-color: var(--jet);
    box-shadow: 0 0 3px var(--night);
    padding: 1rem;
}

.all-filters {
    border-radius: 0.5rem;
    border: 1px solid var(--translucent-white-3);
    box-shadow: 1px 1px 3px var(--night);
    background-color: var(--jet);
    margin-bottom: 1rem;
    grid-column: 2 / 2;
    grid-row: 1 / 2;
    overflow-y: scroll;
    border: 1px solid var(--translucent-white-3);
    flex: 1;
}

</style>