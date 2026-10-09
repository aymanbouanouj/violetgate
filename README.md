# VioletGate

**A responsive, animated authentication UI — designed and developed by Ayman Bounaouj.**

VioletGate is a polished frontend **demo** featuring animated Sign In / Sign Up panels, responsive layout, and light/dark appearance inspired by a purple, black, and white visual identity.

> [!IMPORTANT]
> This is **not a working authentication service**. There is no backend, OAuth flow, account database or password-reset feature. Form submissions are prevented and credentials are not transmitted by this demo. Do not enter real passwords.

## Preview

| Light theme | Dark theme |
| --- | --- |
| ![Desktop light theme](assets/previews/desktop-light.png) | ![Desktop dark theme](assets/previews/desktop-dark.png) |

### Live demo

After enabling GitHub Pages: **https://aymanbouanouj.github.io/violetgate/**

*(Expected URL only — becomes active after you publish the repository and GitHub Pages finishes deploying.)*

## Features

- Animated sign-in and sign-up panels on desktop; stacked layout on small screens.
- Manual light/dark switch with saved preference, falling back to the operating-system theme.
- Brand palette: purple `#7C3AED`, black `#0A0A0D`, charcoal `#17171C`, white `#FFFFFF`.
- Font Awesome social icons with embedded SVG fallbacks for offline use.
- Semantic HTML labels, keyboard focus styles, reduced-motion support, and browser field validation.
- No framework, build step, backend, or npm dependencies required for the page.

## Tech stack

**HTML5**, **CSS3**, **vanilla JavaScript**. Font Awesome and Google Fonts are loaded through third-party CDNs when internet access is available.

## Folder structure

```text
violetgate/
├── index.html                     # GitHub Pages entry point
├── assets/
│   ├── css/style.css               # Responsive styling and themes
│   ├── js/script.js                # Interactions and demo behaviors
│   ├── icons/favicon.svg          # Browser tab icon
│   └── previews/                   # README screenshots
├── scripts/verify.mjs             # Dependency-free integrity check
├── .github/workflows/quality.yml # GitHub Actions static checks
├── .nojekyll                       # Publish static files as-is
├── .editorconfig
├── .gitattributes
├── .gitignore
└── README.md
```

## Run locally

1. Download or clone this repository.
2. Open `index.html` in your browser, or run with VS Code **Live Server**.
3. Try the Sign In / Sign Up switch and the theme toggle.

Optional: run static integrity checks with Node.js 22 or newer:

```bash
node --check assets/js/script.js
node scripts/verify.mjs
```

## Publish to GitHub Pages

1. Create a **public** GitHub repository named `violetgate` under `aymanbouanouj` without generating an initial README or other files.
2. Upload/push the **contents** of this folder. Keep `index.html` in the repository root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select **main** and **/(root)**, then **Save**.
6. When deployment completes, click **Visit site** or open `https://aymanbouanouj.github.io/violetgate/`.

The page has no dependency on the domain root and uses relative asset paths, so it works under the `violetgate` project subpath.

## Credits

Designed & developed by **Ayman Bounaouj**.

This public repository has no open-source license attached. Add an explicit license only if you want to grant reuse or redistribution rights.
