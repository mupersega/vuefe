<template>
  <div class="market-group">
    <div class="node-header" @click="toggleExpanded">
      <div class="header-text">
        <span v-if="hasChildren" class="toggle">
          {{ expanded ? '▼' : '▶' }}
        </span>
        <span>{{ baseNode.marketGroupName }}</span>
      </div>
      <div class="header-actions">
        <button @click="includeThis">include</button>
        <button v-if="hasChildren" @click="includeAll">include all</button>
      </div>
    </div>
    <div v-if="expanded && hasChildren" class="children">
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
  /* border-left: 1px solid var(--translucent-white-1); */
  display: flex;
  flex-direction: column;
  background-color: var(--translucent-white-1);
  /* border: 1px solid var(--translucent-white-1); */
  margin-left: 1rem;
  font-size: 0.7rem;
}

.all-filters>.market-group:first-child {
  margin-left: 0;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  padding: 0.5rem;
  background-color: var(--jet);
  border-bottom: 1px solid var(--translucent-white-1);
  border-left: 1px solid var(--translucent-white-1);
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
}


.node-header:hover {
  color: var(--flame);
  border-color: turquoise;
  transition: all 0.1s ease;
  border-left: 3px solid var(--flame);
  /* background-color: var(--translucent-white-02); */
  box-shadow: 0 0 5px var(--translucent-white-2);
}

/* .market-group:hover {
  border-color: var(--translucent-white-3);
  transition: all 0.15s ease;
  background-color: var(--translucent-white-02);
  box-shadow: 0 0 5px var(--translucent-white-2);
  transition: all 0.15s ease;
} */

.toggle {
  cursor: pointer;
  font-size: 0.9rem;
  user-select: none;
}
.children {
  top: -100%;
  transition: transform 0.3s ease-in-out, opacity 0.3s 0.1s ease-in-out;
  transform: translateY(0);
  opacity: 1;
  @starting-style {
    border-left: 1px solid var(--translucent-white-3);
    transform: translateY(-10%);
    opacity: 0;
  }
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
}
</style>