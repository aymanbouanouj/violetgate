// Dependency-free verification of a public frontend-only demonstration.
// These static checks do not replace browser tests or a full security audit.
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const html = read('index.html');
const css = read('assets/css/style.css');
const js = read('assets/js/script.js');
const readme = read('README.md');

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML IDs found');
for (const name of ['container', 'register', 'login', 'themeToggle', 'signUpForm', 'signInForm', 'signUpSection', 'signInSection', 'toggleLeft', 'toggleRight', 'signin-title', 'signup-title']) {
  assert(ids.includes(name), `Missing required UI element #${name}`);
}
for (const asset of ['assets/css/style.css', 'assets/js/script.js', 'assets/icons/favicon.svg', 'assets/previews/desktop-light.png', 'assets/previews/desktop-dark.png', 'assets/previews/mobile-signup.png']) {
  assert(existsSync(resolve(root, asset)), `Missing asset file: ${asset}`);
}
for (const asset of ['assets/css/style.css', 'assets/js/script.js', 'assets/icons/favicon.svg']) {
  assert(html.includes(`"${asset}"`), `Missing HTML reference: ${asset}`);
}
assert(css.includes('@media (max-width: 700px)'), 'Responsive mobile rules missing');
assert(css.includes('prefers-reduced-motion'), 'Reduced motion rules missing');
assert(js.includes('setAccessible(toggleLeft, signUp)'), 'Hidden toggle accessibility not managed');
assert(js.includes('heading.focus({ preventScroll: true })'), 'Form focus transfer not implemented');
assert(html.includes('aria-hidden="true" inert'), 'Initial inert states missing');
assert(html.includes('INTERACTIVE DEMO'), 'Visible demo disclosure missing');
assert(html.includes('Do not enter real passwords.'), 'Visible credential warning missing');
assert(!html.includes('type="submit"'), 'Demo must not expose a submit button');
assert(!/<input\b[^>]*\bname\s*=/.test(html), 'Demo inputs should never be submitted by name');
assert(js.includes('event?.preventDefault()'), 'JavaScript submit safety handler missing');
assert(!/https?:\/\//.test(js), 'Unexpected network URL in JavaScript');
assert(!/@import\s+url\(['"]?https?:/i.test(css), 'Third-party CSS font import detected');
assert(!/<(?:script|link)\b[^>]*(?:src|href)=["']https?:/i.test(html), 'Remote script or stylesheet detected');
assert(html.includes('property="og:image"'), 'Social card metadata missing');
assert(readme.includes('[**Live demo ↗**]'), 'Live demo link not prominent');
assert(!readme.includes('Expected URL only'), 'Old deployment placeholder remains');
assert(html.includes('Designed &amp; developed by'), 'Developer credit missing');
assert(existsSync(resolve(root, '.nojekyll')), 'GitHub Pages marker missing');
for (const path of ['package.json', 'playwright.config.mjs', 'tests/violetgate.spec.mjs', 'scripts/capture-previews.mjs', 'docs/RELEASING.md']) {
  assert(existsSync(resolve(root, path)), `Missing development file: ${path}`);
}
assert(read('package.json').includes('@axe-core/playwright'), 'Accessibility test dependency not declared');
assert(read('.github/workflows/quality.yml').includes('browser-tests:'), 'Browser CI job missing');

// Basic leak guard for known sensitive filenames and recognizable credential formats.
const inspect = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const full = resolve(directory, entry.name);
    if (entry.isDirectory()) { inspect(full); continue; }
    const path = relative(root, full).replaceAll('\\', '/');
    assert(!/(^|\/)\.env(?:\.|$)|(^|\/)(?:id_rsa|id_ed25519)$|\.(?:pem|p12|pfx|key)$/i.test(path), `Potential secret file: ${path}`);
    if (!/\.(?:html|css|js|mjs|md|yml|yaml|svg|json|txt|gitignore|gitattributes|editorconfig)$/i.test(path) && !path.startsWith('.')) continue;
    const content = readFileSync(full, 'utf8');
    for (const [kind, expr] of [
      ['GitHub token', /gh[pousr]_[A-Za-z0-9_]{30,}/],
      ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
      ['AWS access key', /AKIA[0-9A-Z]{16}/],
    ]) assert(!expr.test(content), `${kind} detected in ${path}`);
  }
};
inspect(root);
console.log('VioletGate static, privacy, and integrity checks passed.');
