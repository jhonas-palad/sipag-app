import { KEYWORDS } from "@/lib/constants";
import { getDataRedirect } from "@/lib/fetch";
import { useAuthSession } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useRouter } from "expo-router";
export const useGetAccomplishedWasteReports = () => {
  const { token, user } = useAuthSession(
    useShallow((state) => ({ token: state.token, user: state.user }))
  );
  const router = useRouter();
  return useQuery({
    queryKey: [KEYWORDS.ACCOMPLISHED_WASTE_REPORTS],
    queryFn: async () => {
      return await getDataRedirect(
        `/api/v1/waste-reports?cleaner=${user?.id}`,
        token,
        {},
        router
      );
    },
    select(data: any) {
      return data?.data;
    },
  });
};
