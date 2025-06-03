import { defineStore } from "pinia";

export const useMainStateStore = defineStore("mainState", {
  state: () => ({
    selectedMarketGroups: [] as number[],
    // Last expand/collapse event timestamp and action
    expandCollapseEvent: {
      timestamp: 0,
      action: '' as 'expandAll' | 'collapseAll' | '',
      target: '' as string
    },
  }),
  actions: {
    setSelectedMarketGroups(marketGroupIds: number[]) {
      this.selectedMarketGroups = marketGroupIds;
    },    addSelectedMarketGroup(marketGroupId: number) {
      // Only update if the ID isn't already in the array
      if (!this.selectedMarketGroups.includes(marketGroupId)) {
        this.selectedMarketGroups = [...this.selectedMarketGroups, marketGroupId];
      }
    },
    removeSelectedMarketGroup(marketGroupId: number) {
      this.selectedMarketGroups = this.selectedMarketGroups.filter(
        (id) => id !== marketGroupId
      );
    },
    toggleMarketGroupSelection(marketGroupId: number) {
      if (this.isGroupSelected(marketGroupId)) {
        this.removeSelectedMarketGroup(marketGroupId);
      } else {
        this.addSelectedMarketGroup(marketGroupId);
      }
    },
    // is group selected
    isGroupSelected(marketGroupId: number): boolean {
      return this.selectedMarketGroups.includes(marketGroupId);
    },    // Add a method to handle adding multiple groups at once with a single state update
    addMultipleMarketGroups(marketGroupIds: number[]) {
      const newSelectedGroups = [...this.selectedMarketGroups];
      
      // Filter out only the IDs that don't already exist in the array
      const uniqueNewIds = marketGroupIds.filter(id => !newSelectedGroups.includes(id));
      
      // Only update state if we have new IDs to add
      if (uniqueNewIds.length > 0) {
        this.selectedMarketGroups = [...newSelectedGroups, ...uniqueNewIds];
      }
    },
    
    // Remove multiple groups with a single state update
    removeMultipleMarketGroups(marketGroupIds: number[]) {
      this.selectedMarketGroups = this.selectedMarketGroups.filter(
        (id) => !marketGroupIds.includes(id)
      );
    },
    
    // Global expand/collapse actions
    triggerExpandAll(target: string = 'all') {
      this.expandCollapseEvent = {
        timestamp: Date.now(),
        action: 'expandAll',
        target
      };
    },
    
    triggerCollapseAll(target: string = 'all') {
      this.expandCollapseEvent = {
        timestamp: Date.now(),
        action: 'collapseAll',
        target
      };
    }
  },
});

export function useMainState() {
  const mainStateStore = useMainStateStore();
  return {
    selectedMarketGroups: mainStateStore.selectedMarketGroups,
    setSelectedMarketGroups: mainStateStore.setSelectedMarketGroups,
    addSelectedMarketGroup: mainStateStore.addSelectedMarketGroup,
    removeSelectedMarketGroup: mainStateStore.removeSelectedMarketGroup,
    isGroupSelected: mainStateStore.isGroupSelected,
    toggleMarketGroupSelection: mainStateStore.toggleMarketGroupSelection,
    addMultipleMarketGroups: mainStateStore.addMultipleMarketGroups,
    removeMultipleMarketGroups: mainStateStore.removeMultipleMarketGroups,
    
    // Expand/collapse events and actions
    expandCollapseEvent: mainStateStore.expandCollapseEvent,
    triggerExpandAll: mainStateStore.triggerExpandAll,
    triggerCollapseAll: mainStateStore.triggerCollapseAll,
  };
}