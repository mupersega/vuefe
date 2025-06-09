<template>
    <div class="main-view">        <div class="workshop-wrapper">            <div class="blueprints column" 
                 :class="{ 'blueprints--drag-over': workshopStore.isDragOver }" @drop="handleDrop"
                 @dragover.prevent="handleDragOver" @dragenter.prevent="handleDragEnter"                 @dragleave="handleDragLeave">
                <!-- Selection Info Bar -->
                <div v-if="workshopStore.hasSelection" class="selection-info">
                    <div class="selection-info__content">
                        <span class="selection-info__count">
                            {{ workshopStore.selectedBlueprintCount }} blueprint{{ workshopStore.selectedBlueprintCount !== 1 ? 's' : '' }} selected
                        </span>
                        <div class="selection-info__preview">
                            <span v-for="(blueprint, index) in previewBlueprints" :key="blueprint.typeId" class="selection-info__item">
                                {{ blueprint.typeName }}{{ index < previewBlueprints.length - 1 ? ', ' : '' }}
                            </span>
                            <span v-if="workshopStore.selectedBlueprintCount > 3" class="selection-info__more">
                                and {{ workshopStore.selectedBlueprintCount - 3 }} more...
                            </span>
                        </div>
                    </div>
                    <div class="selection-info__actions">
                        <button @click="clearSelection" class="selection-info__clear-btn">
                            Clear Selection
                        </button>
                    </div>
                </div>

                <div class="column__content">
                    <div v-if="!workshopStore.hasBlueprints" class="drop-zone">
                        <div class="drop-zone__text">Drop your blueprints here</div>
                        <div class="drop-zone__hint">Drag items from staging area</div>
                    </div>                    <div v-else class="blueprints-list">
                        <InvTypeSlip 
                            v-for="blueprint in workshopStore.sortedBlueprints" 
                            :key="blueprint.typeId" 
                            :inv-type="blueprint"
                            :count="blueprint.count"
                            variant="blueprint"
                            @increase-count="increaseCount"
                            @decrease-count="decreaseCount"
                            @remove="removeBlueprint"
                        />
                    </div>
                </div>
            </div>

            <div class="products column">
                <div class="column__content">
                    <div class="placeholder">
                        <div class="placeholder__text">Products of blueprints will appear here</div>
                    </div>                </div>
            </div>

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
import esiService from "@/services/esiService";
import type { InvTypeDto } from "@api-client/models/inv-type-dto";
import InvTypeSlip from "@components/InvType/InvTypeSlip.vue";

export default defineComponent({
    name: "WorkshopView",
    
    components: {
        InvTypeSlip
    },
    
    data() {
        return {
            // No local state needed - everything is in the store
        };
    },      computed: {
        stagingStore() {
            return useStagingState();
        },
        stagedTypes() {
            return this.stagingStore.stagedItems;
        },
        workshopStore() {
            return useWorkshopState();
        },
        esiService() {
            return esiService;
        },
        previewBlueprints() {
            // Show first 3 selected blueprints in the preview
            return this.workshopStore.selectedBlueprints.slice(0, 3);
        }    },    methods: {        
        clearSelection() {
            this.workshopStore.clearSelection();
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
        },

        handleDrop(event: DragEvent) {
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
                }

                // Add dropped items to blueprints list via store
                this.workshopStore.addBlueprints(droppedItems);

                console.log(`Dropped ${droppedItems.length} blueprints:`, droppedItems);

                // Optional: Remove items from staging store
                // this.stagingStore.removeItems(droppedItems.map(item => item.typeId));

            } catch (error) {
                console.error('Error processing dropped data:', error);
                this.workshopStore.setError(error instanceof Error ? error : new Error('Unknown error'));
            }
        },

        removeBlueprint(typeId: number) {
            this.workshopStore.removeBlueprint(typeId);
        },        increaseCount(typeId: number, amount: number = 1) {
            this.workshopStore.increaseCount(typeId, amount);
        },

        decreaseCount(typeId: number, amount: number = 1) {
            this.workshopStore.decreaseCount(typeId, amount);
        },
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

.blueprints {
    flex: 1.5;
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

/* Blueprints Column - Drop Zone Styling */
.blueprints {
    position: relative;
}

.blueprints--drag-over {
    background-color: var(--turquoise-bg);
}

.blueprints--drag-over::after {
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

.blueprints--drag-over .drop-zone {
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

/* Blueprints List */
.blueprints-list {
    flex: 1;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-auto-rows: min-content;
    gap: 0.5rem;
    scrollbar-width: thin;
    scrollbar-color: var(--flame) var(--eerie-black);
}

.blueprints-list::-webkit-scrollbar {
    width: 6px;
}

.blueprints-list::-webkit-scrollbar-track {
    background: var(--eerie-black);
}

.blueprints-list::-webkit-scrollbar-thumb {
    background-color: var(--translucent-white-2);
    border-radius: 6px;
}

.blueprints-list::-webkit-scrollbar-thumb:hover {
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
    transform: translateY(-0%);
    transition: transform 0.15s ease, height 0.15s ease, opacity 0.15s ease, margin 0.15s ease;

    @starting-style {
        transform: translateY(-50%);
        opacity: 0.9;
        height: 0;
        margin: 0;
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
</style>