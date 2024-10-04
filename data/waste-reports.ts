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

import { produce } from "immer";

import { Router, useRouter } from "expo-router";
import { minToSec } from "@/lib/util";
import { KEYWORDS } from "@/lib/constants";

const ENDPOINT = "/api/v1/waste-reports/";
export const WASTE_REPORTS = "WASTE_REPORTS";

export const useGetFilteredWasteReports = (
  params: string,
  opts?: Omit<
    UseQueryOptions<
      SuccessResponseData<WastePost[]>,
      ResponseError,
      WastePost[]
    >,
    "queryKey" | "queryFn" | "select"
  >
) => {
  let url = ENDPOINT;
  const { token, user } = useAuthSession(
    useShallow((state) => ({ token: state.token, user: state.user }))
  );
  const router = useRouter();
  let paramsQ = "?";
  switch (params) {
    case "pending":
      paramsQ += "status=INPROGRESS&";
      break;
    case "available":
      paramsQ += "status=AVAILABLE&";
      break;
    case "cleared":
      paramsQ += "status=CLEARED&";
      break;
    case "myposts":
      paramsQ += `posted_by=${user?.id}&`;
  }

  url += paramsQ;
  return useQuery<SuccessResponseData<WastePost[]>, ResponseError, WastePost[]>(
    {
      queryKey: [WASTE_REPORTS, params],
      async queryFn() {
        return (await getDataRedirect(url, token, {}, router)) as any;
      },
      select(data) {
        return data.data as WastePost[];
      },
      ...opts,
    }
  ) as any;
};
export const useGetAllWasteReports = (
  opts?: Omit<
    UseQueryOptions<
      SuccessResponseData<WastePost[]>,
      ResponseError,
      WastePost[]
    >,
    "queryKey" | "queryFn" | "select"
  >
) => {
  const url = ENDPOINT;
  const token = useAuthSession(useShallow((state) => state.token));
  const router = useRouter();
  return useQuery<SuccessResponseData<WastePost[]>, ResponseError, WastePost[]>(
    {
      queryKey: [WASTE_REPORTS],
      async queryFn() {
        return (await getDataRedirect(url, token, {}, router)) as any;
      },
      select(data) {
        return data.data as WastePost[];
      },
      ...opts,
    }
  ) as any;
};
export const useGetWasteReportPostDetail = (
  id: string,
  opts?: Omit<
    UseQueryOptions<
      SuccessResponseData<WastePost[]>,
      ResponseError,
      WastePost[]
    >,
    "queryKey" | "queryFn" | "select"
  >
) => {
  const url = ENDPOINT + String(id);
  const token = useAuthSession(useShallow((state) => state.token));

  const router = useRouter();
  const q = useQuery<SuccessResponseData<WastePost>, ResponseError, WastePost>({
    queryKey: [WASTE_REPORTS + id],
    async queryFn() {
      return (await getDataRedirect(url, token, {}, router)) as any;
    },
    select(data) {
      return data.data as WastePost;
    },
    // refetchInterval: minToSec(1),
    ...opts,
  }) as any;

  return q;
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
      queryClient.invalidateQueries({
        queryKey: [WASTE_REPORT_ACTIVITIES],
      });
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
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({ queryKey: [WASTE_REPORTS] });
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
      console.log({ variables });
      queryClient.invalidateQueries({
        queryKey: [WASTE_REPORTS],
      });
      if (variables.action === "done") {
        [KEYWORDS.ACCOMPLISHED_WASTE_REPORTS, KEYWORDS.CLEANER_POINTS].forEach(
          (queryKey) => {
            queryClient.invalidateQueries({
              queryKey: [queryKey],
            });
          }
        );
      }
      queryClient.setQueryData(
        [WASTE_REPORTS + id],
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
