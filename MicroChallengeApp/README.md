# Micro Challenge AI

A React-based micro challenge manager with AI-powered challenge generation. Create, organize, draw, and complete small daily challenges to build productive habits.

**[Live Demo](https://lukaszswieboda.github.io/MicroChallenge)**

This project was built to combine frontend development, state management, and practical AI integration in a small but complete portfolio application.

## Features

- **Challenge Management** — create, edit, delete, and filter challenges by category
- **Random Draw** — draw a random challenge from your active list
- **Completion Tracking** — mark challenges as done and review your history
- **Progress Stats** — completion rate, day streak, difficulty breakdown, top category
- **AI Challenge Generator** — generate contextual challenge suggestions based on your goal, category, available time, and difficulty
- **Persistent Storage** — all data saved in `localStorage` with migration support for schema changes

## Tech Stack

- React 18 with Context API for state management
- React Router 7 with client-side routing
- Vite for build and development
- Vanilla CSS (no UI framework)
- GitHub Pages deployment via `gh-pages`
- OpenAI API integration (optional, for real AI suggestions)

## AI Challenge Generator

The app includes an AI-powered challenge generator accessible from the **AI Generator** tab.

### How it works

1. Describe your goal (e.g. "improve focus", "learn guitar")
2. Select a category, available time, and optionally a difficulty level
3. Click **Generate Suggestions** to get 3 tailored challenge ideas
4. Save any suggestion directly to your challenge list

### Demo Mode (default)

When no API key is configured, the generator runs in **Demo Mode** — it uses a built-in template engine that produces contextually relevant suggestions based on your inputs. This allows full functionality without any external dependencies.

### Real API Mode

To use OpenAI's API for real AI-generated challenges:

1. Click **API Key** in the generator header
2. Enter your OpenAI API key (`sk-...`)
3. The key is stored in `sessionStorage` (cleared when the browser tab closes)
4. The generator now calls `gpt-4o-mini` for each request

### Security Note

The API key is stored client-side in `sessionStorage` and sent directly from the browser to OpenAI. This is suitable for local development and portfolio demos. For a production application, the API call should be proxied through a backend to avoid exposing the key in the browser.

## Getting Started

### Prerequisites

- Node.js 16+
- npm 8+

### Installation

```bash
git clone https://github.com/LukaszSwieboda/MicroChallenge.git
cd MicroChallenge/MicroChallengeApp
npm install
```

### Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

Deploys the production build to `https://lukaszswieboda.github.io/MicroChallenge`.

## Project Structure

```
src/
├── components/
│   ├── AddChallenge.js        # Challenge creation form
│   ├── AIGenerator.js         # AI challenge generator UI
│   ├── ChallengeContext.js    # Central state + persistence
│   ├── ChallengeList.js       # Active challenges with filtering
│   ├── ChallengeStats.js      # Progress statistics
│   ├── CompletedChallenges.js # Completed challenges + stats
│   ├── DrawChallenge.js       # Random challenge draw
│   └── Home.js                # Home page shell
├── services/
│   └── aiService.js           # AI service layer (mock + OpenAI)
├── layouts/
│   └── App.js                 # Router + navigation
├── styles/
│   └── AppStyles.css          # Global styles
└── constants.js               # Shared categories, difficulties, defaults
```

## Known Limitations

- **Client-side only** — no backend, no user accounts. Data is per-browser via `localStorage`.
- **API key exposure** — the OpenAI key is handled client-side. Acceptable for demos, not for production.

## Future Improvements

- Add unit tests for `ChallengeContext` and streak calculation
- Allow editing all challenge fields (category, difficulty, time), not just title
- Prevent duplicate entries in completed challenges
- Add data export/import
- Move AI calls behind a serverless function for production use
