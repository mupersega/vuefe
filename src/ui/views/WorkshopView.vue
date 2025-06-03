<template>
    <div class="main-view">
        <h1>Workshop</h1>
        <p>This is the draft view where you can manage your drafts.</p>
        <div class="staging">
            <div class="items">
                <h2>Staged Items</h2>
                <ul>
                    <li v-for="(item, index) in stagedTypes" :key="index">
                        {{ item.typeId }} ({{ item.typeName }})
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useStagingState } from "@/stores/useStagingStore";

export default defineComponent({
    name: "WorkshopView",
    data() {
    },
    computed: {
        stagingStore() {
            return useStagingState();
        },
        stagedTypes() {
            return this.stagingStore.stagedItems
        },
    },
});
</script>
<style>
.main-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    width: 100%;
    height: 100%;
}
</style>