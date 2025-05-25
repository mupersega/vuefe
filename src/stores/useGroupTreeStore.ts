// stores/useGroupTreeStore.ts
import { defineStore } from 'pinia'
import apiService from '@/services/ApiService'
import type { MarketGroupNodeDto } from '@api-client/models/market-group-node-dto'

export const useGroupTreeStore = defineStore('groupTree', {
    state: () => ({
        tree: [] as MarketGroupNodeDto[]
    }),

    actions: {
        async loadTree() {
            const data = await apiService.getMarketGroupTree()
            this.tree = data
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
        }
    }
})
