# Trust the data you load

Standing context for every worker on this chain. Read it before taking a ticket.

## Purpose

`cv-gen` is a client-side résumé builder and viewer. Its central flow is:
a user builds a résumé, exports it as JSON, hosts that JSON somewhere public, and
shares a link of the form `https://<site>/?data=<url-to-their-json>`. The viewer
fetches that URL at runtime and renders whatever comes back.

That makes the résumé JSON **untrusted input from the renderer's point of view**:
the `?data=` parameter is attacker-controllable, so anyone can hand a victim a
link that loads JSON they wrote. A prior session fixed one XSS on this path
(`setDOMInnerHTML` now uses `textContent`) but the path was never audited end to
end and has no tests at all.

This chain closes that gap and, while the format is being touched anyway,
resolves the three fields in the export that are typed but unreachable: `theme`,
`background`, and site metadata.

**Destination:** the untrusted-data path — fetch, validate, render — is covered
by tests and free of the defects listed below, and `theme`, `background`, and
metadata either work or are ruled out in writing.

## Repository facts

- SvelteKit 2.70 + Svelte 5 (runes) + Vite 8 + Tailwind 4, TypeScript, `pnpm`.
- Static export via `adapter-static` with `prerender = true`; output to `./build`.
- Path alias: `@/*` → `./src/lib/*` (declared in `svelte.config.js`).
- Tailwind 4 is wired through `@tailwindcss/postcss` **inline in `vite.config.ts`**,
  not via `@tailwindcss/vite` and not via a `postcss.config.mjs`. This is a
  deliberate workaround for vitejs/vite#23096. Do not "tidy" it into a config
  file or swap it for the Vite plugin.
- Validation lives in `src/lib/resumeSchema.ts` (zod 4). Every object schema uses
  `.passthrough()` so unknown keys survive an import/export round trip. Preserve
  that property.
- Themes are a registry: `src/themes/index.ts` maps a name to a `Theme`
  (`{ name, icons, Page }`, typed in `src/types.ts`). `Page` is a real Svelte
  component. Handlebars was deleted in a prior session; do not reintroduce
  string templating.
- Baseline at the time of writing: `pnpm check` reports 0 errors / 0 warnings
  across 273 files, and `pnpm build` is green. Keep both true.

## Known defects this chain fixes

Each was verified in source during planning. Line numbers are from the state of
the tree when the chain was written; confirm before editing.

1. `src/themes/default/components/ContactItem.svelte:10` renders
   `<a href={link.href}>` straight from the loaded JSON. A `javascript:` href
   executes on click. — ticket 02
2. `src/components/Builder/ResumeForm.svelte:242` binds an unbounded
   `<input type="number">` to `skill.level`. Out-of-range values render an
   undefined CSS custom property in
   `src/themes/default/components/SkillsSection.svelte:26` (invisible swatch),
   and they fail `skillLevelSchema` on reload — at which point `loadDraft()` in
   `src/routes/builder/+page.svelte` falls back to `emptyState()` and the user's
   entire draft is silently lost. — ticket 03
3. `src/routes/load/+page.svelte:8` builds `goto("/?data=" + url)` with no
   encoding, truncating any résumé URL that carries its own query string. — ticket 04
4. `inputData.theme` is never read. `src/routes/+page.svelte` renders
   `<ResumePreview {inputData} />` and the builder passes `theme="default"`, so
   the prop's default always wins. — ticket 05
5. `src/components/Builder/Dropdown.svelte:60` nests `<button>` elements inside a
   `<button>` — invalid HTML that breaks keyboard navigation. The toggle also
   only ever sets `showDropdown = true`, so re-clicking cannot close it. No
   builder input has a `<label>`. — ticket 08
6. `src/app.html` declares no `<title>`, and nothing in `src/` uses
   `<svelte:head>`. Every hosted microsite is untitled. — ticket 10
7. `Background` is fully typed in `src/types.ts:78`, validated as
   `z.unknown().optional()` in `src/lib/resumeSchema.ts:84`, and never rendered;
   the viewer hard-codes `--background-color: #444`. — ticket 07

## Decisions taken during planning

- **Test the harness first.** Ticket 01 exists only so every later ticket has a
  real `pnpm test` gate. It is a layer rather than a user-visible change, and
  that was accepted deliberately.
- **Unit tests only.** Vitest for schema, helpers, and pure logic. Playwright and
  browser E2E are out of scope for this chain — a builder→export→viewer round
  trip is worth doing, but not here.
- **Security before features.** Tickets 02–04 are the verified defects and come
  before any format or infrastructure work.
- **Ticket 07 may resolve as "ruled out."** Rendering the background is not a
  foregone conclusion. Removing the field cleanly is an acceptable answer, as
  long as no half-state is left behind.

## Boundaries

- No backend, no database, no authentication. The app stays fully client-side
  and statically exported.
- Do not change the export JSON shape in a way that breaks existing hosted
  résumés. Additive and lenient changes only; `.passthrough()` stays.
- Do not upgrade framework major versions. The stack was modernized in a prior
  session and is deliberately pinned where it is.
- `build/` is generated and gitignored. Never commit it.
