import type { InvTypeDto } from "@api-client/models/inv-type-dto";
import { defineStore } from "pinia";
import { db } from "@services/db";
import { useMainStateStore } from "./useMainStateStore";

export const useStagingStore = defineStore("staging", {
    state: () => ({
        searchString: "",
        selectedMarketGroupIds: [] as number[],
        stagedItems: [] as InvTypeDto[],
        isLoading: false,
        error: null as Error | null,
    }),
    actions: {        addGroup(marketGroupId: number) {
            if (!this.selectedMarketGroupIds.includes(marketGroupId)) {
                this.selectedMarketGroupIds = [...this.selectedMarketGroupIds, marketGroupId];
                this.fetchStagedItems();
            }
        },
        removeGroup(marketGroupId: number) {
            if (this.selectedMarketGroupIds.includes(marketGroupId)) {
                this.selectedMarketGroupIds = this.selectedMarketGroupIds.filter(id => id !== marketGroupId);
                this.fetchStagedItems();
            }
        },
        addMultipleGroups(marketGroupIds: number[]) {
            const newSelectedGroups = [...this.selectedMarketGroupIds];
            const uniqueNewIds = marketGroupIds.filter(id => !newSelectedGroups.includes(id));
            
            if (uniqueNewIds.length > 0) {
                this.selectedMarketGroupIds = [...newSelectedGroups, ...uniqueNewIds];
                this.fetchStagedItems();
            }
        },
        removeMultipleGroups(marketGroupIds: number[]) {
            const originalLength = this.selectedMarketGroupIds.length;
            this.selectedMarketGroupIds = this.selectedMarketGroupIds.filter(
                id => !marketGroupIds.includes(id)
            );
            
            if (originalLength !== this.selectedMarketGroupIds.length) {
                this.fetchStagedItems();
            }
        },
        setGroups(marketGroupIds: number[]) {
            this.selectedMarketGroupIds = [...marketGroupIds];
            this.fetchStagedItems();
        },
        syncWithMainState() {
            const mainStore = useMainStateStore();
            this.selectedMarketGroupIds = [...mainStore.selectedMarketGroups];
            this.fetchStagedItems();
        },
        async fetchStagedItems() {
            this.isLoading = true;
            this.error = null;
            
            try {
                let query = db.invTypes.where('marketGroupId').anyOf(this.selectedMarketGroupIds);
                if (this.searchString) {
                    query = query.filter(item =>
                        item.typeName!.toLowerCase().includes(this.searchString.toLowerCase())
                    );
                }
                this.stagedItems = await query.toArray();
            } catch (err) {
                this.error = err instanceof Error ? err : new Error('Unknown error');
                this.stagedItems = [];
            } finally {
                this.isLoading = false;
            }
        }
    },
    getters: {
        stagedItemCount: (state) => state.stagedItems.length,
    },
});

// Initialize synchronization between stores
let syncInitialized = false;

// Create a wrapper function that sets up store subscription for synchronization
export function useStagingStore_WithSync() {
    const stagingStore = useStagingStore();
    const mainStore = useMainStateStore();
    
    // Only set up the subscription once
    if (!syncInitialized) {
        // Subscribe to the main state store changes
        mainStore.$subscribe((_, state) => {
            // Only update if the selectedMarketGroups actually changed
            if (JSON.stringify(stagingStore.selectedMarketGroupIds) !== JSON.stringify(state.selectedMarketGroups)) {
                stagingStore.setGroups(state.selectedMarketGroups);
            }
        });
        
        syncInitialized = true;
    }
    
    return stagingStore;
}

export function useStagingState() {
    const stagingStore = useStagingStore_WithSync();
    
    return {
        // State properties
        searchString: stagingStore.searchString,
        selectedMarketGroupIds: stagingStore.selectedMarketGroupIds,
        stagedItems: stagingStore.stagedItems,
        isLoading: stagingStore.isLoading,
        error: stagingStore.error,
        
        // Actions
        addGroup: stagingStore.addGroup,
        removeGroup: stagingStore.removeGroup,
        addMultipleGroups: stagingStore.addMultipleGroups,
        removeMultipleGroups: stagingStore.removeMultipleGroups,
        setGroups: stagingStore.setGroups,
        syncWithMainState: stagingStore.syncWithMainState,
        fetchStagedItems: stagingStore.fetchStagedItems,
        
        // Getters
        stagedItemCount: stagingStore.stagedItemCount
    };
}