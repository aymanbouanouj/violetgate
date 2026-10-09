// Basic structural integrity checks using only Node.js built-ins.
// Browser rendering and authentication services are outside this script's scope.
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const css = readFileSync(resolve(root, 'assets/css/style.css'), 'utf8');
const js = readFileSync(resolve(root, 'assets/js/script.js'), 'utf8');

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML IDs found');

for (const name of ['container', 'register', 'login', 'themeToggle', 'signUpForm', 'signInForm', 'signUpSection', 'signInSection']) {
  assert(ids.includes(name), `Missing required UI element #${name}`);
}
for (const asset of ['assets/css/style.css', 'assets/js/script.js', 'assets/icons/favicon.svg']) {
  assert(html.includes(`"${asset}"`), `Missing HTML asset reference: ${asset}`);
  assert(existsSync(resolve(root, asset)), `Missing asset file: ${asset}`);
}
assert(css.includes('@media (max-width: 700px)'), 'Mobile stylesheet rules not found');
assert(js.includes('event.preventDefault()'), 'Demo forms must not submit real credentials');
assert(html.includes('Designed &amp; developed by'), 'Author credit missing');
assert(existsSync(resolve(root, '.nojekyll')), 'Pages static publishing marker missing');
console.log('VioletGate static checks passed.');
