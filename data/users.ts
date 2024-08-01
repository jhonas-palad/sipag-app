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
export const users: User[] = [
  { id: 1, firstName: "John", lastName: "Smith" },
  { id: 2, firstName: "Emily", lastName: "Johnson" },
  { id: 3, firstName: "Michael", lastName: "Davis" },
  { id: 4, firstName: "Sarah", lastName: "Brown" },
  { id: 5, firstName: "David", lastName: "Wilson" },
];

export const userPosts: UserPost[] = [
  {
    user: findItem(users, 1)!,
    ...findItem(wastePosts, 1)!,
  },
  {
    user: findItem(users, 1)!,
    ...findItem(wastePosts, 2)!,
  },
  {
    user: findItem(users, 2)!,
    ...findItem(wastePosts, 3)!,
  },
  {
    user: findItem(users, 2)!,
    ...findItem(wastePosts, 4)!,
  },
  {
    user: findItem(users, 3)!,
    ...findItem(wastePosts, 5)!,
  },
  {
    user: findItem(users, 3)!,
    ...findItem(wastePosts, 6)!,
  },
  {
    user: findItem(users, 5)!,
    ...findItem(wastePosts, 7)!,
  },
  {
    user: findItem(users, 3)!,
    ...findItem(wastePosts, 8)!,
  },
  {
    user: findItem(users, 4)!,
    ...findItem(wastePosts, 10)!,
  },
  {
    user: findItem(users, 4)!,
    ...findItem(wastePosts, 9)!,
  },
];

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
      const url = new URL(`/api/v1/auth/signup`, BASE_URL).toString();
      const { status, body } = await FileSystem.uploadAsync(
        url,
        photo?.url as string,
        {
          fieldName: "photo",
          httpMethod: "POST",
          parameters: {
            email: email!,
            first_name: first_name!,
            last_name: last_name!,
            password: password!,
            phone_number: phone_number!,
          },
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        }
      );
      if (status >= 400) {
        throw new ResponseError(
          `Failed to create user: ${status}`,
          null,
          body,
          status
        );
      }
      return body;
    },
    ...opts,
  });
}
