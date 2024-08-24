import {
  UseQueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryResult,
  QueryFunction,
} from "@tanstack/react-query";
import FormData from "form-data";
import { postDataWithImage, getData, postData } from "@/lib/fetch";
import { WasteReportSchemaT } from "@/schemas/waste-report";
import { ResponseError } from "@/errors/response-error";
import { WastePost } from "@/types/maps";
import { type SuccessResponseData } from "@/types/response";
import { useAuthSession } from "@/store/auth";
import { useShallow } from "zustand/react/shallow";
import { log } from "@/utils/logger";

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
  // if (id === false) {
  //   return null as any; // TypeScript needs explicit casting here
  // }

  log.debug(
    id === null ? "Fetching waste reports." : `Fetching waste report id : ${id}`
  );
  const token = useAuthSession(useShallow((state) => state.token));
  const url = id !== null ? ENDPOINT + String(id) : ENDPOINT;

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
      return await getData(url, token);
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

  return useMutation<SuccessResponseData<unknown>, ResponseError, string>({
    async mutationFn(id) {
      const url = `${ENDPOINT}${id}`;
      return await postData(url, {}, token, "application/json", {
        method: "DELETE",
      });
    },
    ...opts,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [WASTE_REPORTS] });
      opts?.onSuccess?.(data, variables, context);
    },
  });
};

export const useCreateReportPost = (
  opts?: UseMutationOptions<unknown, ResponseError, WasteReportSchemaT>
) => {
  const queryClient = useQueryClient();
  const token = useAuthSession(useShallow((state) => state.token));
  return useMutation<unknown, ResponseError, WasteReportSchemaT>({
    mutationKey: ["CREATE_WASTE_REPORT"],
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

      return await postData(
        ENDPOINT,
        formData as FormData,
        token,
        "multipart/form-data"
      );
    },
    ...opts,
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({ queryKey: [WASTE_REPORTS] });
      await opts?.onSuccess?.(data, variables, context);
    },
  });
};

type ActionParams = {
  action: "accept" | "cancel" | "done";
};
export const useWasteReportActions = (
  id: string,
  opts?: UseMutationOptions<unknown, ResponseError, ActionParams>
) => {
  let mutationKey = opts?.mutationKey
    ? ["CREATE_WASTE_REPORT_ACTION", id, ...opts.mutationKey]
    : ["CREATE_WASTE_REPORT_ACTION", id];

  const url = "/api/v1/waste-reports/" + id + "/tasks";
  const queryClient = useQueryClient();
  const token = useAuthSession(useShallow((state) => state.token));
  return useMutation<unknown, ResponseError, ActionParams>({
    ...opts,
    mutationKey,
    async mutationFn({ action }) {
      return await postData(
        url,
        JSON.stringify({
          action,
        }),
        token
      );
    },
    async onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey: [WASTE_REPORTS] });
      opts?.onSuccess?.(data, variables, context);
    },
  });
};
