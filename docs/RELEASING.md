# VioletGate maintenance & release procedure

This file is for the repository maintainer. It does not change the public UI.

## 1. Check and publish a candidate

From the actual Git clone (not the ZIP or another directory):

```powershell
npm install
npx playwright install chromium
npm run check
npm run test:e2e
npm run previews

git status --short
git diff --check
```

Review the generated screenshots and the diff, then commit and push the verified changes. GitHub Actions must show **Static checks** and **Browser E2E & accessibility** succeeding on the new commit. GitHub Pages must also deploy successfully.

For more reproducible dependency installation, after the first npm install generate and commit `package-lock.json`, CI will automatically use `npm ci` when a lockfile exists. This is preferable for long-term maintenance. Do not publish `node_modules`.

## 2. Protect `main` *after* E2E checks have passed

Configure GitHub repository **Settings → Rules → Rulesets → New branch ruleset**; target the `main` branch. Enable *Require a pull request before merging*, *Require status checks to pass*, *Block force pushes*, and *Restrict deletions* as appropriate for a solo-maintained public repository. Select the two observed check names: `Static checks` and `Browser E2E & accessibility`. Activate the ruleset only after those checks exist and pass, or you may block normal merges. Ruleset availability and enforcement depend on account/repository settings. This operation requires repository administrative permissions.

Alternatively use **Settings → Branches → Add branch protection rule** for `main`. Once configured, future changes should go through short-lived branches and pull requests rather than direct pushes. Verify the rule is active by reviewing it in Settings.

## 3. Create first versioned release

Only when the new commit is green in both workflows and the updated screenshots are on `main`:

```powershell
gh run list --repo aymanbouanouj/violetgate --limit 6
gh release create v1.0.0 --repo aymanbouanouj/violetgate --target main --title "VioletGate v1.0.0" --notes "First stable frontend-only UI demo. Responsive animated panels, accessible keyboard navigation, light/dark themes, privacy-first demo behavior, Playwright E2E tests, axe-core accessibility checks, and updated project previews. No real authentication backend."
```

Check the published release URL and tag, then update any public portfolio links if needed. **Do not** create or push a tag before the checks pass.

## 4. Licensing and attribution

No `LICENSE` has been added automatically. A public GitHub repository is not the same as granting an open-source license. If you want external reuse, choose a license knowingly and verify attribution obligations for any upstream tutorial, design, icons, or borrowed assets before publishing licensing claims.
