import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";
import { postDataWithImage, getData } from "@/lib/fetch";
import { WasteReportSchemaT } from "@/schemas/waste-report";

import { ResponseError } from "@/errors/response-error";
import { WastePost } from "@/types/maps";
import { SuccessResponseData } from "@/types/response";
import { useAuthSession } from "@/store/auth";
import { useShallow } from "zustand/react/shallow";

const ENDPOINT = "/api/v1/waste-report/";
export const WASTE_REPORTS = Symbol("WASTE_REPORTS");
export const useWasteReportPosts = (id: string | null = null) => {
  const token = useAuthSession(useShallow((state) => state.token));
  const url = id !== null ? ENDPOINT + String(id) + "/" : ENDPOINT;
  return useQuery<unknown, ResponseError, SuccessResponseData<WastePost>>({
    queryKey: [WASTE_REPORTS, id],
    async queryFn() {
      return await getData(url, token);
    },
  });
};

export const useCreateReportPost = (
  opts?: UseMutationOptions<unknown, ResponseError, WasteReportSchemaT>
) => {
  const token = useAuthSession(useShallow((state) => state.token));
  return useMutation<unknown, ResponseError, WasteReportSchemaT>({
    async mutationFn({ title, description, image, location }) {
      return await postDataWithImage(
        "/api/v1/waste-report/",
        {
          title,
          image,
          description,
          latitude: String(location.latitude),
          longitude: String(location.longitude),
        },
        token,
        { method: "POST" }
      );
    },
    ...opts,
  });
};
