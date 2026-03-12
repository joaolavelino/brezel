# Tags API

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

---

## POST /api/tags

Creates a new tag for the authenticated user.

### Request Body

```json
{
  "name": "Travel",
  "color": "#87c468"
}
```

| Field   | Type   | Required | Description                         |
| ------- | ------ | -------- | ----------------------------------- |
| `name`  | string | Yes      | Tag name. Used to generate the slug |
| `color` | string | No       | Hex color string (e.g. `#87c468`)   |

### Response

```json
{
  "data": {
    "id": "cmmnr6oa90008n88z6jd111th",
    "userId": "cmmfcevsd0000788zc6igja71",
    "name": "Travel",
    "slug": "travel",
    "color": "#87c468",
    "createdAt": "2026-03-12T17:40:04.592Z",
    "updatedAt": "2026-03-12T17:40:04.592Z"
  }
}
```

### Error Cases

| Status | Code                    | When                         |
| ------ | ----------------------- | ---------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session            |
| `400`  | `BAD_REQUEST`           | Invalid payload or duplicate |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error      |

---

## PATCH /api/tags/:id

Updates an existing tag. All fields are optional.

### URL Parameters

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `id`      | string | Yes      | The tag id  |

### Request Body

```json
{
  "name": "Travel",
  "color": "#87c468"
}
```

| Field   | Type   | Required | Description                                       |
| ------- | ------ | -------- | ------------------------------------------------- |
| `name`  | string | No       | Updated name. Regenerates the slug                |
| `color` | string | No       | Hex color string. Pass `null` to remove the color |

### Response

```json
{
  "data": {
    "id": "cmmnr6oa90008n88z6jd111th",
    "userId": "cmmfcevsd0000788zc6igja71",
    "name": "Travel",
    "slug": "travel",
    "color": "#87c468",
    "createdAt": "2026-03-12T17:40:04.592Z",
    "updatedAt": "2026-03-12T17:40:04.592Z"
  }
}
```

### Error Cases

| Status | Code                    | When                                         |
| ------ | ----------------------- | -------------------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                            |
| `400`  | `BAD_REQUEST`           | Invalid payload, invalid id, or duplicate    |
| `404`  | `NOT_FOUND`             | Tag doesn't exist or belongs to another user |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error                      |

---

## DELETE /api/tags/:id

Deletes a tag. Automatically removes the tag from all entries it was attached to.

### URL Parameters

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `id`      | string | Yes      | The tag id  |

### Response

```json
{
  "data": {
    "name": "Travel"
  }
}
```

### Error Cases

| Status | Code                    | When                                         |
| ------ | ----------------------- | -------------------------------------------- |
| `401`  | `UNAUTHORIZED`          | No active session                            |
| `400`  | `BAD_REQUEST`           | Invalid id format                            |
| `404`  | `NOT_FOUND`             | Tag doesn't exist or belongs to another user |
| `500`  | `INTERNAL_SERVER_ERROR` | Unexpected server error                      |
