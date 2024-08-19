import { User, UserPost } from "@/types/user";
import { wastePosts } from "./waste-posts";
import { findItem } from "@/utils/array";
import { WastePost } from "@/types/maps";
import { postData } from "@/lib/fetch";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { type ImagePickerAsset } from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { BASE_URL } from "@/lib/fetch";
import { ResponseError } from "@/errors/response-error";
import { SignupSchemaAllOptionalType } from "@/schemas/auth";
import { UserDetailsType } from "@/schemas/users";
import FormData from "form-data";

export type UploadPhotoParams = {
  id: User["id"];
  uri: ImagePickerAsset["uri"];
};

export function createUser(
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
      // const url = new URL(`/api/v1/auth/signup`, BASE_URL).toString();
      const formData = new FormData();
      formData.append("email", email ?? "");
      formData.append("first_name", first_name ?? "");
      formData.append("last_name", last_name ?? "");
      formData.append("password", password ?? "");
      formData.append("phone_number", phone_number ?? "");
      console.log(photo);
      formData.append("photo", {
        uri: photo!.url,
        name: photo!.fileName,
        type: photo!.mimeType,
      });
      return await postData(
        "/api/v1/auth/signup",
        formData as FormData,
        null,
        "multipart/form-data"
      );
      // const { status, body } = await FileSystem.uploadAsync(
      //   url,
      //   photo?.url as string,
      //   {
      //     fieldName: "photo",
      //     httpMethod: "POST",
      //     parameters: {
      //       email: email!,
      //       first_name: first_name!,
      //       last_name: last_name!,
      //       password: password!,
      //       phone_number: phone_number!,
      //     },
      //     uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      //   }
      // );
      // if (status >= 400) {
      //   throw new ResponseError(
      //     `Failed to create user: ${status}`,
      //     null,
      //     body,
      //     status
      //   );
      // }
      // return body;
    },
    ...opts,
  });
}
