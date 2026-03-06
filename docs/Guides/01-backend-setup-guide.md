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
