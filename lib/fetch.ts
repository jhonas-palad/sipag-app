import { agetValueSecureStore } from "./secure-store";
import { authTokenKey } from "@/store/auth";
import * as FileSystem from "expo-file-system";
import { ResponseError } from "@/errors/response-error";
import { SuccessResponseData } from "@/types/response";
import FormData from "form-data";
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
  body: RequestInit["body"] | Record<string, string> | FormData,
  token: string | null = "",
  contentType: string = "application/json",
  opts?: RequestInit
) {
  let tokenInit = token ? await initAuth(token) : {};
  let init = { ...tokenInit, ...opts };
  init.method = "POST";
  init.body = body as RequestInit["body"];
  init.headers = {
    "Content-Type": contentType,
    ...init.headers,
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

export const postDataWithImage = async (
  url: string,
  body: {
    image: string;
    [key: string]: any;
  },
  token: string | null = null,
  opts?: RequestInit
) => {
  url = String(new URL(url, BASE_URL));
  const bodyClone = { ...body };
  const imageUri = bodyClone.image;
  //@ts-ignore
  delete bodyClone.image;
  let tokenInit = token ? await initAuth(token) : {};
  let init = { ...tokenInit, ...opts };
  let headers = init.headers ?? {};
  const { status, body: responseBody } = await FileSystem.uploadAsync(
    url,
    imageUri,
    {
      fieldName: "image",
      httpMethod:
        (init.method as FileSystem.FileSystemAcceptedUploadHttpMethod) ??
        "POST",
      parameters: {
        ...bodyClone,
      },

      headers: headers as Record<string, string>,
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    }
  );
  if (status >= 400) {
    console.log("status", status);
    throw new ResponseError(
      `Failed to post data: ${status}`,
      null,
      responseBody,
      status
    );
  }
  return body;
};

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
