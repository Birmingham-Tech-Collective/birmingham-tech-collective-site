# Birmingham Tech Collective

Website for Birmingham Tech Collective CIC — a community-led initiative supporting tech education and access across Birmingham.

## Stack

Pure HTML5, CSS, and vanilla JavaScript — no build step, no dependencies.

- **Fonts:** Geist & Geist Mono via Google Fonts
- **Forms:** [Formspree](https://formspree.io) (contact form)
- **Hosting:** GitHub Pages

## Development

No build process is needed. Open any `.html` file directly in a browser, or use a local dev server:

```bash
# Python (built-in)
python -m http.server 8080

# Node (if installed)
npx serve .
```

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via the workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

**First-time setup:**
1. Go to **Settings → Pages** in your GitHub repo
2. Set **Source** to `GitHub Actions`

## Before launch

- [ ] Replace the FormSpree placeholder in [`contact.html`](contact.html) with a real form ID
- [ ] Add the CIC company registration number to the footer in all HTML files

## Code style

Formatting is handled by [Prettier](https://prettier.io) (config in [`.prettierrc`](.prettierrc)) and editor settings are in [`.editorconfig`](.editorconfig). Install the Prettier extension for your editor to auto-format on save.
