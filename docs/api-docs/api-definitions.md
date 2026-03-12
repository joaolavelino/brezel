# Definitions API

Definitions belong to entries and are always accessed through them.

---

## POST /api/entries/:id/definitions

Creates a new definition for the given entry.

### URL Parameters

| Parameter | Type   | Required | Description  |
| --------- | ------ | -------- | ------------ |
| `id`      | string | Yes      | The entry id |

### Request Body

```json
{
  "translation": "running shoe / joggers",
  "termOverride": "Laufschuh",
  "notes": "Normally used in the plural form Laufschuhe.",
  "partOfSpeech": "noun",
  "nounArticle": "der"
}
```

| Field          | Type         | Required                        | Description                                               |
| -------------- | ------------ | ------------------------------- | --------------------------------------------------------- |
| `translation`  | string       | Yes                             | The meaning of the entry in this sense                    |
| `termOverride` | string       | No                              | A more specific form to display instead of the entry term |
| `notes`        | string       | No                              | Notes specific to this definition                         |
| `partOfSpeech` | PartOfSpeech | No                              | noun, verb, other. Defaults to `other`                    |
| `nounArticle`  | NounArticle  | Required if partOfSpeech = noun | der, die, das, plural, unknown                            |

### Response

```json
{
  "data": {
    "id": "cmmnw0eaw000dn88zh5je4lyz",
    "entryId": "cmmfcevt1000j788z3mp1lgew",
    "translation": "running shoe / joggers",
    "termOverride": null,
    "notes": "There are more specific words for other types of shoes like Carbon-laufschuhe",
    "partOfSpeech": "noun",
    "nounArticle": "der",
    "deletedAt": null,
    "createdAt": "2026-03-12T19:55:09.802Z",
    "updatedAt": "2026-03-12T19:55:09.802Z"
  }
}
```

### Error Cases

| Status | Code                    | When                                            |
| ------ | ----------------------- | ----------------------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                               |
| `400`  | `BAD_REQUEST`           | Invalid payload or missing nounArticle for noun |
| `404`  | `NOT_FOUND`             | Entry doesn't exist or belongs to another user  |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error                         |

---

## PATCH /api/entries/:id/definitions/:defId

> 🚧 In progress

---

## DELETE /api/entries/:id/definitions/:defId

> 🚧 In progress
