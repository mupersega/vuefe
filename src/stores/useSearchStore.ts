import { InvTypesApi } from "@/api-client";
import type { InvTypeDto } from "@api-client/models/inv-type-dto";
import { defineStore } from "pinia";

// export const useSearchStore = defineStore("staging", {
//   state: () => ({
//     stagedItems: [] as InvTypeDto[],
//     _service: null as any | null, // Replace 'any' with your actual service type
//   }),
// },
// {
//   actions: {
//     async loadStagedItems() {
//       const data = await InvTypesApi.getInvTypes();
//       this.stagedItems = data;
//       this._service = new InvTypesApi(data); // Adjust based on your service initialization
//     },
//   },

//   getters: {
//     getItemById: (state) => (id: number) => {
//       return state.stagedItems.find(item => item.id === id) || null;
//     },

//     getItemsByName: (state) => (name: string) => {
//       return state.stagedItems.filter(item => item.name.includes(name));
//     },
//   },
// });