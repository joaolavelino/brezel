# Front-end UX flow

## Core principles to guide the development:

1. Frictionless capture: The core action must be with the least steps possible;
2. Search and Capture need to feel always near: Neither should feel like a secondary feature;
3. The app should reduce cognitive load: The user must always know the next step, or the options available and the forms can't feel overwhelming;
4. Step-by-step disclosure on complex interactions: Show the minimum necessary and then expanding.
5. Entries are a living concept: They can start small and be progressively expanded.
6. Mobile-first, but desktop-efficient: Mobile version needs to focus on flow and desktop focus on context and speed.

## What are user actions

- Authenticate and enter the app
- Quickly search for a known word
- Quickly capture a new word
- Expand an existing entry with definitions/examples/links
- Notice pending or relevant information
- Access other sections without losing the sense of a central hub

## Primary user flows

### A: Authentication:

**Goal:** Enter the app with minial friction using google or github accounts.

#### Steps

1. User lands on login screen;
2. User chooses the login/sign up method (Google or Github)
3. Auth succeds;
4. User redirected to Hub;

#### Front-end needs:

[] Auth buttons
[] Loading state
[] Error state
[] Redirect handeling
[] Branded motion/animation layer

### B: Search from Hub:

**Goal:** find an existing word as fast as possible.

#### Steps

1. User lands on Hub
2. User focuses search
3. Types query
4. Receives suggestions or results
5. Opens entry screen

#### Front-end needs:

[] Search input
[] Debounced search
[] Suggestions list / recent searches / grouped results
[] Empty states
[] Quick category filters
[] Sticky minimized search on mobile scroll

### C: Quick capture:

**Goal:** register a word with the smallest possible effort.

#### Steps

1. User taps capture
2. User enters minimum required data
3. Front-end check duplicates
4. User confirms creation
5. User lands on created entry
6. User chooses:
   - stop here
   - add definition

#### Front-end needs:

[] Fast modal/drawer flow
[] Duplicate detection on blur
[] Light validation
[] Success state with next actions
[] Error state

### D: Entry expansion:

**Goal:** enrich an entry progressively after initial creation.

#### Steps

1. User create a new entry / user opens an existent entry
2. Adds definition
3. Optionally adds example
4. Optionally adds more examples
5. Optionally adds links to other entries

#### Front-end needs:

[] Entry detail screen
[] Definition accordion/collapsible blocks
[] Nested actions
[] Inline or modal subflows
[] Refresh/revalidation after mutation

### E: Entry share:

**Goal:** allow user to share the content of the entry.

#### Steps

1. User opens an entry
2. Clicks on share button
3. User clicks on copy URL button
4. Application creates a static page for the entrynice

#### Front-end needs:

### 1 - Login and auth

The user needs to log in using Google/Github or create a new user.

#### Screen:

1. Login screen:
   Idea: A screen with solid brand colour and animated welcome message and logo. Quick slide up to reveal the auth options (logo will stay up top).
   Structure: Logo + Motto and the button group

### 2 - Get notified and have quick options for word search and capture.

This will be the core of the application. Almost everything will start from here. Step is the decisive moment for the user as he will need to revisit this all the time.

#### Screen:

1. The Hub:
   Idea: The screen needs to display three main things:

- Search bar + categories button
- Capture options
- Notifications
  Other things to consider
- A navbar with all the shortcuts and a user/logout
- Access to static content
- Later there will be more options like Memorisation or Group info+actions
- Other ideas: Random word or last words learned
  Structure: The search bar and capture button need to be the main focus of this screen. On mobile at the end there can be a set of scroll shortcuts. and when the user scroll down, the 2 primary actions (search and capture) will stay minimized and sticky on the top.
  Questions: Can the desktop verson hold this minimalistic value without feeling too much empty and hiding things on extra steps just for a lazy minimalist design?

### 3 - Capture a word

The user needs a structured way to capture a word. This can be done in two main ways:

- Complete entry
- Quick capture
  So this flow needs to allow completing the action on multiple positions. This will be better thought out as a quick wizard. Few info at a time, so the user doesn't feel overwhelmed
  The wizard needs to be Quick and easy and the data structure tree allow this. Instead of a HUGE form that will touch many tables of the DB simultaneously, the structure of the wizard will be a multi-form sequence with the consolidated serving as a guide.

#### Screens:

1. New entry form:
   Idea: This is the most complex screen as it needs a couple of logic and domain related steps. It will deal with the primary part of the content, the entry. On desktop this can be inside a dialog, but on mobile, this can be a drawer that slides from the side or the bottom of the window.
   Structure: Term and notes are simple inputs (text and textarea) but the tag logic will require allowing the user to create new tags. When the user confirms they will be redirected to the entry screen where they can further complete the entry.
   Logic: WHen the user types the term and blurs, there needs to be a quick api call to check if the user already has this term. If so, it will suggest to navigate to that term where new definitions can be added.
   After submitting: Show the entry and give 2 options: close or add a definition:

2. Entry Screen:
   Idea: This is the entry display screen. Here the user can quickly see all the information about the entry and add new. After the first step of capture it will display the entry-level information and on the specific definition and links sections, it will only display the "add new" button.
   Structure: The main entry information, with main definition (empty ATM). The hierarchy is to show the definition that can be expanded. This definition element is a collapsible or an accordion that shows primarily the term override (with the article) - POS - and the translation. Examples and notes are hidden. While showing the examples, there is a button to add a new example.

3. New definition form:
   Idea: This is opened by clicking on the add-definition-button. It's a quick form with term override, POS, article (in case of nouns- conditionally rendered) and notes, there's no intrinsic logic behind this.
   QUICK DECISION ALERT: Do I allow adding examples here and sending all the info on the same submit, or it's better to save and then add examples?
   QUICK DESICION ALERT2: Do I use this form isolated on a drawer/dialog - or just add them into the entry screen. Dialog will allow examples better, but directly provides snappier UX.
   Structure depending on the decisions: Fields:

- TermOverride: text optional,
- POS: Select required with default value.
- NounArticla: Select (only shows when) POS==noun
- Translation: text required;
- Notes: textarea: optional;

On the submit response, I can show two options for the user: Go to the entry or adding an example:

4. New example form:
   Idea: quick form for new examples. Triggered by clicking new example on the definition (or embedded on the definition form).
   Structure: Two fields, one text (phrase) and one textarea (notes). Simple as that.
   On the submit response, show the user 2 options: Go back to the entry or adding another example;

5. Links form:
   Idea: By clicking on New Link, this will show a way for the user to select another term to create a link with. Need to filter this so the already linked words don't appear on the options for the combobox.
   Structure: open combobox so the user can search for an entry.
