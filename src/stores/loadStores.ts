// stores/loadStores.ts
import { useGroupTreeStore } from './useGroupTreeStore'

export async function loadStores() {
  const groupTreeStore = useGroupTreeStore()
  await groupTreeStore.loadTree()
}