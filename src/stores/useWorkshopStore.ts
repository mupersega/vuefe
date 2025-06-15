import type { InvTypeDto } from "@api-client/models/inv-type-dto";
import { defineStore } from "pinia";

export interface ProductWithCount extends InvTypeDto {
    count: number;
}

export const useWorkshopStore = defineStore("workshop", {
    state: () => ({
        products: [] as ProductWithCount[],
        selectedProductIds: [] as number[],
        isDragOver: false,
        dragCounter: 0,
        isLoading: false,
        error: null as Error | null,
    }),
      actions: {
        // Product management
        addProduct(product: InvTypeDto) {
            const exists = this.products.some(p => p.typeId === product.typeId);
            if (!exists) {
                this.products.push({
                    ...product,
                    count: 1
                });
            }
        },

        addProducts(products: InvTypeDto[]) {
            products.forEach(product => {
                this.addProduct(product);
            });
        },

        removeProduct(typeId: number) {
            const index = this.products.findIndex(p => p.typeId === typeId);
            if (index !== -1) {
                this.products.splice(index, 1);
            }
        },

        clearProducts() {
            this.products = [];        },// Count management
        increaseCount(typeId: number, amount: number = 1) {
            const product = this.products.find(p => p.typeId === typeId);
            if (product) {
                product.count = (product.count || 1) + amount;
            }
        },

        decreaseCount(typeId: number, amount: number = 1) {
            const product = this.products.find(p => p.typeId === typeId);
            if (product) {
                product.count = Math.max(1, (product.count || 1) - amount);
            }
        },        setCount(typeId: number, count: number) {
            const product = this.products.find(p => p.typeId === typeId);
            if (product) {
                product.count = Math.max(1, count);
            }
        },        // Selection management
        selectProduct(typeId: number) {
            if (!this.selectedProductIds.includes(typeId)) {
                this.selectedProductIds.push(typeId);
            }
        },

        deselectProduct(typeId: number) {
            this.selectedProductIds = this.selectedProductIds.filter(id => id !== typeId);
        },

        toggleProductSelection(typeId: number) {
            if (this.selectedProductIds.includes(typeId)) {
                this.deselectProduct(typeId);
            } else {
                this.selectProduct(typeId);
            }
        },

        clearSelection() {
            this.selectedProductIds = [];
        },

        selectSingleProduct(typeId: number) {
            this.selectedProductIds = [typeId];
        },

        selectMultipleProducts(typeIds: number[]) {
            // Add to existing selection
            const newSelections = typeIds.filter(id => !this.selectedProductIds.includes(id));
            this.selectedProductIds = [...this.selectedProductIds, ...newSelections];
        },

        isProductSelected(typeId: number): boolean {
            return this.selectedProductIds.includes(typeId);
        },

        // Batch count operations for selected products
        increaseSelectedProductsCount(amount: number = 1) {
            this.selectedProductIds.forEach(typeId => {
                this.increaseCount(typeId, amount);
            });
        },

        decreaseSelectedProductsCount(amount: number = 1) {
            this.selectedProductIds.forEach(typeId => {
                this.decreaseCount(typeId, amount);
            });
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
        },        // Utility methods
        getProductById(typeId: number): ProductWithCount | undefined {
            return this.products.find(p => p.typeId === typeId);
        },

        hasProduct(typeId: number): boolean {
            return this.products.some(p => p.typeId === typeId);
        },

        // Error handling
        setError(error: Error | null) {
            this.error = error;
        },

        setLoading(isLoading: boolean) {
            this.isLoading = isLoading;
        },    },    getters: {
        productCount: (state) => state.products.length,
        totalProductCount: (state) => state.products.reduce((total: number, p: ProductWithCount) => total + p.count, 0),
        hasProducts: (state) => state.products.length > 0,
        
        // Selection getters
        selectedProductCount: (state) => state.selectedProductIds.length,
        hasSelection: (state) => state.selectedProductIds.length > 0,
        selectedProducts: (state) => state.products.filter((p: ProductWithCount) => 
            state.selectedProductIds.includes(p.typeId!)
        ),
        
        // Get products sorted by name
        sortedProducts: (state) => {
            return [...state.products].sort((a: ProductWithCount, b: ProductWithCount) => 
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
        products: workshopStore.products,
        selectedProductIds: workshopStore.selectedProductIds,
        isDragOver: workshopStore.isDragOver,
        dragCounter: workshopStore.dragCounter,
        isLoading: workshopStore.isLoading,
        error: workshopStore.error,
        
        // Actions
        addProduct: workshopStore.addProduct,
        addProducts: workshopStore.addProducts,
        removeProduct: workshopStore.removeProduct,
        clearProducts: workshopStore.clearProducts,
        
        // Count management
        increaseCount: workshopStore.increaseCount,
        decreaseCount: workshopStore.decreaseCount,
        setCount: workshopStore.setCount,
        
        // Selection management
        selectProduct: workshopStore.selectProduct,
        deselectProduct: workshopStore.deselectProduct,
        toggleProductSelection: workshopStore.toggleProductSelection,
        clearSelection: workshopStore.clearSelection,
        selectSingleProduct: workshopStore.selectSingleProduct,
        selectMultipleProducts: workshopStore.selectMultipleProducts,
        isProductSelected: workshopStore.isProductSelected,
        
        // Batch operations
        increaseSelectedProductsCount: workshopStore.increaseSelectedProductsCount,
        decreaseSelectedProductsCount: workshopStore.decreaseSelectedProductsCount,
        
        // Drag state management
        setDragOver: workshopStore.setDragOver,
        incrementDragCounter: workshopStore.incrementDragCounter,
        decrementDragCounter: workshopStore.decrementDragCounter,
        resetDragState: workshopStore.resetDragState,
        
        // Utility methods
        getProductById: workshopStore.getProductById,
        hasProduct: workshopStore.hasProduct,
        
        // Error handling
        setError: workshopStore.setError,
        setLoading: workshopStore.setLoading,
        
        // Getters
        productCount: workshopStore.productCount,
        totalProductCount: workshopStore.totalProductCount,
        hasProducts: workshopStore.hasProducts,
        selectedProductCount: workshopStore.selectedProductCount,
        hasSelection: workshopStore.hasSelection,
        selectedProducts: workshopStore.selectedProducts,
        sortedProducts: workshopStore.sortedProducts,

        // Legacy support - keep old blueprint names for compatibility
        blueprints: workshopStore.products,
        selectedBlueprintIds: workshopStore.selectedProductIds,
        addBlueprint: workshopStore.addProduct,
        addBlueprints: workshopStore.addProducts,
        removeBlueprint: workshopStore.removeProduct,
        clearBlueprints: workshopStore.clearProducts,
        selectBlueprint: workshopStore.selectProduct,
        deselectBlueprint: workshopStore.deselectProduct,
        toggleBlueprintSelection: workshopStore.toggleProductSelection,
        selectSingleBlueprint: workshopStore.selectSingleProduct,
        selectMultipleBlueprints: workshopStore.selectMultipleProducts,
        isBlueprintSelected: workshopStore.isProductSelected,
        increaseSelectedBlueprintsCount: workshopStore.increaseSelectedProductsCount,
        decreaseSelectedBlueprintsCount: workshopStore.decreaseSelectedProductsCount,
        getBlueprintById: workshopStore.getProductById,
        hasBlueprint: workshopStore.hasProduct,
        blueprintCount: workshopStore.productCount,
        totalBlueprintCount: workshopStore.totalProductCount,
        hasBlueprints: workshopStore.hasProducts,
        selectedBlueprintCount: workshopStore.selectedProductCount,
        selectedBlueprints: workshopStore.selectedProducts,
        sortedBlueprints: workshopStore.sortedProducts,
    };
}
