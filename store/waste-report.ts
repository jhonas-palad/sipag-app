import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { WastePost, WastePostOptionals } from "@/types/maps";
type WasteReportState = {
  posts: WastePost[] | null;
  selectedPost: string | null;
  totalFeeds: number | null;
  wasteReportDetail: WastePost | null;
};

type WasteReportActions = {
  selectPost: (id: string | number | null) => void;
  setPosts: (posts: WastePost[]) => void;
  setWasteReportDetail: (detail: WastePostOptionals | WastePost) => void;
};

export type WasteReportStore = WasteReportState & WasteReportActions;

const initialState: WasteReportState = {
  posts: null,
  selectedPost: null,
  totalFeeds: null,
  wasteReportDetail: null,
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
    wasteReportDetail: null,
    setWasteReportDetail(detail) {
      const wasteReportDetail = get().wasteReportDetail;
      if (wasteReportDetail === null) {
        set({
          wasteReportDetail: {
            ...(detail as WastePost),
          },
        });
      } else {
        set({
          wasteReportDetail: {
            ...wasteReportDetail,
            ...(detail as WastePost),
          },
        });
      }
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
