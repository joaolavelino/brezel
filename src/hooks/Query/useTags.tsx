import { queryKeys } from "@/constants/queryKeys";
import { getTags } from "@/services/tagsServices";
import { useQuery } from "@tanstack/react-query";

export function useGetTags() {
  return useQuery({
    queryFn: getTags,
    queryKey: queryKeys.tags.all,
  });
}
