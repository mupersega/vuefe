import type { InvTypeDto } from "@api-client/models/inv-type-dto";
import { defineStore } from "pinia";

export interface BlueprintWithCount extends InvTypeDto {
    count: number;
}

export const useWorkshopStore = defineStore("workshop", {
    state: () => ({
        blueprints: [] as BlueprintWithCount[],
        isDragOver: false,
        dragCounter: 0,
        isLoading: false,
        error: null as Error | null,
    }),
    
    actions: {
        // Blueprint management
        addBlueprint(blueprint: InvTypeDto) {
            const exists = this.blueprints.some(bp => bp.typeId === blueprint.typeId);
            if (!exists) {
                this.blueprints.push({
                    ...blueprint,
                    count: 1
                });
            }
        },

        addBlueprints(blueprints: InvTypeDto[]) {
            blueprints.forEach(blueprint => {
                this.addBlueprint(blueprint);
            });
        },

        removeBlueprint(typeId: number) {
            const index = this.blueprints.findIndex(bp => bp.typeId === typeId);
            if (index !== -1) {
                this.blueprints.splice(index, 1);
            }
        },

        clearBlueprints() {
            this.blueprints = [];
        },

        // Count management
        increaseCount(typeId: number) {
            const blueprint = this.blueprints.find(bp => bp.typeId === typeId);
            if (blueprint) {
                blueprint.count = (blueprint.count || 1) + 1;
            }
        },

        decreaseCount(typeId: number) {
            const blueprint = this.blueprints.find(bp => bp.typeId === typeId);
            if (blueprint) {
                blueprint.count = Math.max(1, (blueprint.count || 1) - 1);
            }
        },

        setCount(typeId: number, count: number) {
            const blueprint = this.blueprints.find(bp => bp.typeId === typeId);
            if (blueprint) {
                blueprint.count = Math.max(1, count);
            }
        },

        // Drag state management
        setDragOver(isDragOver: boolean) {
            this.isDragOver = isDragOver;
        },

        incrementDragCounter() {
            this.dragCounter++;
            this.isDragOver = true;
        },

        decrementDragCounter() {
            this.dragCounter--;
            if (this.dragCounter === 0) {
                this.isDragOver = false;
            }
        },

        resetDragState() {
            this.isDragOver = false;
            this.dragCounter = 0;
        },

        // Utility methods
        getBlueprintById(typeId: number): BlueprintWithCount | undefined {
            return this.blueprints.find(bp => bp.typeId === typeId);
        },

        hasBlueprint(typeId: number): boolean {
            return this.blueprints.some(bp => bp.typeId === typeId);
        },

        // Error handling
        setError(error: Error | null) {
            this.error = error;
        },

        setLoading(isLoading: boolean) {
            this.isLoading = isLoading;
        },
    },

    getters: {
        blueprintCount: (state) => state.blueprints.length,
        totalBlueprintCount: (state) => state.blueprints.reduce((total, bp) => total + bp.count, 0),
        hasBlueprints: (state) => state.blueprints.length > 0,
        
        // Get blueprints sorted by name
        sortedBlueprints: (state) => {
            return [...state.blueprints].sort((a, b) => 
                (a.typeName || '').localeCompare(b.typeName || '')
            );
        },
    },
});

// Create a wrapper function for consistent API
export function useWorkshopState() {
    const workshopStore = useWorkshopStore();
    
    return {
        // State properties
        blueprints: workshopStore.blueprints,
        isDragOver: workshopStore.isDragOver,
        dragCounter: workshopStore.dragCounter,
        isLoading: workshopStore.isLoading,
        error: workshopStore.error,
        
        // Actions
        addBlueprint: workshopStore.addBlueprint,
        addBlueprints: workshopStore.addBlueprints,
        removeBlueprint: workshopStore.removeBlueprint,
        clearBlueprints: workshopStore.clearBlueprints,
        
        // Count management
        increaseCount: workshopStore.increaseCount,
        decreaseCount: workshopStore.decreaseCount,
        setCount: workshopStore.setCount,
        
        // Drag state management
        setDragOver: workshopStore.setDragOver,
        incrementDragCounter: workshopStore.incrementDragCounter,
        decrementDragCounter: workshopStore.decrementDragCounter,
        resetDragState: workshopStore.resetDragState,
        
        // Utility methods
        getBlueprintById: workshopStore.getBlueprintById,
        hasBlueprint: workshopStore.hasBlueprint,
        
        // Error handling
        setError: workshopStore.setError,
        setLoading: workshopStore.setLoading,
        
        // Getters
        blueprintCount: workshopStore.blueprintCount,
        totalBlueprintCount: workshopStore.totalBlueprintCount,
        hasBlueprints: workshopStore.hasBlueprints,
        sortedBlueprints: workshopStore.sortedBlueprints,
    };
}
