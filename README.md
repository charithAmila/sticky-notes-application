# Sticky Notes

A single-page sticky notes application built with React and TypeScript.

## Features

### Core

- **Create notes** — click "Add New" to create a note at a random position with a random color
- **Move notes** — drag any note to reposition it on the board
- **Resize notes** — drag the handle in the bottom-right corner to resize
- **Delete notes** — drag a note over the trash zone (bottom-right) to remove it

### Bonus

- **Edit text** — click any note to type; changes are auto-saved after 500ms
- **Local storage** — notes persist across page reloads
- **Note colors** — each note gets a randomly generated background color

## Project Structure

```
sticky-notes/
├── src/
│   ├── components/
│   │   ├── Note.tsx              # Note component with drag, resize, edit
│   │   ├── note.css
│   │   ├── TrashZone.tsx         # Trash drop zone
│   │   └── trash-zone.css
│   ├── hooks/
│   │   └── useNote.ts            # Note interaction logic
│   ├── services/
│   │   └── NoteService.ts        # localStorage CRUD
│   ├── types/
│   │   └── Note.d.ts             # TypeScript types
│   ├── utils/
│   │   └── randomHexColor.ts
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Getting Started

### Requirements

- Node.js 20.19+ or 22.12+
- npm

### Install and run

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

### Production build

```bash
npm run build
npm run preview
```

Output goes to `dist/`.

### Lint

```bash
npm run lint
```

## Tech Stack

|           |                         |
| --------- | ----------------------- |
| Language  | TypeScript 5.6 (strict) |
| Framework | React 18.3              |
| Build     | Vite 5.4                |
| Styling   | Vanilla CSS             |
| Linting   | ESLint 9                |

## Data Model

```typescript
type Note = {
  id: number;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};
```

Notes are stored in `localStorage` as a JSON array under the key `"notes"`.

## Architecture Notes

- State lives in `App.tsx` and flows down via props
- `useNote` hook isolates all drag, resize, and edit logic from the component
- `NoteService` abstracts all `localStorage` reads and writes
- Drag position is tracked with `useRef` to avoid re-renders on every mouse move
- Text changes are debounced 500ms before saving to storage
- Resize and drag both save to storage only on `mouseup` / `dragend`, not on every event

## Browser Support

- Google Chrome (latest) — Windows and macOS
- Mozilla Firefox (latest) — all platforms
- Microsoft Edge (latest) — Windows

Minimum screen resolution: 1024×768

## Known Limitations

- No z-index management — clicking a note does not bring it to front
- Trash zone position is fixed to bottom-right and not responsive
- IDs use `Math.random()` — consider `crypto.randomUUID()` for production
- No error handling for `localStorage` quota or private browsing
- Multiple tabs may cause write conflicts (last-write-wins)
