# Make inputData.theme actually select the theme

## Question

Every résumé export carries a `theme` field. Nothing reads it.

- `src/types.ts` declares `theme: keyof typeof themes` on `InputData`.
- `src/lib/resumeSchema.ts` validates it as `z.string().optional()` — any string
  passes, including names of themes that do not exist.
- `src/routes/+page.svelte` renders `<ResumePreview {inputData} />` with no
  `theme` prop, so `ResumePreview`'s own `theme = "default"` default wins.
- `src/routes/builder/+page.svelte` explicitly passes `theme="default"`.

So the field is written into every export, validated loosely, and then ignored.
The theme registry in `src/themes/index.ts` supports exactly one theme today,
which is why nobody noticed.

Wire it up:

- `ResumePreview` should resolve the theme from `inputData.theme` against the
  registry, falling back to `default` when the name is missing or unregistered.
  An unknown theme must never throw or render a blank page — hosted JSON is
  untrusted and may name a theme this deployment does not ship, or one from a
  future version.
- Both call sites stop hard-coding `"default"`. Note that the builder's call
  site also passes `hideLanguages` and a bound `currentLanguage`; only the theme
  handling changes.
- Tighten the schema so `theme` is checked against the registry's actual keys
  rather than `z.string()` — but keep it lenient. An unknown theme must not fail
  the whole parse and reject the résumé; it should fall back. Keep the
  `.passthrough()` behaviour described in CONTEXT.md intact.

`ResumePreview` also side-loads theme CSS through
`$effect(() => { void import(`../themes/${theme}/styles/index.css`) })`. Once
`theme` becomes genuinely variable this stops being decorative — check that
switching themes at runtime loads the right stylesheet and that the build still
emits every theme's CSS. Ticket 06 adds the second theme that will really
exercise this; here, just make sure nothing about the mechanism assumes a single
theme.

## Done when

- A résumé export naming a registered theme renders in that theme, in both the
  viewer and the builder preview.
- An export naming an unregistered theme falls back to `default` and renders,
  with no thrown error and no blank page.
- An export with no `theme` field at all still renders.
- Neither `+page.svelte` nor `builder/+page.svelte` hard-codes a theme name.
- `theme` is validated against the registry keys without an unknown value
  failing the parse.
- Tests cover the registered, unregistered, and absent cases.
- `pnpm test`, `pnpm check`, and `pnpm build` all exit 0.
