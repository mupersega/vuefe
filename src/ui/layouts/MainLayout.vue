<template>
    <div class="app-container">
        <Sidebar />
        <main>
            <div class="top-bar" v-if="showSearchControls">
                <SearchControls />
                <FilterHousing />
                <!-- <div class="staging">
                    <div class="item"
                    v-for="item in stagingItems">
                    item: {{ item.typeName }} - {{ item.typeId }}
                    </div>
                </div> -->
            </div>
            <div class="page-content">
                <slot></slot>
            </div>
        </main>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Sidebar from '@components/sidebar/Sidebar.vue';
import SearchControls from '@components/searchControls/SearchControls.vue';
import { useStagingStore } from '@/stores/useStagingStore';
import FilterHousing from '../components/filterHousing/FilterHousing.vue';

export default defineComponent({
    name: 'MainLayout',
    components: {
        Sidebar,
        SearchControls,
        FilterHousing
    },
    props: {
        showSearchControls: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        stagingStore() {
            return useStagingStore();
        },
        stagingItems() {
            return this.stagingStore.stagedItems;
        },
    },
});
</script>

<style scoped>
.app-container {
    display: grid;
    grid-template-columns: min-content 3fr;
    grid-template-rows: 1fr;
    grid-template-areas:
        "nav main";
    height: 100vh;
    width: 100vw;
    position: relative;
}

.top-bar {
    grid-area: top-bar;
    display: flex;
    flex-direction: row;
}

main {
    grid-area: main;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
}

.page-content {
    display: flex;
    overflow-y: scroll;
    height: 100%;
    align-items: center;
    justify-content: center;
}

</style>
