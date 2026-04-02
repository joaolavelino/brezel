export const queryKeys = {
  entries: {
    all: ["entries"] as const,
    detail: (id: string) => ["entries", id] as const,
  },
  tags: {
    all: ["tags"] as const,
    detail: (id: string) => ["tags", id] as const,
  },
};
