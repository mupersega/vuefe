<template>
    <div class="app-container">
        <Sidebar v-if="layoutStore.isSidebarOpen" />
        <main :class="{ 'drawer-open': layoutStore.isRightDrawerOpen }">
            <LayoutControls />
            <Transition name="drawer">
                <div class="left-drawer" v-show="layoutStore.isRightDrawerOpen">
                    <div class="drawer-accent" :class="{'new': layoutStore.isRightDrawerOpen}"></div>
                    <FilterHousing/>
                </div>
            </Transition>
            <div class="top-bar" v-if="layoutStore.isSearchControlsOpen">
                <SearchControls />
            </div>
            <div class="page-content">
                <slot></slot>
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

import { useLayout } from '@stores/index';

export default defineComponent({
    name: 'MainLayout',
    components: {
        Sidebar,
        SearchControls,
        FilterHousing,
        LayoutControls
    },
    props: {
        showSearchControls: {
            type: Boolean,
            default: false
        },
        showDrawer: {
            type: Boolean,
            default: false
        },
        drawerOpen: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            drawerOpen: false,
        };
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

.top-bar {
    grid-area: top-bar;
    display: flex;
    flex-direction: row;
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
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 10;
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
    z-index: 11;
    transition: opacity 0.5s 0.2s cubic-bezier(0.25, 1.5, 0.5, 1);
    opacity: 1;

    @starting-style {
        opacity: 0;
    }
}

/* Vue transition classes for the drawer */
.drawer-enter-active,
.drawer-leave-active {
    transition: transform 0.3s cubic-bezier(0.25, 1.1, 0.5, 1);
    pointer-events: none; /* Prevent interaction during animation */
}

.drawer-enter-from,
.drawer-leave-to {
    transform: translateX(-100%);
}

.drawer-enter-to,
.drawer-leave-from {
    transform: translateX(0);
}

.page-content {
    display: flex;
    overflow-y: scroll;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex: 1;
    transition: margin-left 0.3s cubic-bezier(0.68, 0, 0.265, 1.2);
    margin-left: 0;
}

/* Apply styles when drawer is open */
main.drawer-open .page-content {
    margin-left: 300px;
}

/* Ensure content adjusts during transitions */
main.drawer-open .drawer-enter-active ~ .page-content,
main .drawer-leave-active ~ .page-content {
    transition: margin-left 0.2s ease-in-out;
}

</style>
