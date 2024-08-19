import { create } from "zustand";
import { findItem } from "@/utils/array";
import { UserPost } from "@/types/user";
import { immer } from "zustand/middleware/immer";
import { WastePost } from "@/types/maps";
type WasteReportState = {
  posts: WastePost[] | null;
  selectedPost: string | null;
  totalFeeds: number | null;
};

type WasteReportActions = {
  selectPost: (id: string | number | null) => void;
  setPosts: (posts: WastePost[]) => void;
};

export type WasteReportStore = WasteReportState & WasteReportActions;

const initialState: WasteReportState = {
  posts: null,
  selectedPost: null,
  totalFeeds: null,
};
export const useWasteReportStore = create<WasteReportStore>()(
  immer((set, get) => ({
    ...initialState,
    setPosts(posts) {
      set({ posts, totalFeeds: posts.length });
    },
    selectPost: (id) => {
      if (id === null) {
        set({ selectedPost: null });
        return;
      }
      set({ selectedPost: String(id) });
      // const posts = get().posts;
      // if (!posts) {
      //   return;
      // }
      // const currentFeed = findItem(posts, id);
      // if (currentFeed === null) {
      //   return;
      // }
    },
  }))
);

type WasteContainerState = {
  showBtmModal?: boolean;
  showBtmSheet?: boolean;
};
type WasteContainerActions = {
  setContainerState: (args: WasteContainerState) => void;
};

export const useWasteContainerState = create<
  WasteContainerState & WasteContainerActions
>()(
  immer((set, get) => ({
    showBtmModal: false,
    showBtmSheet: false,
    setContainerState(args) {
      set({ ...args });
    },
  }))
);
