import RootStore from "@/stores/RootStore";

const stores = new RootStore();

// Only expose stores to window in client-side and development environment
if (typeof window !== "undefined") {
  // @ts-ignore
  window.stores = stores;
}

export default stores;
