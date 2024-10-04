import { createNetInfoStore, NetInfoState } from "@/store/netinfo";
import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
export const NetinfoContext = createContext<ReturnType<
  typeof createNetInfoStore
> | null>(null);

function NetinfoProvider({ children }: { children: React.ReactNode }) {
  const netInfoStoreRef = useRef<ReturnType<typeof createNetInfoStore>>();
  if (!netInfoStoreRef.current) {
    netInfoStoreRef.current = createNetInfoStore();
  }

  return (
    <NetinfoContext.Provider value={netInfoStoreRef.current}>
      {children}
    </NetinfoContext.Provider>
  );
}

export function useNetInfoContext<T>(selector: (state: NetInfoState) => T): T {
  const store = useContext(NetinfoContext);
  if (!store) throw new Error("Missing BearContext.Provider in the tree");
  return useStore(store, selector);
}

export default NetinfoProvider;
