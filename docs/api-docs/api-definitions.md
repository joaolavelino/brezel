# Definitions API

Definitions belong to entries and are always accessed through them.
Deleting a definition cascades to all its examples.

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

| Field          | Type         | Required                         | Description                                               |
| -------------- | ------------ | -------------------------------- | --------------------------------------------------------- |
| `translation`  | string       | Yes                              | The meaning of the entry in this sense                    |
| `termOverride` | string       | No                               | A more specific form to display instead of the entry term |
| `notes`        | string       | No                               | Notes specific to this definition                         |
| `partOfSpeech` | PartOfSpeech | No                               | noun, verb, other. Defaults to `other`                    |
| `nounArticle`  | NounArticle  | Required if partOfSpeech is noun | der, die, das, plural, unknown                            |

### Response

```json
{
  "data": {
    "id": "cmmnw0eaw000dn88zh5je4lyz",
    "entryId": "cmmfcevt1000j788z3mp1lgew",
    "translation": "running shoe / joggers",
    "termOverride": null,
    "notes": "Normally used in the plural form Laufschuhe.",
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

Updates an existing definition. All fields are optional.

If `partOfSpeech` is changed to a non-noun, `nounArticle` is automatically cleared.

### URL Parameters

| Parameter | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| `id`      | string | Yes      | The entry id      |
| `defId`   | string | Yes      | The definition id |

### Request Body

```json
{
  "translation": "running shoe",
  "partOfSpeech": "noun",
  "nounArticle": "der"
}
```

| Field          | Type         | Required | Description                                                                     |
| -------------- | ------------ | -------- | ------------------------------------------------------------------------------- |
| `translation`  | string       | No       | Updated translation                                                             |
| `termOverride` | string       | No       | Updated term override                                                           |
| `notes`        | string       | No       | Updated notes                                                                   |
| `partOfSpeech` | PartOfSpeech | No       | noun, verb, other                                                               |
| `nounArticle`  | NounArticle  | No       | Required if changing partOfSpeech to noun. Auto-cleared if changing to non-noun |

### Response

Returns the updated definition.

### Error Cases

| Status | Code                    | When                                                          |
| ------ | ----------------------- | ------------------------------------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                                             |
| `400`  | `BAD_REQUEST`           | Invalid payload, empty body, or nounArticle on non-noun       |
| `404`  | `NOT_FOUND`             | Definition doesn't exist or doesn't belong to this entry/user |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error                                       |

---

## DELETE /api/entries/:id/definitions/:defId

Deletes a definition and all its examples.

### URL Parameters

| Parameter | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| `id`      | string | Yes      | The entry id      |
| `defId`   | string | Yes      | The definition id |

### Response

```json
{
  "data": {
    "translation": "running shoe / joggers"
  }
}
```

### Error Cases

| Status | Code                    | When                                                          |
| ------ | ----------------------- | ------------------------------------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                                             |
| `400`  | `BAD_REQUEST`           | Invalid id format                                             |
| `404`  | `NOT_FOUND`             | Definition doesn't exist or doesn't belong to this entry/user |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error                                       |
