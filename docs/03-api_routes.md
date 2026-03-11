# API Routes — Brezel

This document describes the available API routes in Brezel.

All routes are prefixed with `/api`.
All routes require authentication. Unauthenticated requests return `401`.

---

# Error Response Shape

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

# Entries

## GET /api/entries

Returns all active entries for the authenticated user with primary definition and tags.

### Query Parameters

| Parameter | Type   | Required | Description                                       |
| --------- | ------ | -------- | ------------------------------------------------- |
| `q`       | string | No       | Search term — matches against term or translation |
| `tag`     | string | No       | Filter by tag slug                                |

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

# Tags

## GET /api/tags

Returns all tags for the authenticated user, ordered alphabetically by slug.

### Response

```json
{
  "data": [
    {
      "id": "cmmfcevsk0002788z96ii1ty0",
      "name": "clothes",
      "slug": "clothes",
      "color": null
    },
    {
      "id": "cmmfcevsk0003788zv8g8qkiv",
      "name": "Running",
      "slug": "running",
      "color": "#E25C4A"
    }
  ]
}
```

### Error Cases

| Status | Code                    | When                    |
| ------ | ----------------------- | ----------------------- |
| `401`  | `UNAUTHORIZED`          | No active session       |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error |
