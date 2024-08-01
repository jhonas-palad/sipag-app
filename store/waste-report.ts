import { create } from "zustand";
import { findItem } from "@/utils/array";
import { userPosts } from "@/data/users";
import { UserPost } from "@/types/user";
import { immer } from "zustand/middleware/immer";

type WasteReportState = {
  posts: UserPost[];
  selectedPost: UserPost | null;
  totalFeeds: number;
};

type WasteReportActions = {
  selectPost: (id: string | number | null) => void;
};

export type WasteReportStore = WasteReportState & WasteReportActions;

const initialState: WasteReportState = {
  posts: userPosts,
  selectedPost: null,
  totalFeeds: 10,
};
export const useWasteReportStore = create<WasteReportStore>()(
  immer((set, get) => ({
    ...initialState,
    selectPost: (id) => {
      if (id === null) {
        set({ selectedPost: null });
        return;
      }
      const posts = get().posts;
      const currentFeed = findItem(posts, id);
      if (currentFeed === null) {
        return;
      }
      set({ selectedPost: currentFeed });
    },
  }))
);
