# Authentication Setup — NextAuth + Prisma

This document explains how authentication is configured in Brezel.

---

# Overview

Brezel uses **NextAuth v5 (Auth.js)** for authentication.

Authentication is handled via OAuth — users log in through Google or GitHub without Brezel handling passwords directly.

Sessions are stored in the database using the **Prisma adapter**.

---

# 1 — Install NextAuth

```bash
npm install next-auth@beta
npm install @auth/prisma-adapter
```

---

# 2 — Generate the Auth Secret

NextAuth requires a secret to encrypt sessions.

```bash
npx auth secret
```

Add the generated value to `.env`:

```
AUTH_SECRET=your_generated_secret
```

Never commit this value. Confirm `.env` is in `.gitignore`.

---

# 3 — Create OAuth Applications

Two OAuth providers are configured: **Google** (primary) and **GitHub** (for developers and recruiters).

## Google

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project — `Brezel`
3. Go to **APIs & Services → OAuth consent screen** — choose External
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth Client ID**
   - Application type: Web application
   - Name: `Brezel DEV`
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copy the Client ID and Client Secret

## GitHub

1. Go to [github.com/settings/developers](https://github.com/settings/developers) → OAuth Apps → New OAuth App
   - Application name: `Brezel DEV`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
2. Copy the Client ID and generate a Client Secret

## Add to `.env`

```
AUTH_GOOGLE_ID=your_client_id
AUTH_GOOGLE_SECRET=your_client_secret
AUTH_GITHUB_ID=your_client_id
AUTH_GITHUB_SECRET=your_client_secret
```

For production, create separate OAuth apps (`Brezel PROD`) with production URLs and separate credentials.

---

# 4 — Update the Prisma Schema

NextAuth requires additional fields on the `User` model and three new models.

Add to the `User` model:

```prisma
emailVerified DateTime?
image         String?
accounts      Account[]
sessions      Session[]
```

Add the following models:

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
}
```

Run the migration:

```bash
npx prisma migrate dev --name add-auth-tables
```

---

# 5 — Create the Auth Configuration

Create `src/auth.ts`:

```ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google, GitHub],
});
```

Important: `auth.ts` instantiates its own Prisma client instead of using the shared singleton from `lib/prisma.ts`. This is required because `auth.ts` initializes outside the normal Next.js module lifecycle, where the singleton may not yet be available.

This is the same reason the seed file uses its own client. Any standalone Prisma instantiation in this project must configure the adapter explicitly.

---

# 6 — Create the Route Handler

Create `app/api/auth/[...nextauth]/route.ts`:

```ts
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

This exposes the NextAuth endpoints that handle the OAuth flow and session management.

---

# 7 — Verify

Start the dev server and go to `http://localhost:3000/api/auth/signin`.

After a successful login, verify in Prisma Studio that rows were created in:

- `User`
- `Account`
- `Session`

---

# Mental Model

```bash
User clicks "Login with Google"
        ↓
NextAuth redirects to Google
        ↓
Google authenticates the user
        ↓
Google redirects back to /api/auth/callback/google
        ↓
NextAuth receives confirmation
        ↓
Prisma adapter saves User, Account, Session to the database
        ↓
User is authenticated
```
