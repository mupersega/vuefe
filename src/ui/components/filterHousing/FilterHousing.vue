<template>
    <div class="filter-selection-container">
        <div class="filter-controls">
            <select class="filter-select" name="filterOptions" id="" @change="setBaseNode">
                <option value="0" disabled selected>Select a market group</option>
                <option class="filter-option" v-for="group in marketGroupOptions" :value="group.marketGroupId" :key="group.marketGroupId">
                    {{ group.marketGroupName }}
                </option>
            </select>
            <div class="tree-controls">
                <button @click="expandAll" title="Expand all groups">
                    <font-awesome-icon :icon="['fas', 'angles-down']" />
                </button>
                <button @click="collapseAll" title="Collapse all groups">
                    <font-awesome-icon :icon="['fas', 'angles-right']" />
                </button>
            </div>
        </div>
        <div class="all-filters">
            <MarketGroupFilter v-if="baseNode" :baseNode="baseNode" />
        </div>
    </div>
</template>
<script lang="ts">
import { type MarketGroupNodeDto } from '@/api-client';
import { useGroupTree } from '@/stores/useGroupTreeStore';
import { useMainState } from '@/stores/useMainStateStore';
import MarketGroupFilter from './MarketGroupFilter.vue';

export default {
    name: 'FilterHousing',
    components: {
        MarketGroupFilter
    }, methods: {
        /**
         * Handle selection from the market group dropdown
         * @param event - The change event from the select element
         */
        setBaseNode(event: Event) {
            const target = event.target as HTMLSelectElement;
            const selectedValue = parseInt(target.value, 10);
            const marketGroup = this.marketGroupOptions.find(group => group.marketGroupId === selectedValue);
            if (marketGroup) {
                this.baseNode = marketGroup;
            } else {
                console.warn('No market group found for selected value:', selectedValue);
            }
        },

        /**
         * Trigger global expand all event
         */
        expandAll() {
            const mainState = useMainState();
            mainState.triggerExpandAll();
        },

        /**
         * Trigger global collapse all event
         */
        collapseAll() {
            const mainState = useMainState();
            mainState.triggerCollapseAll();
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
            return useGroupTree();
        },
        marketGroupOptions() {
            return this.groupTreeStore.tree;
        }
    },
};
</script>
<style scoped>

.filter-select {
    width: 100%;
    padding: 0.25rem 0.75rem;
    box-sizing: border-box;
    border: 1px solid var(--translucent-white-3);
    border-radius: 0.5rem;
    height: 2rem;
    background-color: var(--eerie-black);
    color: var(--gray);
    font-size: 0.7rem;
    outline: none;
    transition: all 0.15s ease;
    width: calc(100% - 1.5rem);
}

.filter-select:hover {
    color: var(--platinum);
    border-color: turquoise;
}

.filter-select:focus {
    outline: none;
    border-color: var(--flame);
    color: var(--flame);
    text-shadow: 0 0 0.5px currentColor;
}

/* Apply flame color to select with a selected option */
.filter-select:not(:invalid) {
    color: var(--flame);
    text-shadow: 0 0 0.5px currentColor;
}

.filter-selection-container {
    display: flex;
    flex-direction: column;
    width: 300px;
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    background-color: var(--jet);
    border-left: 1px solid var(--translucent-white-3);
}

.filter-option {
    background-color: var(--eerie-black);
    color: var(--silver);
    padding: 0.5rem;
    border-radius: 0.3rem;
    margin: 0.25rem 0;
    cursor: pointer;
    transition: all 0.15s ease;
}

.filter-option:hover {
    background-color: var(--flame) !important;
    color: var(--eerie-black);
}

.filter-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    gap: 0.5rem;
}

.tree-controls {
    display: flex;
    gap: 0.25rem;
}

.tree-controls button {
    background-color: var(--eerie-black);
    color: var(--gray);
    border: 1px solid var(--translucent-white-1);
    border-radius: 0.3rem;
    padding: 0.3rem 0.5rem;
    cursor: pointer;
    transition: all 0.15s ease;
}

.tree-controls button:hover {
    color: var(--flame);
    border-color: var(--flame);
}

.all-filters {
    overflow-y: scroll;
    border-top: 1px solid var(--translucent-white-3);
    flex: 1;
    scrollbar-width: thin;
    scrollbar-color: var(--flame) var(--eerie-black);
}

.all-filters::-webkit-scrollbar {
    width: 6px;
}

.all-filters::-webkit-scrollbar-track {
    background: var(--eerie-black);
}

.all-filters::-webkit-scrollbar-thumb {
    background-color: var(--translucent-white-2);
    border-radius: 6px;
}

.all-filters::-webkit-scrollbar-thumb:hover {
    background-color: var(--flame);
}
</style>