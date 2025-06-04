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
        getGroupById: (state) => {
            // Use memoization for better performance with repeated calls
            const cache = new Map<number, MarketGroupNodeDto | null>();
            
            return (id: number): MarketGroupNodeDto | null => {
                // Return from cache if available
                if (cache.has(id)) {
                    return cache.get(id)!;
                }
                
                // Iterative BFS approach is more efficient than recursion for large trees
                const queue: MarketGroupNodeDto[] = [...state.tree];
                while (queue.length > 0) {
                    const node = queue.shift()!;
                    if (node.marketGroupId === id) {
                        cache.set(id, node);
                        return node;
                    }
                    if (node.children?.length) {
                        queue.push(...node.children);
                    }
                }
                
                cache.set(id, null);
                return null;
            };
        },        getGroupsByIds: (state) => {
            // Simplified implementation without complex caching
            
            return (ids: number[]): MarketGroupNodeDto[] => {
                if (!state.tree.length || !ids.length) return [];
                
                // Create a Set for faster lookups
                const idsSet = new Set(ids);
                const result: MarketGroupNodeDto[] = [];
                
                // Use BFS to find all the IDs at once
                const queue: MarketGroupNodeDto[] = [...state.tree];
                
                while (queue.length > 0 && idsSet.size > 0) {
                    const node = queue.shift()!;
                    
                    // Check if this node matches any of the IDs we're looking for
                    if (node.marketGroupId !== undefined && idsSet.has(node.marketGroupId)) {
                        result.push(node);
                        idsSet.delete(node.marketGroupId);
                    }
                      // Only add children if we still have IDs to find
                    if (node.children?.length && idsSet.size > 0) {
                        queue.push(...node.children);
                    }
                }
                
                return result;
            };
        },        getParentOf: (state) => {
            const cache = new Map<number, MarketGroupNodeDto | null>();
            
            return (id: number): MarketGroupNodeDto | null => {
                if (cache.has(id)) {
                    return cache.get(id) || null;
                }
                
                // BFS approach with parent tracking
                const queue: Array<{node: MarketGroupNodeDto, parent: MarketGroupNodeDto | null}> = 
                    state.tree.map(node => ({node, parent: null}));
                
                while (queue.length > 0) {
                    const {node, parent} = queue.shift()!;
                    
                    if (node.marketGroupId === id) {
                        cache.set(id, parent);
                        return parent;
                    }
                    
                    if (node.children?.length) {
                        queue.push(
                            ...node.children.map(child => ({node: child, parent: node}))
                        );
                    }
                }
                
                cache.set(id, null);
                return null;
            };
        },        getChildrenOf: (state) => {
            // Use memoization for better performance with repeated calls
            const childrenCache = new Map<number, MarketGroupNodeDto[]>();
            
            return (id: number): MarketGroupNodeDto[] => {
                // Return from cache if available
                if (childrenCache.has(id)) {
                    return [...childrenCache.get(id)!]; // Return a copy to prevent mutation
                }
                
                // Find the group by iterating through the tree
                let group: MarketGroupNodeDto | null = null;
                const queue: MarketGroupNodeDto[] = [...state.tree];
                
                while (queue.length > 0 && group === null) {
                    const node = queue.shift()!;
                    if (node.marketGroupId === id) {
                        group = node;
                        break;
                    }
                    
                    if (node.children?.length) {
                        queue.push(...node.children);
                    }
                }
                
                if (!group) {
                    childrenCache.set(id, []);
                    return [];
                }
                
                // Store children in cache and return them
                const children = group.children || [];
                childrenCache.set(id, children);
                return [...children]; // Return a copy to prevent mutation
            };
        },          getAllChildrenIDsOf: (state) => {
            // Using a simple implementation with direct caching
            const cache = new Map<number, number[]>();
            
            return (id: number): number[] => {
                // Return from cache if available
                if (cache.has(id)) {
                    return [...cache.get(id)!]; // Return a copy to prevent mutation
                }
                
                // First find the node with the given ID (use BFS for efficiency)
                let targetNode: MarketGroupNodeDto | null = null;
                const nodeQueue: MarketGroupNodeDto[] = [...state.tree];
                
                while (nodeQueue.length > 0 && targetNode === null) {
                    const node = nodeQueue.shift()!;
                    if (node.marketGroupId === id) {
                        targetNode = node;
                        break;
                    }
                    
                    if (node.children?.length) {
                        nodeQueue.push(...node.children);
                    }
                }
                
                if (!targetNode || !targetNode.children?.length) {
                    cache.set(id, []);
                    return [];
                }
                
                // Collect all child IDs using BFS (more efficient than recursion)
                const childIds: number[] = [];
                const queue: MarketGroupNodeDto[] = [...targetNode.children];
                
                while (queue.length > 0) {
                    const node = queue.shift()!;
                    if (node.marketGroupId !== undefined) {
                        childIds.push(node.marketGroupId);
                    }
                    
                    if (node.children?.length) {
                        queue.push(...node.children);
                    }
                }
                
                cache.set(id, childIds);
                return childIds;
            };
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
        getChildrenOf: groupTreeStore.getChildrenOf,
        getAllChildrenIDsOf: groupTreeStore.getAllChildrenIDsOf
    }
}