<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  leftLabel?: string;
  rightLabel?: string;
  switchClass?: string;
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'change', value: boolean): void;
}>()

const toggleSwitch = () => {
  const newValue = !props.modelValue;
  emit('update:modelValue', newValue);
  emit('change', newValue);
};
</script>

<template>
  <button type="button" class="me-switch" :class="switchClass" @click="toggleSwitch">
    <span :class="{ 'text-active': modelValue }">{{ leftLabel || 'Off' }}</span>
    <div class="switch-outer">
      <div class="switch-inner" :class="{ 'switch-inner-active': !modelValue }"></div>
    </div>
    <span :class="{ 'text-active': !modelValue }">{{ rightLabel || 'On' }}</span>
  </button>
</template>

<style scoped>
.me-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: max-content;
  padding: 0.25rem 1rem;
  gap: 0.5rem;
  border-radius: .5rem;
  background-color: var(--eerie-black);
  border: 1px solid var(--translucent-white-3);
  cursor: pointer;
  user-select: none;
  color: var(--gray);
  position: relative;
  transition: all 0.15s ease;
}

/* Base pseudo-element for hover and active effects */
.me-switch::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 0px solid transparent;
  box-shadow: 0 0 0 0 transparent;
  pointer-events: none;
  border-radius: 0.5rem;
  transition: border-color 0.15s ease, border-width 0.15s ease, box-shadow 0.15s ease;
}

.me-switch:hover::after {
  border: 1px solid turquoise;
}

.me-switch:active::after {
  box-shadow: 0 0 3px 3px turquoise inset;
}

.me-switch input[type="checkbox"] {
  display: none;
}

.me-switch span {
  font-size: 0.7rem;
  transition: color 0.15s ease;
}

.switch-outer {
  width: calc(var(--sidebar-width-compressed) / 2);
  height: calc(var(--sidebar-width-compressed) / 4);
  background-color: var(--eerie-black);
  border-radius: 1.5rem;
  border: 1px solid var(--translucent-white-3);
  padding: 1px;
}

.switch-inner {
  width: calc(var(--sidebar-width-compressed) / 4);
  height: 100%;
  background-color: var(--flame);
  border-radius: 1.5rem;
  transition: transform 0.15s ease;
}

.switch-inner-active {
  transform: translateX(calc(var(--sidebar-width-compressed) / 4 - 4px));
}

.me-switch .text-active {
  color: var(--flame);
}
</style>
