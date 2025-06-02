import { defineStore } from "pinia";

export const useMainStateStore = defineStore("mainState", {
  state: () => ({
    selectedMarketGroups: [] as number[],
  }),
  actions: {
    setSelectedMarketGroups(marketGroupIds: number[]) {
      this.selectedMarketGroups = marketGroupIds;
    },
    addSelectedMarketGroup(marketGroupId: number) {
      if (!this.selectedMarketGroups.includes(marketGroupId)) {
        this.selectedMarketGroups.push(marketGroupId);
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
    },

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
  };
}