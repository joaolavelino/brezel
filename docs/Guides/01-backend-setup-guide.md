# Backend Setup — Prisma + SQLite

This document explains how the database layer of **Brezel** is configured.

It serves both as project documentation and as a guide to understand how the backend communicates with the database.

---

# Overview

The backend of Brezel uses:

- **Prisma** as ORM and data modeling tool
- **SQLite** as the database
- **better-sqlite3** as the SQLite driver
- **Next.js Route Handlers** as the API layer

The data flow in the application looks like this:

```
Next.js Route Handler
        ↓
Prisma Client (lib/prisma.ts)
        ↓
Generated Prisma Client
        ↓
SQLite Database
```

---

# 1 — Install Prisma

Install Prisma and the Prisma client.

```bash
npm install prisma --save-dev
npm install @prisma/client
```

Initialize Prisma:

```bash
npx prisma init
```

This creates the base structure:

```
/prisma
  schema.prisma
.env
```

---

# 2 — Configure SQLite

Brezel uses **SQLite** as the database for the first version of the application.

SQLite stores the entire database in a single file.

Inside `.env`:

```
DATABASE_URL="file:./dev.db"
```

This tells Prisma where the database file should be located.

---

# 3 — Install the SQLite Adapter

Brezel uses **better-sqlite3** as the SQLite driver.

Install the dependencies:

```bash
npm install better-sqlite3
npm install @prisma/adapter-better-sqlite3
```

The adapter allows Prisma to communicate with SQLite using the `better-sqlite3` driver.

---

# 4 — Define the Data Model

All database models are defined in:

```
prisma/schema.prisma
```

This file defines the **structure of the database**.

Example:

```
model Entry {
  id        String   @id @default(cuid())
  term      String
  createdAt DateTime @default(now())
}
```

The schema describes:

- models (tables)
- relations
- indexes
- enums
- constraints

The schema represents the **domain model of the application**.

---

# 5 — Generate the Prisma Client

After defining models, generate the Prisma client.

```
npx prisma generate
```

This command reads `schema.prisma` and generates a **typed database client**.

In Brezel, the generated client is placed in:

```
/src/generated/prisma
```

The generated client exposes methods such as:

```
prisma.entry.findMany()
prisma.entry.create()
prisma.entry.update()
prisma.entry.delete()
```

Important:

**`prisma generate` does NOT modify the database.**

It only generates the TypeScript client used by the application.

---

# 6 — Run Database Migrations

When the schema changes, the database structure must be updated.

Run:

```
npx prisma migrate dev
```

This command:

1. updates the database structure
2. creates a migration history
3. keeps the database synchronized with the schema

---

# 7 — Create a Shared Prisma Client

The application needs a single Prisma client instance to query the database.

Create:

```
src/lib/prisma.ts
```

Example implementation:

```ts
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

Purpose of this file:

- create a **single Prisma client instance**
- reuse it across the application
- prevent multiple database connections during Next.js hot reload

Without this pattern, development servers may produce errors like:

```
Too many Prisma Clients are already running
```

---

# 8 — Using Prisma in the Application

Database queries are executed through the shared Prisma instance.

Example:

```ts
import { prisma } from "@/lib/prisma";

const entries = await prisma.entry.findMany();
```

This allows the application to access the database using **type-safe queries**.

---

# 9 — Useful Prisma Commands

Generate Prisma client:

```
npx prisma generate
```

Create migration:

```
npx prisma migrate dev
```

Open database viewer:

```
npx prisma studio
```

---

# 10 — Mental Model

Understanding the Prisma workflow is easier if we think about the layers.

```
schema.prisma
      ↓
prisma generate
      ↓
Generated Prisma Client
      ↓
lib/prisma.ts
      ↓
Route Handlers
      ↓
Database Queries
```

Key ideas:

- `schema.prisma` defines the **database structure**
- `prisma generate` creates the **database client**
- `lib/prisma.ts` creates a **shared Prisma instance**
- route handlers use Prisma to **read and write data**

---

# 11 — Seed the Database

A seed file populates the database with realistic development data.

The seed is not just for convenience — it is a design tool.
It forces you to confront real data before the UI exists and exposes edge cases early.

## Why seed data matters

A good seed covers the full range of states the UI will need to handle:

- a complete entry with definitions, examples, tags, and links
- an incomplete entry (quick capture — term only, no definitions)
- entries with multiple definitions
- entries linked to other entries

Without this range, UI problems stay hidden until late in development.

## Install tsx

The seed file runs as a standalone script outside of Next.js.
`tsx` is used to execute it directly.

```bash
hnpm install -D tsx
```

## Configure the seed command

In `prisma.config.ts`, add the seed command:

````tsmigrations: {
path: "prisma/migrations",
seed: "tsx ./prisma/seed.ts",
},

## Create the seed file

Create `prisma/seed.ts`.

The seed file must instantiate its own Prisma client.
It cannot use the shared singleton from `lib/prisma.ts` because it runs outside the Next.js runtime.

Because Brezel uses the `better-sqlite3` adapter, every Prisma instantiation — including the seed — must configure the adapter explicitly:
```ts
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import * as dotenv from 'dotenv'dotenv.config()const adapter = new PrismaBetterSqlite3({
url: process.env.DATABASE_URL!,
})const prisma = new PrismaClient({ adapter })async function main() {
// seed data here
}main()
.catch((e) => {
console.error(e)
process.exit(1)
})
.finally(async () => {
await prisma.$disconnect()
})
````

Note: `dotenv` must be imported manually because the seed runs outside Next.js, which normally handles environment variables automatically.

## Important patterns

**Always capture created records in variables.**
You will need their `id` to set relations like `primaryDefinitionId` or to create `EntryLink` records.

**Use `upsert` for reference data** (users, tags) so the seed can run multiple times safely.

**Use `create` for entries and relations** — entries have no natural unique constraint to upsert on.

**Set `primaryDefinitionId` in a separate update** after the entry is created, because of the circular reference between `Entry` and `Definition`.

**Use `include: { definitions: true }` on entry creates** to get definition ids back in the response — without it, `definitions` is undefined on the returned object.

## Run the seed

```bash
npx prisma db seed
```

To reset the database and reseed from scratch:

```bash
npx prisma migrate reset
```

This wipes the database, re-runs all migrations, and runs the seed automatically.
