import type { InvTypeDto } from "@api-client/models/inv-type-dto";
import { defineStore } from "pinia";
import { db } from "@services/db";

export const useStagingStore = defineStore("staging", {
    state: () => ({
        searchString: "",
        selectedMarketGroupIds: [] as number[],
        stagedItems: [] as InvTypeDto[],
        isLoading: false,
        error: null as Error | null,
    }),
    actions: {
        addGroup(marketGroupId: number) {
            if (!this.selectedMarketGroupIds.includes(marketGroupId)) {
                this.selectedMarketGroupIds.push(marketGroupId);
            }
        },
        removeGroup(marketGroupId: number) {
            const index = this.selectedMarketGroupIds.indexOf(marketGroupId);
            if (index !== -1) {
                this.selectedMarketGroupIds.splice(index, 1);
            }
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