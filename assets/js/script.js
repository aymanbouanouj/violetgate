'use strict';

const container = document.getElementById('container');
const register = document.getElementById('register');
const login = document.getElementById('login');
const signUpSection = document.getElementById('signUpSection');
const signInSection = document.getElementById('signInSection');
const themeToggle = document.getElementById('themeToggle');

function showForm(signUp) {
  container.classList.toggle('active', signUp);
  signUpSection.inert = !signUp;
  signUpSection.setAttribute('aria-hidden', String(!signUp));
  signInSection.inert = signUp;
  signInSection.setAttribute('aria-hidden', String(signUp));
}

register.addEventListener('click', () => showForm(true));
login.addEventListener('click', () => showForm(false));

// Follow the system setting initially, but respect a previously saved choice.
let savedTheme = null;
try { savedTheme = localStorage.getItem('violetgate-theme') ?? localStorage.getItem('ayman-theme'); } catch (_) { /* Storage may be unavailable. */ }
const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme === 'dark' || savedTheme === 'light'
  ? savedTheme
  : systemDark ? 'dark' : 'light';

function setTheme(theme) {
  const dark = theme === 'dark';
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute('aria-pressed', String(dark));
  const label = `Switch to ${dark ? 'light' : 'dark'} mode`;
  themeToggle.setAttribute('aria-label', label);
  themeToggle.setAttribute('title', label);
}
setTheme(initialTheme);

themeToggle.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(theme);
  try { localStorage.setItem('violetgate-theme', theme); } catch (_) { /* Still works for this visit. */ }
});

// This project provides a UI only; don't submit credentials to a nonexistent backend.
for (const [formId, statusId] of [
  ['signUpForm', 'signup-status'],
  ['signInForm', 'signin-status'],
]) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = 'Demo interface only — authentication is not connected yet.';
  });
  form.querySelectorAll('[data-social]').forEach((button) => {
    button.addEventListener('click', () => {
      status.textContent = `${button.dataset.social} sign-in is not connected yet.`;
    });
  });
}

document.getElementById('forgotPassword').addEventListener('click', () => {
  document.getElementById('signin-status').textContent = 'Password reset is not connected yet.';
});

// When Font Awesome is online, show the real brand glyphs. Otherwise,
// keep the embedded SVG logos visible: never leave empty icon buttons.
window.addEventListener('load', async () => {
  if (!document.fonts?.load) return;
  try {
    const faces = await document.fonts.load('400 18px "Font Awesome 6 Brands"');
    if (faces.some(face => face.status === 'loaded')) {
      document.documentElement.classList.add('fa-ready');
    }
  } catch (_) { /* The SVG logos remain available when offline. */ }
});
