import { useQuery } from "@tanstack/react-query";
import { ResponseError } from "@/errors/response-error";
import { SuccessResponseData } from "@/types/response";
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
  body: RequestInit["body"],
  contentType: string = "application/json",
  opts?: RequestInit
) {
  let init = opts || {};
  init.method = "POST";
  init.body = body;
  init.headers = {
    "Content-Type": contentType,
    ...init.headers,
  };
  return await fetchData<T>(url, init);
}

export async function getData(url: string | URL, opts: RequestInit = {}) {
  return await fetchData(url, opts);
}
