import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type ToggleHideState = {
  hide: boolean;
};

type ToggleHideAction = {
  setTabHide: (hide: boolean) => void;
};

export const useToggleHideTab = create<ToggleHideState & ToggleHideAction>()(
  immer((set) => ({
    hide: false,
    setTabHide: (hide: boolean) => {
      set({ hide });
    },
  }))
);
