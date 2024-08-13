import { postData } from "@/lib/fetch";
import {
  useQuery,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  SignupSchema,
  type SiginFormSchemaType,
  type SignupFormSchemaType,
} from "@/schemas/auth";
import { UserDetailsType } from "@/schemas/users";
import { ResponseError } from "@/errors/response-error";
import { SuccessResponseData } from "@/types/response";
import { User } from "@/types/user";
import { agetValueSecureStore } from "@/lib/secure-store";
import * as zod from "zod";
import { authTokenKey, useAuthSession } from "@/store/auth";
import { useShallow } from "zustand/react/shallow";
export const AUTH_USER = "AUTH_USER";

export type AuthTokenResponse = SuccessResponseData<User & { token: string }>;

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
      return await postData(
        "/api/v1/auth/signin",
        JSON.stringify(credentials),
        null
      );
    },
    ...opts,
  });
  return resultMutation;
}

const UserCredentialsSchema = SignupSchema.omit({
  first_name: true,
  last_name: true,
  photo: true,
}).partial({
  email: true,
  phone_number: true,
});

type UserCredentialsSchemaType = zod.infer<typeof UserCredentialsSchema>;
export function validateCredentials(
  opts?: Omit<
    UseMutationOptions<
      SuccessResponseData<Omit<UserCredentialsSchemaType, "password">>,
      ResponseError,
      UserCredentialsSchemaType
    >,
    "mutationKey" | "mutationFn"
  >
) {
  const resultMutation = useMutation<
    SuccessResponseData<Omit<UserCredentialsSchemaType, "password">>,
    ResponseError,
    UserCredentialsSchemaType
  >({
    mutationKey: [AUTH_USER],
    async mutationFn(credentials: UserCredentialsSchemaType) {
      return await postData<UserDetailsType>(
        "/api/v1/users/credentials",
        JSON.stringify(credentials)
      );
    },
    ...opts,
  });
  return resultMutation;
}

export function useSignOutUser() {
  const resultMutation = useMutation({});
}

export function useIsValidToken() {
  const { isAuthenticated, token } = useAuthSession(
    useShallow((state) => ({
      token: state.token,
      isAuthenticated: state.isAuthenticated,
    }))
  );
  const resultMutation = useQuery({
    queryKey: [authTokenKey],
    async queryFn() {
      if (isAuthenticated()) {
        return await postData(
          "/api/v1/auth/verify",
          JSON.stringify({
            token: token!,
          }),
          null
        );
      }
      throw Error("No token found");
    },
  });
  return resultMutation;
}
