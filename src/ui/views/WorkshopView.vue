<template>    <div class="main-view">
        <!-- Dialogs -->
        <div v-if="showCreateDialog" class="dialog-overlay" @click="closeCreateDialog">
            <div class="dialog" @click.stop>
                <input 
                    v-model="newUnitName" 
                    @keyup.enter="handleCreateUnit"
                    @keyup.escape="closeCreateDialog"
                    placeholder="Unit name..."
                    class="dialog__input"
                    ref="createInput">
                <div class="dialog__actions">
                    <button @click="handleCreateUnit" class="dialog__btn dialog__btn--primary">Save</button>
                    <button @click="closeCreateDialog" class="dialog__btn">Cancel</button>
                </div>
            </div>
        </div>

        <div v-if="showRenameDialog" class="dialog-overlay" @click="closeRenameDialog">
            <div class="dialog" @click.stop>
                <input 
                    v-model="renameUnitName" 
                    @keyup.enter="handleRenameUnit"
                    @keyup.escape="closeRenameDialog"
                    placeholder="New name..."
                    class="dialog__input"
                    ref="renameInput">
                <div class="dialog__actions">
                    <button @click="handleRenameUnit" class="dialog__btn dialog__btn--primary">Rename</button>
                    <button @click="closeRenameDialog" class="dialog__btn">Cancel</button>
                </div>
            </div>
        </div>
        
        <div class="workshop-wrapper">
            <!-- Products Column with drag/drop and blueprint management -->
            <div class="products column" 
                 :class="{ 'products--drag-over': workshopStore.isDragOver }" 
                 @drop="handleDrop"
                 @dragover.prevent="handleDragOver" 
                 @dragenter.prevent="handleDragEnter"                   @dragleave="handleDragLeave">

                <!-- Selection Info Bar -->
                <div v-if="workshopStore.hasSelection" class="selection-info">                    <div class="selection-info__content">
                        <span class="selection-info__count">
                            {{ workshopStore.selectedProductCount }} item{{ workshopStore.selectedProductCount !== 1 ? 's' : '' }} selected
                        </span>
                        <div class="selection-info__preview">
                            <span v-for="(product, index) in previewProducts" :key="product.typeId" class="selection-info__item">
                                {{ product.typeName }}{{ index < previewProducts.length - 1 ? ', ' : '' }}
                            </span>
                            <span v-if="workshopStore.selectedProductCount > 3" class="selection-info__more">
                                and {{ workshopStore.selectedProductCount - 3 }} more...
                            </span>
                        </div>
                    </div>
                    <div class="selection-info__actions">
                        <button @click="clearSelection" class="selection-info__clear-btn">
                            Clear Selection
                        </button>
                    </div>
                </div>                <div class="column__content">
                    <div v-if="!workshopStore.hasProducts" class="drop-zone">
                        <div class="drop-zone__text">Drop your items here</div>
                        <div class="drop-zone__hint">Drag items from staging area</div>
                    </div>
                    
                    <div v-else class="products-list">
                        <InvTypeSlip 
                            v-for="product in workshopStore.sortedProducts" 
                            :key="product.typeId" 
                            :inv-type="product"
                            :count="product.count"
                            variant="product"
                            @increase-count="increaseCount"
                            @decrease-count="decreaseCount"
                            @remove="removeProduct"
                        />
                    </div>
                </div>

                <!-- Unit Management (Save/Load) -->
                <div class="unit-management">
                    <div class="unit-selector">
                        <label class="unit-selector__label">Load Unit:</label>                        <MeCombobox
                            v-model="selectedUnitName"
                            :items="unitDropdownItems"
                            label-field="name"
                            value-field="id"
                            placeholder="Select unit to load..."
                            @select="handleUnitSelect"
                            class="unit-combobox"
                            :open-upward="true"
                        />
                    </div>
                    
                    <div class="unit-actions">
                        <button 
                            @click="showCreateDialog = true" 
                            class="unit-btn"
                            title="Save current items as new unit">
                            Save As...
                        </button>
                        <button 
                            v-if="unitStore.hasCurrentUnit" 
                            @click="showRenameDialog = true" 
                            class="unit-btn"
                            title="Rename current unit">
                            Rename
                        </button>
                        <button 
                            v-if="unitStore.hasCurrentUnit" 
                            @click="handleDeleteUnit" 
                            class="unit-btn unit-btn--danger"
                            title="Delete current unit">
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <!-- Materials Column -->
            <div class="materials column">
                <div class="column__content">
                    <div class="placeholder">
                        <div class="placeholder__text">Required materials will appear here</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStagingState } from "@/stores/useStagingStore";
import { useWorkshopState } from "@/stores/useWorkshopStore";
import { useUnitStore } from "@/stores/useUnitStore";
import esiService from "@/services/esiService";
import type { InvTypeDto } from "@api-client/models/inv-type-dto";
import InvTypeSlip from "@components/InvType/InvTypeSlip.vue";
import MeCombobox from "@components/shared/MeCombobox.vue";

export default defineComponent({
    name: "WorkshopView",
      components: {
        InvTypeSlip,
        MeCombobox
    },    data() {
        return {
            // Unit management state
            selectedUnitId: '' as string,
            selectedUnitName: '' as string,
            showCreateDialog: false,
            showRenameDialog: false,
            newUnitName: '',
            renameUnitName: '',
        };
    },computed: {        stagingStore() {
            return useStagingState();
        },
        stagedTypes() {
            return this.stagingStore.stagedItems;
        },
        workshopStore() {
            return useWorkshopState();
        },        unitStore() {
            return useUnitStore();
        },        esiService() {
            return esiService;
        },        previewProducts() {
            // Show first 3 selected products in the preview
            return this.workshopStore.selectedProducts.slice(0, 3);
        },
        unitDropdownItems() {
            return this.unitStore.allUnits.map(unit => ({
                id: unit.id,
                name: unit.name
            }));
        }
    },

    methods: {
        clearSelection() {
            this.workshopStore.clearSelection();
        },// Unit Management Methods
        handleUnitChange() {
            if (this.selectedUnitId) {
                // Load selected unit into workshop
                this.unitStore.setCurrentUnit(this.selectedUnitId);
                this.loadUnitIntoWorkshop(this.selectedUnitId);
            } else {                // Clear current unit and workshop
                this.unitStore.clearCurrentUnit();
                this.workshopStore.clearProducts();
            }
        },

        handleCreateUnit() {
            if (!this.newUnitName.trim()) {
                return;
            }

            const unit = this.unitStore.createAndSetCurrentUnit({
                name: this.newUnitName.trim(),
                description: `Created on ${new Date().toLocaleDateString()}`
            });

            this.selectedUnitId = unit.id;
            this.closeCreateDialog();
        },

        handleRenameUnit() {
            if (!this.renameUnitName.trim() || !this.unitStore.currentUnit) {
                return;
            }

            this.unitStore.updateUnit(this.unitStore.currentUnit.id, {
                name: this.renameUnitName.trim()
            });

            this.closeRenameDialog();
        },

        handleDeleteUnit() {
            if (!this.unitStore.currentUnit) {
                return;
            }

            if (confirm(`Are you sure you want to delete "${this.unitStore.currentUnit.name}"?`)) {
                this.unitStore.deleteUnit(this.unitStore.currentUnit.id);
                this.selectedUnitId = '';
            }
        },

        closeCreateDialog() {
            this.showCreateDialog = false;
            this.newUnitName = '';
        },        closeRenameDialog() {
            this.showRenameDialog = false;
            this.renameUnitName = '';
        },

        handleUnitSelect(item: any) {
            this.selectedUnitId = item.id;
            this.selectedUnitName = item.name;
            
            // Load selected unit into workshop
            this.unitStore.setCurrentUnit(item.id);
            this.loadUnitIntoWorkshop(item.id);
        },

        handleDragEnter(event: DragEvent) {
            event.preventDefault();
            this.workshopStore.incrementDragCounter();
        },

        handleDragLeave() {
            this.workshopStore.decrementDragCounter();
        },

        handleDragOver(event: DragEvent) {
            event.preventDefault();
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'move';
            }
        },        handleDrop(event: DragEvent) {
            event.preventDefault();
            this.workshopStore.resetDragState();

            if (!event.dataTransfer) return;

            try {
                // Try to get structured data first
                const jsonData = event.dataTransfer.getData('application/json');
                const customData = event.dataTransfer.getData('application/x-inv-types');

                let droppedItems: InvTypeDto[] = [];

                if (customData) {
                    droppedItems = JSON.parse(customData);
                } else if (jsonData) {
                    droppedItems = JSON.parse(jsonData);
                } else {
                    console.warn('No structured data found in drop event');
                    return;
                }                // Add dropped items to workshop store (primary)
                this.workshopStore.addProducts(droppedItems);

                // If there's a current unit, sync the workshop state to it
                this.syncWorkshopToCurrentUnit();

                console.log(`Dropped ${droppedItems.length} items into workshop:`, droppedItems);

            } catch (error) {
                console.error('Error processing dropped data:', error);
                this.workshopStore.setError(error instanceof Error ? error : new Error('Unknown error'));
            }
        },        // Workshop Item Management Methods
        removeProduct(typeId: number) {
            this.workshopStore.removeProduct(typeId);
            // Sync changes to current unit if one is selected
            this.syncWorkshopToCurrentUnit();
        },

        increaseCount(typeId: number, amount: number = 1) {
            this.workshopStore.increaseCount(typeId, amount);
            // Sync changes to current unit if one is selected
            this.syncWorkshopToCurrentUnit();
        },

        decreaseCount(typeId: number, amount: number = 1) {
            this.workshopStore.decreaseCount(typeId, amount);
            // Sync changes to current unit if one is selected
            this.syncWorkshopToCurrentUnit();        },

        // Unit-Workshop Sync Methods
        syncWorkshopToCurrentUnit() {
            if (!this.unitStore.hasCurrentUnit) return;

            // Convert workshop products to unit items
            const unitItems = this.workshopStore.products.map(p => ({
                typeId: p.typeId!,
                quantity: p.count,
                typeName: p.typeName || undefined
            }));

            // Clear current unit and add workshop items
            const currentUnit = this.unitStore.currentUnit!;
            currentUnit.items = unitItems;
            currentUnit.updatedAt = new Date();
            
            // Save to localStorage
            this.unitStore.setCurrentUnit(currentUnit.id);
        },

        loadUnitIntoWorkshop(unitId: string) {
            const unit = this.unitStore.getUnitById(unitId);
            if (!unit) return;

            // Clear current workshop
            this.workshopStore.clearProducts();

            // Convert unit items to workshop products
            const products = unit.items.map(item => ({
                typeId: item.typeId,
                typeName: item.typeName || `Type ${item.typeId}`,
                // Add any other required InvTypeDto properties as needed
            }));

            // Add to workshop with quantities
            products.forEach(p => {
                this.workshopStore.addProduct(p);
                const unitItem = unit.items.find(item => item.typeId === p.typeId);
                if (unitItem) {
                    this.workshopStore.setCount(p.typeId!, unitItem.quantity);
                }
            });
        },
    },    mounted() {
        // Initialize the selected unit ID and name if there's a current unit
        if (this.unitStore.currentUnit) {
            this.selectedUnitId = this.unitStore.currentUnit.id;
            this.selectedUnitName = this.unitStore.currentUnit.name;
        }

        // Set up focus for dialog inputs when they appear
        this.$watch('showCreateDialog', (newVal) => {
            if (newVal) {
                this.$nextTick(() => {
                    (this.$refs.createInput as HTMLElement)?.focus();
                });
            }
        });

        this.$watch('showRenameDialog', (newVal) => {
            if (newVal && this.unitStore.currentUnit) {
                this.renameUnitName = this.unitStore.currentUnit.name;
                this.$nextTick(() => {
                    (this.$refs.renameInput as HTMLElement)?.focus();
                });
            }
        });
    },
});
</script>

<style scoped>
.workshop-wrapper {
    display: flex;
    width: 100%;
    gap: 1rem;
    flex: 1;
    overflow: hidden;
}

.column {
    flex: 1;
    border: 1px solid var(--translucent-white-1);
    border-radius: 0.5rem;
    background-color: var(--eerie-black);
    display: flex;
    flex-direction: column;
    overflow: auto;
    transition: all 0.15s ease;
    position: relative;
    min-width: 200px;
}

.products {
    flex: 1.5; /* Give products column more space since it contains blueprints */
}

.materials {
    flex: 1;
}

.column::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 0px solid transparent;
    pointer-events: none;
    border-radius: 0.5rem;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.column__content {
    flex: 1;
    padding: 0.5rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* Products Column - Drop Zone Styling */
.products {
    position: relative;
}

.products--drag-over {
    background-color: var(--turquoise-bg);
}

.products--drag-over::after {
    border: 2px solid var(--turquoise);
    box-shadow: 0 0 8px var(--turquoise-glow);
}

.drop-zone {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--gray);
    transition: all 0.15s ease;
}

/* stylelint-disable-next-line at-rule-no-unknown */
.drop-zone {
    @starting-style {
        opacity: 0;
        transform: scale(0.9);
    }
}

.products--drag-over .drop-zone {
    color: var(--turquoise);
    text-shadow: 0 0 0.5px currentColor;
}

.drop-zone__text {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--platinum);
}

.drop-zone__hint {
    font-size: 0.7rem;
    color: var(--gray);
    font-style: italic;
}

/* Products List */
.products-list {
    flex: 1;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-auto-rows: min-content;
    gap: 0.5rem;
    scrollbar-width: thin;
    scrollbar-color: var(--flame) var(--eerie-black);
}

.products-list::-webkit-scrollbar {
    width: 6px;
}

.products-list::-webkit-scrollbar-track {
    background: var(--eerie-black);
}

.products-list::-webkit-scrollbar-thumb {
    background-color: var(--translucent-white-2);
    border-radius: 6px;
}

.products-list::-webkit-scrollbar-thumb:hover {
    background-color: var(--flame);
}

/* Placeholder styling for other columns */
.placeholder {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--gray);
}

.placeholder__text {
    font-size: 0.875rem;
    color: var(--gray);
}

/* Selection info bar styles */
.selection-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(64, 224, 208, 0.05);
    border: 1px solid var(--turquoise);
    border-radius: 0.5rem;
    padding: 0.75rem;
    margin: 0.5rem;
    font-size: 0.7rem;
    position: relative;
    height: 2.75rem;
    box-sizing: border-box;
    transform: translateY(0%);
    transition: transform 0.15s ease, height 0.15s ease, opacity 0.15s ease, margin 0.15s ease;
    animation: slideInSelection 0.15s ease-out;
}

@keyframes slideInSelection {
    from {
        transform: translateY(-50%);
        opacity: 0.9;
        height: 0;
        margin: 0;
    }
    to {
        transform: translateY(0%);
        opacity: 1;
        height: 2.75rem;
        margin: 0.5rem;
    }
}

.selection-info__content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.selection-info__count {
    font-weight: bold;
    color: var(--turquoise);
    text-shadow: 0 0 0.5px currentColor;
    display: block;
    margin-bottom: 0.125rem;
    line-height: 1;
}

.selection-info__preview {
    color: var(--gray);
    font-size: 0.7rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1;
}

.selection-info__item {
    font-weight: 500;
}

.selection-info__more {
    font-style: italic;
    color: var(--gray);
}

.selection-info__actions {
    display: flex;
    gap: 0.5rem;
}

.selection-info__clear-btn {
    background-color: var(--eerie-black);
    color: var(--gray);
    border: 1px solid var(--translucent-white-3);
    padding: 0.25rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.7rem;
    transition: all 0.15s ease;
    position: relative;
    user-select: none;
}

.selection-info__clear-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 0px solid transparent;
    pointer-events: none;
    border-radius: 0.5rem;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.selection-info__clear-btn:hover {
    color: var(--platinum);
}

.selection-info__clear-btn:hover::after {
    border: 1px solid var(--turquoise);
}

.selection-info__clear-btn:active::after {
    box-shadow: 0 0 3px 3px var(--turquoise) inset;
}

/* Unit Management Styles */
.unit-management {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    background-color: var(--translucent-white-02);
    border-top: 1px solid var(--translucent-white-1);
    margin-top: auto;
    border-radius: 0 0 0.5rem 0.5rem;
}

.unit-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
}

.unit-selector__label {
    font-size: 0.6rem;
    color: var(--gray);
    white-space: nowrap;
}

.unit-combobox {
    flex: 1;
    max-width: 200px;
}

.unit-actions {
    display: flex;
    gap: 0.5rem;
}

.unit-btn {
    padding: 0.25rem 0.5rem;
    height: 1.75rem;
    border: 1px solid var(--translucent-white-3);
    border-radius: 0.25rem;
    background-color: var(--eerie-black);
    color: var(--gray);
    font-size: 0.6rem;
    cursor: pointer;
    transition: all 0.15s ease;
    position: relative;
}

.unit-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 0px solid transparent;
    pointer-events: none;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.unit-btn:hover {
    color: var(--platinum);
}

.unit-btn:hover::after {
    border: 1px solid var(--turquoise);
}

.unit-btn:active::after {
    box-shadow: 0 0 3px 3px var(--turquoise) inset;
}

.unit-btn--danger:hover::after {
    border-color: var(--flame);
}

/* Simple Dialog Styles */
.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.15s ease-out;
}

.dialog {
    background-color: var(--eerie-black);
    border: 1px solid var(--translucent-white-3);
    border-radius: 0.5rem;
    padding: 1rem;
    min-width: 250px;
    animation: slideIn 0.15s ease-out;
}

.dialog__input {
    width: 100%;
    padding: 0.25rem 0.75rem;
    height: 2rem;
    background-color: var(--eerie-black);
    border: 1px solid var(--translucent-white-3);
    border-radius: 0.5rem;
    color: var(--gray);
    font-size: 0.7rem;
    margin-bottom: 0.75rem;
    transition: all 0.15s ease;
    box-sizing: border-box;
    outline: none;
}

.dialog__input:hover {
    color: var(--platinum);
    border-color: var(--turquoise);
}

.dialog__input:focus {
    border-color: var(--flame);
    color: var(--flame);
    text-shadow: 0 0 0.5px currentColor;
}

.dialog__input:not(:placeholder-shown) {
    color: var(--flame);
    text-shadow: 0 0 0.5px currentColor;
}

.dialog__input::placeholder {
    color: var(--gray);
}

.dialog__actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
}

.dialog__btn {
    padding: 0.25rem 0.75rem;
    height: 2rem;
    border: 1px solid var(--translucent-white-3);
    border-radius: 0.5rem;
    background-color: var(--eerie-black);
    color: var(--gray);
    cursor: pointer;
    font-size: 0.7rem;
    transition: all 0.15s ease;
    position: relative;
}

.dialog__btn::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 0px solid transparent;
    pointer-events: none;
    border-radius: 0.5rem;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.dialog__btn:hover {
    color: var(--platinum);
}

.dialog__btn:hover::after {
    border: 1px solid var(--turquoise);
}

.dialog__btn:active::after {
    box-shadow: 0 0 3px 3px var(--turquoise) inset;
}

.dialog__btn--primary {
    background-color: var(--flame);
    color: var(--eerie-black);
    border-color: var(--flame);
}

.dialog__btn--primary:hover {
    background-color: var(--burnt-sienna);
    border-color: var(--burnt-sienna);
    color: var(--eerie-black);
}

.dialog__btn--primary::after {
    display: none;
}
</style>