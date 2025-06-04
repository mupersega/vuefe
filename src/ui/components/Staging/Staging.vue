<template>
    <div class="staging">
        <ul class="items">
            <li v-for="(item, index) in stagedTypes" :key="index" class="inventory-item" :title="item.typeName!">
                {{ item.typeId }}
                <img v-img-loaded :src="esiService.getTypeIconUrl(item.typeId)"/>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useStagingState } from "@/stores/useStagingStore";
import esiService from "@/services/esiService";

export default defineComponent({
    name: "StagingView",
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
.items {
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