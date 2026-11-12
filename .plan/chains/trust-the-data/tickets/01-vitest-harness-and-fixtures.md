# Stand up Vitest with a shared résumé fixture set

## Question

The project has no test framework. Every later ticket on this chain is gated on
`pnpm test`, so that command has to exist and be meaningful before anything else
lands.

Two things are needed:

**A runner.** Add Vitest as a dev dependency and a `test` script that runs once
and exits — `vitest run`, not the watching default, because it is used as a
check gate. Vitest needs to resolve the project's `@/*` → `./src/lib/*` alias;
the SvelteKit Vite plugin does not supply that to a plain Vitest run, so set it
explicitly. Keep the Tailwind PostCSS wiring in `vite.config.ts` untouched (see
CONTEXT.md — it is a deliberate workaround).

**Fixtures.** Later tickets all need the same sample data, so build it once:

- a full valid export — several languages, every section type
  (`experienceList`, `skillList`, `summary`), profile links with icons;
- a minimal export — one language, one section, the least that still parses;
- a hostile export — the shapes this chain exists to defend against: a
  `javascript:` href on a profile link, a skill `level` of `7`, a `theme` naming
  a theme that is not registered, and an unknown top-level key that
  `.passthrough()` must preserve.

The hostile fixture is data for later tickets to assert against. Do not fix any
of the defects it encodes here — tickets 02, 03, and 05 own those. It is fine
and expected that the hostile fixture fails `inputDataSchema` today on the skill
level; assert that as the current behaviour.

Then write the first tests. Cover `inputDataSchema` from
`src/lib/resumeSchema.ts` (each fixture accepted or rejected as expected, and a
round trip proving `.passthrough()` keeps unknown keys) and
`decodeSearchParamsObject` from `src/lib/url.ts`. `getSearchParams` reads
`window.location` directly, so either leave it for ticket 04 or test it under a
DOM environment — do not refactor it here.

Browser and end-to-end testing is out of scope for this chain. No Playwright.

## Done when

- `vitest` is a dev dependency and `"test": "vitest run"` is in `package.json`.
- The `@/*` alias resolves inside tests.
- Fixtures for the valid, minimal, and hostile exports live somewhere later
  tickets can import them, and the hostile one carries all four hazards listed
  above.
- Tests cover `inputDataSchema` accept, reject, and unknown-key round trip, plus
  `decodeSearchParamsObject`.
- `pnpm test` exits 0.
- `pnpm check` still reports 0 errors and 0 warnings.
