import { agetValueSecureStore } from "./secure-store";
import { authTokenKey } from "@/store/auth";
import { ResponseError } from "@/errors/response-error";
import { SuccessResponseData } from "@/types/response";
import { Router } from "expo-router";
export const BASE_URL =
  process.env.EXPO_PUBLIC_MODE === "development"
    ? process.env.EXPO_PUBLIC_SIPAG_API_URL
    : "";

export async function fetchData<T extends any>(
  url: string | URL,
  opts?: RequestInit
): Promise<SuccessResponseData<T>> {
  url = new URL(url, BASE_URL);
  let response = await fetch(url, { ...opts });
  let badStatus = false;
  if (!response.ok) {
    badStatus = true;
  }

  let data;
  try {
    data = await response.json();
    if (badStatus) {
      throw data;
    }
  } catch (err) {
    if (badStatus) {
      let e = (err as Error)?.message ? err instanceof Error : err;
      throw new ResponseError(`fetchData error`, null, e, response.status);
    }
  }

  return {
    data,
    status: response.status,
  };
}

export async function postData<T>(
  url: string | URL,
  token: string | null = "",
  opts?: RequestInit
) {
  let tokenInit = token ? await initAuth(token) : {};
  let init = { ...tokenInit, ...opts };
  init.method = init.method ?? "POST";
  init.headers = {
    "Content-Type": "application/json",
    ...init.headers,
    ...tokenInit.headers,
  };
  return await fetchData<T>(url, init);
}

export async function getData(
  url: string | URL,
  token: string | null = null,
  opts: RequestInit = {}
) {
  let init = { ...(await initAuth(token)), ...opts };
  return await fetchData(url, init);
}

export const fetchRedirectWrapper =
  <T>(func: (...args: any) => Promise<SuccessResponseData<T>>) =>
  async (
    url: string | URL,
    token: string | null,
    opts: RequestInit = {},
    router: Router
  ) => {
    try {
      return await func(url, token, opts);
    } catch (err) {
      if (err instanceof ResponseError && err.status === 401) {
        router.replace("/auth");
      } else {
        throw err;
      }
    }
  };

export const getDataRedirect = fetchRedirectWrapper(getData);
export const postDataRedirect = fetchRedirectWrapper(postData);

export const initAuth = async (token: string | null): Promise<RequestInit> => {
  if (!token) {
    token = await agetValueSecureStore(authTokenKey);
  }
  if (!token) {
    throw Error("No authentication token stored");
  }
  const initOpts = {
    headers: {
      Authorization: "Bearer " + token!,
    },
  };
  return initOpts;
};
