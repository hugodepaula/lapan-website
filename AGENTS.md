# Repository Guidelines

## Project Structure & Module Organization
This repository is an Astro static site for LAPAN. Application code lives in `src/`: route pages in `src/pages`, shared layouts/components in `src/layouts` and `src/components`, global styles in `src/styles`, and typed content collections in `src/content`. Markdown content is split by domain, for example `src/content/team`, `src/content/events`, and `src/content/projects`. Public assets are served from `public/`, especially `public/images` and the Decap CMS files in `public/admin`. Legacy migration material stays in `_migration/` and should only be edited when intentionally fixing imported content.

## Build, Test, and Development Commands
Install dependencies with `npm install`. Use `npm run dev` to start Astro dev server at `http://localhost:4321`. Run `npm run build` to generate the production site in `dist/`, and `npm run preview` to validate the built output locally. For content normalization utilities, use `npm run zotero:normalizar`.

## Coding Style & Naming Conventions
Follow the existing code style: ES modules, double quotes in TypeScript/JavaScript, trailing commas where the formatter leaves them, and 2-space indentation in `.astro`, `.ts`, and CSS files. Prefer descriptive Portuguese field names in content schemas to match the current collections, and keep route/component filenames in PascalCase for components and lowercase for page paths. Store normalized images in kebab-case paths such as `public/images/team/luiza-filgueiras-bicalho.jpg`.

## Testing Guidelines
There is no automated test suite configured yet. Treat `npm run build` as the minimum validation step for every change, and manually verify affected routes in `npm run dev` or `npm run preview`. When editing CMS-backed content, confirm the relevant collection still matches `src/content.config.ts` and that images resolve correctly from `public/`.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commit prefixes with scopes, usually in Portuguese, for example `feat(team): ...`, `refactor(assets): ...`, and `style(ui): ...`. Keep commits focused and use a scope that matches the area changed. Pull requests should include a short description, impacted routes or content collections, linked issues when applicable, and screenshots for visible UI changes. Mention any content migrations, manual checks, or deploy-related configuration such as `PUBLIC_CONTACT_FORM_ENDPOINT`.

## Configuration & Content Notes
Use Node.js 20+ and npm 10+ as documented in `INSTALL.md`. The contact form depends on `PUBLIC_CONTACT_FORM_ENDPOINT` in `.env`. Decap CMS edits are exposed at `/admin`; if you change collection structure or media paths, update both `public/admin/config.yml` and the Astro content schema.
