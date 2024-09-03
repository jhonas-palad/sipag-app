import {
  UseQueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryResult,
  usePrefetchQuery,
  FetchQueryOptions,
} from "@tanstack/react-query";
import FormData from "form-data";
import { getDataRedirect, postDataRedirect } from "@/lib/fetch";
import { WasteReportSchemaT } from "@/schemas/waste-report";
import { ResponseError } from "@/errors/response-error";
import { WastePost } from "@/types/maps";
import { type SuccessResponseData } from "@/types/response";
import { useAuthSession } from "@/store/auth";
import { useShallow } from "zustand/react/shallow";
import { log } from "@/utils/logger";
import { produce } from "immer";
import { useWs } from "@/hooks/useWebSocket";
import { useCallback } from "react";
import { Router, useRouter } from "expo-router";

const ENDPOINT = "/api/v1/waste-reports/";
export const WASTE_REPORTS = "WASTE_REPORTS";

type ReturnQueryWasteReport<T> = T extends string
  ? UseQueryResult<WastePost, ResponseError>
  : UseQueryResult<WastePost[], ResponseError>;

type ReturnDataWasteReport<T> = T extends string ? WastePost : WastePost[];
export const useWasteReportPosts = <T extends string | null>(
  id: T,
  opts?: Omit<
    UseQueryOptions<
      SuccessResponseData<ReturnDataWasteReport<T>>,
      ResponseError,
      ReturnDataWasteReport<T>
    >,
    "queryKey" | "queryFn" | "select"
  >
): ReturnQueryWasteReport<T> => {
  log.debug(
    id === null ? "Fetching waste reports." : `Fetching waste report id : ${id}`
  );
  const url = id !== null ? ENDPOINT + String(id) : ENDPOINT;
  const token = useAuthSession(useShallow((state) => state.token));
  const router = useRouter();
  const queryKey = [WASTE_REPORTS];
  if (id) {
    queryKey.push(id as string);
  }
  return useQuery<
    SuccessResponseData<ReturnDataWasteReport<T>>,
    ResponseError,
    ReturnDataWasteReport<T>
  >({
    queryKey,
    async queryFn() {
      return (await getDataRedirect(url, token, {}, router)) as any;
    },
    select(data) {
      return data.data as ReturnDataWasteReport<T>;
    },
    ...opts,
  }) as any;
};

export const useDeleteWastReport = (
  opts?: UseMutationOptions<SuccessResponseData<unknown>, ResponseError, string>
) => {
  const token = useAuthSession(useShallow((state) => state.token));
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<SuccessResponseData<unknown>, ResponseError, string>({
    async mutationFn(id) {
      const url = `${ENDPOINT}${id}`;
      return (await postDataRedirect(
        url,
        token,
        {
          method: "DELETE",
        },
        router
      )) as SuccessResponseData<unknown>;
    },
    ...opts,
    async onSuccess(data, id, context) {
      queryClient.removeQueries({ queryKey: [WASTE_REPORTS, id] });
      queryClient.setQueryData(
        [WASTE_REPORTS],
        (oldResponse: SuccessResponseData<WastePost[]>) => {
          return produce(oldResponse, (draftResponse) => {
            draftResponse.data = draftResponse.data.filter(
              (item: WastePost) => {
                return String(item.id) !== String(id);
              }
            );
          });
        }
      );
      opts?.onSuccess?.(data, id, context);
    },
  });
};

export const useCreateReportPost = (
  opts?: UseMutationOptions<
    SuccessResponseData<WastePost>,
    ResponseError,
    WasteReportSchemaT
  >
) => {
  const token = useAuthSession(useShallow((state) => state.token));
  const router = useRouter();
  return useMutation<
    SuccessResponseData<WastePost>,
    ResponseError,
    WasteReportSchemaT
  >({
    // mutationKey: ["CREATE_WASTE_REPORT"],
    async mutationFn({ title, description, image, location }) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("image", {
        uri: image.url,
        name: image.fileName,
        type: image.mimeType,
      });
      formData.append("latitude", String(location.latitude));
      formData.append("longitude", String(location.longitude));

      return (await postDataRedirect(
        ENDPOINT,
        token,
        {
          //@ts-ignore
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        router
      )) as SuccessResponseData<WastePost>;
    },
    ...opts,
    async onSuccess(data, variables, context) {
      // queryClient.setQueryData(
      //   [WASTE_REPORTS],
      //   (oldResponse: SuccessResponseData<WastePost[]>) => {
      //     return produce(oldResponse, (draftResponse) => {
      //       draftResponse.data = [data.data, ...draftResponse.data];
      //     });
      //   }
      // );
      await opts?.onSuccess?.(data, variables, context);
    },
  });
};

type ActionParams = {
  action: "accept" | "cancel" | "done";
};
export const useWasteReportActions = (
  id: string,
  opts?: UseMutationOptions<
    SuccessResponseData<WastePost>,
    ResponseError,
    ActionParams
  >
) => {
  let mutationKey = opts?.mutationKey
    ? ["CREATE_WASTE_REPORT_ACTION", id, ...opts.mutationKey]
    : ["CREATE_WASTE_REPORT_ACTION", id];

  const url = "/api/v1/waste-reports/" + id + "/tasks";
  const queryClient = useQueryClient();
  const token = useAuthSession(useShallow((state) => state.token));
  const router = useRouter();
  return useMutation<
    SuccessResponseData<WastePost>,
    ResponseError,
    ActionParams
  >({
    ...opts,
    mutationKey,
    async mutationFn({ action }) {
      return (await postDataRedirect(
        url,
        token,
        {
          body: JSON.stringify({
            action,
          }),
        },
        router
      )) as SuccessResponseData<WastePost>;
    },
    async onSuccess(data, variables, context) {
      queryClient.setQueryData(
        [WASTE_REPORTS, id],
        (oldState: SuccessResponseData<WastePost>) => {
          return produce(oldState, (draftState) => {
            draftState.data = data.data.result;
          });
        }
      );
      opts?.onSuccess?.(data, variables, context);
    },
  });
};

export type WasteReportActivitiesQuery = UseQueryResult<any[], ResponseError>;
export const WASTE_REPORT_ACTIVITIES = "WASTE_REPORT_ACTIVITIES";

const fetchWasteReportActivities = async (
  token: string | null,
  router: Router
) => {
  return (await getDataRedirect(
    "/api/v1/waste-reports/activites",
    token,
    {},
    router
  )) as SuccessResponseData<any>;
};

export const useWasteReportActivitiesPrefetch = (
  opts?: FetchQueryOptions<Promise<SuccessResponseData<any>>, ResponseError>
) => {
  const token = useAuthSession(useShallow((state) => state.token));
  const router = useRouter();
  return usePrefetchQuery<Promise<SuccessResponseData<any>>, ResponseError>({
    queryKey: [WASTE_REPORT_ACTIVITIES],
    async queryFn() {
      return (await fetchWasteReportActivities(
        token,
        router
      )) as SuccessResponseData<any>;
    },
    ...opts,
  });
};

export const useWasteReportActivities = (
  opts?: UseQueryOptions<SuccessResponseData<any[]>, ResponseError>
) => {
  const token = useAuthSession(useShallow((state) => state.token));
  const router = useRouter();
  return useQuery<SuccessResponseData<any[]>, ResponseError>({
    queryKey: [WASTE_REPORT_ACTIVITIES],
    async queryFn() {
      return await fetchWasteReportActivities(token, router);
    },
    select(data) {
      return data.data;
    },
    ...opts,
  });
};

export const useRealTimeWasteReportActivities = () => {
  const queryClient = useQueryClient();
  const handleSetQueryData = useCallback(
    (event: WebSocketEventMap["message"]) => {
      const { message } = JSON.parse(event.data);
      queryClient.setQueryData(
        [WASTE_REPORT_ACTIVITIES],
        (oldResponse: SuccessResponseData<any>) => {
          return produce(oldResponse, (draftResponse) => {
            draftResponse.data = [message, ...draftResponse.data];
          });
        }
      );
      queryClient.setQueryData(
        [WASTE_REPORTS],
        (oldResponse: SuccessResponseData<WastePost[]>) => {
          return produce(oldResponse, (draftResponse) => {
            //Add the post in the list
            if (
              message.activity === "ADDED_POST" &&
              draftResponse.data.findIndex(
                (item: WastePost) => item.id === message.post.id
              ) === -1
            ) {
              draftResponse.data = [message.post, ...draftResponse.data];

              return;
            }
            //Modify the waste post in the list
            draftResponse.data = draftResponse.data.map((post: WastePost) => {
              if (String(post.id) !== String(message.post.id)) {
                return post;
              }
              return message.post;
            });
          });
        }
      );
    },
    [queryClient]
  );

  const ws = useWs("waste-report-activities/", {
    onMessage: handleSetQueryData,
  });
  return ws;
};
