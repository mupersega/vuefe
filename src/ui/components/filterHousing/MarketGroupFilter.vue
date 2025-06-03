<template>
  <div class="market-group">
    <div class="node-header" @click="toggleExpanded">
      <div class="header-text">
        <span v-if="hasChildren" class="toggle" @click.stop="toggleExpanded">
          <font-awesome-icon :icon="['fas', 'chevron-right']" :class="{ expanded: expanded }" />
        </span>
        <span v-else class="toggle-placeholder"></span>
        <span>{{ baseNode.marketGroupName }}</span>
      </div>      <div class="header-actions">
        <button v-if="hasChildren" @click.stop="includeAll">
          <div class="button-content">
            <font-awesome-icon :icon="['fas', 'list-check']" />
            <div class="indicator">
              <span v-if="includeAllToggle" :class="{ active: includeAllToggle }">-</span>
              <span v-else :class="{ active: !includeAllToggle }">+</span>
            </div>
          </div>
        </button>
        <button @click.stop="includeThis"
          :class="{ selected: mainStateStore.isGroupSelected(baseNode.marketGroupId!) }">
          <div class="button-content">
            <font-awesome-icon :icon="['fas', 'plus']" />
          </div>
        </button>
      </div>
    </div>    <transition name="expand" @enter="startTransition" @after-enter="endTransition" @before-leave="startTransition" @after-leave="endTransition">
      <div v-if="expanded && hasChildren" class="children">
        <MarketGroupFilter v-for="child in baseNode.children" :key="child.marketGroupId" :baseNode="child" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { MarketGroupNodeDto } from '../../../api-client';
import { useMainState } from '@/stores/useMainStateStore';
import { useGroupTree } from '@/stores';

export default defineComponent({
  name: 'MarketGroupFilter',
  components: {
    MarketGroupFilter: () => import('./MarketGroupFilter.vue')
  },
  props: {
    baseNode: {
      type: Object as PropType<MarketGroupNodeDto>,
      required: true
    }
  },
  data(){
    return {
      expanded: false,
      includeAllToggle: false
    };
  },  computed: {
    hasChildren(): boolean {
      return Boolean(this.baseNode.children && this.baseNode.children.length > 0);
    },
    mainStateStore() {
      return useMainState();
    },
    groupTreeStore() {
      return useGroupTree();
    },
    // Watch for expand/collapse events
    expandCollapseEvent() {
      return this.mainStateStore.expandCollapseEvent;
    }
  },
  watch: {
    // Watch for global expand/collapse events
    expandCollapseEvent: {
      handler(newEvent) {
        // Only react if the event is new (has a timestamp)
        if (newEvent.timestamp === 0) return;
        
        // Check if this event is targeted at all groups or a specific group that matches this one
        const shouldReact = 
          newEvent.target === 'all' || 
          (this.baseNode.marketGroupId !== undefined && newEvent.target === this.baseNode.marketGroupId.toString());
        
        if (shouldReact) {
          if (newEvent.action === 'expandAll') {
            this.expanded = true;
          } else if (newEvent.action === 'collapseAll') {
            this.expanded = false;
          }
        }
      },
      deep: true
    }
  },  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded;
    },
    includeThis() {
      this.mainStateStore.toggleMarketGroupSelection(this.baseNode.marketGroupId!);
    },
    includeAll() {
      this.includeAllToggle = !this.includeAllToggle;
      if (this.includeAllToggle) {
        const allChildren = this.groupTreeStore.getAllChildrenIDsOf(this.baseNode.marketGroupId!);
        this.mainStateStore.addMultipleMarketGroups([...allChildren, this.baseNode.marketGroupId!]);
      } else {
        const allChildren = this.groupTreeStore.getAllChildrenIDsOf(this.baseNode.marketGroupId!);
        this.mainStateStore.removeMultipleMarketGroups([...allChildren, this.baseNode.marketGroupId!]);
      }
    },    // Transition hook methods for smooth height animation
    startTransition(element: Element) {
      const el = element as HTMLElement;
      el.style.height = 'auto';
      const height = el.scrollHeight;
      el.style.height = '0px';
      // Trigger a reflow to make the browser recognize the height change
      void el.offsetHeight;
      el.style.height = `${height}px`;
    },
    endTransition(element: Element) {
      const el = element as HTMLElement;
      el.style.height = 'auto';
    },
  }
});
</script>

<style scoped>
.market-group {
  display: flex;
  flex-direction: column;
  background-color: var(--translucent-white-03);
  margin-left: 0.75rem;
  font-size: 0.7rem;
  border-left: 1px solid var(--translucent-white-1);
  position: relative;
}

.all-filters>.market-group:first-child {
  margin-left: 0;
  border-left: none;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  padding: 0.3rem 0.75rem;
  background-color: var(--jet);
  border-bottom: 1px solid var(--translucent-white-1);
  position: relative;
  transition: all 0.15s cubic-bezier(0.68, 0, 0.265, 1.2);
}

.header-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-grow: 1;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  /* this is a key lil opacity */
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.node-header:hover .header-actions {
  opacity: 1;
}

.node-header:hover {
  color: var(--flame);
  border-color: turquoise;
  background-color: var(--eerie-black);
  text-shadow: 0 0 0.5px currentColor;
}

.node-header:hover::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background-color: var(--flame);
}

.toggle {
  cursor: pointer;
  font-size: 0.7rem;
  user-select: none;
  color: var(--gray);
  transition: color 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  position: relative;
}

.toggle-placeholder {
  width: 16px;
  display: inline-block;
}

.toggle svg {
  transition: transform 0.3s cubic-bezier(0.68, 0, 0.265, 1.2);
}

.toggle .expanded {
  transform: rotate(90deg);
}

.node-header:hover .toggle {
  color: var(--flame);
}

.toggle:hover svg:not(.expanded) {
  transform: rotate(30deg);
}

.toggle:hover svg.expanded {
  transform: rotate(110deg);
}

.children {
  overflow: hidden;
  transition: height 0.23s ease-in-out;
}

/* Expand transition styles */
.expand-enter-active,
.expand-leave-active {
  will-change: height;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  height: 0 !important;
}

button {
  color: var(--gray);
  background-color: var(--eerie-black);
  border: 1px solid var(--translucent-white-1);
  border-radius: 0.3rem;
  padding: 0.15rem 0.4rem;
  font-size: 0.7rem;
  cursor: pointer;
  transition: color .125s cubic-bezier(0.25, 0.1, 0.25, 1.0), 
              background-color .125s cubic-bezier(0.25, 0.1, 0.25, 1.0);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, var(--flame) 50%, var(--burnt-sienna) 95%);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.125s cubic-bezier(0.25, 0.1, 0.25, 1.0);
}

button:hover {
  color: var(--burnt-sienna);
  z-index: 1;
}

button:hover::before {
  opacity: 0.3;
}

button:active::before {
  opacity: 0.5;
}

button.selected {
  /* color: var(--flame); */
  background-color: var(--eerie-black);
  font-weight: bold;
  z-index: 2;
  border-color: var(--translucent-white-1);
}

button.selected::before {
  opacity: 1;
}

.button-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

button svg {
  mix-blend-mode: plus-lighter;
}

button.selected svg {
  color: var(--flame);
  /* mix-blend-mode: normal; */
  filter: drop-shadow(0 0 1px var(--eerie-black));
}

.indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-direction: column;
  margin-left: 0.25rem;

  span {
    width: 0.5rem;
    height: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gray);
    font-size: 0.7rem;
    /* flex: 1; */
  }

  span.active {
    color: var(--flame);
  }
}
</style>