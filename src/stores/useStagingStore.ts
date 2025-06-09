import type { InvTypeDto } from "@api-client/models/inv-type-dto";
import { defineStore } from "pinia";
import { db } from "@services/db";
import { useMainStateStore } from "./useMainStateStore";

export const useStagingStore = defineStore("staging", {
    state: () => ({
        searchString: "",
        selectedMarketGroupIds: [] as number[],
        stagedItems: [] as InvTypeDto[],
        selectedStagedItemIds: [] as number[],
        isLoading: false,
        error: null as Error | null,
        mouseDown: false,        // New state for drag functionality
        isDragging: false,
        dragStartPosition: { x: 0, y: 0 },
        // Performance configuration
        performanceSettings: {
            dragJuiceThreshold: 20, // Max items before using simple drag feedback
            enableAdvancedDragJuice: true, // Allow users to disable completely
        },
    }),
    actions: {        addGroup(marketGroupId: number) {
            if (!this.selectedMarketGroupIds.includes(marketGroupId)) {
                this.selectedMarketGroupIds = [...this.selectedMarketGroupIds, marketGroupId];
                this.clearSelection(); // Clear item selection when groups change
                this.fetchStagedItems();
            }
        },
        removeGroup(marketGroupId: number) {
            if (this.selectedMarketGroupIds.includes(marketGroupId)) {
                this.selectedMarketGroupIds = this.selectedMarketGroupIds.filter(id => id !== marketGroupId);
                this.clearSelection(); // Clear item selection when groups change
                this.fetchStagedItems();
            }
        },        addMultipleGroups(marketGroupIds: number[]) {
            const newSelectedGroups = [...this.selectedMarketGroupIds];
            const uniqueNewIds = marketGroupIds.filter(id => !newSelectedGroups.includes(id));
            
            if (uniqueNewIds.length > 0) {
                this.selectedMarketGroupIds = [...newSelectedGroups, ...uniqueNewIds];
                this.clearSelection(); // Clear item selection when groups change
                this.fetchStagedItems();
            }
        },
        removeMultipleGroups(marketGroupIds: number[]) {
            const originalLength = this.selectedMarketGroupIds.length;
            this.selectedMarketGroupIds = this.selectedMarketGroupIds.filter(
                id => !marketGroupIds.includes(id)
            );
            
            if (originalLength !== this.selectedMarketGroupIds.length) {
                this.clearSelection(); // Clear item selection when groups change
                this.fetchStagedItems();
            }
        },
        setGroups(marketGroupIds: number[]) {
            this.selectedMarketGroupIds = [...marketGroupIds];
            this.clearSelection(); // Clear item selection when groups change
            this.fetchStagedItems();
        },
        syncWithMainState() {
            const mainStore = useMainStateStore();
            this.selectedMarketGroupIds = [...mainStore.selectedMarketGroups];
            this.clearSelection(); // Clear item selection when syncing with main state
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
        },

        // Enhanced selection methods
        selectItem(itemId: number) {
            if (!this.selectedStagedItemIds.includes(itemId)) {
                this.selectedStagedItemIds.push(itemId);
            }
        },
        deselectItem(itemId: number) {
            this.selectedStagedItemIds = this.selectedStagedItemIds.filter(id => id !== itemId);
        },
        toggleItemSelection(itemId: number) {
            if (this.selectedStagedItemIds.includes(itemId)) {
                this.deselectItem(itemId);
            } else {
                this.selectItem(itemId);
            }
        },
        clearSelection() {
            console.log("Clearing selection");
            this.selectedStagedItemIds = [];
        },
        selectSingleItem(itemId: number) {
            this.selectedStagedItemIds = [itemId];
        },
        selectMultipleItems(itemIds: number[]) {
            // Add to existing selection
            const newSelections = itemIds.filter(id => !this.selectedStagedItemIds.includes(id));
            this.selectedStagedItemIds = [...this.selectedStagedItemIds, ...newSelections];
        },
        isItemSelected(itemId: number): boolean {
            return this.selectedStagedItemIds.includes(itemId);
        },

        // Drag state management
        startDrag(position: { x: number, y: number }) {
            this.isDragging = true;
            this.dragStartPosition = position;
        },
        endDrag() {
            this.isDragging = false;
            this.dragStartPosition = { x: 0, y: 0 };
        },

        // Get selected item data for drag operations
        getSelectedItemsData(): InvTypeDto[] {
            return this.stagedItems.filter(item => 
                this.selectedStagedItemIds.includes(item.typeId!)
            );
        }
    },
    getters: {
        stagedItemCount: (state) => state.stagedItems.length,
        selectedItemCount: (state) => state.selectedStagedItemIds.length,
        hasSelection: (state) => state.selectedStagedItemIds.length > 0,
        // Helper to get selected items for display
        selectedItems: (state) => state.stagedItems.filter(item => 
            state.selectedStagedItemIds.includes(item.typeId!)
        ),
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
      return {        // State properties
        searchString: stagingStore.searchString,
        selectedMarketGroupIds: stagingStore.selectedMarketGroupIds,
        stagedItems: stagingStore.stagedItems,
        selectedStagedItemIds: stagingStore.selectedStagedItemIds,
        isLoading: stagingStore.isLoading,
        error: stagingStore.error,
        isDragging: stagingStore.isDragging,
        mouseDown: stagingStore.mouseDown,
        dragStartPosition: stagingStore.dragStartPosition,
        
        // Actions
        addGroup: stagingStore.addGroup,
        removeGroup: stagingStore.removeGroup,
        addMultipleGroups: stagingStore.addMultipleGroups,
        removeMultipleGroups: stagingStore.removeMultipleGroups,
        setGroups: stagingStore.setGroups,
        syncWithMainState: stagingStore.syncWithMainState,
        fetchStagedItems: stagingStore.fetchStagedItems,
        
        // Selection actions
        selectItem: stagingStore.selectItem,
        deselectItem: stagingStore.deselectItem,
        toggleItemSelection: stagingStore.toggleItemSelection,
        clearSelection: stagingStore.clearSelection,
        selectSingleItem: stagingStore.selectSingleItem,
        selectMultipleItems: stagingStore.selectMultipleItems,
        isItemSelected: stagingStore.isItemSelected,
        
        // Drag actions
        startDrag: stagingStore.startDrag,
        endDrag: stagingStore.endDrag,
        getSelectedItemsData: stagingStore.getSelectedItemsData,
          // Getters
        stagedItemCount: stagingStore.stagedItemCount,
        selectedItemCount: stagingStore.selectedItemCount,
        hasSelection: stagingStore.hasSelection,
        selectedItems: stagingStore.selectedItems,
        
        // Performance settings
        performanceSettings: stagingStore.performanceSettings,
    };
}