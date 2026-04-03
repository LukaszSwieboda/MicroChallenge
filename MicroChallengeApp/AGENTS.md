# AGENTS.md

## Project Overview

This repository contains a small React application for managing "micro challenges".
Users can:

- add a challenge,
- filter, edit, and delete active challenges,
- draw a random challenge,
- mark a drawn challenge as completed,
- review completed challenges.

The project is currently a client-side app with persistence in `localStorage`.

## Stack

- React 18
- `react-scripts` 5
- `react-router-dom` 7
- React Context for app state
- GitHub Pages deployment via `basename="/MicroChallenge"` and `homepage` in `package.json`

## Key Entry Points

- `src/index.js`: app bootstrap
- `src/layouts/App.js`: router, navigation, top-level provider wiring
- `src/components/ChallengeContext.js`: central state and business logic
- `src/styles/AppStyles.css`: global styling

## Runtime Architecture

### Routing

Routes are defined in `src/layouts/App.js`:

- `/` -> `Home`
- `/draw` -> `DrawChallenge`
- `/completed` -> `CompletedChallenges`

The router uses `basename="/MicroChallenge"`, which is important for GitHub Pages hosting.

### State Management

All shared state lives in `src/components/ChallengeContext.js`.

The context currently owns:

- `challengeList`
- `selectedChallenge`
- `completedChallenges`
- `drawMessage`

It also exposes the main operations:

- `addChallenge`
- `editChallenge`
- `deleteChallenge`
- `drawNewChallenge`
- `markChallengeAsCompleted`

### Persistence

Data is stored in `localStorage` under:

- `mc_challengeList`
- `mc_completedChallenges`

The provider also includes migration-style normalization through `migrateChallenge()`, which means older stored entries may still load even if their shape differs slightly.

## Component Map

### `src/components/Home.js`

Home page shell. Renders:

- `AddChallenge`
- `ChallengeList`

### `src/components/AddChallenge.js`

Responsible for creating new challenges.

Current fields:

- `title`
- `category`
- `difficulty`
- `estimatedMinutes`

Validation is intentionally lightweight.
Current behavior includes basic title validation and defensive normalization of numeric time values.
Prefer extending the current validation incrementally instead of replacing it wholesale.

### `src/components/ChallengeList.js`

Displays active challenges and supports:

- category filtering,
- inline title editing,
- deleting challenges.

Important note: editing currently updates only the title, not the other fields.

### `src/components/DrawChallenge.js`

Allows drawing one random challenge from the active list and marking it as completed.

Important behavior:

- drawing selects from `challengeList`,
- completing moves the selected challenge into `completedChallenges`,
- the selected challenge is then cleared.

### `src/components/CompletedChallenges.js`

Shows completed challenges only.

## Shared Constants

`src/constants.js` currently defines shared option lists and defaults, including:

- `CATEGORIES`
- `DIFFICULTIES`
- default challenge values used by the form and model

Prefer extending these constants instead of hardcoding new option lists or default values inside components.

## Styling Notes

Global styling lives mainly in `src/styles/AppStyles.css`.

Current characteristics:

- background image on `body`,
- centered card-like containers,
- shared button/input styles,
- route-specific container classes such as `.draw-challenge` and `.completed-challenges`,
- mobile adjustments for navigation and form layout.

When changing UI, prefer reusing the existing container structure instead of introducing a second parallel styling system.

## Working Agreements For Future Agents

### Preserve Existing User Changes

The worktree is already dirty. Before editing, inspect current file contents and avoid reverting unrelated user changes.

### Keep State Logic Centralized

If a change affects challenge lifecycle or persistence, update `ChallengeContext.js` first and let components stay mostly presentational.

### Respect Existing Data Shape

Challenge objects currently use:

- `id`
- `title`
- `category`
- `difficulty`
- `estimatedMinutes`
- `done`
- `createdAt`

If this shape changes, update:

- creation logic,
- migration logic,
- any component that renders challenge metadata,
- `localStorage` compatibility assumptions.

### Be Careful With GitHub Pages Routing

Do not remove or casually change:

- `basename="/MicroChallenge"` in the router,
- `homepage` in `package.json`

unless deployment behavior is intentionally being changed.

### Preserve Build And Deploy Behavior

Do not change build or deployment-related configuration unless explicitly requested.

Be especially careful with:

- `homepage` in `package.json`
- router basename
- GitHub Pages assumptions
- production build behavior

### Prefer Small, Consistent Changes

This codebase is simple and centralized. Favor incremental edits over introducing new abstractions unless there is clear reuse or growing complexity.

### Avoid Unnecessary Dependencies

Do not add new libraries unless they solve a real problem that cannot be handled cleanly with the current stack.

Prefer:

- small local utilities,
- existing React patterns,
- current CSS structure

over introducing new packages.

### Prefer Semantic HTML

Use semantic HTML whenever possible.

In particular:

- use real `<form>` elements for form interactions,
- prefer `onSubmit` over ad hoc keyboard handlers,
- use semantic buttons (`type="button"` / `type="submit"`) intentionally.

Do not replace normal form behavior with custom key handling unless there is a strong reason.

### Reuse Shared Constants And Defaults

When working with categories, difficulties, or default challenge values, import them from `src/constants.js`.

Do not hardcode:

- category option lists,
- difficulty option lists,
- default category,
- default difficulty,
- default minutes

inside multiple components.

### Be Defensive With localStorage

Treat `localStorage` as unreliable input.

When changing persistence logic:

- handle missing keys safely,
- handle invalid JSON safely,
- avoid accidental data wiping on hydration failure,
- keep migration logic backward-compatible where possible,
- avoid blocking unrelated storage keys when one key is corrupted.

### Keep Changes Scoped

When implementing a requested phase, stay within that phase.

Do not:

- refactor unrelated files,
- redesign UI unless requested,
- change architecture without clear need,
- mix feature work with broad cleanup.

If you notice adjacent issues, mention them separately instead of expanding the current scope automatically.

### Verify Changes Before Finishing

Before considering a task complete:

- check that the app still builds if the change affects runtime behavior,
- verify existing core flows still work,
- summarize changed files,
- summarize any remaining risks or follow-up items.

Do not claim completion without verifying the requested behavior.

## Useful Commands

- `npm start` - run locally
- `npm run build` - production build
- `npm test` - run tests
- `npm run deploy` - publish build to GitHub Pages

## Good First Improvement Areas

- improve form validation and error display,
- allow editing category/difficulty/time, not only title,
- prevent duplicate completion entries,
- add tests around `ChallengeContext` behavior,
- refine mobile layout and scrolling behavior.

## Review Workflow

After completing a meaningful implementation step, run an adversarial code review before moving to the next phase.

Use this review workflow:

- run adversarial review after a meaningful batch of changes,
- do not run a full review after tiny cosmetic-only edits,
- treat review as read-only analysis first,
- only apply fixes that are relevant and justified,
- after applying fixes, optionally run one follow-up review to confirm closure.

Preferred review targets:

- state management changes,
- persistence/localStorage changes,
- data model changes,
- routing changes,
- API/AI integration,
- non-trivial refactors.

When reviewing findings:

- prioritize correctness, regressions, edge cases, compatibility, and data-loss risks,
- avoid unnecessary refactors,
- avoid changing unrelated files during review fixes.

### Review Fix Discipline

When adversarial review finds issues:

- fix the meaningful issues first,
- avoid speculative rewrites,
- do not enter repeated review/fix loops without substantial new changes,
- prefer one follow-up review at most after applying a batch of fixes.
