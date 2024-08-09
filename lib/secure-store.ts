import { EmptySecureStoreValue } from "@/errors/secure-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";

export function saveSecureStore(key: string, value: string) {
  SecureStore.setItem(key, value);
}

export async function asaveSecureStore(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function agetValueSecureStore(
  key: string,
  throwEmpty: boolean = false
) {
  const value = await SecureStore.getItemAsync(key);
  if (throwEmpty && value === null) {
    throw new EmptySecureStoreValue(`${key} not found in Secure Store`);
  }
  return value;
}

export function getValueSecureStore(key: string, throwEmpty: boolean = false) {
  const value = SecureStore.getItem(key);
  if (throwEmpty && value === null) {
    throw new EmptySecureStoreValue(`${key} not found in Secure Store`);
  }
  return value;
}

export async function deleteKeySecureStore(key: string) {
  await SecureStore.deleteItemAsync(key);
}
export const useSaveSecureStore = () => {
  return useMutation<unknown, Error, { key: string; value: string }>({
    mutationKey: ["saveSecureStore"],
    async mutationFn({ key, value }) {
      return await asaveSecureStore(key, value);
    },
  });
};
export const useGetSecureStore = (key: string) => {
  return useQuery({
    queryKey: ["getSecureStore"],
    async queryFn() {
      return await agetValueSecureStore(key);
    },
  });
};
