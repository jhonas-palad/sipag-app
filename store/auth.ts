import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { User } from "@/types/user";

type AuthSessionState = {
  session: User | null;
  apiToken: string | null;
  isLoading: boolean;
};

type AuthSessionAction = {
  signIn: () => void;
  signOut: () => void;
  // getToken: () => void;
  // persistToken: () => void;
};

export const useAuthSession = create<AuthSessionState & AuthSessionAction>()(
  immer((set) => ({
    session: null,
    isLoading: false,
    apiToken: null,
    signIn: () => {},
    signOut: () => {},
  }))
);
