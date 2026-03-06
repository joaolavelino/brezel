# Brezel

V1 - Documentation

## What is Brezel.

Named after the traditional German pastry, Brezel was born from the needs of a German language learner, who loves to take notes while learning just to struggle later searching through piles of paper and a bunch of notebooks for that specific word I learned years ago.

The goal of Brezel is to create a personal learning environment where vocabulary can be quickly captured, easily searched, and expanded over time.

Brezel is not a German dictionary.  
It is a guide to **the German of my own life** — a place where personal experiences, contexts, and associations with words are recorded and can be accessed instantly when needed.

## How does it work?

Brezel works like a personal rolodex where entries can grow over time. Notes are expandable, editable, searchable, and organized through tags and relationships.

Unlike a traditional dictionary, Brezel is **user-centered** rather than word-centered.

Different people learn the same word in different ways, in different contexts, and build different mental connections. In Brezel, every entry belongs to a specific user. Definitions, examples, and notes are personal and reflect the learner’s own experience with the language.

## Notes on different situations:

> Learning doesn’t happen only behind a desk.

This premise guided the design of the application, allowing different ways to register new entries.

- A complete registration of an entry, with definitions and notes, all there to be filled;
- Quick capture: A simpler way to quickly register those terms that appear in the wild and leave all the research and definitions for later (featuring not-so-gentle incomplete-entry-reminders)

## Data model

This project was born during my process of learning backend development and is used as an opportunity to create an application end -to-end. From the data modelling to the typography selection.

The basic organisation is:

- **Entries**: The lemma or surface form encountered by the user. An entry represents a word, expression, idiom, or question and acts as the main “card” in the rolodex.
- **Definition**: Each entry contains one or more definitions. A definition represents a specific sense of the entry and may include grammatical information, notes, and examples.
- **Links**: Definitions can reference other entries to represent relationships between words, expressions, or related concepts.
- **Tags**: Tags represent the domains of the user’s life where the word appears (for example: travel, work, restaurant). Tags are fully customisable and personal to each user.
- **Static content**: Brezel also includes reference pages with useful grammar guides and cheat sheets. (Not searching on google for “Adjektivdeklination” or “Wechselpräpositionen” anymore)

## The stack

This first version is a monolith app built on Next.js (app-router) with Typescript using the following stack:  
###Data and Backend:
The backend uses Prisma for database access and data modeling., and the database is on SQLite. The API is RESTful and the authentication is handled by OAuth.  
###Frontend:
The frontend is built exploring the benefits of SSR, and using different tools: Zustand for state management, Tanstack query for server mutations, React Hook Form and Zod for the forms and validation, Tailwind, Framer Motion and ShadcnUI for componentisation and styling.

The application is fully tested using Vitest, React Testing Library, and MSW.

The application will be organised as a PWA, making it easily accessible on mobile devices while still available on desktop.

## Domain Rules

These are the main domain rules that guided Brezel’s data modelling:

- Entry represents the lexical form encountered by the user.
- Definition represents a single sense of an entry.
- Examples belong to definitions.
- Entries can reference other entries with links.
- Tags represent domains of the user's life and are fully customisable.
- Entries may exist without definitions to support quick capture. But they are considered incomplete entries.

# Roadmap: Was liegt um die Ecke?

There are several steps that are already planned ahead for the next versions of Brezel:

## A collective learning process

For users of a school or institution, Brezel will allow groups and a teacher/student relationship, including a entry-validation flow for the teacher, personalised static content for the school group.

## Memorisation tools

Flashcards and Der/Die/Das tools with only words from the world of the user or for specific categories.

## For visual learners

Different people learn differently, so Brezel is planned to included different ways to the users communicate their ideas and define the words they encounter all around them, like sketching or taking pictures.

## Photo capture

Users will be able to trigger a quick capture using the camera, with text recognition tools to make the Quick Capture even quicker.
