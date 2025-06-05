<template>
    <div class="staging">
        <ul class="items"
            v-on:mousedown="activateDragSelector"
            v-on:mousemove="updateDragSelector"
            v-on:mouseup="deactivateDragSelector"
            >
            <!-- v-on:mouseleave="deactivateDragSelector" -->
            <!-- startX {{ startX }}, startY {{ startY }} -->
            <inv-type-slip v-for="item in stagedTypes" :invType="item" />
            <div class="drag-selector" v-bind:style="dragSelectorStyles"></div>
        </ul>
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
            mousedown: false,
            startX: 0,
            startY: 0,
            dragSelectorStyles: {
                left: '0px',
                top: '0px',
                width: '0px',
                height: '0px',
                display: 'none',
            },
        };
    },
    computed: {
        stagingStore() {
            return useStagingState();
        },
        stagedTypes() {
            return this.stagingStore.stagedItems
        },
        esiService() {
            return esiService;
        },
    },
    components: {
        InvTypeSlip
    },
    methods: {
        logMousePosition(event: MouseEvent) {
            const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            console.log("Mouse position:", mouseX, mouseY);
        },
        activateDragToSelect(event: MouseEvent) {
            this.mousedown = true;
            this.dragBoxStyle.display = 'block';

            // Store initial mouse position as the anchor point
            const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            this.startX = event.clientX - rect.left;
            this.startY = event.clientY - rect.top;

            // Initialize the drag box at the anchor point with zero size
            this.dragBoxStyle.left = `${this.startX}px`;
            this.dragBoxStyle.top = `${this.startY}px`;
            this.dragBoxStyle.width = '0px';
            this.dragBoxStyle.height = '0px';

            console.log("Drag to select activated at:", this.startX, this.startY);
        },
        deactivateDragToSelect() {
            this.mousedown = false;
            this.dragBoxStyle.display = 'none';
            this.dragBoxStyle.width = '0px';
            this.dragBoxStyle.height = '0px';
        },
        updateDragToSelect(event: MouseEvent) {
            if (!this.mousedown) return;

            const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            const currentX = event.clientX - rect.left;
            const currentY = event.clientY - rect.top;

            // Calculate width and height based on difference between start position and current position
            const width = Math.abs(currentX - this.startX);
            const height = Math.abs(currentY - this.startY);

            // Determine the top-left corner of the box based on direction of drag
            let left, top;

            // If dragging to the left/up from starting point
            if (currentX < this.startX) {
                left = currentX;
            } else {
                left = this.startX;
            }

            if (currentY < this.startY) {
                top = currentY;
            } else {
                top = this.startY;
            }

            // Update the drag box style
            this.dragBoxStyle.left = `${left}px`;
            this.dragBoxStyle.top = `${top}px`;
            this.dragBoxStyle.width = `${width}px`;
            this.dragBoxStyle.height = `${height}px`;
        },
    },
});
</script>
<style scoped>

.items.mousedown {
    cursor: grabbing;
    background-color: var(--translucent-white-1);
}
.staging {
    padding: 10px;
    flex: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.drag-to-select-box {
    position: absolute;
    border: 1px solid var(--flame);
    background-color: rgba(255, 69, 0, 0.2);
    pointer-events: none;
    z-index: 10;
    display: none; /* Initially hidden */
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
</style>