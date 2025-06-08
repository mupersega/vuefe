<template>
    <div class="inv-type-slip" :class="{
        'inv-type-slip--selected': isSelected,
        'inv-type-slip--dragging': isDragging
    }" :draggable="true" @click="handleClick" @mouseenter="processMouseEnter" @dragstart="handleDragStart"
        @dragend="handleDragEnd">        <div class="inv-type-slip__icon">
            <img :src="esiService.getBlueprintOriginalUrl(invType.typeId)" alt="Type Icon" />
        </div>
        <div class="inv-type-slip__name-wrapper">
            <div class="inv-type-slip__name">
                {{ invType.typeName }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import esiService from "@/services/esiService";
import { type InvTypeDto } from "@api-client/models/inv-type-dto";
import { useStagingState } from "@/stores/useStagingStore";

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
        }
    },
    data() {
        return {
            isDragging: false
        };
    },
    computed: {
        esiService() {
            return esiService;
        },
        stagingStore() {
            return useStagingState();
        },
        isSelected(): boolean {
            return this.stagingStore.isItemSelected(this.invType.typeId!);
        },
        selectionIndex(): number {
            const index = this.stagingStore.selectedStagedItemIds.indexOf(this.invType.typeId!);
            return index >= 0 ? index + 1 : 0;
        }
    },
    methods: {
        handleClick(event: MouseEvent) {
            event.preventDefault();

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
        },

        processMouseEnter() {
            if (this.parentMouseDown) {
                this.stagingStore.selectItem(this.invType.typeId!);
            }
        }, handleDragStart(event: DragEvent) {
            this.isDragging = true;

            // Determine what items to drag
            const itemsToDrag = this.isSelected
                ? this.stagingStore.getSelectedItemsData()
                : [this.invType];            // If this item isn't selected but others are, select it for the drag
            if (!this.isSelected && this.stagingStore.hasSelection) {
                this.stagingStore.selectItem(this.invType.typeId!);
            }            // Hide the browser's default drag image by setting a transparent image
            if (event.dataTransfer) {
                // Create a transparent image element and add it to DOM temporarily
                const transparentImg = document.createElement('img');
                transparentImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
                transparentImg.style.position = 'absolute';
                transparentImg.style.top = '-1000px';
                transparentImg.style.left = '-1000px';
                transparentImg.style.width = '1px';
                transparentImg.style.height = '1px';
                transparentImg.style.opacity = '0';
                
                // Add to DOM, set as drag image, then remove
                document.body.appendChild(transparentImg);
                event.dataTransfer.setDragImage(transparentImg, 0, 0);
                
                // Remove from DOM after a short delay
                setTimeout(() => {
                    if (transparentImg.parentNode) {
                        transparentImg.parentNode.removeChild(transparentImg);
                    }
                }, 0);
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
        },

        handleDragEnd() {
            this.isDragging = false;
            this.stagingStore.endDrag();
        }
    },
});
</script>

<style scoped>
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
    overflow: hidden; /* Clip content to prevent images from poking out */
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
    transform: translateY(-1px);
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
    opacity: 0.6;
    transform: rotate(2deg) scale(0.95);    z-index: 1000;
}
</style>