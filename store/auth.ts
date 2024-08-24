import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { User } from "@/types/user";

import {
  saveSecureStore,
  getValueSecureStore,
  deleteKeySecureStore,
} from "@/lib/secure-store";
import { log } from "@/utils/logger";
type AuthSessionState = {
  token: string | null;
  user: User | null;
};

type AuthSessionAction = {
  setToken: (token: string) => void;
  setUser: (details: User) => void;
  isAuthenticated: () => boolean;
  signOut: () => void;
};

export const authTokenKey = "authTokenKey";
export const authUserIdKey = "authUserId";

export const useAuthSession = create<AuthSessionState & AuthSessionAction>()(
  immer((set, get) => ({
    user: null,
    token: null,
    isAuthenticated() {
      let { token, user, setToken, setUser } = get();

      if (!token) {
        token = getValueSecureStore(authTokenKey) as string | null;
        token && setToken(token!);
      }
      if (!user) {
        let userString = getValueSecureStore(authUserIdKey)!;
        if (userString) {
          user = JSON.parse(userString);
          setUser(user!);
        }
      }
      return !!user && !!token;
    },
    setToken(token) {
      saveSecureStore(authTokenKey, token);
      set({ token: token });
    },
    setUser(details) {
      saveSecureStore(authUserIdKey, JSON.stringify(details) as string);
      set({ user: details });
    },
    signOut() {
      set({ token: null, user: null });
      deleteKeySecureStore(authTokenKey)
        .then(console.log)
        .catch((err) => console.log(`deleteKeySecureStore - ERROR : ${err}`));
      deleteKeySecureStore(authUserIdKey)
        .then(console.log)
        .catch((err) => console.log(`deleteKeySecureStore - ERROR : ${err}`));
    },
  }))
);
