import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

type OnboardingValues = "string" | null;
export const useSetOnboardingFlag = (
  opts?: UseMutationOptions<void, Error, string>
) => {
  const { setItem } = useAsyncStorage(STORAGE_KEYS.ONBOARDING);
  return useMutation<void, Error, string>({
    async mutationFn(value: string) {
      return await setItem(value);
    },
    ...opts,
  });
};

//If true, redirect meaning onboarding done
export const useGetOnBoardingFlag = (
  opts?: UseQueryOptions<OnboardingValues, Error>
) => {
  const { getItem } = useAsyncStorage(STORAGE_KEYS.ONBOARDING);
  return useQuery<OnboardingValues, Error>({
    queryKey: [STORAGE_KEYS.ONBOARDING],
    queryFn: async () => {
      return (await getItem()) as OnboardingValues;
    },
    ...opts,
  });
};
