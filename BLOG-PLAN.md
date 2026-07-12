# Block Blog — Build Plan

## Overview

A static blog built with React, styled with react-bootstrap, that renders blog posts from local markdown files and deploys to GitHub Pages via GitHub Actions.

## Tech Stack

| Layer | Technology |
|---|---|
| Build tool | Vite 6 |
| UI framework | React 19 |
| Styling | react-bootstrap (Bootstrap 5) |
| Markdown rendering | react-markdown |
| Frontmatter parsing | gray-matter |
| Routing | react-router-dom (client-side for dev; static export for prod) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

## Architecture

```
block-blog/
├── public/
├── posts/                 # Markdown blog posts with YAML frontmatter
│   ├── 2026-07-01-hello-world.md
│   └── ...
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # react-bootstrap Navbar
│   │   ├── BlogCard.jsx      # Post preview card for listing
│   │   ├── BlogPost.jsx      # Full post renderer
│   │   └── Layout.jsx        # Shared layout wrapper
│   ├── pages/
│   │   ├── Home.jsx          # Landing / post list
│   │   ├── PostPage.jsx      # Single post view
│   │   └── NotFound.jsx      # 404 page
│   ├── utils/
│   │   └── posts.js          # Functions to parse markdown & frontmatter
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml        # GitHub Actions → GitHub Pages
```

## How It Works

### 1. Blog Posts (Markdown + Frontmatter)

Each post is a `.md` file in `posts/` with YAML frontmatter:

```markdown
---
title: "Hello World"
date: "2026-07-01"
excerpt: "First post on the Block blog."
tags: ["meta", "introduction"]
---

This is the body of the blog post. Written in **markdown**.
```

### 2. Reading Posts (Build-Time Static Generation)

At build time, a Vite plugin or a script in `vite.config.js` reads all `.md` files from `posts/`, parses them with `gray-matter`, and generates a JSON manifest of all posts. This manifest is imported by the React app at runtime.

**Key design choice:** Use `import.meta.glob` (Vite's built-in glob import) to statically discover markdown files, avoiding the need for a custom build plugin.

```js
// src/utils/posts.js
const postModules = import.meta.glob('/posts/*.md', { query: '?raw', import: 'default', eager: true });

export function getAllPosts() {
  return Object.entries(postModules).map(([path, content]) => {
    const slug = path.replace('/posts/', '').replace('.md', '');
    const { data, content: body } = matter(content);
    return { slug, ...data, body };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
}
```

### 3. Routing

- `/` → Home page (list of blog post cards)
- `/post/:slug` → Individual blog post page
- `*` → 404 page

`react-router-dom` with `BrowserRouter` handles routing.

### 4. Styling with react-bootstrap

- `Navbar` (top navigation with blog title and links)
- `Card` (blog post preview cards on the home page)
- `Container` / `Row` / `Col` (responsive layout)
- Custom CSS overrides in `App.css` for blog-specific styling

## GitHub Pages Deployment

### Repository Setup

1. Create a new repo in the **FullStack-Agents** GitHub org: `block-blog`
2. Push the code to `main` branch
3. In repo Settings → Pages → Source: **GitHub Actions**

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)

Uses the official Vite-recommended approach:

```yaml
name: Deploy static content to Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Vite Config (`vite.config.js`)

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/block-blog/',  // matches repo name on GitHub Pages
})
```

## Build & Deploy Flow

```
Write markdown post → git add → git commit → git push (to main)

  ┌─────────────────────────────────────────────────┐
  │ GitHub Actions triggers on push to main          │
  │                                                  │
  │  1. Checkout repo                                │
  │  2. Install dependencies (npm ci)                │
  │  3. Build (npm run build → produces dist/)       │
  │  4. Upload dist/ as Pages artifact               │
  │  5. Deploy artifact to GitHub Pages              │
  │                                                  │
  └─────────────────────────────────────────────────┘

          Blog live at: https://fullstack-agents.github.io/block-blog/
```

## Implementation Steps

### Phase 1: Scaffold

1. Create Vite + React project: `npm create vite@latest block-blog -- --template react`
2. `cd block-blog && npm install`
3. Add dependencies: `react-bootstrap bootstrap react-router-dom react-markdown gray-matter`
4. Create `posts/` directory with a sample blog post
5. Set up `vite.config.js` with correct `base` path

### Phase 2: Core Components

6. Build `Layout.jsx` with react-bootstrap `Navbar`
7. Build `BlogCard.jsx` (Card component for post preview)
8. Build `BlogPost.jsx` (react-markdown rendering)
9. Build `posts.js` utility (import.meta.glob + gray-matter parsing)
10. Set up `App.jsx` with react-router routes

### Phase 3: Pages

11. Build `Home.jsx` — lists all posts as BlogCards
12. Build `PostPage.jsx` — renders a single post
13. Build `NotFound.jsx` — 404 page

### Phase 4: Deployment

14. Create `.github/workflows/deploy.yml`
15. Create GitHub repo `FullStack-Agents/block-blog`
16. Push to main → verify GitHub Actions runs
17. Enable GitHub Pages in repo settings → Actions source
18. Verify blog is live at the Pages URL

### Phase 5: Polish

19. Add custom CSS overrides for blog-specific styling
20. Add RSS feed (optional)
21. Add tag-based filtering (optional)
22. Write `README.md` for the repo

## Notes

- **No CMS, no database.** Blog is pure markdown files in the repo. This keeps it simple and portable.
- **Adding a new post:** Just create a new `.md` file in `posts/` and push to `main`. GitHub Actions handles the rest.
- **No hot-reload for markdown** — the build step re-reads all markdown files. For local dev, re-running `npm run dev` picks up changes.
- **GitHub Pages URL** will be `https://fullstack-agents.github.io/block-blog/` (since the repo is under the `FullStack-Agents` org with repo name `block-blog`).