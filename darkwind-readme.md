# WindWave Dark Mode

Practicum site for implementing a dark mode toggle with JavaScript, themed on wind energy for smart cities.

## Features
- Light / Dark / System theme choice, plus a quick sun and moon toggle in the top bar
- `window.matchMedia("(prefers-color-scheme: dark)")` detects the device setting and reacts live
- `localStorage` remembers the choice across visits (and across open tabs)
- A tiny script in the page head applies the saved theme before first paint, so there is no flash
- Demo of changing an element with `classList.toggle` versus an inline `style`
- Inspector, live preview of a landing page in both themes, and an event log

## Files
- `darkwind-page.html` – the page
- `darkwind-style.css` – theme tokens (light and dark) and styles
- `darkwind-script.js` – theme logic, storage, events
- `vercel.json` – opens the page at the site root (keep this exact name)

## Upload to GitHub
1. Create a NEW repository for this site.
2. Add file -> Upload files, drag in the unzipped files (not the zip), and commit.

## Deploy on Vercel
1. Vercel -> Add New -> Project, import the repository.
2. Framework Preset: Other. Leave build settings empty. Deploy.
