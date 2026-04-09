import { queryKeys } from "@/constants/queryKeys";
import { createEntry, getEntries } from "@/services/entries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.entries.all,
    mutationFn: createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entries.all });
    },
  });
}
export function useGetEntries() {
  return useQuery({
    queryFn: getEntries,
    queryKey: queryKeys.entries.all,
  });
}
