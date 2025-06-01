import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", {
  state: () => ({
    isSearchControlsOpen: false,
    isRightDrawerOpen: true,
    isSidebarOpen: true,
    isMobile: false,
  }),
  actions: {
    toggleRightDrawer() {
      this.isRightDrawerOpen = !this.isRightDrawerOpen;
    },
    toggleSearchControls() {
      this.isSearchControlsOpen = !this.isSearchControlsOpen;
    },
    setIsMobile(isMobile: boolean) {
      this.isMobile = isMobile;
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    setIsSidebarOpen(isOpen: boolean) {
      this.isSidebarOpen = isOpen;
    },
    setIsSearchControlsOpen(isOpen: boolean) {
      this.isSearchControlsOpen = isOpen;
    },
    setIsRightDrawerOpen(isOpen: boolean) {
      this.isRightDrawerOpen = isOpen;
    },
  },
});

export function useLayout() {
  const layoutStore = useLayoutStore();
  return {
    isSearchControlsOpen: layoutStore.isSearchControlsOpen,
    isRightDrawerOpen: layoutStore.isRightDrawerOpen,
    toggleRightDrawer: layoutStore.toggleRightDrawer,
    toggleSearchControls: layoutStore.toggleSearchControls,
    setIsMobile: layoutStore.setIsMobile,
    isMobile: layoutStore.isMobile,
    toggleSidebar: layoutStore.toggleSidebar,
    isSidebarOpen: layoutStore.isSidebarOpen,
  };
}