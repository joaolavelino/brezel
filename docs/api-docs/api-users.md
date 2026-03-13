# User API

---

## DELETE /api/user

Permanently deletes the authenticated user and all their data.

This includes all entries, definitions, examples, tags, links, accounts, and sessions. This action is irreversible.

### Response

```json
{
  "data": {
    "id": "cmmfcevsd0000788zc6igja71"
  }
}
```

### Error Cases

| Status | Code                    | When                    |
| ------ | ----------------------- | ----------------------- |
| `401`  | `UNAUTHORIZED`          | No active session       |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error |
