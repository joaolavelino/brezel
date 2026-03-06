# Database Model

This document explains the database model of **Brezel**.

Its goal is not only to describe the Prisma schema technically, but also to explain the reasoning behind the main entities and relationships of the system.

Brezel is not modeled as a dictionary.  
It is modeled as a **personal vocabulary environment**, where language is captured as the user encounters it in real life.

Because of that, the database is designed around the learner's experience:

- what was encountered
- what it means
- in which context it appeared
- how it connects to other vocabulary

---

# Mental Model

The core structure of Brezel is:

```txt
User
 ↓
Entry
 ↓
Definition
 ↓
Example
```

And around it:

```txt
Entry ↔ Tag
Entry ↔ Entry
```

This means:

- a **User** owns their vocabulary data
- an **Entry** represents the word or expression encountered
- a **Definition** represents one meaning of that entry
- an **Example** shows usage of a definition
- **Tags** organize entries by life context
- **Entry links** connect related entries

---

# Core Principle

The most important modeling decision in Brezel is this:

**An Entry is not the same thing as a Definition.**

This distinction exists because a learner usually encounters a **form first** and only later develops or records its meanings.

Example:

```txt
Entry: laufen
```

Possible definitions:

- to run
- to walk
- to operate

So the entry is the lexical item encountered by the user, while the definitions represent the possible senses of that item.

This separation makes the model more flexible and more faithful to real language learning.

---

# Models

## User

The `User` model represents the owner of the data.

Each user's vocabulary, tags, and notes are personal.
This is essential because Brezel is built around the idea that different learners encounter and organize language differently.

### Main fields

- `id`
- `email`
- `name`
- `createdAt`
- `updatedAt`

### Relationships

- one user has many `Entry`
- one user has many `Tag`

### Why it exists

Brezel is a personal system, not a global dictionary.
All vocabulary data belongs to a specific user.

---

## Entry

The `Entry` model is the central model of the application.

An entry represents the lexical form encountered by the user.

Examples of entries:

- `Haus`
- `zum Glück`
- `Wie geht's?`
- `sich freuen auf`

The entry is the main "card" in the personal rolodex.

### Main fields

- `id`
- `userId`
- `term`
- `termNormalized`
- `form`
- `notes`
- `deletedAt`
- `createdAt`
- `updatedAt`

### Important fields explained

#### `term`

The original term as captured by the user.

#### `termNormalized`

A normalized version of the term used for search and lookup.

This exists to make searching easier and more consistent.

Examples:

```txt
Haus → haus
Straße → strasse
```

The exact normalization strategy belongs to application logic, but the field exists to support efficient search.

#### `form`

The grammatical or practical form of the entry.

Enum values:

- `word`
- `phrase`
- `idiom`
- `question`
- `not_sure`

This supports both precise classification and quick capture when the user is unsure.

#### `notes`

Optional personal notes about the entry.

These may include:

- memory aids
- context of discovery
- warnings
- comparisons
- personal associations

#### `deletedAt`

Used for soft deletion.

Instead of removing entries immediately from the database, Brezel can mark them as deleted and potentially support trash/restore workflows.

### Relationships

- belongs to one `User`
- has many `Definition`
- has many `EntryTag`
- has many links to other entries through `EntryLink`
- may have one `primaryDefinition`

### Why it exists

The learner usually encounters a term first, not a fully structured definition.

Because of that, `Entry` must exist as an independent model.

This also allows Brezel to support **quick capture**:
an entry can be created first and completed later.

---

## Definition

The `Definition` model represents a single meaning of an entry.

A single entry may have multiple meanings, and each meaning may need separate grammatical information, notes, and examples.

### Main fields

- `id`
- `entryId`
- `translation`
- `termOverride`
- `notes`
- `partOfSpeech`
- `nounArticle`
- `deletedAt`
- `createdAt`
- `updatedAt`

### Important fields explained

#### `translation`

The main translation or meaning recorded by the user.

Example:

```txt
Entry: laufen
Definition: to run
```

#### `termOverride`

An optional override used when the specific definition needs to display a more precise form than the main entry.

This is useful when a meaning is better represented by a variation or more specific phrasing.

#### `notes`

Additional notes about this specific meaning.

This is different from entry-level notes, because some observations belong only to one sense of the word.

#### `partOfSpeech`

Enum values:

- `noun`
- `verb`
- `other`

This allows grammatical classification of the specific definition.

#### `nounArticle`

Enum values:

- `der`
- `die`
- `das`
- `plural`
- `unknown`

This is used for noun-specific grammatical information.

### Relationships

- belongs to one `Entry`
- has many `Example`
- may be the primary definition for one `Entry`

### Why it exists

Many words are polysemous.
Brezel needs to represent one term with several senses.

Separating `Definition` from `Entry` makes the model:

- more accurate
- easier to expand
- better for UI presentation
- closer to the learner's actual process

---

## Example

The `Example` model stores usage examples for a specific definition.

Examples are attached to definitions rather than directly to entries because usage usually illustrates a particular meaning.

### Main fields

- `id`
- `definitionId`
- `text`
- `notes`
- `createdAt`
- `updatedAt`

### Relationships

- belongs to one `Definition`

### Why it exists

Examples are essential for contextual learning.

A word is often easier to remember when connected to a sentence, a situation, or a pattern of use.

By attaching examples to definitions, Brezel preserves the relationship between meaning and usage.

---

## Tag

The `Tag` model represents a life context or thematic domain associated with entries.

Examples:

- `travel`
- `work`
- `restaurant`
- `bureaucracy`
- `music`

### Main fields

- `id`
- `userId`
- `name`
- `slug`
- `color`
- `createdAt`
- `updatedAt`

### Important fields explained

#### `name`

The visible tag name.

#### `slug`

A normalized identifier for the tag.

Used to ensure uniqueness per user and allow predictable internal handling.

#### `color`

Optional visual metadata for UI presentation.

### Relationships

- belongs to one `User`
- has many `EntryTag`

### Why it exists

Brezel organizes vocabulary not only by linguistic meaning, but also by the user's real-life contexts.

A tag answers questions like:

- where did this word appear?
- in which area of life do I use this?
- which vocabulary belongs to work, travel, or music?

---

## EntryTag

`EntryTag` is the join model connecting entries and tags.

This implements a many-to-many relationship.

### Main fields

- `entryId`
- `tagId`

### Relationships

- belongs to one `Entry`
- belongs to one `Tag`

### Why it exists

A single entry may belong to several contexts, and a single tag may group many entries.

Example:

```txt
Entry: Rechnung
Tags: work, bureaucracy, shopping
```

The join model allows this flexibility cleanly.

---

## EntryLink

The `EntryLink` model connects related entries.

This allows Brezel to represent relationships between vocabulary items.

Examples of relationships a user may perceive:

- related forms
- similar words
- associated concepts
- expression families

### Main fields

- `aEntryId`
- `bEntryId`
- `createdAt`

### Relationships

- belongs to one `Entry` as `aEntry`
- belongs to one `Entry` as `bEntry`

### Why it exists

Vocabulary is not only a list. It is also a network.

This model allows Brezel to represent conceptual connections between entries and gradually build a more personal lexical map.

### Important note

The schema stores links as a **canonical pair**, meaning the relationship is stored once instead of twice.

This avoids duplication such as:

```txt
Haus → Wohnung
Wohnung → Haus
```

being stored as two separate rows.

---

# Enums

## EntryForm

Defines what kind of item the entry represents.

Values:

- `word`
- `phrase`
- `idiom`
- `question`
- `not_sure`

### Why it exists

Not everything captured by a learner is a single word.
This enum allows the model to support real learning situations.

---

## PartOfSpeech

Defines the grammatical class of a definition.

Values:

- `noun`
- `verb`
- `other`

### Why it exists

The grammatical category often belongs to a specific sense or use of the entry.

---

## NounArticle

Stores article information for nouns.

Values:

- `der`
- `die`
- `das`
- `plural`
- `unknown`

### Why it exists

For German learners, article information is part of learning the word itself.

---

# Relationships Summary

The main relationships are:

```txt
User 1 ── N Entry
User 1 ── N Tag

Entry 1 ── N Definition
Definition 1 ── N Example

Entry N ── N Tag   (via EntryTag)
Entry N ── N Entry (via EntryLink)

Entry 1 ── 0..1 primary Definition
```

---

# Domain Rules Reflected in the Schema

The schema implements the following core domain rules:

- every entry belongs to a user
- every definition belongs to exactly one entry
- entries may exist without definitions
- every example belongs to exactly one definition
- tags are personal to a user
- entries may have many tags
- entries may link to other entries
- one definition may be marked as primary for an entry
- soft deletion is supported through `deletedAt`

---

# Why This Model Fits Brezel

This model was designed around real language learning struggles.

It reflects a process where:

1. a learner encounters a term
2. captures it quickly
3. later researches its meaning
4. adds notes and examples
5. connects it to life contexts
6. links it to related vocabulary

Because of that, the database is not only technically structured.
It is shaped by the actual experience Brezel wants to support.

---

# Mental Model for Future Development

When thinking about new features, it helps to remember:

- `Entry` = what was encountered
- `Definition` = what it means
- `Example` = how it is used
- `Tag` = where it belongs in life
- `EntryLink` = how it connects to other vocabulary

This is the conceptual backbone of Brezel.
