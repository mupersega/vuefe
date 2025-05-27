<template>
  <div class="market-group">
    <div class="node-header" @click="toggleExpanded">
      <span v-if="hasChildren" class="toggle">
        {{ expanded ? '▼' : '▶' }}
      </span>
      <span>{{ baseNode.marketGroupName }}</span>
      <button @click="includeThis">include</button>
      <button v-if="hasChildren" @click="includeAll">include all</button>
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
  margin-left: 1rem;
  flex-direction: column;
  /* border: 1px solid var(--translucent-white-1); */
  padding: 0.5rem;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  margin-left: 0.5rem;
  /* border-bottom: 1px solid var(--translucent-white-3); */
}

.market-group:hover {
  /* color: var(--flame); */
  /* border-color: var(--translucent-white-3); */
  transition: all 0.15s ease;
  /* background-color: var(--translucent-white-1); */
  /* box-shadow: 0 0 5px var(--translucent-white-2); */
  transition: all 0.15s ease;
}

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