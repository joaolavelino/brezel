import { queryKeys } from "@/constants/queryKeys";
import {
  createEntry,
  deleteEntry,
  getEntries,
  getEntry,
  restoreEntry,
  setPrimaryDefinition,
  updateEntry,
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

export function useUpdateEntry(entryId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.detail(entryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
    },
  });
}

export function useDeleteEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
    },
  });
}
export function useRestoreEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
    },
  });
}
