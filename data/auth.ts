import { postData } from "@/lib/fetch";
import {
  useQuery,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  type SiginFormSchemaType,
  type SignupFormSchemaType,
} from "@/schemas/auth";
import { UserDetailsType } from "@/schemas/users";
import { ResponseError } from "@/errors/response-error";
import { SuccessResponseData } from "@/types/response";

export const AUTH_USER = "AUTH_USER";

export type AuthTokenResponse = unknown;

export function signInUser(
  opts?: Omit<
    UseMutationOptions<AuthTokenResponse, ResponseError, SiginFormSchemaType>,
    "mutationKey" | "mutationFn"
  >
) {
  const resultMutation = useMutation<
    AuthTokenResponse,
    ResponseError,
    SiginFormSchemaType
  >({
    mutationKey: [AUTH_USER],
    async mutationFn(credentials: SiginFormSchemaType) {
      return await postData("/api/v1/auth/signin", JSON.stringify(credentials));
    },
    ...opts,
  });
  return resultMutation;
}

export function signUpUser(
  opts?: Omit<
    UseMutationOptions<
      SuccessResponseData<UserDetailsType>,
      ResponseError,
      SignupFormSchemaType
    >,
    "mutationKey" | "mutationFn"
  >
) {
  const resultMutation = useMutation<
    SuccessResponseData<UserDetailsType>,
    ResponseError,
    SignupFormSchemaType
  >({
    mutationKey: [AUTH_USER],
    async mutationFn(credentials: SignupFormSchemaType) {
      return await postData<UserDetailsType>(
        "/api/v1/auth/signup",
        JSON.stringify(credentials)
      );
    },
    ...opts,
  });
  return resultMutation;
}
