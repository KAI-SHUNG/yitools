# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

易经六爻工具 — a web-based Yi Jing (I Ching) divination tool focused on 六爻 (Six Lines) practice. Features: user authentication, divination (起卦), persistent storage, interactive knowledge base with popups, divination interpretation hints, and AI-powered deep readings via Claude API.

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Backend/Auth/DB**: Supabase (PostgreSQL, Row Level Security)
- **AI Integration**: Claude API (Anthropic SDK) for divination interpretation
- **Package Manager**: pnpm

## Commands

```bash
pnpm dev          # Start Vite dev server
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm lint         # ESLint
pnpm test         # Run tests (if configured)
```

## Architecture

```
src/
├── components/       # Reusable UI components
│   ├── auth/         # Login, register, user menu
│   ├── divination/   # 起卦 interface (coin toss, manual input)
│   ├── hexagram/     # Hexagram display, line rendering
│   ├── knowledge/    # 六爻知识 popup modals (六亲, 六神, 世应, etc.)
│   └── interpretation/ # AI reading display, hints panel
├── pages/            # Route-level pages
├── hooks/            # Custom React hooks (useAuth, useDivination, etc.)
├── lib/
│   ├── supabase/     # Supabase client, auth helpers, DB types
│   ├── yijing/       # Core 六爻 logic: hexagram data, 纳甲, 六亲 mapping
│   └── ai/           # Claude API integration for interpretation
├── types/            # TypeScript type definitions
└── data/             # Static data: 64 hexagrams, 爻辞, 六十四卦卦辞
```

## Key Domain Concepts (六爻)

- **卦 (guà)**: Hexagram — 6 lines (爻), each either 阳 (solid) or 阴 (broken)
- **本卦/变卦**: Original hexagram vs. changed hexagram (after 动爻)
- **纳甲 (nà jiǎ)**: System assigning 天干地支 to each line
- **六亲 (liù qīn)**: Five relations (父母, 兄弟, 子孙, 妻财, 官鬼) relative to 用神
- **六神 (liù shén)**: Daily spirits (青龙, 朱雀, 勾陈, 螣蛇, 白虎, 玄武)
- **世应 (shì yìng)**: Self/Other positions within the hexagram
- **动爻 (dòng yáo)**: Changing lines that transform 本卦 into 变卦

## Data Model (Supabase)

- `profiles` — user profile, linked to auth.users
- `divinations` — question, 本卦, 动爻, 变卦, 时间, AI interpretation result
- `hexagrams` — static reference: 64 hexagrams with 卦辞, 爻辞, 象辞

## Environment Variables

```
VITE_SUPABASE_URL=          # Supabase project URL
VITE_SUPABASE_ANON_KEY=     # Supabase anon key
CLAUDE_API_KEY=             # Server-side only — never expose to client
```

## Conventions

- All API keys and secrets server-side only (Supabase Edge Functions or API routes)
- Use Supabase Row Level Security to isolate user data
- 六爻 calculation logic in `lib/yijing/` must be pure functions with comprehensive tests
- Knowledge popups should be data-driven from `data/` — not hardcoded in components
- Chinese UI text, English code/comments
