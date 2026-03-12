# Brezel

Brezel is a **personal vocabulary notebook for language learners**.

Named after the traditional German pastry, Brezel was born from the needs of a German learner who enjoys taking notes while studying — only to later struggle searching through piles of paper and multiple notebooks for that one word learned months ago.

Instead of being a traditional dictionary, Brezel focuses on **the German of your own life** — your examples, your notes, and your personal associations with the language.

---

# Core Idea

Brezel works like a **personal rolodex of vocabulary**.

Each entry represents a word, phrase, or idiom encountered by the learner and can grow over time with additional information.

Entries may contain:

- definitions
- personal notes
- example sentences
- links to related entries
- tags representing real-life contexts

The goal is to build a **searchable and expandable vocabulary system** that reflects how each individual experiences and learns the language.

Rather than storing "all German words", Brezel stores **the words that appear in your life**.

---

# Project Documentation

The vision, domain model, and design decisions behind Brezel are documented in the `/docs` folder.

Start here:

📖 **Project Overview**  
/docs/01-brezel_overview.md

This document explains:

- the learning philosophy behind Brezel
- the domain model
- how vocabulary is structured in the system
- the design principles guiding development

Additional technical documentation can also be found in `/docs`.

---

##Other documentation:

- [**Api Routes**](/docs/api-docs/api-_index.md)
- [**Domain Rules**](/docs/02-models_and_domain_rules.md)

# Tech Stack (V1)

Brezel is being built as a **full-stack learning project** exploring backend development and system design.

### Backend & Data

- **Next.js (App Router)**
- **TypeScript**
- **Prisma ORM**
- **SQLite**

### Frontend

- **React**
- **Tailwind CSS**
- **TanStack Query**
- **Zustand**
- **React Hook Form + Zod**
- **Shadcn/UI**

---

# Running the Project

Install dependencies:

```bash
npm install
npm run dev
```

Open:
http://localhost:3000
