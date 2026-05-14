# Kingmaker

Federal proposal operations workspace for OpalAI — a single-page React app
with installable PWA support.

Originated as an HTML/Babel prototype from Claude Design; converted into a
modern Vite + React build with Tailwind, React Router, and a service-worker
backed PWA shell.

## Stack

- **Vite 5** — dev server and production bundler
- **React 18** + **React Router 6** — SPA routing
- **Tailwind CSS 3** — styling
- **Recharts** — pipeline funnel chart
- **vite-plugin-pwa** — manifest + auto-updating service worker

## Scripts

```bash
npm install              # install deps
npm run dev              # vite dev server on :5173
npm run build            # production build → dist/
npm run preview          # serve dist/ on :4173
npm run generate-pwa-assets  # regenerate PWA icons from public/favicon.svg
```

## Routes

| Path                         | Screen                              |
| ---------------------------- | ----------------------------------- |
| `/`                          | Dashboard                           |
| `/pipeline`                  | Pipeline / opportunity feed         |
| `/reviews`                   | My Reviews — approval queue         |
| `/team`                      | Team & Capabilities                 |
| `/kb`                        | Knowledge Base                      |
| `/settings`                  | Settings                            |
| `/opp/:oppId`                | Redirects to `/opp/:oppId/budget`   |
| `/opp/:oppId/:step`          | Opportunity workspace (10 steps)    |

Workspace steps: `intake`, `triage`, `scope`, `collaborators`, `draft`,
`tasks`, `timeline`, `budget`, `assembly`, `submission`.

## Project layout

```
src/
  main.jsx           entry — registers SW, mounts <App/> in <BrowserRouter>
  App.jsx            top-level layout + workspace state + <Routes>
  index.css          tailwind @layer base / utilities + custom animations
  data.js            static fixture data (opportunities, team, etc.)
  icons.jsx          inline SVG icon set (lucide-flavored)
  primitives.jsx     Pill, Avatar, Card, Button, etc.
  shell.jsx          Sidebar, TopBar, AIRail
  dashboard.jsx      Dashboard screen
  pipeline.jsx       Pipeline table
  workspace.jsx      Workspace step panels (intake → timeline)
  other-screens.jsx  Budget, Assembly, Compliance, Team, KB, Reviews, Settings
  tweaks-panel.jsx   floating tweaks panel + hooks
public/
  favicon.svg        source icon (PWA assets generated from this)
  pwa-*.png          generated icons
```

## PWA

The service worker (`vite-plugin-pwa`) precaches the built bundle and uses
`StaleWhileRevalidate` for Google Fonts. The app installs from any modern
browser via the address-bar install button. Manifest is generated at build
time; theme / icons / shortcuts live in `vite.config.js`.

To regenerate icons after changing the source SVG:

```bash
npm run generate-pwa-assets
```

## Notes

- The app is designed for ≥1440px desktop; narrower viewports compress
  columns but everything still renders.
- All proposal/team data is static fixture content — there is no backend.
- The Tweaks panel sends `postMessage` events to `window.parent`; these
  are harmless when running standalone.
