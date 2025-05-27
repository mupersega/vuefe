<template>
  <div class="market-group">
    <div class="node-header" @click="toggleExpanded">
      <div class="header-text">
        <span v-if="hasChildren" class="toggle" @click.stop="toggleExpanded">
          <font-awesome-icon 
            :icon="['fas', 'chevron-right']"
            :class="{ expanded: expanded }"
          />
        </span>
        <span v-else class="toggle-placeholder"></span>
        <span>{{ baseNode.marketGroupName }}</span>
      </div>
      <div class="header-actions">
        <button @click.stop="includeThis">
          <font-awesome-icon :icon="['fas', 'plus']" /> Include
        </button>
        <button v-if="hasChildren" @click.stop="includeAll">
          <font-awesome-icon :icon="['fas', 'list-check']" /> Include All
        </button>
      </div>
    </div>
    <div v-if="hasChildren" class="children" :style="{ maxHeight: expanded ? '1000px' : '0px' }">
      <MarketGroupFilter
        v-for="child in baseNode.children"
        :key="child.marketGroupId"
        :baseNode="child"
        @include-this="forwardIncludeThis"
        @include-all="forwardIncludeAll"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue';
import type { MarketGroupNodeDto } from '@/api-client';

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
  setup(props, { emit }) {
    const expanded = ref(false);
    const hasChildren = props.baseNode.children && props.baseNode.children.length > 0;

    function toggleExpanded() {
      expanded.value = !expanded.value;
    }
    function expand() {
      expanded.value = true;
    }
    function collapse() {
      expanded.value = false;
    }
    function includeThis() {
      emit('include-this', props.baseNode);
    }
    function includeAll() {
      emit('include-all', props.baseNode);
    }
    function forwardIncludeThis(node: MarketGroupNodeDto) {
      emit('include-this', node);
    }
    function forwardIncludeAll(node: MarketGroupNodeDto) {
      emit('include-all', node);
    }

    return {
      expanded,
      hasChildren,
      toggleExpanded,
      includeThis,
      includeAll,
      forwardIncludeThis,
      forwardIncludeAll,
      expand,
      collapse
    };
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

.market-group:not(:last-child) {
  margin-bottom: 1px;
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
  padding: 0.5rem 0.75rem;
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
  opacity: 0.7;
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
  max-height: 1000px; /* Set a reasonable max height */
  transition: max-height 0.3s cubic-bezier(0.68, 0, 0.265, 1.2);
}

button {
  background-color: var(--eerie-black);
  color: var(--gray);
  border: 1px solid var(--translucent-white-3);
  border-radius: 0.3rem;
  padding: 0.15rem 0.4rem;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

button:hover {
  color: var(--flame);
  border-color: var(--flame);
  text-shadow: 0 0 0.5px currentColor;
  box-shadow: 0 0 3px rgba(255, 89, 36, 0.2);
}
</style>