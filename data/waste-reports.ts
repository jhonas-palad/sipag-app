import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import FormData from "form-data";
import { postDataWithImage, getData, postData } from "@/lib/fetch";
import { WasteReportSchemaT } from "@/schemas/waste-report";
import { ResponseError } from "@/errors/response-error";
import { WastePost } from "@/types/maps";
import { SuccessResponseData } from "@/types/response";
import { useAuthSession } from "@/store/auth";
import { useShallow } from "zustand/react/shallow";

const ENDPOINT = "/api/v1/waste-report/";
export const WASTE_REPORTS = "WASTE_REPORTS";
export const useWasteReportPosts = (id: string | false | null = null) => {
  const token = useAuthSession(useShallow((state) => state.token));
  const url = id !== null ? ENDPOINT + String(id) : ENDPOINT;
  return useQuery<unknown, ResponseError, SuccessResponseData<WastePost>>({
    queryKey: [WASTE_REPORTS, id],
    async queryFn() {
      if (id === false) {
        return null;
      }
      return await getData(url, token);
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
