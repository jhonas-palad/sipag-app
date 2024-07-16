import { create } from "zustand";
import { WastePost } from "@/types/maps";
import { findItem } from "@/utils/array";
import { userPosts } from "@/data/users";
import { UserPost } from "@/types/user";
type MapState = {
  posts: UserPost[];
  selectedPost: UserPost | null;
  totalFeeds: number;
};

type MapActions = {
  selectPost: (id: string | number | null) => void;
};

export type MapStore = MapState & MapActions;

const initialState: MapState = {
  posts: userPosts,
  selectedPost: null,
  totalFeeds: 10,
};
export const useMapStore = create<MapStore>()((set, get) => ({
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
}));
