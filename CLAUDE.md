# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`whiley-web` is the frontend for **WileyTEC** (a Peruvian tech company). It is a React 19 + Vite SPA in plain JavaScript (no TypeScript). It consumes a separate backend (`whiley-backend`, deployed on Render) and is itself deployed on **Vercel**. UI text is in Spanish.

## Commands

```bash
npm run dev      # Vite dev server (http://localhost:5173)
npm run build    # Production build to dist/
npm run preview  # Serve the production build locally
npm run lint     # ESLint over the whole repo
```

There is **no test suite** configured — do not assume a test runner exists.

## Environment

- `VITE_API_URL` — base URL of the backend (e.g. `http://localhost:3000` in dev, the Render URL in prod). The app appends `/api` to it. `.env` is gitignored; `.env.example` documents the variable.
- On Vercel, env vars are set in the dashboard, not committed.

## Architecture

### Two separate surfaces in one SPA
`src/App.jsx` defines all routing and splits the app into two worlds:

1. **Public site** — wrapped in `PublicLayout` (`<Header>` + page + `<Footer>`). Routes: `/`, `/nosotros`, `/servicios`, `/soporte`. Pages live in `src/pages/` and compose section components from `src/components/`.
2. **Admin panel** — routes under `/admin`. `/admin/login` is standalone; everything else is nested inside `<AdminLayout>` (sidebar + header, content via `<Outlet>`) and gated by `<ProtectedRoute>`. Admin pages live in `src/pages/admin/`.

`<ScrollToHash>` in `App.jsx` handles smooth-scroll to `#anchor` targets and scroll-to-top on navigation — this is why in-page section links (e.g. on the public pages) work across route changes.

### Auth flow
- `src/context/AuthContext.jsx` is the single source of truth for admin auth. `<AuthProvider>` wraps the entire app in `App.jsx`. State (`admin`, `token`) is mirrored to `localStorage` under keys `admin_token` and `admin_data`, so sessions survive refresh. Use the `useAuth()` hook to read `admin`, `isAuthenticated`, `login`, `logout`, `loading`.
- `<ProtectedRoute>` (`src/components/admin/ProtectedRoute.jsx`) waits for `loading` to settle, then redirects to `/admin/login` if not authenticated.
- Login is a JWT exchange: `AdminLogin.jsx` POSTs to `${VITE_API_URL}/api/auth/login` and calls `login(data.admin, data.token)` on success.

### API layer
`src/services/api.js` is the **only** place that should talk to the backend (the one exception today is the login call inside `AdminLogin.jsx`). It exports one grouped object per resource: `contactosAPI`, `planesHostingAPI`, `planesVPSAPI`, `planesBigDataAPI`, `equipoAPI`, `faqsAPI`, `historialAPI`. All requests go through the shared `apiRequest()` helper, which:
- prefixes `VITE_API_URL + /api`,
- attaches `Authorization: Bearer <admin_token>` automatically from `localStorage`,
- parses JSON and throws `new Error(data.error || ...)` on non-OK responses.

When adding a backend-backed feature, add a method to the relevant `*API` object here rather than calling `fetch` directly in a component.

### Admin CRUD page pattern
Every admin resource page (e.g. `AdminPlanesHosting.jsx`) follows the same shape — replicate it for consistency:
- local state for `loading`, `error`, list data, plus modal state (`modalAbierto`, `modoEdicion`, the entity being edited, `guardando`);
- a `cargar*()` loader called in `useEffect` on mount, re-called after every mutation;
- a single create/edit modal driven by a `formInicial` template object and a generic `handleChange` (handles checkboxes via `type === 'checkbox' ? checked : value`);
- mutations call the corresponding `*API` method, then re-fetch;
- destructive/edge actions use native `confirm()` / `alert()` for UX (no toast library).

Note: backend list endpoints return a wrapper object — pages read the array off a named field (e.g. `data.planes`), not the response directly.

### Styling
Plain CSS, co-located one `.css` file per component/page (imported directly in the `.jsx`). No CSS framework or CSS-in-JS. Brand accent color is `#F0A815` (gold) on dark backgrounds. Icons come from `lucide-react`. `three` / `@react-three/fiber` / `@react-three/drei` power 3D visuals (e.g. the Hero sphere); the admin login uses a hand-rolled canvas particle animation.

### Deployment
`vercel.json` rewrites all paths to `/index.html` so client-side routing works on Vercel (without it, deep links like `/admin/dashboard` would 404 on refresh).

## Known inconsistencies (be aware, not necessarily to "fix")
- `AdminLogin.jsx` calls `import.meta.env.VITE_API_URL` directly **without** the `|| 'http://localhost:3000'` fallback that `api.js` uses — login breaks if the env var is unset.
- The login "Recordarme" checkbox and "¿Olvidaste tu contraseña?" link are UI-only with no wired behavior.
- There is no automatic logout when the backend rejects an expired/invalid token; `apiRequest` just throws.
