'use strict';

const container = document.getElementById('container');
const register = document.getElementById('register');
const login = document.getElementById('login');
const signUpSection = document.getElementById('signUpSection');
const signInSection = document.getElementById('signInSection');
const themeToggle = document.getElementById('themeToggle');
const toggleLeft = document.getElementById('toggleLeft');
const toggleRight = document.getElementById('toggleRight');

function setAccessible(section, enabled) {
  section.inert = !enabled;
  section.setAttribute('aria-hidden', String(!enabled));
}

function showForm(signUp) {
  // Update both sliding forms AND the panels on the other side.
  container.classList.toggle('active', signUp);
  setAccessible(signUpSection, signUp);
  setAccessible(signInSection, !signUp);
  setAccessible(toggleLeft, signUp);
  setAccessible(toggleRight, !signUp);

  // The clicked button becomes hidden. Move focus to the newly shown form.
  const heading = document.getElementById(signUp ? 'signup-title' : 'signin-title');
  heading.focus({ preventScroll: true });
}

register.addEventListener('click', () => showForm(true));
login.addEventListener('click', () => showForm(false));

// Follow the system setting initially, but respect a previously saved choice.
let savedTheme = null;
try { savedTheme = localStorage.getItem('violetgate-theme'); } catch (_) { /* Storage may be unavailable. */ }
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

// The page is a frontend demo. Buttons are deliberately not of type=submit,
// and password inputs have no name attribute: even with JavaScript disabled,
// a demo form cannot submit credentials through the URL.
for (const [formId, statusId] of [
  ['signUpForm', 'signup-status'],
  ['signInForm', 'signin-status'],
]) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  const showDemoMessage = (event) => {
    event?.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent = 'Frontend demo only — no account is created or signed in.';
  };
  form.addEventListener('submit', showDemoMessage);
  form.querySelector('[data-demo-submit]').addEventListener('click', showDemoMessage);
  form.querySelectorAll('[data-social]').forEach((button) => {
    button.addEventListener('click', () => {
      status.textContent = `${button.dataset.social} authentication is not available in this UI demo.`;
    });
  });
}

document.getElementById('forgotPassword').addEventListener('click', () => {
  document.getElementById('signin-status').textContent = 'Password reset is not available in this UI demo.';
});
