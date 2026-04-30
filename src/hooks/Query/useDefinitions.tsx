import { queryKeys } from "@/constants/queryKeys";
import { createDefinition, updateDefinition } from "@/services/definitions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateDefinition(entryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.entries.detail(entryId),
    mutationFn: createDefinition,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
    },
  });
}

export function useUpdateDefinition(entryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.entries.detail(entryId),
    mutationFn: updateDefinition,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
    },
  });
}
