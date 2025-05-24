// stores/useGroupTreeStore.ts
import { defineStore } from 'pinia'
import { GroupTreeService } from '@/services/GroupTreeService'
import type { MarketGroupNodeDto } from '@/api-client'
export const useGroupTreeStore = defineStore('groupTree', {
    state: () => ({
        tree: [] as MarketGroupNodeDto[],
        _service: null as GroupTreeService | null
    }),

    actions: {
        async loadTree() {
            const data = await fetch('/api/test').then(res => res.json())
            this.tree = data
            this._service = new GroupTreeService(data)
        }
    },

    getters: {
        getGroupById: (state) => (id: number) => {
            return state._service?.findGroupById(id) ?? null
        },

        getParentOf: (state) => (id: number) => {
            return state._service?.findParentOf(id) ?? null
        }
    }
})
