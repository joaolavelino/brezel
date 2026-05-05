import { queryKeys } from "@/constants/queryKeys";
import { createEntryLink, deleteEntryLink } from "@/services/links";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateLink(entryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEntryLink,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
    },
  });
}

export function useDeleteLink(entryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEntryLink,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
    },
  });
}
