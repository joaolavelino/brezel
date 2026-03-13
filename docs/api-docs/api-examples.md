# Examples API

Examples belong to definitions and are always accessed through them.

---

## POST /api/entries/:id/definitions/:defId/examples

Creates a new example for the given definition.

### URL Parameters

| Parameter | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| `id`      | string | Yes      | The entry id      |
| `defId`   | string | Yes      | The definition id |

### Request Body

```json
{
  "text": "Ich laufe dreimal pro Woche.",
  "notes": "Simple present tense example."
}
```

| Field   | Type   | Required | Description             |
| ------- | ------ | -------- | ----------------------- |
| `text`  | string | Yes      | The example sentence    |
| `notes` | string | No       | Notes about the example |

### Response

```json
{
  "data": {
    "id": "cmmp9jb0w000fn88zrpn2l7be",
    "definitionId": "cmmfcevsv0006788znu33hv8j",
    "text": "Ich laufe dreimal pro Woche.",
    "notes": "Simple present tense example.",
    "createdAt": "2026-03-13T19:01:33.200Z",
    "updatedAt": "2026-03-13T19:01:33.200Z"
  }
}
```

### Error Cases

| Status | Code                    | When                                                          |
| ------ | ----------------------- | ------------------------------------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                                             |
| `400`  | `BAD_REQUEST`           | Invalid payload or invalid id format                          |
| `404`  | `NOT_FOUND`             | Definition doesn't exist or doesn't belong to this entry/user |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error                                       |

---

## PATCH /api/entries/:id/definitions/:defId/examples/:exId

Updates an existing example. All fields are optional.

### URL Parameters

| Parameter | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| `id`      | string | Yes      | The entry id      |
| `defId`   | string | Yes      | The definition id |
| `exId`    | string | Yes      | The example id    |

### Request Body

```json
{
  "text": "Ich habe in diesem Jahr schon 200km gelaufen.",
  "notes": "Uses Perfekt tense with Partizip II."
}
```

| Field   | Type   | Required | Description                                    |
| ------- | ------ | -------- | ---------------------------------------------- |
| `text`  | string | No       | Updated example sentence                       |
| `notes` | string | No       | Updated notes. Pass `null` to remove the notes |

### Response

Returns the updated example.

### Error Cases

| Status | Code                    | When                                                            |
| ------ | ----------------------- | --------------------------------------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                                               |
| `400`  | `BAD_REQUEST`           | Invalid payload, empty body, or invalid id format               |
| `404`  | `NOT_FOUND`             | Example doesn't exist or doesn't belong to this definition/user |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error                                         |

---

## DELETE /api/entries/:id/definitions/:defId/examples/:exId

Deletes an example.

### URL Parameters

| Parameter | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| `id`      | string | Yes      | The entry id      |
| `defId`   | string | Yes      | The definition id |
| `exId`    | string | Yes      | The example id    |

### Response

```json
{
  "data": {
    "text": "Ich laufe dreimal pro Woche."
  }
}
```

### Error Cases

| Status | Code                    | When                                                            |
| ------ | ----------------------- | --------------------------------------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                                               |
| `400`  | `BAD_REQUEST`           | Invalid id format                                               |
| `404`  | `NOT_FOUND`             | Example doesn't exist or doesn't belong to this definition/user |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error                                         |

# Examples API

Examples belong to definitions and are always accessed through them.

---

## POST /api/entries/:id/definitions/:defId/examples

Creates a new example for the given definition.

### URL Parameters

| Parameter | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| `id`      | string | Yes      | The entry id      |
| `defId`   | string | Yes      | The definition id |

### Request Body

```json
{
  "text": "Ich laufe dreimal pro Woche.",
  "notes": "Simple present tense example."
}
```

| Field   | Type   | Required | Description             |
| ------- | ------ | -------- | ----------------------- |
| `text`  | string | Yes      | The example sentence    |
| `notes` | string | No       | Notes about the example |

### Response

```json
{
  "data": {
    "id": "cmmp9jb0w000fn88zrpn2l7be",
    "definitionId": "cmmfcevsv0006788znu33hv8j",
    "text": "Ich laufe dreimal pro Woche.",
    "notes": "Simple present tense example.",
    "createdAt": "2026-03-13T19:01:33.200Z",
    "updatedAt": "2026-03-13T19:01:33.200Z"
  }
}
```

### Error Cases

| Status | Code                    | When                                                          |
| ------ | ----------------------- | ------------------------------------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                                             |
| `400`  | `BAD_REQUEST`           | Invalid payload or invalid id format                          |
| `404`  | `NOT_FOUND`             | Definition doesn't exist or doesn't belong to this entry/user |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error                                       |

---

## PATCH /api/entries/:id/definitions/:defId/examples/:exId

Updates an existing example. All fields are optional.

### URL Parameters

| Parameter | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| `id`      | string | Yes      | The entry id      |
| `defId`   | string | Yes      | The definition id |
| `exId`    | string | Yes      | The example id    |

### Request Body

```json
{
  "text": "Ich habe in diesem Jahr schon 200km gelaufen.",
  "notes": "Uses Perfekt tense with Partizip II."
}
```

| Field   | Type   | Required | Description                                    |
| ------- | ------ | -------- | ---------------------------------------------- |
| `text`  | string | No       | Updated example sentence                       |
| `notes` | string | No       | Updated notes. Pass `null` to remove the notes |

### Response

Returns the updated example.

### Error Cases

| Status | Code                    | When                                                            |
| ------ | ----------------------- | --------------------------------------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                                               |
| `400`  | `BAD_REQUEST`           | Invalid payload, empty body, or invalid id format               |
| `404`  | `NOT_FOUND`             | Example doesn't exist or doesn't belong to this definition/user |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error                                         |

---

## DELETE /api/entries/:id/definitions/:defId/examples/:exId

Deletes an example.

### URL Parameters

| Parameter | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| `id`      | string | Yes      | The entry id      |
| `defId`   | string | Yes      | The definition id |
| `exId`    | string | Yes      | The example id    |

### Response

```json
{
  "data": {
    "text": "Ich laufe dreimal pro Woche."
  }
}
```

### Error Cases

| Status | Code                    | When                                                            |
| ------ | ----------------------- | --------------------------------------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                                               |
| `400`  | `BAD_REQUEST`           | Invalid id format                                               |
| `404`  | `NOT_FOUND`             | Example doesn't exist or doesn't belong to this definition/user |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error                                         |
