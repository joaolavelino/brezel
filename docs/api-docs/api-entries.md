# Entries API

## GET /api/entries

Returns entries for the authenticated user. Defaults to active entries only.

### Query Parameters

| Parameter | Type   | Required | Description                                                                  |
| --------- | ------ | -------- | ---------------------------------------------------------------------------- |
| `q`       | string | No       | Search term — matches against term or translation                            |
| `tag`     | string | No       | Filter by tag slug                                                           |
| `status`  | string | No       | `deleted` — soft-deleted entries. `incomplete` — entries with no definitions |

Query parameters are combinable. Search query is normalized before matching.

### Response

```json
{
  "data": [
    {
      "id": "cmmfcevsu0005788zzy72ybku",
      "term": "laufen",
      "termNormalized": "laufen",
      "form": "word",
      "notes": "One of those verbs that means different things depending on context.",
      "deletedAt": null,
      "createdAt": "2026-03-06T20:24:23.934Z",
      "updatedAt": "2026-03-06T20:24:23.937Z",
      "primaryDefinitionId": "cmmfcevsv0006788znu33hv8j",
      "primaryDefinition": {
        "id": "cmmfcevsv0006788znu33hv8j",
        "translation": "to run",
        "partOfSpeech": "verb",
        "nounArticle": null
      },
      "entryTags": [
        {
          "entryId": "cmmfcevsu0005788zzy72ybku",
          "tagId": "cmmfcevsk0003788zv8g8qkiv",
          "tag": {
            "id": "cmmfcevsk0003788zv8g8qkiv",
            "name": "Running",
            "slug": "running",
            "color": "#E25C4A"
          }
        }
      ]
    }
  ]
}
```

### Examples

| Request                               | Description                                      |
| ------------------------------------- | ------------------------------------------------ |
| `GET /api/entries`                    | All active entries                               |
| `GET /api/entries?q=laufen`           | Entries matching "laufen" in term or translation |
| `GET /api/entries?tag=running`        | Entries tagged "running"                         |
| `GET /api/entries?q=shoe&tag=running` | Combined filter                                  |
| `GET /api/entries?status=deleted`     | Soft-deleted entries                             |
| `GET /api/entries?status=incomplete`  | Entries with no definitions                      |

### Error Cases

| Status | Code                    | When                    |
| ------ | ----------------------- | ----------------------- |
| `401`  | `UNAUTHORIZED`          | No active session       |
| `400`  | `BAD_REQUEST`           | Invalid status value    |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error |

---

## GET /api/entries/:id

Returns a single entry with all definitions, examples, and links.

### URL Parameters

| Parameter | Type   | Required | Description  |
| --------- | ------ | -------- | ------------ |
| `id`      | string | Yes      | The entry id |

### Response

```json
{
  "data": {
    "id": "cmmfcevsu0005788zzy72ybku",
    "term": "laufen",
    "termNormalized": "laufen",
    "form": "word",
    "notes": "One of those verbs that means different things depending on context.",
    "deletedAt": null,
    "createdAt": "2026-03-06T20:24:23.934Z",
    "updatedAt": "2026-03-06T20:24:23.937Z",
    "primaryDefinitionId": "cmmfcevsv0006788znu33hv8j",
    "definitions": [
      {
        "id": "cmmfcevsv0006788znu33hv8j",
        "translation": "to run",
        "termOverride": null,
        "notes": null,
        "partOfSpeech": "verb",
        "nounArticle": null,
        "examples": [
          {
            "id": "cmmfcevsv0007788zs4rx28bb",
            "text": "Ich laufe jeden Morgen im Park.",
            "notes": null
          }
        ]
      }
    ],
    "links": [
      {
        "id": "cmmfcevt1000j788z3mp1lgew",
        "term": "laufschuh",
        "termNormalized": "laufschuh",
        "form": "word",
        "primaryDefinitionId": null
      }
    ]
  }
}
```

### Error Cases

| Status | Code                    | When                                           |
| ------ | ----------------------- | ---------------------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                              |
| `404`  | `NOT_FOUND`             | Entry doesn't exist or belongs to another user |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error                        |

---

## POST /api/entries

Creates a new entry for the authenticated user.

### Request Body

```json
{
  "term": "Fernweh",
  "notes": "longing for distant places",
  "form": "word",
  "tags": ["tag-id-here"]
}
```

| Field   | Type      | Required | Description                                                     |
| ------- | --------- | -------- | --------------------------------------------------------------- |
| `term`  | string    | Yes      | The term as encountered by the user                             |
| `notes` | string    | No       | Personal notes about the term                                   |
| `form`  | EntryForm | No       | word, phrase, idiom, question, not_sure. Defaults to `not_sure` |
| `tags`  | string[]  | No       | Array of tag ids to attach. Defaults to `[]`                    |

### Response

```json
{
  "data": {
    "id": "cmmma7q4q0004n88z34moge2x",
    "term": "Fernweh",
    "termNormalized": "fernweh",
    "form": "word",
    "notes": "longing for distant places",
    "deletedAt": null,
    "primaryDefinitionId": null,
    "createdAt": "2026-03-11T16:57:13.975Z",
    "updatedAt": "2026-03-11T16:57:13.975Z"
  }
}
```

### Error Cases

| Status | Code                    | When                              |
| ------ | ----------------------- | --------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                 |
| `400`  | `BAD_REQUEST`           | Invalid payload or duplicate term |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error           |

---

## PATCH /api/entries/:id

Updates an existing entry for the authenticated user. All fields are optional.

### URL Parameters

| Parameter | Type   | Required | Description  |
| --------- | ------ | -------- | ------------ |
| `id`      | string | Yes      | The entry id |

### Request Body

```json
{
  "term": "laufen",
  "form": "word",
  "notes": "updated note",
  "primaryDefinitionId": "def-id-here",
  "tags": ["tag-id-1", "tag-id-2"]
}
```

| Field                 | Type      | Required | Description                                                              |
| --------------------- | --------- | -------- | ------------------------------------------------------------------------ |
| `term`                | string    | No       | Updated term. Triggers normalization and duplicate check                 |
| `form`                | EntryForm | No       | word, phrase, idiom, question, not_sure                                  |
| `notes`               | string    | No       | Personal notes about the term                                            |
| `primaryDefinitionId` | string    | No       | ID of the definition to set as primary. Must belong to this entry        |
| `tags`                | string[]  | No       | Full desired tag state — replaces existing tags. Pass `[]` to remove all |

### Response

Returns the updated entry in the same shape as `GET /api/entries/:id`.

### Error Cases

| Status | Code                    | When                                                        |
| ------ | ----------------------- | ----------------------------------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                                           |
| `400`  | `BAD_REQUEST`           | Invalid payload, duplicate term, or invalid definition/tags |
| `404`  | `NOT_FOUND`             | Entry doesn't exist or belongs to another user              |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error                                     |

---

## DELETE /api/entries/:id

Soft-deletes an entry. Sets `deletedAt` to the current timestamp. The entry remains in the database and can be restored.

### URL Parameters

| Parameter | Type   | Required | Description  |
| --------- | ------ | -------- | ------------ |
| `id`      | string | Yes      | The entry id |

### Response

```json
{
  "data": {
    "id": "cmmmagb660006n88zfftefgen",
    "term": "quelle"
  }
}
```

### Error Cases

| Status | Code                    | When                                           |
| ------ | ----------------------- | ---------------------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                              |
| `404`  | `NOT_FOUND`             | Entry doesn't exist or belongs to another user |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error                        |

---

## PATCH /api/entries/:id/restore

Restores a soft-deleted entry by clearing `deletedAt`.

### URL Parameters

| Parameter | Type   | Required | Description  |
| --------- | ------ | -------- | ------------ |
| `id`      | string | Yes      | The entry id |

### Response

```json
{
  "data": {
    "id": "cmmmagb660006n88zfftefgen",
    "term": "quelle"
  }
}
```

### Error Cases

| Status | Code                    | When                                            |
| ------ | ----------------------- | ----------------------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                               |
| `404`  | `NOT_FOUND`             | Entry doesn't exist, not deleted, or wrong user |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error                         |

---

## POST /api/entries/:id/links

Creates a link between two entries. Links are undirected — order does not matter.

### URL Parameters

| Parameter | Type   | Required | Description         |
| --------- | ------ | -------- | ------------------- |
| `id`      | string | Yes      | The origin entry id |

### Request Body

```json
{
  "targetId": "cmmfcevt1000j788z3mp1lgew"
}
```

| Field      | Type | Required | Description                    |
| ---------- | ---- | -------- | ------------------------------ |
| `targetId` | cuid | Yes      | The id of the entry to link to |

### Response

```json
{
  "data": {
    "term1": "laufen",
    "term2": "laufschuh"
  }
}
```

### Error Cases

| Status | Code                    | When                                                       |
| ------ | ----------------------- | ---------------------------------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                                          |
| `400`  | `BAD_REQUEST`           | Invalid payload, self-link attempt, or link already exists |
| `404`  | `NOT_FOUND`             | Either entry doesn't exist or belongs to another user      |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error                                    |

---

## DELETE /api/entries/:id/links

Removes a link between two entries.

### URL Parameters

| Parameter | Type   | Required | Description         |
| --------- | ------ | -------- | ------------------- |
| `id`      | string | Yes      | The origin entry id |

### Request Body

```json
{
  "targetId": "cmmfcevt1000j788z3mp1lgew"
}
```

| Field      | Type | Required | Description                        |
| ---------- | ---- | -------- | ---------------------------------- |
| `targetId` | cuid | Yes      | The id of the entry to unlink from |

### Response

```json
{
  "data": {
    "term1": "laufen",
    "term2": "laufschuh"
  }
}
```

### Error Cases

| Status | Code                    | When                                                 |
| ------ | ----------------------- | ---------------------------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                                    |
| `400`  | `BAD_REQUEST`           | Invalid payload or self-link attempt                 |
| `404`  | `NOT_FOUND`             | Link doesn't exist or entries belong to another user |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error                              |
