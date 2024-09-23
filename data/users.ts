import { User } from "@/types/user";
import { getData, postData } from "@/lib/fetch";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";
import { type ImagePickerAsset } from "expo-image-picker";
import { ResponseError } from "@/errors/response-error";
import { SignupSchemaAllOptionalType } from "@/schemas/auth";

import FormData from "form-data";
import { KEYWORDS } from "@/lib/constants";
import { useAuthSession } from "@/store/auth";
import { useShallow } from "zustand/react/shallow";

export type UploadPhotoParams = {
  id: User["id"];
  uri: ImagePickerAsset["uri"];
};

export function useCreateUser(
  opts?: Omit<
    UseMutationOptions<unknown, ResponseError, SignupSchemaAllOptionalType>,
    "mutationKey" | "mutationFn"
  >
) {
  return useMutation<unknown, ResponseError, SignupSchemaAllOptionalType>({
    async mutationFn({
      email,
      first_name,
      last_name,
      password,
      phone_number,
      photo,
    }) {
      const formData = new FormData();
      formData.append("email", email ?? "");
      formData.append("first_name", first_name ?? "");
      formData.append("last_name", last_name ?? "");
      formData.append("password", password ?? "");
      formData.append("phone_number", phone_number ?? "");
      formData.append("photo", {
        uri: photo!.url,
        name: photo!.fileName,
        type: photo!.mimeType,
      });
      return await postData("/api/v1/auth/signup", null, {
        //@ts-ignore
        body: formData as FormData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    ...opts,
  });
}
