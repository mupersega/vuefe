<template>
    <div class="staging" :class="{ dragging: stagingStore.isDragging }">
        <!-- Selection Info Bar -->
        <div v-if="stagingStore.hasSelection" class="selection-info">
            <div class="selection-info__content">
                <span class="selection-info__count">
                    {{ stagingStore.selectedItemCount }} item{{ stagingStore.selectedItemCount !== 1 ? 's' : '' }} selected
                </span>
                <div class="selection-info__preview">
                    <span v-for="(item, index) in previewItems" :key="item.typeId" class="selection-info__item">
                        {{ item.typeName }}{{ index < previewItems.length - 1 ? ', ' : '' }}
                    </span>
                    <span v-if="stagingStore.selectedItemCount > 3" class="selection-info__more">
                        and {{ stagingStore.selectedItemCount - 3 }} more...
                    </span>
                </div>
            </div>
            <div class="selection-info__actions">
                <button @click="clearSelection" class="selection-info__clear-btn">
                    Clear Selection
                </button>
            </div>
        </div>        <!-- Instructions -->
        <div class="instructions" v-if="!stagingStore.hasSelection">
            <div class="instructions__content">
                <span class="instructions__hint">Click items to select</span>
                <button 
                    class="instructions__help-btn"
                    @click="showInstructions = !showInstructions"
                    :title="showInstructions ? 'Hide instructions' : 'Show full instructions'"
                >
                    {{ showInstructions ? '−' : '?' }}
                </button>
            </div>
            <div v-if="showInstructions" class="instructions__details">
                <strong>Multi-Select Instructions:</strong><br>
                • Click items to select<br>
                • Ctrl/Cmd + Click for multi-select<br>
                • Shift + Click for range select<br>
                • Drag any selected item to move all selected items
            </div>
        </div>

        <!-- Items Grid -->
        <ul class="items" 
            @click="handleBackgroundClick">
              <inv-type-slip 
                v-for="item in stagingStore.stagedItems" 
                :key="item.typeId"
                :invType="item" 
                :parentMouseDown="stagingStore.mouseDown"
                v-memo="[item.typeId, stagingStore.isItemSelected(item.typeId), stagingStore.isDragging]"
            /></ul>
        <div 
            v-if="stagingStore.isDragging && cachedDragPreviewData" 
            class="drag-preview"
            ref="dragPreviewRef"
        >
            <div class="drag-preview__content">
                <div v-if="cachedDragPreviewData.isSingle" class="drag-preview__single">
                    <img 
                        :src="esiService.getBlueprintOriginalUrl(cachedDragPreviewData.items[0].typeId)" 
                        alt="Item Icon" 
                        class="drag-preview__icon"
                    />
                    <span class="drag-preview__name">{{ cachedDragPreviewData.items[0].typeName }}</span>
                </div>
                <div v-else class="drag-preview__multiple">
                    <div class="drag-preview__icons">
                        <img 
                            v-for="(item, index) in cachedDragPreviewData.items" 
                            :key="item.typeId"
                            :src="esiService.getBlueprintOriginalUrl(item.typeId)" 
                            alt="Item Icon" 
                            class="drag-preview__icon drag-preview__icon--stacked"
                            :style="{ transform: `translate(${index * 3}px, ${index * 3}px)` }"
                        />
                    </div>
                    <span class="drag-preview__count">
                        {{ cachedDragPreviewData.count }} items
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStagingState } from "@/stores/useStagingStore";
import esiService from "@/services/esiService";
import InvTypeSlip from "@components/InvType/InvTypeSlip.vue";

export default defineComponent({
    name: "StagingView",    data() {
        return {
            showInstructions: false,
            dragPreviewPosition: { x: 0, y: 0 },
            debugDrag: false, // Set to true to enable drag debugging
            // Cache drag preview data to avoid reactive lookups during drag
            cachedDragPreviewData: null as {
                count: number;
                items: any[];
                isSingle: boolean;
            } | null,
            // Throttle mouse move events for better performance
            lastMouseMoveTime: 0
        };
    },
    computed: {
        stagingStore() {
            return useStagingState();
        },
        stagedTypes() {
            return this.stagingStore.stagedItems;
        },
        esiService() {
            return esiService;
        },
        previewItems() {
            // Show first 3 selected items in the preview
            return this.stagingStore.selectedItems.slice(0, 3);
        }
    },    components: {
        InvTypeSlip
    },    watch: {
        'stagingStore.isDragging'(newValue: boolean) {
            return; // No need to track drag state here, handled in mounted
            if (newValue) {
                // Cache drag preview data once when drag starts to avoid reactive lookups
                this.cachedDragPreviewData = {
                    count: this.stagingStore.selectedItemCount,
                    items: this.stagingStore.selectedItems.slice(0, 3), // Only cache what we need
                    isSingle: this.stagingStore.selectedItemCount === 1
                };
                
                this.startDragPreviewTracking();
                console.log('positioning');
                // Wait for next tick to ensure DOM element exists, then position it
                this.$nextTick(() => {
                    const dragPreview = document.querySelector('.drag-preview') as HTMLElement;
                    if (dragPreview) {
                        const x = this.stagingStore.dragStartPosition.x + 10;
                        const y = this.stagingStore.dragStartPosition.y - 40;
                        dragPreview.style.left = `${x}px`;
                        dragPreview.style.top = `${y}px`;
                    }
                });
            } else {
                this.stopDragPreviewTracking();
                this.cachedDragPreviewData = null; // Clear cache
            }
        }
    },
    methods: {
        clearSelection() {
            this.stagingStore.clearSelection();
        },
        
        handleBackgroundClick(event: MouseEvent) {
            // Clear selection when clicking on empty space
            if (event.target === event.currentTarget) {
                this.stagingStore.clearSelection();
            }
        },
        
        // Keyboard shortcuts (optional enhancement)
        handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                this.stagingStore.clearSelection();
            } else if (event.key === 'Delete' && this.stagingStore.hasSelection) {
                // Handle delete selected items
                this.handleDeleteSelected();
            } else if (event.ctrlKey && event.key === 'a') {
                // Select all items
                event.preventDefault();
                this.selectAllItems();
            }
        },
        
        handleDeleteSelected() {
            // Implement delete functionality if needed
            console.log('Delete selected items:', this.stagingStore.selectedItems);
        },        selectAllItems() {
            const allIds = this.stagingStore.stagedItems.map(item => item.typeId!);
            this.stagingStore.selectMultipleItems(allIds);
        },
        
        // Handle mouse movement for drag preview - optimized for performance
        handleMouseMove(event: MouseEvent) {
            if (!this.stagingStore.isDragging) return;
            
            // Throttle mouse move events to 60fps max
            const now = performance.now();
            if (now - this.lastMouseMoveTime < 200) return; // ~60fps
            this.lastMouseMoveTime = now;
            
            // Use direct DOM manipulation for better performance
            const dragPreview = document.querySelector('.drag-preview') as HTMLElement;
            if (dragPreview) {
                // Position drag preview above and to the right of cursor
                const x = event.clientX + 10;
                const y = event.clientY - 40; // Move up from cursor
                dragPreview.style.left = `${x}px`;
                dragPreview.style.top = `${y}px`;
                
                // Only update reactive data occasionally for debugging
                if (this.debugDrag && Math.random() < 0.01) { // Only 1% of the time
                    console.log('Mouse move - clientX:', event.clientX, 'clientY:', event.clientY);
                }
            }
        },// Start tracking mouse for drag preview
        startDragPreviewTracking() {
            document.addEventListener('mousemove', this.handleMouseMove);
            // Add event listener with passive: false to ensure it works during drag
            document.addEventListener('dragover', this.handleDragMouseMove, { passive: false });
            // Also listen for drag events globally
            window.addEventListener('drag', this.handleDragMouseMove, { passive: false });
        },

        // Stop tracking mouse for drag preview
        stopDragPreviewTracking() {
            document.removeEventListener('mousemove', this.handleMouseMove);
            document.removeEventListener('dragover', this.handleDragMouseMove);
            window.removeEventListener('drag', this.handleDragMouseMove);
        },        // Handle mouse movement during dragover events (more reliable during drag)
        handleDragMouseMove(event: DragEvent) {
            if (!this.stagingStore.isDragging) return;
            
            // Throttle drag move events too
            const now = performance.now();
            if (now - this.lastMouseMoveTime < 16) return; // ~60fps
            this.lastMouseMoveTime = now;
            
            // Use direct DOM manipulation for better performance
            const dragPreview = document.querySelector('.drag-preview') as HTMLElement;
            if (dragPreview) {
                // Position drag preview above and to the right of cursor
                const x = event.clientX + 10;
                const y = event.clientY - 40; // Move up from cursor
                dragPreview.style.left = `${x}px`;
                dragPreview.style.top = `${y}px`;
                
                if (this.debugDrag && Math.random() < 0.01) {
                    console.log('Drag move - clientX:', event.clientX, 'clientY:', event.clientY);
                }
            }
        },
    },
    
    mounted() {
        // Add keyboard event listeners
        document.addEventListener('keydown', this.handleKeyDown);
    },    beforeUnmount() {
        // Clean up event listeners
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('dragover', this.handleDragMouseMove);
        window.removeEventListener('drag', this.handleDragMouseMove);
    }
});
</script>

<style scoped>
.staging {
    padding: 10px;
    flex: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.selection-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(235, 94, 40, 0.05);
    border: 1px solid var(--flame);
    border-radius: 0.5rem;
    padding: 0.75rem;
    margin-bottom: 1rem;
    font-size: 0.7rem;
    position: relative;
    height: 2.75rem; /* Fixed height to exactly match instructions */
    box-sizing: border-box; /* Include border and padding in height calculation */
}

.selection-info__content {
    flex: 1;
    overflow: hidden; /* Prevent content from expanding container */
    display: flex;
    flex-direction: column;
    justify-content: center; /* Center content vertically */
}

.selection-info__count {
    font-weight: bold;
    color: var(--flame);
    text-shadow: 0 0 0.5px currentColor;
    display: block;
    margin-bottom: 0.125rem; /* Reduced margin to fit in fixed height */
    line-height: 1;
}

.selection-info__preview {
    color: var(--gray);
    font-size: 0.7rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; /* Keep preview on single line */
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

.instructions {
    background-color: rgba(64, 224, 208, 0.05);
    border: 1px solid var(--translucent-white-3);
    border-radius: 0.5rem;
    padding: 0.75rem;
    margin-bottom: 1rem;
    font-size: 0.7rem;
    box-sizing: border-box; /* Ensure consistent box model */
    height: 2.75rem; /* Fixed height to match selection-info */
    position: relative; /* For absolute positioning of details */
}

.instructions__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--gray);
    height: 100%; /* Fill the fixed height container */
}

.instructions__hint {
    color: var(--gray);
    flex: 1;
}

.instructions__help-btn {
    background-color: var(--eerie-black);
    color: var(--gray);
    border: 1px solid var(--translucent-white-3);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.7rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    margin-left: 0.5rem;
    position: relative;
    user-select: none;
}

.instructions__help-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 0px solid transparent;
    pointer-events: none;
    border-radius: 50%;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.instructions__help-btn:hover {
    color: var(--platinum);
}

.instructions__help-btn:hover::after {
    border: 1px solid var(--turquoise);
}

.instructions__help-btn:active::after {
    box-shadow: 0 0 3px 3px var(--turquoise) inset;
}

.instructions__details {
    position: absolute;
    top: 100%; /* Position below the main instructions container */
    left: 0;
    right: 0;
    margin-top: 0.25rem; /* Small offset to separate from parent */
    padding: 0.75rem;
    background-color: var(--eerie-black);
    border: 1px solid var(--translucent-white-3);
    border-radius: 0.5rem; /* Full border radius for floating appearance */
    color: var(--gray);
    animation: slideDown 0.3s ease-out;
    z-index: 10; /* Ensure it appears above other content */
    backdrop-filter: blur(4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.instructions strong {
    color: var(--turquoise);
    text-shadow: 0 0 0.5px currentColor;
}

.items {
    position: relative;
    background-color: var(--eerie-black);
    overflow-y: scroll;
    border: 1px solid var(--translucent-white-3);
    flex: 1;
    padding: 0.5rem;
    border-radius: 0.5rem 0 0 0.5rem;
    scrollbar-width: thin;
    scrollbar-color: var(--flame) var(--eerie-black);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0.5rem;
}

.items::-webkit-scrollbar {
    width: 6px;
}

.items::-webkit-scrollbar-track {
    background: var(--eerie-black);
}

.items::-webkit-scrollbar-thumb {
    background-color: var(--translucent-white-2);
    border-radius: 6px;
}

.items::-webkit-scrollbar-thumb:hover {
    background-color: var(--flame);
}

.drag-preview {
    position: fixed;
    background-color: var(--eerie-black);
    color: var(--platinum);
    padding: 0.25rem 0.5rem; /* Reduced vertical padding */
    border-radius: 0.5rem;
    font-size: 0.7rem;
    font-weight: bold;
    z-index: 10000;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); /* Reduced shadow spread */
    white-space: nowrap;
    top: -1000px;
    left: -1000px;
    border: 1px solid var(--flame);
    backdrop-filter: blur(2px);
    transition: none;
    will-change: transform;
}

.drag-preview__content {
    display: flex;
    align-items: center;
    gap: 0.25rem; /* Reduced gap */
}

.drag-preview__single {
    display: flex;
    align-items: center;
    gap: 0.25rem; /* Reduced gap */
}

.drag-preview__multiple {
    display: flex;
    align-items: center;
    gap: 0.25rem; /* Reduced gap */
}

.drag-preview__icons {
    position: relative;
    width: 20px; /* Smaller icon container */
    height: 20px;
}

.drag-preview__icon {
    width: 20px; /* Smaller icon size */
    height: 20px;
    object-fit: contain;
    border-radius: 2px;
}

.drag-preview__icon--stacked {
    position: absolute;
    top: 0;
    left: 0;
    width: 16px; /* Smaller stacked icons */
    height: 16px;
    border: 1px solid rgba(255, 255, 255, 0.5);
}

.drag-preview__name {
    max-width: 120px; /* Reduced max width */
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--flame);
    text-shadow: 0 0 0.5px currentColor;
}

.drag-preview__count {
    font-weight: bold;
    color: var(--flame);
    text-shadow: 0 0 0.5px currentColor;
}

/* Hide cursor during drag operations */
.staging.dragging {
    cursor: none !important;
}

.staging.dragging * {
    cursor: none !important;
}

.drag-to-select-box {
    position: absolute;
    border: 1px solid var(--flame);
    background-color: rgba(235, 94, 40, 0.2);
    pointer-events: none;
    z-index: 10;
    display: none;
}
</style>