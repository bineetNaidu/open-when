# Open When

A zero-backend web app for writing and sharing collections of "Open When" letters with someone you love. Everything lives in the URL — no accounts, no servers, no storage.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Language | TypeScript 6 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 12 |
| Routing | React Router v7 |
| Icons | Lucide React |
| Compression | lz-string |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check + production build
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── animations/
│   │   ├── AnimatedEnvelope.tsx   # 3D tilt envelope with floating animation
│   │   ├── FloatingParticles.tsx  # Canvas-based ambient particle system
│   │   ├── LetterReveal.tsx       # Line-by-line letter reveal animation
│   │   └── SealAnimation.tsx      # Full-screen seal + share link overlay
│   └── LetterCard.tsx             # Expandable letter editor card
├── hooks/
│   └── useReducedMotion.ts        # Respects prefers-reduced-motion
├── pages/
│   ├── CreatePage.tsx             # Letter writing interface
│   └── OpenPage.tsx               # Recipient envelope + letter view
├── utils/
│   ├── daily.ts                   # Deterministic daily letter selection
│   ├── id.ts                      # Random ID generator
│   └── url.ts                     # lz-string encode/decode helpers
└── types/
    └── index.ts                   # Shared TypeScript interfaces
```

---

## How the URL Works

The entire letter collection is serialized to JSON, compressed with `lz-string`, and embedded in the URL as the `?d=` query parameter.

```
/open?d=<lz-string compressed + URI encoded JSON>
```

No data ever leaves the browser. The link itself is the database.

Maximum practical URL length is around 2000 characters in older browsers. With lz-string compression, this supports roughly 8–12 average-length letters before URLs get unwieldy.

---

## Deterministic Daily Selection

The same URL always shows the same letter to everyone on the same calendar day, with no backend involved.

```ts
function hashString(str: string): number { ... }   // djb2-style hash
const seed = hashString(urlData + todayString())    // URL + YYYY-M-D
const index = seed % letters.length                 // stable index
```

Tomorrow the date component changes, so a different letter is selected automatically.

---

## Routing

| Path | Page |
|---|---|
| `/` | CreatePage — write and seal letters |
| `/open?d=...` | OpenPage — view today's letter |

React Router handles client-side routing. Vite's `historyApiFallback: true` ensures direct `/open` URL visits don't 404 in dev.

For production deployment on static hosts (Netlify, Vercel, GitHub Pages), add the appropriate redirect rule so all paths serve `index.html`.

**Netlify** — add `_redirects` to `/public`:

```
/* /index.html 200
```

**Vercel** — add to `vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

## Animation Architecture

All animations use Framer Motion. Key patterns used:

- `AnimatePresence mode="wait"` — clean page-level transitions
- `useMotionValue` + `useSpring` — physics-based envelope tilt on cursor move
- `useTransform` — maps drag distance to opacity for swipe feedback
- Canvas `requestAnimationFrame` loop — particle system runs off React render cycle
- Staggered `delay: i * 0.05` — letter cards animate in sequentially

Reduced motion is respected globally via the `useReducedMotion` hook, which reads the `prefers-reduced-motion` media query and disables entrance animations.

---

## ESLint

To enable stricter type-aware linting for production:

```js
// eslint.config.js
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

---

## Known Limitations

- URL length caps at ~2000 chars in some browsers — very long messages may produce unshareble links on SMS
- No edit-after-share — once a link is shared, the sender must re-seal to change letters
- Clock-based daily rotation uses the recipient's local device time, not a server clock
- No delivery confirmation — the sender cannot know if the recipient has opened their letter
