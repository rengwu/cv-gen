# cv-gen — Project Specification

**Generated:** 2026-06-07  
**Project Root:** `/Users/rengwu/Desktop/Projects/cv-gen`

---

## 1. Overview

`cv-gen` is a client-side résumé builder and viewer microsite. Users construct résumés through a visual form builder, export them as JSON, host the JSON externally (e.g., GitHub, jsonbin.io), and then share a link that loads and renders the résumé in a print-friendly web page. It can also be self-hosted with a pre-configured JSON URL via an environment variable.

The project is a proof-of-concept / side-project. It is intentionally simple: no backend, no database, no authentication.

---

## 2. Stack

| Technology | Version | Role |
|------------|---------|------|
| Svelte | `^4.2.7` | UI framework |
| SvelteKit | `^2.0.0` | App framework / router |
| Vite | `^5.0.3` | Build tool |
| TypeScript | `^5.0.0` | Language |
| Tailwind CSS | `^3.3.6` | Utility CSS |
| PostCSS | `^8.4.32` | CSS processing |
| Handlebars | `^4.7.8` | Template engine for résumé rendering |
| shadcn-svelte | initialized | Component primitives (scarcely used) |
| lucide-svelte | `^0.341.0` | Icons |
| @iconify/svelte | `^3.1.6` | Icon system (unused in practice) |
| clsx / tailwind-merge | latest | Class name utilities |
| tailwind-variants | `^0.2.0` | Tailwind variant utilities (unused) |
| pnpm | (lockfile present) | Package manager |

**Deployment target:** Static (SvelteKit `adapter-static`, `prerender = true`). Hosted on Netlify.

---

## 3. Directory Structure

```
cv-gen/
├── .context/                  # Agent session memory (newly created)
├── .skills/                   # Agent skills (project-specific)
├── .svelte-kit/               # SvelteKit generated files
├── build/                     # Static build output (checked into repo)
├── docs/
│   ├── TODO.md                # Hand-written task list
│   └── preview.png            # README screenshot
├── src/
│   ├── app.d.ts               # Empty SvelteKit app types
│   ├── app.pcss               # Tailwind directives + CSS variables (shadcn)
│   ├── lib/
│   │   ├── index.ts           # Empty lib re-export
│   │   ├── url.ts             # URL search-param helpers
│   │   └── utils.ts           # cn() helper, flyAndScale transition, deep-mutate util
│   ├── routes/
│   │   ├── +layout.svelte     # Root layout (imports app.pcss)
│   │   ├── +layout.ts         # `export const prerender = true`
│   │   ├── +page.svelte       # Landing / résumé viewer (root)
│   │   ├── builder/
│   │   │   ├── +layout.svelte # Empty builder layout
│   │   │   └── +page.svelte   # Resume builder page
│   │   └── load/
│   │       └── +page.svelte   # Load existing résumé by URL
│   ├── components/
│   │   ├── Builder/
│   │   │   ├── Button.svelte
│   │   │   ├── Dropdown.svelte
│   │   │   ├── EllipsisDropdown.svelte
│   │   │   ├── EllipsisVertical.svelte
│   │   │   ├── Form.svelte
│   │   │   ├── FormSection.svelte
│   │   │   ├── ListDropdownOptions.svelte
│   │   │   ├── ResumeForm.svelte
│   │   │   ├── SelectInput.svelte
│   │   │   ├── TextField.svelte
│   │   │   └── TextInput.svelte
│   │   ├── FadeIn.svelte
│   │   ├── LandingLayout.svelte
│   │   ├── Message.svelte
│   │   ├── ResumePreview.svelte
│   │   └── Welcome.svelte
│   ├── themes/
│   │   ├── index.ts           # Theme registry (exports `{ default: theme }`)
│   │   ├── schema.ts          # DOM ID constants for template injection
│   │   ├── utils.ts           # DOM helpers, download/copy utils, sectionMap
│   │   └── default/
│   │       ├── index.ts       # Theme definition object
│   │       ├── pageTemplate.ts          # Handlebars page shell
│   │       ├── components/
│   │       │   ├── contactItemTemplate.ts
│   │       │   ├── experienceSectionTemplate.ts
│   │       │   ├── skillsSectionTemplate.ts
│   │       │   └── summarySectionTemplate.ts
│   │       ├── assets/
│   │       │   ├── icons/       # 7 SVG icons (github, leetcode, linkedin, etc.)
│   │       │   ├── videos/      # 1 webm background video
│   │       │   └── fonts/       # ~454 font files (Inter, Saans, Serrif, WorkSans)
│   │       └── styles/
│   │           ├── fonts.css    # @font-face declarations
│   │           ├── globals.css  # Theme CSS variables & typography
│   │           └── index.css    # Component layout & responsive rules
│   └── types.ts               # All TypeScript domain types
├── static/
│   ├── favicon.png
│   └── global.css             # Commented-out legacy styles
├── .env / .env.example
├── components.json            # shadcn-svelte config
├── package.json
├── pnpm-lock.yaml
├── postcss.config.cjs
├── svelte.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 4. Schemas & Models

### `InputData` (`src/types.ts`)
```ts
{
  defaultLanguage: string;
  theme: "default";          // keyof typeof themes
  languages: { [langCode: string]: ResumeData };
  background: SolidBackground | VideoBackground | YoutubeBackground;
}
```

### `ResumeData`
```ts
{
  profile: Profile;
  sections: ValidSection[];  // ExperienceSection | SkillSection | SummarySection
}
```

### `Profile`
```ts
{
  name: string;
  caption?: string;
  location?: string;        // present in type, unused in builder UI
  description?: string;     // present in type, unused in builder UI
  links: Link[];
}
```

### `Link`
```ts
{ label: string; href: string; icon?: string }
```

### `ExperienceSection`
```ts
{
  title: string;
  type: "experienceList";
  data: Experience[];
}
```

### `Experience`
```ts
{
  title: string;
  subtitle: string;
  location: string;
  date: string;
  items: string[];   // bullet points
}
```

### `SkillSection`
```ts
{
  title: string;
  type: "skillList";
  labels: { low: string; high: string };
  data: Skill[];
}
```

### `Skill`
```ts
{ name: string; level: 1 | 2 | 3 | 4 | 5 }
```

### `SummarySection`
```ts
{
  title: string;
  type: "summary";
  data: { description: string };
}
```

### `Background`
```ts
{ type: "solid"; color: string }
| { type: "video"; src: string }
| { type: "youtube"; src: string }
```

### `Theme` (runtime contract)
```ts
{
  name: string;
  pageTemplate: string;              // Handlebars HTML
  contactItemTemplate: string;
  experienceSectionTemplate: string;
  skillsSectionTemplate: string;
  summarySectionTemplate: string;
  icons: { [key: string]: string };  // SVG paths
}
```

---

## 5. Routes

| Route | File | Purpose | Render Mode |
|-------|------|---------|-------------|
| `/` | `src/routes/+page.svelte` | Viewer. Loads JSON from `?data=` query or `PUBLIC_PRELOADED_RESUME_DATA_URL` env var. Falls back to welcome page. | Static (prerendered) |
| `/builder` | `src/routes/builder/+page.svelte` | Side-by-side résumé form editor with live preview. Supports JSON import/export, copy-to-clipboard, download, print. | Static |
| `/load` | `src/routes/load/+page.svelte` | Simple page to paste a JSON URL and redirect to `/?data=...` | Static |

No API routes or server-side endpoints exist.

---

## 6. Features

### Viewer (`/`)
- Fetches externally-hosted JSON résumé data.
- Supports language switching if multiple languages are present in `InputData.languages`.
- Renders résumé using Handlebars templates injected into the DOM.
- Print-friendly styling via `@media print` CSS.
- Fixed "Print" button and `cv-gen` credits link.

### Builder (`/builder`)
- Add/manage multiple language versions.
- Profile editing (name, caption, contact links with icon selection).
- Section management: Experience, Skills (with 1–5 level slider + color legend), Summary.
- Rearrange and delete items via ellipsis dropdown.
- Live preview of the résumé using `ResumePreview`.
- JSON import (paste raw JSON to overwrite state).
- JSON export (copy to clipboard or download as `.json`).
- Print-to-PDF via browser `print()`.

### Load (`/load`)
- Minimal input to redirect to viewer with `?data=` query parameter.

---

## 7. Key Design Decisions

1. **Static-only / No backend.** All state lives in the browser. JSON data is hosted externally. This makes deployment trivial (Netlify, any static host) but means no persistence, auth, or collaboration.

2. **Handlebars inside Svelte.** Rather than using Svelte components for résumé rendering, the app compiles Handlebars template strings and manually injects HTML into a `bind:this` div (`ResumePreview.svelte`). This was chosen to support a "theme" system where templates are swappable strings. The trade-off is losing Svelte's reactivity for the résumé body and doing imperative DOM manipulation.

3. **Theme system with only one theme.** The `Theme` type and `themes` registry are designed for multiple themes, but only `default` exists. The builder even shows "COMING SOON" for theme selection.

4. **Client-side language switcher.** Multi-language support is built into the data schema (`languages` map) and rendered as toggle buttons in the viewer, but there is no i18n framework.

5. **shadcn-svelte initialized but mostly unused.** `components.json` and `tailwind.config.js` include shadcn configuration, yet all UI components are hand-rolled in `src/components/Builder/`. The only shadcn artifact is the CSS variable setup in `app.pcss`.

6. **Self-hosted JSON via env var.** `PUBLIC_PRELOADED_RESUME_DATA_URL` allows a deployed instance to always load a specific résumé without requiring users to pass a query parameter.

---

## 8. Architecture Structure

```
+----------------------------------+
|  User visits / or /builder       |
+----------------------------------+
                |
    +-----------+-----------+
    |                       |
+---v---+             +-----v------+
| Viewer|             |  Builder   |
|  /    |             |  /builder  |
+---+---+             +-----+------+
    |                       |
    | fetch JSON URL        | user input
    | (query param or env)  |
    |                       |
+---v---------------------v--------+
|         InputData (JSON)         |
+---+---------------------+--------+
    |                     |
    |  $: reactive        |  bind:formState
    |  resumeData         |
    |                     |
+---v---------------------v--------+
|      ResumePreview.svelte        |
|  (Handlebars.compile + DOM       |
|   injection into pageElement)    |
+----------------------------------+
    |
+---v------------------------------+
|  Theme templates (Handlebars)    |
|  + default pageTemplate          |
|  + contact / exp / skills /      |
|    summary section templates     |
+----------------------------------+
    |
+---v------------------------------+
|  Theme styles (plain CSS)        |
|  globals.css + index.css         |
+----------------------------------+
```

Data flow is entirely unidirectional within each page:
- **Viewer:** URL → fetch → `InputData` → `ResumeData` for default/current language → Handlebars render.
- **Builder:** User input → `formState: InputData` → passed to `ResumePreview` → same render path as viewer.

---

## 9. Issues & Technical Debt

1. **Massive font file bloat.** `src/themes/default/assets/fonts/` contains ~454 font files (~288k lines of binary data). Most are "TRIAL" fonts (Saans, Serrif) that should not be shipped. Only Inter, Serrif Regular, and WorkSans appear referenced in `fonts.css`. The rest are dead weight inflating the repo and build.

2. **No tests.** Zero unit, integration, or E2E tests exist. No testing framework is configured.

3. **No CI/CD.** No `.github/workflows/`, no Netlify config file, no deployment automation.

4. **Console statements in production code.** `src/themes/utils.ts` lines 36, 49, 52 contain `console.log` / `console.error` for clipboard and download operations.

5. **Handlebars re-rendering is imperative and fragile.** `ResumePreview.svelte` sets `pageElement.innerHTML` directly on reactive changes. This bypasses Svelte's virtual DOM, breaks Svelte event handlers inside templates, and causes a full DOM teardown/rebuild on every data change. The `renderOnlyOnce` flag and `initialLoadComplete` guard are workarounds for re-render loops.

6. **Type safety holes.** `src/themes/utils.ts` uses `any` for several function parameters (`innerValue`, `innerHTML`, `element`, `object`). `src/lib/utils.ts` contains a `@ts-ignore` in `mutateDeepValue`. `app.d.ts` is empty.

7. **Dead code.**
   - `tailwind-variants` dependency is installed but unused.
   - `@iconify/svelte` is installed but unused; custom SVGs are used instead.
   - `static/global.css` is entirely commented out.
   - `src/lib/index.ts` is empty.
   - `src/components/Builder/TextField.svelte` exists but is not imported anywhere (builder uses `TextInput` directly).

8. **Builder profile fields commented out.** Location and description inputs are commented out in `ResumeForm.svelte` even though they exist in the `Profile` type.

9. **Checked-in build output.** The `build/` directory is committed to Git, which is unusual for a generated artifact and can cause merge conflicts.

10. **Unchecked JSON fetch.** `src/routes/+page.svelte` fetches user-provided URLs with no validation, CORS handling, or error boundaries beyond a generic message string.

11. **No accessibility considerations.** Form inputs lack labels in many places, color contrast for skill swatches is untested, and focus management in dropdowns is minimal.

12. **TODOs from `docs/TODO.md` still open:** dynamic site metadata, theming in builder, multiple themes, background customization.

---

## 10. Usage

### Install
```bash
pnpm install
```

### Development
```bash
pnpm dev          # Vite dev server
```

### Build
```bash
pnpm build        # Static export to ./build
```

### Type check
```bash
pnpm check        # svelte-check
```

### Environment Variables
Create `.env` from `.env.example`:
```
PUBLIC_PRELOADED_RESUME_DATA_URL="https://link.to/your/resume.json"
```

### Deploy
The `build/` folder is a static site. Can be deployed to Netlify, Vercel, GitHub Pages, or any static host.

---

## 11. Tests

**Status: None.**

No test files, no test scripts in `package.json`, and no testing frameworks configured.

**Recommended strategy:**
- Add Vitest for unit testing `src/lib/url.ts`, `src/themes/utils.ts`, and type validators.
- Add Playwright for E2E coverage of the builder flow (add language → add section → export JSON → load in viewer).

---

## 12. Notable Files

| File | Purpose |
|------|---------|
| `src/routes/+page.svelte` | Root viewer page. Handles data loading and fallback welcome state. |
| `src/routes/builder/+page.svelte` | Builder UI shell with sidebar states and preview pane. |
| `src/components/ResumePreview.svelte` | Core renderer. Compiles Handlebars templates and injects HTML into the DOM. |
| `src/components/Builder/ResumeForm.svelte` | All form fields for profile, links, sections, and nested items. |
| `src/types.ts` | Domain model types (`InputData`, `ResumeData`, `Theme`, etc.). |
| `src/themes/default/index.ts` | Theme registry entry. Aggregates templates and icons. |
| `src/themes/utils.ts` | `sectionMap`, DOM manipulation helpers, download/copy utilities. |
| `src/themes/schema.ts` | Hardcoded DOM element IDs used by the template injection system. |
| `src/themes/default/styles/globals.css` | Theme CSS variables and typography rules. |
| `svelte.config.js` | SvelteKit config with `@sveltejs/adapter-static` and `@/*` alias. |
| `src/app.pcss` | Tailwind base + shadcn CSS variables. |
| `docs/TODO.md` | Hand-maintained checklist of planned features. |
