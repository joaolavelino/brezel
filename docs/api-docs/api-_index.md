# API Reference — Brezel

All routes are prefixed with `/api`.
All routes require authentication. Unauthenticated requests return `401`.

---

## Error Response Shape

All errors follow this structure:

```json
{
  "status": 400,
  "code": "NOT_FOUND",
  "message": "Entry not found"
}
```

4xx errors return a user-facing message.
5xx errors return a generic message — details are logged server-side only.

---

## Sections

- [Entries](./api-entries.md)
- [Tags](./api-tags.md)
- [Definitions](./api-definitions.md)
- [Examples](./api-examples.md)
