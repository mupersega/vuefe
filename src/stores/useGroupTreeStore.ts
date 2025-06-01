// stores/useGroupTreeStore.ts
import { defineStore } from 'pinia'
import apiService from '@/services/apiService'
import type { MarketGroupNodeDto } from '@api-client/models/market-group-node-dto'

const useGroupTreeStore = defineStore('groupTree', {
    state: () => ({
        tree: [] as MarketGroupNodeDto[],
        loading: false,
        loaded: false
    }),

    actions: {
        async loadTree() {
            if (this.loading) return // Prevent duplicate calls

            this.loading = true
            try {
                const data = await apiService.getMarketGroupTree()
                this.tree = data
                this.loaded = true
            } catch (error) {
                console.error('Failed to load market group tree:', error)
            } finally {
                this.loading = false
            }
        },
        async setup() {
            await this.loadTree()
        }
    },

    getters: {
        getGroupById: (state) => (id: number): MarketGroupNodeDto | null => {
            function find(nodes: MarketGroupNodeDto[]): MarketGroupNodeDto | null {
                for (const node of nodes) {
                    if (node.marketGroupId === id) return node
                    const child = node.children ? find(node.children) : null
                    if (child) return child
                }
                return null
            }
            return find(state.tree)
        },
        getGroupsByIds: (state) => (ids: number[]): MarketGroupNodeDto[] => {
            if (!state.tree.length || !ids.length) return []

            const result: MarketGroupNodeDto[] = []
            const remainingIds = new Set(ids)

            function find(nodes: MarketGroupNodeDto[]): boolean {
                if (remainingIds.size === 0) return true // Stop if we found all IDs

                for (const node of nodes) {
                    // Check if this node matches any of the IDs we're looking for
                    if (node.marketGroupId && remainingIds.has(node.marketGroupId)) {
                        result.push(node)
                        remainingIds.delete(node.marketGroupId)

                        // Stop traversing completely if we've found all IDs
                        if (remainingIds.size === 0) {
                            return true
                        }
                    }

                    // Only search children if we still have IDs to find
                    if (node.children && node.children.length && remainingIds.size > 0) {
                        // If we found all remaining IDs in this subtree, stop traversing other branches
                        if (find(node.children)) {
                            return true
                        }
                    }
                }

                // Return true if we found all IDs, false otherwise
                return remainingIds.size === 0
            }

            find(state.tree)
            return result
        },

        getParentOf: (state) => (id: number): MarketGroupNodeDto | null => {
            function find(nodes: MarketGroupNodeDto[], parent: MarketGroupNodeDto | null): MarketGroupNodeDto | null {
                for (const node of nodes) {
                    if (node.marketGroupId === id) return parent
                    const found = node.children ? find(node.children, node) : null
                    if (found) return found
                }
                return null
            }
            return find(state.tree, null)
        },

        getChildrenOf: (state) => (id: number): MarketGroupNodeDto[] => {
            function find(nodes: MarketGroupNodeDto[]): MarketGroupNodeDto[] {
                for (const node of nodes) {
                    if (node.marketGroupId === id) return node.children || []
                    const children = node.children ? find(node.children) : []
                    if (children.length > 0) return children
                }
                return []
            }
            return find(state.tree)
        }
    }
})

export function useGroupTree() {
    const groupTreeStore = useGroupTreeStore()
    // Automatically load the tree when the store is first used
    if (!groupTreeStore.loaded && !groupTreeStore.loading) {
        groupTreeStore.loadTree()
    }
    return {
        tree: groupTreeStore.tree,
        loading: groupTreeStore.loading,
        loaded: groupTreeStore.loaded,
        loadTree: groupTreeStore.loadTree,
        setup: groupTreeStore.setup,
        getGroupById: groupTreeStore.getGroupById,
        getGroupsByIds: groupTreeStore.getGroupsByIds,
        getParentOf: groupTreeStore.getParentOf,
        getChildrenOf: groupTreeStore.getChildrenOf
    }
}