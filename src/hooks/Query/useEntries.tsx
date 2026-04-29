import { queryKeys } from "@/constants/queryKeys";
import {
  createEntry,
  getEntries,
  getEntry,
  setPrimaryDefinition,
} from "@/services/entries";
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

export function useGetEntry(id: string) {
  return useQuery({
    queryFn: () => getEntry(id),
    queryKey: queryKeys.entries.detail(id),
  });
}

export function useSetPrimaryDefinition(entryId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.entries.detail(entryId),
    mutationFn: setPrimaryDefinition,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
    },
  });
}
