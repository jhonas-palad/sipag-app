import { useQueryClient, InvalidateQueryFilters } from "@tanstack/react-query";

export const useRefreshQuery = (filter: InvalidateQueryFilters) => {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.refetchQueries(filter);
  };

  return handleRefresh;
};
export const useInvalidateQuery = (filter: InvalidateQueryFilters) => {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries(filter);
  };

  return handleRefresh;
};
