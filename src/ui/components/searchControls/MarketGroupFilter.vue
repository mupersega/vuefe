<template>
  <div class="market-group">
    <div class="node-header">
      <span v-if="hasChildren" class="toggle" @click="toggleExpanded">
        {{ expanded ? '▼' : '▶' }}
      </span>
      <span>{{ baseNode.marketGroupName }}</span>
      <button @click="includeThis">Include This</button>
      <button v-if="hasChildren || baseNode.hasTypes" @click="includeAll">Include All</button>
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
      forwardIncludeAll
    };
  }
});
</script>

<style scoped>
.market-group {
  margin-left: 10px;
  border-left: 1px solid var(--translucent-white-3);
  padding-left: 10px;
}
.node-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.toggle {
  cursor: pointer;
  font-size: 0.9rem;
  user-select: none;
}
.children {
  margin-left: 10px;
  margin-top: 3px;
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