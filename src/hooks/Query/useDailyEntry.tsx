import { queryKeys } from "@/constants/queryKeys";
import { saveDailyEntry } from "@/services/dailyEntries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSaveDailyEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveDailyEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
    },
  });
}
