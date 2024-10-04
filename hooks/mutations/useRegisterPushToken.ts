import { ResponseError } from "@/errors/response-error";
import { postDataRedirect } from "@/lib/fetch";
import { useAuthSession } from "@/store/auth";
import { SuccessResponseData } from "@/types/response";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useShallow } from "zustand/react/shallow";

interface MutatePushTokenParams {}
function useRegisterPushToken(
  opts?: UseMutationOptions<
    SuccessResponseData<undefined>,
    ResponseError,
    string
  >
) {
  const router = useRouter();
  const { token, user } = useAuthSession(
    useShallow((state) => ({ token: state.token, user: state.user }))
  );
  const pushTokenUrl = "/api/v1/announcements/push-token";
  return useMutation<SuccessResponseData<undefined>, ResponseError, string>({
    async mutationFn(pushToken: string) {
      return (await postDataRedirect(
        pushTokenUrl,
        token,
        {
          body: JSON.stringify({ user: user?.id, token: pushToken }),
        },
        router
      )) as any;
    },
    ...opts,
  });
}

export { useRegisterPushToken };
