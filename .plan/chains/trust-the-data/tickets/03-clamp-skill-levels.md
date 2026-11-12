# Clamp skill levels and stop losing drafts to one bad value

## Question

A skill level outside 1–5 silently destroys the user's saved work. The full path:

1. `src/components/Builder/ResumeForm.svelte:242` binds an unbounded
   `<input type="number">` to `skill.level`. There is no `min`, `max`, or
   `step`, so a user can type `7`. (The paired range input beside it is
   correctly bounded 1–5, which makes the two controls disagree.)
2. `src/routes/builder/+page.svelte` autosaves `formState` to
   `localStorage["cv-gen:draft"]` on a 300ms debounce. The bad value is written.
3. On the next visit, `loadDraft()` runs `inputDataSchema.safeParse` over that
   draft. `skillLevelSchema` only accepts the literals 1–5, so the parse fails.
4. `loadDraft()` returns `emptyState()`. **The user's entire résumé is gone**,
   with no message and no way back.

Separately, if such a value is rendered,
`src/themes/default/components/SkillsSection.svelte:26` interpolates
`var(--color-skill-{skill.level})`. Only `--color-skill-1` through `-5` are
defined, so the swatch resolves to nothing and renders invisibly.

Three fixes, one boundary:

- **Input.** Bound the number input and clamp on write so out-of-range values
  never enter state in the first place.
- **Renderer.** Make `SkillsSection` resilient anyway — a level arriving from a
  hand-edited hosted JSON must still produce a visible swatch. Clamp into range
  at render.
- **Draft loading.** This is the important one. `loadDraft()` must stop treating
  "this draft does not validate" as "there is no draft." Surface it to the user
  and give them a path that does not lose their data — the existing import-error
  display in the same file is the precedent for how errors are shown here. Do
  not silently repair the draft behind the user's back either; a silent rewrite
  of their data is the same trust problem in a different direction.

## Done when

- The skill-level number input carries `min`, `max`, and `step`, and a value
  outside 1–5 cannot be committed to `formState`.
- The number input and the range input beside it can no longer disagree.
- `SkillsSection` renders a defined swatch for any level, in range or not.
- A draft that fails schema validation no longer resolves to `emptyState()`
  without the user being told; the user's stored draft is not discarded.
- A regression test starts from a stored draft containing `level: 7` and proves
  the draft is not lost.
- `pnpm test` and `pnpm check` both exit 0.
