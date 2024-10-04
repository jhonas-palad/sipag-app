import { createStore } from "zustand";
import NetInfo, { NetInfoSubscription } from "@react-native-community/netinfo";

export interface NetInfoState {
  internetConnected: boolean | null;
}

export interface NetInfoAction {
  unsubscribe: NetInfoSubscription;
}

export const createNetInfoStore = () => {
  return createStore<NetInfoState & NetInfoAction>()((set) => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      set({ internetConnected: state.isConnected });
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });
    return {
      internetConnected: true,
      unsubscribe,
    };
  });
};
