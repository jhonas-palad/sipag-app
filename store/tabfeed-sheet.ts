import { create } from "zustand";
import { WastePost } from "@/types/maps";
type TabFeedSheetState = {
  hide: boolean;
  selectedPost: WastePost | null;
};

type TabFeedSheetAction = {
  hideTab: () => void;
  showTab: () => void;
};

// const useTabFeedSheetStore = create<TabFeedSheetState & TabFeedSheetAction>()(set) => ({
//   hide: false,
//   hideTab: () = set()
// });

export const useTabFeedSheetStore = create<
  TabFeedSheetState & TabFeedSheetAction
>()((set) => ({
  hide: false,
  selectedPost: null,
  hideTab: () => set({ hide: true }),
  showTab: () => set({ hide: false }),
}));
