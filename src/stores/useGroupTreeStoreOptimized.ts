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
        },
        
        getGroupsByIds: (state) => {
            // Using a cache for multiple calls with the same IDs
            const cache = new Map<string, MarketGroupNodeDto[]>();
            
            return (ids: number[]): MarketGroupNodeDto[] => {
                if (!state.tree.length || !ids.length) return [];
                
                // Generate a cache key from sorted ids
                const cacheKey = [...ids].sort().join(',');
                if (cache.has(cacheKey)) {
                    return [...cache.get(cacheKey)!]; // Return a copy to prevent mutation
                }
                
                // Use a more efficient BFS approach for multiple IDs
                const result: MarketGroupNodeDto[] = [];
                const remainingIds = new Set(ids);
                const queue: MarketGroupNodeDto[] = [...state.tree];
                
                // Early exit if we found all IDs
                while (queue.length > 0 && remainingIds.size > 0) {
                    const node = queue.shift()!;
                    
                    // Check if this node matches any of the IDs we're looking for
                    if (node.marketGroupId !== undefined && remainingIds.has(node.marketGroupId)) {
                        result.push(node);
                        remainingIds.delete(node.marketGroupId);
                        
                        // Stop traversing completely if we've found all IDs
                        if (remainingIds.size === 0) {
                            break;
                        }
                    }
                    
                    // Only add children if we still have IDs to find
                    if (node.children?.length && remainingIds.size > 0) {
                        queue.push(...node.children);
                    }
                }
                
                cache.set(cacheKey, result);
                return result;
            };
        },
        
        getParentOf: (state) => {
            const cache = new Map<number, MarketGroupNodeDto | null>();
            
            return (id: number): MarketGroupNodeDto | null => {
                // Return from cache if available
                if (cache.has(id)) {
                    return cache.get(id)!;
                }
                
                // BFS approach with parent tracking
                interface QueueItem {
                    node: MarketGroupNodeDto;
                    parent: MarketGroupNodeDto | null;
                }
                
                const queue: QueueItem[] = state.tree.map(node => ({
                    node,
                    parent: null
                }));
                
                while (queue.length > 0) {
                    const {node, parent} = queue.shift()!;
                    
                    if (node.marketGroupId === id) {
                        cache.set(id, parent);
                        return parent;
                    }
                    
                    if (node.children?.length) {
                        queue.push(...node.children.map(child => ({
                            node: child,
                            parent: node
                        })));
                    }
                }
                
                cache.set(id, null);
                return null;
            };
        },
        
        getChildrenOf: (state) => {
            const cache = new Map<number, MarketGroupNodeDto[]>();
            
            return (id: number): MarketGroupNodeDto[] => {
                // Return from cache if available
                if (cache.has(id)) {
                    return [...cache.get(id)!]; // Return a copy to prevent mutation
                }
                
                // Find node using BFS (faster than recursion for large trees)
                const queue = [...state.tree];
                while (queue.length > 0) {
                    const node = queue.shift()!;
                    
                    if (node.marketGroupId === id) {
                        const children = node.children || [];
                        cache.set(id, children);
                        return [...children]; // Return a copy to prevent mutation
                    }
                    
                    if (node.children?.length) {
                        queue.push(...node.children);
                    }
                }
                
                cache.set(id, []);
                return [];
            };
        },
        
        getAllChildrenIDsOf: (state) => {
            const cache = new Map<number, number[]>();
            
            return (id: number): number[] => {
                // Return from cache if available
                if (cache.has(id)) {
                    return [...cache.get(id)!]; // Return a copy to prevent mutation
                }
                
                // First find the node with the given ID (use BFS for efficiency)
                let targetNode: MarketGroupNodeDto | null = null;
                const nodeQueue = [...state.tree];
                
                while (nodeQueue.length > 0) {
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
                const queue = [...targetNode.children];
                
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
});

// Create a singleton instance that will be used across the app
let treeStoreInstance: ReturnType<typeof useGroupTreeStore> | null = null;

export function useGroupTree() {
    // Create the store instance if it doesn't exist yet
    if (!treeStoreInstance) {
        treeStoreInstance = useGroupTreeStore();
        
        // Automatically load the tree when the store is first used
        if (!treeStoreInstance.loaded && !treeStoreInstance.loading) {
            treeStoreInstance.loadTree();
        }
    }
    
    return {
        tree: treeStoreInstance.tree,
        loading: treeStoreInstance.loading,
        loaded: treeStoreInstance.loaded,
        loadTree: treeStoreInstance.loadTree,
        setup: treeStoreInstance.setup,
        getGroupById: treeStoreInstance.getGroupById,
        getGroupsByIds: treeStoreInstance.getGroupsByIds,
        getParentOf: treeStoreInstance.getParentOf,
        getChildrenOf: treeStoreInstance.getChildrenOf,
        getAllChildrenIDsOf: treeStoreInstance.getAllChildrenIDsOf
    };
}
