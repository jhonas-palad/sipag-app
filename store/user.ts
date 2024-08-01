import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { type User } from "@/types/user";

type UserState = { details: User | null };

type UserActions = {
  setUserDetails: (user: User) => void;
};

export const useUserState = create<UserState & UserActions>()(
  immer((set) => ({
    details: null,
    setUserDetails(user: User) {
      set({ details: { ...user } });
    },
  }))
);
