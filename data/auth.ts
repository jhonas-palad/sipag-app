import { postData, BASE_URL, getData } from "@/lib/fetch";
import {
  useQuery,
  useMutation,
  UseMutationOptions,
  useQueries,
} from "@tanstack/react-query";
import { SignupSchema, type SiginFormSchemaType } from "@/schemas/auth";
import { UserDetailsType } from "@/schemas/users";
import { ResponseError } from "@/errors/response-error";
import { SuccessResponseData } from "@/types/response";
import { User } from "@/types/user";
import * as zod from "zod";
import { authTokenKey, useAuthSession } from "@/store/auth";
import { useShallow } from "zustand/react/shallow";
import { log } from "@/utils/logger";
import { KEYWORDS } from "@/lib/constants";
import { minToSec } from "@/lib/util";
export const AUTH_USER = "AUTH_USER";

export type AuthTokenResponse = SuccessResponseData<User & { token: string }>;

export function useSigninUser(
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
      return await postData("/api/v1/auth/signin", null, {
        body: JSON.stringify(credentials),
      });
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
export function useValidateCredentials(
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
        null,
        {
          body: JSON.stringify(credentials),
        }
      );
    },
    ...opts,
  });
  return resultMutation;
}

export function useVerifiedUser() {
  const { getStoreAuth, token, user } = useAuthSession(
    useShallow((state) => ({
      token: state.token,
      getStoreAuth: state.getStoreAuth,
      user: state.user,
    }))
  );
  const query = useQueries({
    queries: [
      {
        queryKey: [authTokenKey],
        async queryFn() {
          if (getStoreAuth()) {
            log.debug("Verifying token");

            const result = await postData("/api/v1/auth/verify", null, {
              body: JSON.stringify({
                token: token!,
              }),
            });
            // return await postData("/api/v1/auth/verify", null, {
            //   body: JSON.stringify({
            //     token: token!,
            //   }),
            // });
            return result;
          }
          throw Error(KEYWORDS.NO_TOKEN_FOUND);
        },
        refetchInterval: minToSec(10),
      },
      {
        queryKey: [KEYWORDS.USER_DETAIL],
        async queryFn() {
          const { data } = await getData<User>(
            "/api/v1/users/" + user?.id,
            token
          );
          if (!data.is_verified) {
            throw Error(KEYWORDS.NOT_VERIFIED_USER);
          }
          return data;
        },
      },
    ],
  });

  return query;
}
