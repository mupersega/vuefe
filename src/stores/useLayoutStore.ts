import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", {
  state: () => ({
    topDrawer: true,
    leftDrawer: true,
    sidebar: true,
  }),
  actions: {
    toggleLeftDrawer() {
      this.leftDrawer = !this.leftDrawer;
    },
    toggleTopDrawer() {
      this.topDrawer = !this.topDrawer;
    },
    toggleSidebar() {
      this.sidebar = !this.sidebar;
    },
    setSidebar(open: boolean) {
      this.sidebar = open;
    },
    setTopDrawer(open: boolean) {
      this.topDrawer = open;
    },
    setLeftDrawer(open: boolean) {
      this.leftDrawer = open;
    },
  },
});

export function useLayout() {
  const layoutStore = useLayoutStore();
  return {
    topDrawer: layoutStore.topDrawer,
    leftDrawer: layoutStore.leftDrawer,
    sidebar: layoutStore.sidebar,
    toggleLeftDrawer: layoutStore.toggleLeftDrawer,
    toggleTopDrawer: layoutStore.toggleTopDrawer,
    toggleSidebar: layoutStore.toggleSidebar,
  };
}