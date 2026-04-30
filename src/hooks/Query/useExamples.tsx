import { queryKeys } from "@/constants/queryKeys";
import {
  createExample,
  deleteExample,
  updateExample,
} from "@/services/examples";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateExample(entryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExample,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
    },
  });
}

export function useUpdateExample(entryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExample,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
    },
  });
}
export function useDeleteExample(entryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExample,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
    },
  });
}
