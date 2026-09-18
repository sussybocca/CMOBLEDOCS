# CMOBLEOS Developer Documentation Site

Standalone Netlify-ready public developer documentation for CMOB*LE OS / BYTS / BY5 / BVM1.

## Local development

```powershell
cd CMOBLEOS-docs-site
npm install
npm run dev
```

## Production build

```powershell
npm run build
```

Vite writes the production site to `dist/`.

## Netlify

Create a new Netlify site (you can name it `CMOBLEOS`) and deploy this project directory. `netlify.toml` already configures:

- build command: `npm run build`
- publish directory: `dist`
- Node.js 22
- SPA fallback
- basic security headers

If using a Git repository, set the repository root to this folder and leave the Netlify build settings to the values in `netlify.toml`.

## Main page

The full documentation application is in:

`src/docs.tsx`

Styles are in:

`src/docs.css`

The docs intentionally publish the developer-facing ABI and workflow without publishing private CMOB*LE kernel/backend source.
