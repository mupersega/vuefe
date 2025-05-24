// services/GroupTreeService.ts
import type { MarketGroupNodeDto } from "@/api-client"

export class GroupTreeService {
    private readonly tree: MarketGroupNodeDto[]

    constructor(tree: MarketGroupNodeDto[]) {
        this.tree = tree
    }

    findGroupById(id: number): MarketGroupNodeDto | null {
        return this._findGroupById(id, this.tree)
    }

    findParentOf(id: number): MarketGroupNodeDto | null {
        return this._findParentOf(id, this.tree, null)
    }

    private _findGroupById(id: number, nodes: MarketGroupNodeDto[]): MarketGroupNodeDto | null {
        for (const node of nodes) {
            if (node.marketGroupId === id) return node
            const child = this._findGroupById(id, node.children ? node.children : [])
            if (child) return child
        }
        return null
    }

    private _findParentOf(
        id: number,
        nodes: MarketGroupNodeDto[],
        parent: MarketGroupNodeDto | null
    ): MarketGroupNodeDto | null {
        for (const node of nodes) {
            if (node.marketGroupId === id) return parent
            const found = this._findParentOf(id, node.children ? node.children : [], node)
            if (found) return found
        }
        return null
    }
}
