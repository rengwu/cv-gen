# Render the background, or remove it

## Question

`Background` is a fully specified feature that does not exist.

- `src/types.ts:78` defines a three-member union: `SolidBackground`
  (`{ type: "solid", color }`), `VideoBackground` (`{ type: "video", src }`), and
  `YoutubeBackground` (`{ type: "youtube", src }`).
- `src/lib/resumeSchema.ts:84` validates the field as `z.unknown().optional()` —
  the union is not enforced at all.
- `src/routes/builder/+page.svelte` seeds every new résumé with
  `{ type: "solid", color: "red" }`, which is then never shown to the user and
  never rendered.
- The viewer instead hard-codes `--background-color: #444` in a `<style>` block
  at the bottom of `src/routes/+page.svelte`.
- `docs/TODO.md` lists "Background customization" as open. There is a
  `herobg.webm` sitting unused in `src/themes/default/assets/videos/`.

So every export carries a `background` object that is typed, seeded, ignored,
and unvalidated. Resolve it in one direction or the other. **Either answer is
acceptable** — but no half-state may remain when this ticket closes.

**If you implement it.** Replace `z.unknown()` with a real discriminated union
matching `src/types.ts`, render the background behind the résumé page, and give
the builder a control to set it. Treat the values as hostile: this data arrives
from an attacker-controllable `?data=` URL.

- `color` reaching a CSS custom property is a CSS injection sink — a crafted
  value can break out of the declaration. Validate it as a colour, do not just
  interpolate it.
- `src/routes/+page.svelte`'s hard-coded `--background-color: #444` becomes the
  fallback, not a competing source of truth.
- A `video` `src` is a remote URL loaded into the page. A `youtube` `src` means
  an embedded third-party iframe, which is a much larger decision than a
  background colour — an iframe from arbitrary hosted JSON is a genuine
  escalation of what a shared résumé link can do. It is entirely reasonable to
  ship `solid` and rule out `video` and `youtube` in the same breath; say so
  explicitly if you do.
- Nothing may appear in a print/PDF render. Check the `@media print` rules in
  `ResumePreview.svelte` and `builder/+page.svelte`.

**If you rule it out.** Remove `Background` and its members from `src/types.ts`,
drop the field from `resumeSchema.ts` and from `emptyState()` in the builder,
and update `docs/TODO.md`. Existing hosted résumés carry a `background` key —
`.passthrough()` means it survives an import/export round trip harmlessly, so
confirm that removal does not reject or silently strip data from an older
export. Write the reasoning down so it is not rediscovered.

## Done when

- Exactly one of the two paths is complete: the field is validated, rendered,
  and settable in the builder; or it is gone from types, schema, builder state,
  and the TODO.
- No half-state: there is no typed-but-unreachable `Background` left, and no
  competing hard-coded background colour.
- Older exports containing a `background` key still load without error either
  way, with a test proving it.
- If implemented: colour values are validated rather than interpolated raw, any
  ruled-out member is stated as ruled out, and nothing renders in print.
- The decision and its reasoning are written into the ticket's outcome.
- `pnpm test`, `pnpm check`, and `pnpm build` all exit 0.
