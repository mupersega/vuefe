<template>
    <div class="app-container">
        <Sidebar v-if="layoutStore.sidebar" />
        <main :class="{ 
            'drawer-open': layoutStore.leftDrawer,
            'top-drawer-open': layoutStore.topDrawer 
        }">
            <LayoutControls />
            <Transition name="drawer">
                <div class="left-drawer" v-show="layoutStore.leftDrawer">
                    <div class="drawer-accent" :class="{'new': layoutStore.leftDrawer}"></div>
                    <FilterHousing/>
                </div>
            </Transition>
            <div class="main-right">
                <Transition name="top-drawer">
                    <div class="top-drawer" v-show="layoutStore.topDrawer">
                        <div class="drawer-accent-top" :class="{'new': layoutStore.topDrawer}"></div>
                        <SearchControls />
                        <Staging />
                    </div>
                </Transition>
                <div class="page-content" :class="{ 'has-top-drawer': layoutStore.topDrawer }">
                    <slot></slot>
                </div>
            </div>
        </main>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Sidebar from '@components/Sidebar/Sidebar.vue';
import SearchControls from '@components/SearchControls/SearchControls.vue';
import FilterHousing from '@components/FilterHousing/FilterHousing.vue';
import LayoutControls from '@components/LayoutControls/LayoutControls.vue';
import Staging from '../components/Staging/Staging.vue';

import { useLayout } from '@stores/index';

export default defineComponent({
    name: 'MainLayout',
    components: {
        Sidebar,
        SearchControls,
        FilterHousing,
        LayoutControls,
        Staging,
    },
    computed: {
        layoutStore() {
            return useLayout();
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

/* Ensure sidebar maintains its shadow and proper z-index */
#sidebar {
    z-index: 20; /* Higher than drawer but lower than controls */
    position: relative; /* Ensure z-index applies correctly */
}

.main-right {
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    flex: 1;
    /* Position context for absolute positioned elements */
    position: relative;
}

.sidebar {
    grid-area: nav;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
}

.drawer-controls {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 30;
}

.drawer-controls .drawer-toggle {
    background-color: var(--jet);
    color: var(--translucent-white-2);
    border: none;
    padding: 10px;
    aspect-ratio: 1 / 1;
    cursor: pointer;
    font-size: 0.9rem;
}

main {
    grid-area: main;
    display: flex;
    flex-direction: row;
    position: relative;
    overflow: hidden; /* Changed from hidden to allow pseudo-elements to be visible */
}

.left-drawer {
    display: flex;
    background-color: var(--jet);
    box-shadow: 0 0 3px 1px var(--night);
    z-index: 11;
    width: 300px;
    overflow: visible;
    will-change: transform, opacity;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 1px;
}

.drawer-accent {
    position: absolute;
    top: 0;
    left: -2px;
    width: 2px;
    height: 100%;
    background-color: var(--flame);
    z-index: 11;    transition: opacity 0.5s 0.2s cubic-bezier(0.25, 1.5, 0.5, 1);
    opacity: 1;
}

/* Vue transition classes for the drawer */
.drawer-enter-active,
.drawer-leave-active {
    transition: transform 0.3s cubic-bezier(0.25, 1.1, 0.5, 1);
    pointer-events: none; /* Prevent interaction during animation */
}

.drawer-enter-from,
.drawer-leave-to {
    transform: translateX(-105%);
}

.drawer-enter-to,
.drawer-leave-from {
    transform: translateX(0);
}

.page-content {
    margin-left: 0;
}

/* Apply styles when drawer is open */
main.drawer-open .main-right {
    margin-left: 300px;
}

/* Apply styles when drawer is open */
.main-right {
    transition: margin-left 0.3s cubic-bezier(0.25, 1.1, 0.5, 1), margin-top 0.3s cubic-bezier(0.25, 1.1, 0.5, 1);
    will-change: margin-left, margin-top;
}

/* Top drawer styles */
.top-drawer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: var(--jet);
    box-shadow: 0 0 3px 1px var(--night);
    overflow: visible;
    height: var(--top-drawer-height);
    width: 100%;
}

.drawer-accent-top {
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    height: 1px;
    background-color: var(--flame);
    z-index: 11;
    opacity: 1;
}

.top-drawer-enter-active,
.top-drawer-leave-active {
    transition: transform 0.3s cubic-bezier(0.25, 1.1, 0.5, 1);
    pointer-events: none; /* Prevent interaction during animation */
}

.top-drawer-enter-from,
.top-drawer-leave-to {
    transform: translateY(-105%);
}

.top-drawer-enter-to,
.top-drawer-leave-from {
    transform: translateY(0);
}

/* The page content is placed directly in the flow after the top bar */
.page-content {
    position: relative;
    flex: 1;
    display: flex;
    overflow-y: scroll;
    height: 100%;
    align-items: center;
    justify-content: center;
    margin-top: 0;
    transition: margin-top 0.3s cubic-bezier(0.25, 1.1, 0.5, 1);
    will-change: margin-top;
}

.page-content.has-top-drawer {
    margin-top: var(--top-drawer-height);
}
</style>
