<template>    <div class="inv-type-slip" :class="cssClasses" :draggable="isDraggable" @click="handleClick" @dragstart="handleDragStart" @dragend="handleDragEnd">
        <div class="inv-type-slip__icon">
            <img :src="esiService.getBlueprintOriginalUrl(invType.typeId)" alt="Type Icon" />
        </div>
        <div class="inv-type-slip__name-wrapper">
            <div class="inv-type-slip__name">
                {{ invType.typeName }}
            </div>
        </div>
        
        <!-- Blueprint variant specific elements -->
        <template v-if="variant === 'blueprint'">
            <!-- Counter controls -->
            <div v-if="showCounter" class="inv-type-slip__counter">
                <button class="counter-btn counter-btn--decrease" @click.stop="handleDecreaseCount" 
                        title="Decrease count">
                    −
                </button>
                <span class="counter-value">{{ count || 1 }}</span>
                <button class="counter-btn counter-btn--increase" @click.stop="handleIncreaseCount" 
                        title="Increase count">
                    +
                </button>
            </div>
            
            <!-- Remove button -->
            <button v-if="showRemove" class="inv-type-slip__remove" @click.stop="handleRemove"
                title="Remove blueprint">
                ×
            </button>
        </template>
    </div>
    <!-- Drag preview element, positioned off-screen until needed -->
    <div v-if="showDragPreview" ref="dragPreview" class="drag-preview drag-preview--hidden">
        <div class="drag-preview__inner">
            {{ stagingStore.selectedItemCount }} Items
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import esiService from "@/services/esiService";
import { type InvTypeDto } from "@api-client/models/inv-type-dto";
import { useStagingState } from "@/stores/useStagingStore";

/**
 * InvTypeSlip Component - Optimized for Performance
 * 
 * DRAG PERFORMANCE OPTIMIZATIONS:
 * 1. Smart CSS class computation with performance thresholds
 * 2. Minimal drag "juice" effect for large selections (>20 items)
 * 3. GPU-accelerated properties (transform, opacity, filter)
 * 4. Fast transitions (0.08s) to reduce animation overhead
 * 5. Pre-computed cssClasses to reduce template reactivity
 * 6. will-change hints for optimal layer management
 */

export default defineComponent({
    name: "InvTypeSlip",
    props: {
        invType: {
            type: Object as PropType<InvTypeDto>,
            required: true
        },
        parentMouseDown: {
            type: Boolean,
            default: false
        },
        variant: {
            type: String as PropType<'default' | 'blueprint'>,
            default: 'default'
        },
        count: {
            type: Number,
            default: undefined
        },
        showCounter: {
            type: Boolean,
            default: true
        },
        showRemove: {
            type: Boolean,
            default: true
        }
    },
    emits: ['increase-count', 'decrease-count', 'remove'],data() {
        return {
            isDragging: false,
            showDragPreview: false
        };
    },    computed: {
        esiService() {
            return esiService;
        },
        stagingStore() {
            return useStagingState();
        },        isSelected(): boolean {
            return this.stagingStore.isItemSelected(this.invType.typeId!);
        },        isDraggingThis(): boolean {
            // Add a small performance optimization by caching this computation
            return this.isSelected && this.stagingStore.isDragging;
        },
        isDraggable(): boolean {
            // Blueprint variant is not draggable by default
            return this.variant !== 'blueprint';
        },
        cssClasses(): Record<string, boolean> {
            // Performance optimization: use configurable threshold for drag effects
            const threshold = this.stagingStore.performanceSettings.dragJuiceThreshold;
            const advancedEnabled = this.stagingStore.performanceSettings.enableAdvancedDragJuice;
            const isDragging = this.isDraggingThis;
            const isLargeSelection = this.stagingStore.selectedItemCount > threshold;
            
            return {
                'inv-type-slip--selected': this.isSelected,
                'inv-type-slip--dragging': isDragging && !isLargeSelection && advancedEnabled,
                'inv-type-slip--dragging-simple': isDragging && (isLargeSelection || !advancedEnabled),
                'inv-type-slip--blueprint': this.variant === 'blueprint',
            };
        },
        selectionIndex(): number {
            const index = this.stagingStore.selectedStagedItemIds.indexOf(this.invType.typeId!);
            return index >= 0 ? index + 1 : 0;
        }
    },
    methods: {        handleClick(event: MouseEvent) {
            event.preventDefault();

            // Skip selection syncing for blueprint variant
            if (this.variant === 'blueprint') {
                return;
            }

            if (event.ctrlKey || event.metaKey) {
                // Multi-select mode: toggle this item
                this.stagingStore.toggleItemSelection(this.invType.typeId!);
            } else if (event.shiftKey && this.stagingStore.hasSelection) {
                // Range select mode (optional enhancement)
                this.handleRangeSelect();
            } else {
                // Single select mode: clear others and select this one
                this.stagingStore.selectSingleItem(this.invType.typeId!);
            }
        },

        handleRangeSelect() {
            // Find the range between the last selected item and this one
            const allItems = this.stagingStore.stagedItems;
            const currentIndex = allItems.findIndex(item => item.typeId === this.invType.typeId);
            const selectedIds = this.stagingStore.selectedStagedItemIds;

            if (selectedIds.length > 0) {
                // Find the index of the last selected item
                let lastSelectedIndex = -1;
                for (let i = allItems.length - 1; i >= 0; i--) {
                    if (selectedIds.includes(allItems[i].typeId!)) {
                        lastSelectedIndex = i;
                        break;
                    }
                }

                if (lastSelectedIndex >= 0) {
                    const startIndex = Math.min(currentIndex, lastSelectedIndex);
                    const endIndex = Math.max(currentIndex, lastSelectedIndex);

                    // Select all items in the range
                    const rangeIds = allItems
                        .slice(startIndex, endIndex + 1)
                        .map(item => item.typeId!);

                    this.stagingStore.selectMultipleItems(rangeIds);
                }
            }
        }, handleDragStart(event: DragEvent) {
            this.isDragging = true;
            this.stagingStore.isDragging = true;

            // Determine what items to drag
            const itemsToDrag = this.isSelected
                ? this.stagingStore.getSelectedItemsData()
                : [this.invType];

            // If this item isn't selected but others are, select it for the drag
            if (!this.isSelected && this.stagingStore.hasSelection) {
                this.stagingStore.selectItem(this.invType.typeId!);
            }

            // Show the drag preview element and use it as the drag image
            if (event.dataTransfer) {
                this.showDragPreview = true;

                // Wait for the next tick to ensure the element is rendered
                this.$nextTick(() => {
                    const dragPreview = this.$refs.dragPreview as HTMLElement;
                    if (dragPreview) {
                        event.dataTransfer!.setDragImage(dragPreview, 0, 0);

                        // Hide the preview after the drag image is captured
                        setTimeout(() => {
                            this.showDragPreview = false;
                        }, 0);
                    }
                });
            }

            // Prepare drag data
            const dragData = itemsToDrag.map(item => ({
                typeId: item.typeId,
                typeName: item.typeName,
                marketGroupId: item.marketGroupId,
                // Add any other relevant data
            }));

            // Set drag data in multiple formats for compatibility
            if (event.dataTransfer) {
                // Plain text format
                event.dataTransfer.setData('text/plain',
                    dragData.map(item => item.typeName).join('\n')
                );

                // JSON format for structured data
                event.dataTransfer.setData('application/json', JSON.stringify(dragData));

                // Custom format for internal use
                event.dataTransfer.setData('application/x-inv-types', JSON.stringify(dragData));

                event.dataTransfer.effectAllowed = 'move';
            }

            // Update store drag state with initial position
            this.stagingStore.startDrag({ x: event.clientX, y: event.clientY });

            console.log(`Dragging ${itemsToDrag.length} items:`, dragData);
        },        handleDragEnd() {
            this.isDragging = false;
            this.showDragPreview = false;
            this.stagingStore.isDragging = false;
            this.stagingStore.endDrag();
        },

        // Blueprint variant methods
        handleIncreaseCount() {
            this.$emit('increase-count', this.invType.typeId);
        },

        handleDecreaseCount() {
            this.$emit('decrease-count', this.invType.typeId);
        },

        handleRemove() {
            this.$emit('remove', this.invType.typeId);
        }
    },
});
</script>

<style scoped>
.drag-preview {
    position: absolute;
    pointer-events: none;
    z-index: 1000;
    padding: 0.25rem;
}

.drag-preview--hidden {
    top: -1000px;
    left: -1000px;
}

.drag-preview__inner {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to right, var(--flame) 50%, var(--burnt-sienna) 95%);
    color: var(--white);
    font-size: 0.7rem;
    width: 80px;
    height: 30px;
    border: 1px solid var(--burnt-sienna);
    border-radius: 0.5rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    box-shadow:
        1px 1px 3px 1px var(--mid-night),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    user-select: none;
    font-weight: 600;
    opacity: 0.9;
    mix-blend-mode: plus-lighter;
    position: relative;
    overflow: hidden;
}

.inv-type-slip {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 64px;
    height: 110px;
    background-color: var(--jet);
    justify-content: flex-start;
    user-select: none;
    cursor: pointer;
    transition: all 0.15s ease;
    border: 1px solid var(--translucent-white-1);
    border-radius: 0.5rem;    overflow: hidden;
    will-change: transform, opacity;
    /* Performance: Use transform3d to trigger hardware acceleration */
    transform: translate3d(0, 0, 0);
    /* Performance: Prevent layout thrashing */
    contain: layout style paint;
}

.inv-type-slip::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 0px solid transparent;
    pointer-events: none;
    border-radius: 0.5rem;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.inv-type-slip:hover {
    color: var(--platinum);
    /* transform: translateY(-1px); */
}

.inv-type-slip:hover::after {
    border: 1px solid var(--turquoise);
}

.inv-type-slip:active::after {
    box-shadow: 0 0 3px 3px var(--turquoise) inset;
}

.inv-type-slip__icon {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -1px;
}

.inv-type-slip__icon img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.inv-type-slip__name-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 2px;
}

.inv-type-slip__name {
    text-align: center;
    font-size: 0.6rem;
    color: var(--gray);
    word-wrap: break-word;
    line-height: 1.1;
}

.inv-type-slip--selected {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: var(--flame);
    box-shadow: 0 2px 8px rgba(235, 94, 40, 0.3);
}

.inv-type-slip--selected .inv-type-slip__name {
    color: var(--flame);
    text-shadow: 0 0 0.5px currentColor;
    font-weight: bold;
}

.inv-type-slip--dragging {
    transform: scale(0.95);
    opacity: 0.7;
    filter: brightness(0.8);
    transition: transform 0.08s ease-out, opacity 0.08s ease-out, filter 0.08s ease-out;
    will-change: transform, opacity, filter;
    /* Optimized multi-property approach with faster transitions */
}

.inv-type-slip--dragging-simple {
    opacity: 0.5;
    transition: opacity 0.05s ease;
    /* Minimal performance impact for large selections */
}

/* Blueprint variant styles */
.inv-type-slip--blueprint {
    width: auto;
    height: 64px;
    flex-direction: row;
    align-items: center;
    gap: 0;
    padding: 0;
    padding-right: 3rem; /* Make room for remove button and counter */
    min-width: 200px;
    position: relative;
}

.inv-type-slip--blueprint .inv-type-slip__icon {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    margin-top: 0;
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    overflow: hidden;
}

.inv-type-slip--blueprint .inv-type-slip__name-wrapper {
    flex: 1;
    padding: 0;
    align-items: flex-start;
    justify-content: flex-start;
    text-align: left;
    padding-left: 0.5rem;
}

.inv-type-slip--blueprint .inv-type-slip__name {
    font-size: 0.7rem;
    color: var(--flame);
    text-shadow: 0 0 0.5px currentColor;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.2;
    text-align: left;
}

/* Counter styling */
.inv-type-slip__counter {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 0;
    position: absolute;
    bottom: 0.25rem;
    right: 0.25rem;
}

.counter-btn {
    background-color: var(--eerie-black);
    color: var(--gray);
    border: 1px solid var(--translucent-white-1);
    border-radius: 0.25rem;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.7rem;
    font-weight: bold;
    transition: all 0.15s ease;
    user-select: none;
    position: relative;
}

.counter-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 0px solid transparent;
    pointer-events: none;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.counter-btn:hover {
    color: var(--platinum);
    background-color: var(--jet);
}

.counter-btn:hover::after {
    border: 1px solid var(--turquoise);
}

.counter-btn:active::after {
    box-shadow: 0 0 2px 2px var(--turquoise) inset;
}

.counter-btn--increase:hover {
    color: var(--turquoise);
}

.counter-btn--decrease:hover {
    color: var(--flame);
}

.counter-value {
    font-size: 0.7rem;
    color: var(--platinum);
    font-weight: 500;
    min-width: 18px;
    text-align: center;
    user-select: none;
}

/* Remove button styling */
.inv-type-slip__remove {
    background-color: var(--eerie-black);
    color: var(--gray);
    border: 1px solid var(--translucent-white-1);
    border-radius: 0.5rem;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: bold;
    transition: all 0.15s ease;
    flex-shrink: 0;
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    user-select: none;
}

.inv-type-slip__remove::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 0px solid transparent;
    pointer-events: none;
    border-radius: 0.5rem;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.inv-type-slip__remove:hover {
    color: var(--platinum);
}

.inv-type-slip__remove:hover::after {
    border: 1px solid var(--turquoise);
}

.inv-type-slip__remove:active::after {
    box-shadow: 0 0 3px 3px var(--turquoise) inset;
}
</style>