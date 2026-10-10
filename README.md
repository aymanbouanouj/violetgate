# VioletGate

**An interactive, animated sign-in / sign-up UI demo — designed and developed by Ayman Bounaouj.**

[![Quality checks](https://github.com/aymanbouanouj/violetgate/actions/workflows/quality.yml/badge.svg)](https://github.com/aymanbouanouj/violetgate/actions/workflows/quality.yml)

[**Live demo ↗**](https://aymanbouanouj.github.io/violetgate/) · [Source code](https://github.com/aymanbouanouj/violetgate)

> [!IMPORTANT]
> VioletGate is a **frontend-only demo**, not a real authentication service. No accounts are created, passwords are not verified or transmitted, and OAuth/password-reset actions are illustrative. **Do not enter real credentials.**

## Preview

| Light mode | Dark mode |
| --- | --- |
| ![Light theme](assets/previews/desktop-light.png) | ![Dark theme](assets/previews/desktop-dark.png) |

<details>
<summary>Mobile preview</summary>

![Mobile sign-up screen](assets/previews/mobile-signup.png)

</details>

## Features

- Animated transitions between sign-in and sign-up on desktop, plus a responsive stacked layout for mobile.
- Purple (`#7C3AED`), black, and white branding; light/dark modes with a saved preference.
- Keyboard-accessible interactions with focus management and reduced-motion support.
- Built-in SVG social icons, no external font/icon requests or framework runtime.
- Frontend-only validation and clear notices that authentication is not implemented.
- Social sharing metadata, browser favicon, and GitHub Pages hosting.

## Tech

HTML5, CSS3, and vanilla JavaScript. **No installation or build step is required for website visitors.** Playwright and axe-core are development-only testing tools.

## Project structure

```text
violetgate/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/script.js
│   ├── icons/favicon.svg
│   └── previews/            # Screenshots displayed in this README
├── scripts/verify.mjs      # Static integrity and privacy checks
├── scripts/capture-previews.mjs
├── tests/violetgate.spec.mjs
├── playwright.config.mjs
├── package.json           # Development/test tools only
├── docs/RELEASING.md      # Maintainer release and branch protection steps
├── .github/workflows/quality.yml
├── .gitignore
├── .gitattributes
├── .editorconfig
├── .nojekyll
└── README.md
```

## Run and verify

Open `index.html` in a browser, or use VS Code Live Server.

```bash
node --check assets/js/script.js
node scripts/verify.mjs
```

To run browser E2E and automated accessibility checks:

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

To refresh the three screenshots in `assets/previews/` from the **current** UI:

```bash
npm run previews
```

On Windows, install Python and ensure the `py` launcher is available. GitHub Actions automatically runs the static checks and Playwright + axe-core browser tests on pushes and pull requests. The screenshot script does not run in production.

Test dependencies are pinned in `package.json`. A committed `package-lock.json` is recommended for reproducible transitive dependencies. CI automatically uses `npm ci` when it exists; otherwise it falls back to installing the pinned direct development dependencies. An automated axe-core check does not replace manual accessibility testing.

## Privacy and security scope

- This page stores **only the theme preference** in `localStorage` under `violetgate-theme`.
- Neither passwords nor email addresses are stored or sent by the demonstration logic. The demo action buttons are not HTML submit buttons and sensitive inputs have no `name` attributes.
- No Google Fonts, Font Awesome, remote APIs, analytics, or tracking scripts are required to render the demo.
- A real authentication implementation would require a separately secured backend, HTTPS, server-side validation, rate limiting, and secure session management.

## Attribution and reuse

Designed & developed by **Ayman Bounaouj**. This repository does **not** currently provide an open-source license; public visibility does not automatically grant reuse rights. The embedded example platform logos remain trademarks of their respective owners.

## Maintainer guide

See [release and branch protection instructions](docs/RELEASING.md). Do not create a version tag until checks pass and the screenshots are current.
