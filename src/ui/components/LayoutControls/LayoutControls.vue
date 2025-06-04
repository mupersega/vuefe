<template>
    <div class="layout-controls">
        <button 
            class="control-button" 
            :class="{ 'selected': layoutStore.leftDrawer }" 
            @click="layoutStore.toggleLeftDrawer()"
        >
            <div class="button-content">
                <font-awesome-icon :icon="['fas', 'filter']" />
            </div>
        </button>
        <button 
            class="control-button" 
            :class="{ 'selected': layoutStore.topDrawer }" 
            @click="layoutStore.toggleTopDrawer()"
        >
            <div class="button-content">
                <font-awesome-icon :icon="['fas', 'search']" />
            </div>
        </button>
        <button class="control-button">
            <div class="button-content">
                <font-awesome-icon :icon="['fas', 'cog']" />
            </div>
        </button>
    </div>
</template>
<script lang="ts">
import { useLayoutStore } from '@/stores/useLayoutStore';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'LayoutControls',
    computed: {
        layoutStore() {
            return useLayoutStore();
        }
    },
});
</script>
<style scoped>
.layout-controls {
    position: fixed;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 1000;
    display: flex;
    gap: 0.35rem;
}

.button-content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    mix-blend-mode: plus-lighter;
}

.control-button {
    color: var(--platinum);
    background-color: var(--jet);
    border: 1px solid var(--translucent-white-3);
    border-radius: 0.35rem;
    width: 1.8rem;
    height: 1.8rem;
    transition: color .125s cubic-bezier(0.25, 0.1, 0.25, 1.0), 
                background-color .125s cubic-bezier(0.25, 0.1, 0.25, 1.0);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    font-size: 0.65rem;
}

.control-button::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -25px;
    width: 70px;
    height: 70px;
    background: linear-gradient(to right, var(--flame) 50%, var(--burnt-sienna) 95%);
    z-index: -1;
    opacity: 0;
    filter: drop-shadow(0 0 3px var(--eerie-black));
    transition: opacity 0.2s cubic-bezier(0.25, 0.1, 0.25, 1.0);
}

.control-button:hover {
    color: var(--white);
    background-color: var(--jet);
    z-index: 1;
}

.control-button:hover::before {
    opacity: 0.3;
}

.control-button.selected {
    color: var(--flame);
    background-color: var(--translucent-white-02);
    z-index: 1;
    font-weight: bold;
    /* border-top: 1px solid var(--flame);
    border-left: 2px solid var(--flame); */
}

.control-button.selected::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -25px;
    width: 70px;
    height: 70px;
    background-color: var(--eerie-black);
    z-index: -1;
    opacity: 1;
}
</style>