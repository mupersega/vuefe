<template>
    <div class="inv-type-slip-wrapper" :class="{ 'inv-type-slip-wrapper--product': variant === 'product' }">
        <div class="inv-type-slip" :class="cssClasses" :draggable="isDraggable" @click="handleClick"
            @dragstart="handleDragStart" @dragend="handleDragEnd">
            <div class="inv-type-slip__icon">
                <!-- @ts-ignore Type coercion issue with null vs undefined -->
                <img v-if="imageUrl" :src="imageUrl || ''" />
                <div v-else class="inv-type-slip__icon-placeholder">
                    📦
                </div>
            </div>
            <div class="inv-type-slip__name-wrapper">
                <div class="inv-type-slip__name">
                    {{ invType.typeName }}
                </div>
            </div> <!-- Selection counter for default variant (staging items) -->
            <div v-if="variant === 'default' && productCount > 0" class="inv-type-slip__selection-counter">
                {{ productCount }}
            </div>
        </div>

        <!-- product variant actions section -->
        <div v-if="variant === 'product'" class="inv-type-slip-actions">
            <!-- Counter controls -->
            <div v-if="showCounter" class="inv-type-slip__counter"> <button class="counter-btn counter-btn--decrease"
                    @click.stop="handleDecreaseCount($event)"
                    title="Decrease count (Ctrl+Click: -10, Shift+Click: affect all selected)">
                    −
                </button>
                <span class="counter-value" :class="animationClass">{{ count || 1 }}</span>
                <button class="counter-btn counter-btn--increase" @click.stop="handleIncreaseCount($event)"
                    title="Increase count (Ctrl+Click: +10, Shift+Click: affect all selected)">
                    +
                </button>
            </div>

            <!-- Remove button -->
            <button v-if="showRemove" class="inv-type-slip__remove" @click.stop="handleRemove" title="Remove product">
                ×
            </button>
        </div>
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
import { useWorkshopState } from "@/stores/useWorkshopStore";

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
            type: String as PropType<'default' | 'product'>,
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
    }, emits: ['increase-count', 'decrease-count', 'remove'], data() {
        return {
            isDragging: false,
            showDragPreview: false,
            animationClass: '',
            lastKnownCount: 0
        };
    }, computed: {
        esiService() {
            return esiService;
        },        // Computed property for image URL with smart fallback
        imageUrl(): string {
            const typeId = this.invType.typeId;
            if (!typeId) return '';

            // Use different strategies based on variant
            if (this.variant === 'product') {
                // For product variant, prefer product images
                const url = this.esiService.getBlueprintOriginalUrl(typeId);
                return url || '';
            } else {
                // For default variant, prefer type icons
                const url = this.esiService.getTypeIconUrl(typeId);
                return url || '';
            }
        },

        stagingStore() {
            return useStagingState();
        },
        workshopStore() {
            return useWorkshopState();
        }, isSelected(): boolean {
            if (this.variant === 'product') {
                return this.workshopStore.isProductSelected(this.invType.typeId!);
            }
            return this.stagingStore.isItemSelected(this.invType.typeId!);
        }, isDraggingThis(): boolean {
            // Add a small performance optimization by caching this computation
            return this.isSelected && this.stagingStore.isDragging;
        },
        isDraggable(): boolean {
            // product variant is not draggable by default
            return this.variant !== 'product';
        }, cssClasses(): Record<string, boolean> {
            // Performance optimization: use configurable threshold for drag effects
            const threshold = this.stagingStore.performanceSettings.dragJuiceThreshold;
            const advancedEnabled = this.stagingStore.performanceSettings.enableAdvancedDragJuice;
            const isDragging = this.isDraggingThis;
            const isLargeSelection = this.stagingStore.selectedItemCount > threshold;

            return {
                'inv-type-slip--selected': this.isSelected,
                'inv-type-slip--dragging': isDragging && !isLargeSelection && advancedEnabled,
                'inv-type-slip--dragging-simple': isDragging && (isLargeSelection || !advancedEnabled),
                'inv-type-slip--product': this.variant === 'product',
            };
        }, selectionIndex(): number {
            if (this.variant === 'product') {
                const index = this.workshopStore.selectedProductIds.indexOf(this.invType.typeId!);
                return index >= 0 ? index + 1 : 0;
            }
            const index = this.stagingStore.selectedStagedItemIds.indexOf(this.invType.typeId!);
            return index >= 0 ? index + 1 : 0;
        },

        productCount(): number {
            const product = this.workshopStore.getProductById(this.invType.typeId!);
            return product ? product.count : 0;
        }
    },

    watch: {
        count: {
            handler(newCount, oldCount) {
                if (this.variant === 'product' && oldCount !== undefined && newCount !== oldCount) {
                    this.triggerCountAnimation(newCount > oldCount);
                }
            },
            immediate: false
        }
    },

    mounted() {
        // Initialize the last known count to prevent initial animation
        if (this.variant === 'product') {
            this.lastKnownCount = this.count || 1;
        }
    }, methods: {
        // Counter animation method
        triggerCountAnimation(isIncrease: boolean) {
            // Clear any existing animation
            this.animationClass = '';

            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                this.animationClass = isIncrease ? 'counter-increase' : 'counter-decrease';

                // Clear animation class after animation completes
                setTimeout(() => {
                    this.animationClass = '';
                }, 150); // Shorter duration for subtlety
            });
        },

        handleClick(event: MouseEvent) {
            event.preventDefault(); if (this.variant === 'product') {
                // Product selection logic
                if (event.ctrlKey || event.metaKey) {
                    // Multi-select mode: toggle this product
                    this.workshopStore.toggleProductSelection(this.invType.typeId!);
                } else if (event.shiftKey && this.workshopStore.hasSelection) {
                    // Range select mode
                    this.handleproductRangeSelect();
                } else {
                    // Single select mode: clear others and select this one
                    this.workshopStore.selectSingleProduct(this.invType.typeId!);
                }
            } else {
                // Staging item selection logic
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
                        .map(item => item.typeId!); this.stagingStore.selectMultipleItems(rangeIds);
                }
            }
        },

        handleproductRangeSelect() {
            // Find the range between the last selected product and this one
            const allproducts = this.workshopStore.sortedProducts;
            const currentIndex = allproducts.findIndex(bp => bp.typeId === this.invType.typeId);
            const selectedIds = this.workshopStore.selectedProductIds;

            if (selectedIds.length > 0) {
                // Find the index of the last selected product
                let lastSelectedIndex = -1;
                for (let i = allproducts.length - 1; i >= 0; i--) {
                    if (selectedIds.includes(allproducts[i].typeId!)) {
                        lastSelectedIndex = i;
                        break;
                    }
                }

                if (lastSelectedIndex >= 0) {
                    const startIndex = Math.min(currentIndex, lastSelectedIndex);
                    const endIndex = Math.max(currentIndex, lastSelectedIndex);

                    // Select all products in the range
                    const rangeIds = allproducts
                        .slice(startIndex, endIndex + 1)
                        .map(bp => bp.typeId!);

                    this.workshopStore.selectMultipleProducts(rangeIds);
                }
            }
        },

        handleDragStart(event: DragEvent) {
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
        }, handleDragEnd() {
            this.isDragging = false;
            this.showDragPreview = false;
            this.stagingStore.isDragging = false;
            this.stagingStore.endDrag();
        },        // product variant methods
        handleIncreaseCount(event: MouseEvent) {
            const increment = event.ctrlKey || event.metaKey ? 10 : 1;

            if (event.shiftKey && this.workshopStore.hasSelection && this.workshopStore.isProductSelected(this.invType.typeId!)) {
                // Shift+click: affect all selected products
                this.workshopStore.increaseSelectedProductsCount(increment);
            } else {
                // Normal click: affect only this product
                this.$emit('increase-count', this.invType.typeId, increment);
            }
        },

        handleDecreaseCount(event: MouseEvent) {
            const decrement = event.ctrlKey || event.metaKey ? 10 : 1;

            if (event.shiftKey && this.workshopStore.hasSelection && this.workshopStore.isProductSelected(this.invType.typeId!)) {
                // Shift+click: affect all selected products
                this.workshopStore.decreaseSelectedProductsCount(decrement);
            } else {
                // Normal click: affect only this product
                this.$emit('decrease-count', this.invType.typeId, decrement);
            }
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

/* Wrapper for product variant to contain card and actions */
.inv-type-slip-wrapper {
    display: contents;
    /* For default variant, wrapper doesn't affect layout */
}

.inv-type-slip-wrapper--product {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0;
    position: relative;
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
    border-radius: 0.5rem;
    overflow: hidden;
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

/* Handle missing/broken images */
.inv-type-slip__icon img[src=""],
.inv-type-slip__icon img:not([src]) {
    display: none;
}

.inv-type-slip__icon img[src=""]:after,
.inv-type-slip__icon img:not([src]):after {
    content: "📦";
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: var(--gray);
    opacity: 0.5;
}

/* Placeholder for when no image is available */
.inv-type-slip__icon-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 2rem;
    color: var(--gray);
    opacity: 0.3;
    user-select: none;
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
}

/* product variant styles */
.inv-type-slip--product {
    width: auto;
    height: 64px;
    flex-direction: row;
    align-items: center;
    gap: 0;
    padding: 0;
    min-width: 120px;
    /* Minimum width for product cards */
    max-width: 280px;
    width: 100%;
    position: relative;
}

/* Actions section for product variant */
.inv-type-slip-actions {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    flex-shrink: 0;
    border: none;
    position: relative;
    margin-top: 0;
    /* Actions sit below the card */
    margin-right: 0.5rem;
    /* Push actions in from the right edge */
}

.inv-type-slip--product .inv-type-slip__icon {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    margin-top: 0;
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    overflow: hidden;
}

.inv-type-slip--product .inv-type-slip__name-wrapper {
    flex: 1;
    padding: 0;
    align-items: center;
    justify-content: flex-start;
    text-align: left;
    padding-left: 0.5rem;
    padding-top: 0.125rem;
    /* Slight offset towards top */
}

.inv-type-slip--product .inv-type-slip__name {
    font-size: 0.7rem;
    color: var(--gray);
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.2;
    text-align: left;
}

.inv-type-slip--product.inv-type-slip--selected .inv-type-slip__name {
    color: var(--flame);
    text-shadow: 0 0 0.5px currentColor;
}

/* Counter styling */
.inv-type-slip__counter {
    display: flex;
    align-items: center;
    gap: 0.125rem;
    flex-shrink: 0;
    background-color: var(--translucent-white-03);
    border: 1px solid var(--translucent-white-1);
    border-top: none;
    /* Remove top border for cleaner connection */
    border-radius: 0 0 0.375rem 0.375rem;
    /* Only bottom corners rounded */
    padding: 0.25rem 0.375rem;
    user-select: none;
    transition: all 0.15s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
}

/* Counter container hover effect, similar to custom components */
.inv-type-slip__counter::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 0px solid transparent;
    pointer-events: none;
    border-radius: 0 0 0.375rem 0.375rem;
    /* Match parent border radius */
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.inv-type-slip__counter:hover::after {
    border: 1px solid var(--turquoise);
}

.counter-btn {
    background-color: transparent;
    color: var(--gray);
    border: 1px solid var(--translucent-white-3);
    border-radius: 0.25rem;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.6rem;
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
    background-color: rgba(255, 255, 255, 0.05);
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
    font-size: 0.6rem;
    color: var(--flame);
    text-shadow: 0 0 0.5px currentColor;
    font-weight: 600;
    min-width: 16px;
    text-align: center;
    user-select: none;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.15s ease;
    will-change: transform;
    padding: 0 0.125rem;
}

/* Counter animation classes */
.counter-increase {
    animation: counterPulseUp 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    color: var(--turquoise);
}

.counter-decrease {
    animation: counterPulseDown 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    color: var(--flame);
}

/* Counter animations - more subtle for rapid clicks */
@keyframes counterPulseUp {
    0% {
        transform: scale(1);
        color: var(--platinum);
    }

    50% {
        transform: scale(1.15) translateY(-1px);
        color: var(--turquoise);
        text-shadow: 0 0 3px rgba(64, 224, 208, 0.5);
    }

    100% {
        transform: scale(1);
        color: var(--turquoise);
    }
}

@keyframes counterPulseDown {
    0% {
        transform: scale(1);
        color: var(--platinum);
    }

    50% {
        transform: scale(1.15) translateY(-1px);
        color: var(--flame);
        text-shadow: 0 0 3px rgba(235, 94, 40, 0.5);
    }

    100% {
        transform: scale(1);
        color: var(--flame);
    }
}

/* Remove button styling */
.inv-type-slip__remove {
    background-color: var(--translucent-white-03);
    color: var(--gray);
    border: 1px solid var(--translucent-white-1);
    border-top: none;
    /* Remove top border for cleaner connection */
    border-radius: 0 0 0.375rem 0.375rem;
    /* Only bottom corners rounded */
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: bold;
    transition: all 0.15s ease;
    flex-shrink: 0;
    user-select: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
}

.inv-type-slip__remove::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 0px solid transparent;
    pointer-events: none;
    border-radius: 0 0 0.375rem 0.375rem;
    /* Match parent border radius */
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.inv-type-slip__remove:hover {
    color: var(--platinum);
    background-color: rgba(255, 255, 255, 0.05);
}

.inv-type-slip__remove:hover::after {
    border: 1px solid var(--turquoise);
}

.inv-type-slip__remove:active::after {
    box-shadow: 0 0 3px 3px var(--turquoise) inset;
}

/* Selection counter styling for default variant */
.inv-type-slip__selection-counter {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    background-color: var(--flame);
    color: var(--white);
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    user-select: none;
    z-index: 2;
}
</style>