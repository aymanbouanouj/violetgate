/** Capture real Chromium previews from the current source; no external services. */
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { resolve } from 'node:path';

const url = 'http://127.0.0.1:4173/';
const server = spawn(process.platform === 'win32' ? 'py' : 'python3',
  process.platform === 'win32'
    ? ['-3', '-m', 'http.server', '4173', '--bind', '127.0.0.1']
    : ['-m', 'http.server', '4173', '--bind', '127.0.0.1'],
  { cwd: resolve(import.meta.dirname, '..'), stdio: 'ignore' });

let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    try { const r = await fetch(url); if (r.ok && (await r.text()).includes('VioletGate | Animated Authentication UI')) { ready = true; break; } } catch { /* launching */ }
    await sleep(250);
  }
  if (!ready) throw new Error('Local preview server did not start');
  browser = await chromium.launch();
  for (const { file, viewport, dark, signUp } of [
    { file: 'desktop-light.png', viewport: { width: 1366, height: 768 }, dark: false, signUp: false },
    { file: 'desktop-dark.png', viewport: { width: 1366, height: 768 }, dark: true, signUp: false },
    { file: 'mobile-signup.png', viewport: { width: 390, height: 844 }, dark: false, signUp: true },
  ]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    await page.goto(url);
    await page.evaluate(dark => localStorage.setItem('violetgate-theme', dark ? 'dark' : 'light'), dark);
    await page.reload();
    if (signUp) await page.locator('#register').click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: resolve(import.meta.dirname, '../assets/previews', file), fullPage: true, animations: 'disabled' });
    await page.close();
    console.log(`Updated assets/previews/${file}`);
  }
} finally {
  await browser?.close();
  server.kill();
}
